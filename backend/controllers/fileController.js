const mongoose = require('mongoose');
const File = require('../models/fileModel');

// upload single file
const uploadSingle = async (req, res, next) => {
  try {
    const file = req.file;
    const userId = req.body.userId;
    const label = req.body.label;
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
            parentId: parentId,
            type: type,
          },
        },
      });
    });

    uploadStream.end(file.buffer);
  } catch (err) {
    next(err);
  }
};

// upload multiple files
const uploadMultiple = async (req, res, next) => {
  try {
    const files = req.files;
    const userIds = req.body.userIds;
    const labels = req.body.labels;
    const parentIds = req.body.parentId;
    const types = req.body.type;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    let uploadedFiles = [];

    const uploadFile = (file, userId, label, parentId, type) => {
      return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStreamWithId(
          new mongoose.Types.ObjectId(),
          file.originalname,
          {
            metadata: {
              createdBy: userId,
              label: label,
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
            },
          });
          resolve();
        });

        uploadStream.end(file.buffer);
      });
    };

    const uploadPromises = files.map((file, index) =>
      uploadFile(file, userIds[index], labels[index], parentIds[index], types[index])
    );

    await Promise.all(uploadPromises);

    res.status(201).json({
      message: 'Files uploaded successfully',
      files: uploadedFiles,
    });
  } catch (err) {
    next(err);
  }
};

// Use to modify file metadata and filename in the 'uploads' gridfs bucket.
const performUpdate = async (fileId, userId, label, filename, parentId, type, file) => {
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
      await bucket.delete(new mongoose.Types.ObjectId(fileId));

      //upload new file
      const uploadStream = bucket.openUploadStreamWithId(
        new mongoose.Types.ObjectId(fileId),
        filename,
        {
          metadata: {
            createdBy: userId,
            label: label,
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

      const updatedFile = (file, filename, fileId, userId, label, parentId, type) => {
        return new Promise((resolve, reject) => {
          const uploadStream = bucket.openUploadStreamWithId(
            new mongoose.Types.ObjectId(fileId),
            filename,
            {
              metadata: {
                createdBy: userId,
                label: label,
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
                parentId: parentId,
                type: type,
              },
            });
            resolve();
          });

          uploadStream.end(file.buffer);
        });
      };

      const updatePromise = updatedFile(file, filename, fileId, userId, label, parentId, type);

      await Promise.resolve(updatePromise);

      return updatedFiles[0];
    }

    else {
      const updateData = {
        filename: filename || existingFile[0].filename,
        metadata: {
          createdBy: userId || existingFile[0].metadata.createdBy,
          label: label || existingFile[0].metadata.label,
          parentId: parentId || existingFile[0].metadata.parentId,
          type: type || existingFile[0].metadata.type,
        },
      };

      const updatedFile = await File.findByIdAndUpdate(fileId, updateData, { new: true });
      return updatedFile;
    };
  } catch (error) {
    console.log(error);
  }
};

// update single file
const updateFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const { userId, label, filename, parentId, type } = req.body;
    const file = req.file;

    const updatedFile = await performUpdate(fileId, userId, label, filename, parentId, type, file || null);

    res.json({
      message: 'File updated successfully',
      file: updatedFile,
    });
  } catch (err) {
    next(err);
  }
};

// update multiple files
const updateFiles = async (req, res, next) => {
  try {
    const updates = Array.isArray(req.body) ? req.body : [req.body];
    const files = req.files;

    const updatedFiles = await Promise.all(
      updates.map(async (update, index) => {
        const { _id, userId, label, parentId, type, filename } = update;
        const fileId = _id;
        const file = files && files[index];
        return await performUpdate(fileId, userId, label, filename, parentId, type, file || null);
      })
    );

    res.json({
      message: 'Files updated successfully',
      files: updatedFiles,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

// search for files using query params
const searchFiles = async (req, res, next) => {
  try {
    const { fileId, filename, createdBy, label, parentId, type } = req.query;

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    const searchQuery = {
      ...(fileId && { _id: new mongoose.Types.ObjectId(fileId) }),
      ...(filename && { filename: filename }),
      ...(createdBy && { 'metadata.createdBy': createdBy }),
      ...(label && { 'metadata.label': label }),
      ...(parentId && { 'metadata.parentId': parentId }),
      ...(type && { 'metadata.type': type }),
    };

    const files = await bucket.find(searchQuery).sort({ uploadDate: -1 }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files found" });
    }

    res.status(200).json({ files });
  } catch (err) {
    next(err);
  }
};


// stream file from database to client
const streamFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    // console.log({ fileId });
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
    next(err);
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
    next(err);
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
      return res.status(404).json({ error: 'File not found' });
    }

    res.status(200).json(fileInfo[0]);
  } catch (err) {
    next(err);
  }
};

// get all files from database for a specific user
const getAllFilesByUser = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    const files = await bucket.find({ 'metadata.createdBy': userId }).toArray();

    res.status(200).json(files);
  } catch (err) {
    next(err);
  }
};

// get all files under a certain label
const getAllFilesByLabel = async (req, res, next) => {
  try {
    const { label } = req.query;
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    const files = await bucket.find({ 'metadata.label': label }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files found with the provided label" });
    }

    res.status(200).json(files);
  } catch (err) {
    next(err);
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
      return res.status(404).json({ message: "No files found with the provided parentId" });
    }

    res.status(200).json({ files });
  } catch (err) {
    next(err);
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
      return res.status(404).json({ message: "No files found of the provided type" });
    }

    res.status(200).json({ files });
  } catch (err) {
    next(err);
  }
};


// delete files from database provided with fileIds
const deleteFiles = async (req, res, next) => {
  try {
    const { fileIds } = req.body;
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    if (!fileIds || fileIds.length === 0) {
      return res.status(400).json({ error: 'No file IDs provided for deletion' });
    }

    const deleteFile = (fileId) => {
      return new Promise((resolve, reject) => {
        bucket.delete(new mongoose.Types.ObjectId(fileId), (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    };

    const deletePromises = fileIds.map(deleteFile);

    await Promise.all(deletePromises);

    res.status(200).json({
      message: 'Files deleted successfully',
      deletedFilesCount: fileIds.length,
    });
  } catch (err) {
    next(err);
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
  getAllFilesByLabel,
  deleteFiles,
  getFilesByParentId,
  getFilesByType,
};

