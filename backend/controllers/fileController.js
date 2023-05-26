const mongoose = require('mongoose');
const util = require('util');
const File = require('../models/fileModel');

// upload single file
const uploadSingle = async (req, res, next) => {
  try {
    const file = req.file;
    const userId = req.body.userId;
    const label = req.body.label;
    const displayOnTop = req.body.displayOnTop === 'true';
    const parentId = req.body.parentId;
    const type = req.body.type;

    if (!file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    const uploadStream = bucket.openUploadStreamWithId(new mongoose.Types.ObjectId(), file.originalname, {
      metadata: {
        createdBy: userId,
        label: label,
        displayOnTop: displayOnTop,
        parentId: parentId,
        type: type,
      },
      contentType: file.mimetype,
    });

    uploadStream.on('error', (err) => {
      return res.status(500).json({ error: 'Error occurred while uploading file' });
    });

    uploadStream.on('finish', () => {
      res.status(201).json({
        message: 'File uploaded successfully',
        file: {
          _id: uploadStream.id,
          filename: file.originalname,
          contentType: file.mimetype,
          metadata: {
            createdBy: userId,
            label: label,
            displayOnTop: displayOnTop,
            parentId: parentId,
            type: type,
          },
        },
      });
    });

    uploadStream.end(file.buffer);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// upload multiple files
const uploadMultiple = async (req, res, next) => {
  try {
    const files = req.files;
    const userIds = req.body.userIds;
    const labels = req.body.labels;
    const displayOnTops = req.body.displayOnTops.map(display => display === 'true');
    const parentIds = req.body.parentIds;
    const types = req.body.types;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    let uploadedFiles = [];

    const uploadFile = (file, userId, label, displayOnTop, parentId, type) => {
      return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStreamWithId(
          new mongoose.Types.ObjectId(),
          file.originalname,
          {
            metadata: {
              createdBy: userId,
              label: label,
              displayOnTop: displayOnTop,
              parentId: parentId,
              type: type,
            },
            contentType: file.mimetype,
          }
        );

        uploadStream.on('error', (err) => {
          reject(err);
        });

        uploadStream.on('finish', () => {
          uploadedFiles.push({
            _id: uploadStream.id,
            filename: file.originalname,
            contentType: file.mimetype,
            metadata: {
              parentId: parentId,
              type: type,
              createdBy: userId,
              label: label,
              displayOnTop: displayOnTop,
            },
          });
          resolve();
        });

        uploadStream.end(file.buffer);
      });
    };

    const uploadPromises = files.map((file, index) =>
      uploadFile(file, userIds[index], labels[index], displayOnTops[index], parentIds[index], types[index])
    );

    await Promise.all(uploadPromises);

    res.status(201).json({
      message: 'Files uploaded successfully',
      files: uploadedFiles,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Use to modify file metadata and filename in the 'uploads' gridfs bucket.
const performUpdate = async (fileId, userId, label, displayOnTop, filename, parentId, type, file) => {
  const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads',
  });

  //find file in database
  const existingFile = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();

  if (!existingFile || existingFile.length === 0) {
    throw new Error('File not found');
  }

  try {
    if (file) {
      //delete old file
      const db = mongoose.connection.db;
      const fileCollection = db.collection('uploads.files');
      const chunksCollection = db.collection('uploads.chunks');

      const fileObjectId = new mongoose.Types.ObjectId(fileId);

      await fileCollection.deleteOne({ _id: fileObjectId });
      await chunksCollection.deleteMany({ files_id: fileObjectId });

      //upload new file
      const uploadStream = bucket.openUploadStreamWithId(
        new mongoose.Types.ObjectId(fileId),
        filename,
        {
          metadata: {
            createdBy: userId,
            label: label,
            displayOnTop: displayOnTop,
            parentId: parentId,
            type: type,
          },
          contentType: file.mimetype,
        }
      );

      uploadStream.on('error', (err) => {
        throw new Error('Error occurred while uploading file', err);
      });

      let updatedFiles = [];

      const updatedFile = (file, filename, fileId, userId, label, displayOnTop, parentId, type) => {
        return new Promise((resolve, reject) => {
          const uploadStream = bucket.openUploadStreamWithId(
            new mongoose.Types.ObjectId(fileId),
            filename,
            {
              metadata: {
                createdBy: userId,
                label: label,
                displayOnTop: displayOnTop,
                parentId: parentId,
                type: type,
              },
              contentType: file.mimetype,
            }
          );

          uploadStream.on('error', (err) => {
            reject(err);
          });

          uploadStream.on('finish', () => {
            updatedFiles.push({
              _id: uploadStream.id,
              filename: file.originalname,
              contentType: file.mimetype,
              metadata: {
                createdBy: userId,
                label: label,
                displayOnTop: displayOnTop,
                parentId: parentId,
                type: type,
              },
            });
            resolve();
          });

          uploadStream.end(file.buffer);
        });
      };

      const updatePromise = updatedFile(file, filename, fileId, userId, label, displayOnTop, parentId, type);

      await Promise.resolve(updatePromise);

      return updatedFiles[0];
    }

    else {
      const updateData = {
        filename: filename || existingFile[0].filename,
        metadata: {
          createdBy: userId || existingFile[0].metadata.createdBy,
          label: label || existingFile[0].metadata.label,
          displayOnTop: displayOnTop !== undefined ? displayOnTop : existingFile[0].metadata.displayOnTop,
          parentId: parentId || existingFile[0].metadata.parentId,
          type: type || existingFile[0].metadata.type,
        },
      };

      const updatedFile = await File.findByIdAndUpdate(fileId, updateData, { new: true });
      return updatedFile;
    };
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
};

// update single file
const updateFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const { userId, label, displayOnTop, filename, parentId, type } = req.body;
    const file = req.file;

    const updatedFile = await performUpdate(fileId, userId, label, displayOnTop, filename, parentId, type, file || null);

    res.json({
      message: 'File updated successfully',
      file: updatedFile,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// update multiple files
const updateFiles = async (req, res, next) => {
  try {
    const updates = JSON.parse(req.body.updates);
    const files = req.files;

    const updatedFiles = await Promise.all(
      updates.map(async (update, index) => {
        const { _id, metadata, filename } = update;
        const fileId = _id;
        const file = files ? files[index] : null;
        const { userId, label, displayOnTop, parentId, type } = metadata;
        return await performUpdate(fileId, userId, label, displayOnTop, filename, parentId, type, file || null);
      })
    );

    res.json({
      message: 'Files updated successfully',
      files: updatedFiles,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err.message });
  }
};

// search for files using query params
const searchFiles = async (req, res, next) => {
  try {
    const { fileId, filename, createdBy, label, displayOnTop, parentId, type } = req.query;

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    const searchQuery = {
      ...(fileId && { _id: new mongoose.Types.ObjectId(fileId) }),
      ...(filename && { filename: filename }),
      ...(createdBy && { 'metadata.createdBy': createdBy }),
      ...(label && { 'metadata.label': label }),
      ...(displayOnTop && { 'metadata.displayOnTop': displayOnTop }),
      ...(parentId && { 'metadata.parentId': parentId }),
      ...(type && { 'metadata.type': type }),
    };

    const files = await bucket.find(searchQuery).sort({ uploadDate: -1 }).toArray();

    if (!files || files.length === 0) {
      return res.status(200).json({ message: "No files found" });
    }

    res.status(200).json({ files });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// stream file from database to client
const streamFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    const fileInfo = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();

    if (!fileInfo || fileInfo.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

    res.set('Content-Type', fileInfo[0].contentType);
    res.set('Content-Disposition', `inline; filename="${fileInfo[0].filename}"`);

    downloadStream.pipe(res);

    downloadStream.on('error', (err) => {
      res.status(500).json({ error: 'Error occurred while streaming file' });
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// download file from database and server storage folder
const downloadFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    const fileInfo = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();

    if (!fileInfo || fileInfo.length === 0) {
      return res.status(404).json({ error: 'File not found' });
    }

    const downloadStream = bucket.openDownloadStream(new mongoose.Types.ObjectId(fileId));

    res.set('Content-Type', fileInfo[0].contentType);
    res.set('Content-Disposition', `attachment; filename="${fileInfo[0].filename}"`);

    downloadStream.pipe(res);

    downloadStream.on('error', (err) => {
      res.status(500).json({ error: 'Error occurred while downloading file' });
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get file from database by id
const getFileById = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    const fileInfo = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).toArray();

    if (!fileInfo || fileInfo.length === 0) {
      return res.status(201).json({ message: "No files found for the provided fileId", status: 201 });
    }

    res.status(200).json(fileInfo[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get all files from database for a specific user
const getAllFilesByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    const files = await bucket.find({ 'metadata.createdBy': userId }).toArray();

    if (!files || files.length === 0) {
      return res.status(201).json({ message: "No files found for the provided user", status: 201 });
    }

    res.status(200).json({ files });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get all files from database for a specific file name
const getAllFilesByName = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    const files = await bucket.find({ filename: filename }).toArray();

    if (!files || files.length === 0) {
      return res.status(201).json({ message: "No files found with the provided name", status: 201 });
    }

    res.status(200).json({ files });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get all files under a certain label
const getAllFilesByLabel = async (req, res, next) => {
  try {
    const { label } = req.params;
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    const files = await bucket.find({ 'metadata.label': label }).toArray();

    if (!files || files.length === 0) {
      return res.status(201).json({ message: "No files found with the provided label", status: 201 });
    }

    res.status(200).json({ files });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get all files under a certain parent id
const getFilesByParentId = async (req, res, next) => {
  try {
    const { parentId } = req.params;

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    const files = await bucket.find({ 'metadata.parentId': parentId }).toArray();

    if (!files || files.length === 0) {
      return res.status(201).json({ message: "No files found with the provided parentId", status: 201 });
    }

    res.status(200).json({ files });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// get all files of a certain type
const getFilesByType = async (req, res, next) => {
  try {
    const { type } = req.params;

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    const files = await bucket.find({ 'metadata.type': type }).toArray();

    if (!files || files.length === 0) {
      return res.status(201).json({ message: "No files found of the provided type", status: 201 });
    }

    res.status(200).json({ files });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// delete file from database provided with fileId
const deleteFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    const db = mongoose.connection.db;
    const fileCollection = db.collection('uploads.files');
    const chunksCollection = db.collection('uploads.chunks');

    const fileResult = await fileCollection.deleteOne({ _id: new mongoose.Types.ObjectId(fileId) });
    await chunksCollection.deleteMany({ files_id: new mongoose.Types.ObjectId(fileId) });

    if (fileResult.deletedCount === 0) {
      throw new Error(`File not found for id ${fileId}`);
    }

    res.status(200).json({ message: 'File deleted successfully' });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// delete files from database provided with fileIds
const deleteFiles = async (req, res, next) => {
  try {
    let { fileIds } = req.body;
    fileIds = JSON.parse(fileIds);
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    if (!fileIds || fileIds.length === 0) {
      return res.status(400).json({ error: 'No file IDs provided for deletion' });
    }

    const db = mongoose.connection.db;
    const fileCollection = db.collection('uploads.files');
    const chunksCollection = db.collection('uploads.chunks');

    const deleteFile = async (fileId) => {
      const fileResult = await fileCollection.deleteOne({ _id: new mongoose.Types.ObjectId(fileId) });
      await chunksCollection.deleteMany({ files_id: new mongoose.Types.ObjectId(fileId) });

      if (fileResult.deletedCount === 0) {
        throw new Error(`File not found for id ${fileId}`);
      }
    };

    await Promise.all(fileIds.map(deleteFile));

    res.status(200).json({
      message: 'Files deleted successfully',
      deletedFilesCount: fileIds.length,
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = {
  uploadSingle,
  uploadMultiple,
  updateFile,
  updateFiles,
  searchFiles,
  streamFile,
  downloadFile,
  getFileById,
  getAllFilesByUser,
  getAllFilesByName,
  getAllFilesByLabel,
  deleteFile,
  deleteFiles,
  getFilesByParentId,
  getFilesByType,
};