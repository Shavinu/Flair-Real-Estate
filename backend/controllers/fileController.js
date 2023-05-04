const mongoose = require('mongoose');
const File = require('../models/fileModel');

const uploadSingle = async (req, res, next) => {
  try {
    const file = req.file;
    const userId = req.body.userId;
    const label = req.body.label;

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
          },
        },
      });
    });

    uploadStream.end(file.buffer);
  } catch (err) {
    next(err);
  }
};

const uploadMultiple = async (req, res, next) => {
  try {
    const files = req.files;
    const userIds = req.body.userIds;
    const labels = req.body.labels;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files provided' });
    }

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    let uploadedFiles = [];

    const uploadFile = (file, userId, label) => {
      return new Promise((resolve, reject) => {
        const uploadStream = bucket.openUploadStreamWithId(
          new mongoose.Types.ObjectId(),
          file.originalname,
          {
            metadata: {
              createdBy: userId,
              label: label,
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
      uploadFile(file, userIds[index], labels[index])
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

const performUpdate = async (fileId, userId, label, filename, file) => {
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
          },
          contentType: file.mimetype,
        }
      );
  
      uploadStream.on('error', (err) => {
        throw new Error('Error occurred while uploading file', err);
      });
  
      let updatedFiles = [];
  
      const updatedFile = (file, filename, fileId, userId, label) => {
        return new Promise((resolve, reject) => {
          const uploadStream = bucket.openUploadStreamWithId(
            new mongoose.Types.ObjectId(fileId),
            filename,
            {
              metadata: {
                createdBy: userId,
                label: label,
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
              },
            });
            resolve();
          });
  
          uploadStream.end(file.buffer);
        });
      };
  
      const updatePromise = updatedFile(file, filename, fileId, userId, label);
  
      await Promise.resolve(updatePromise);
  
      return updatedFiles[0];
    }
  
    else {
      const updateData = {
        filename: filename || existingFile[0].filename,
        metadata: {
          createdBy: userId || existingFile[0].metadata.createdBy,
          label: label || existingFile[0].metadata.label,
        },
      };
  
      const updatedFile = await File.findByIdAndUpdate(fileId, updateData, { new: true });
      return updatedFile;
    };
  } catch (error) {
    console.log(error);
  }
};

const updateFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    const { userId, label, filename } = req.body;
    const file = req.file;

    const updatedFile = await performUpdate(fileId, userId, label, filename, file);

    res.json({
      message: 'File updated successfully',
      file: updatedFile,
    });
  } catch (err) {
    next(err);
  }
};

const updateFiles = async (req, res, next) => {
  try {
    const updates = JSON.parse(req.body.updates);
    const files = req.files;

    console.log(updates);
    console.log(files);

    const updatedFiles = await Promise.all(
      updates.map(async (update, index) => {
        const { _id, userId, label, filename } = update;
        const fileId = _id;
        const file = files && files[index];
        return await performUpdate(fileId, userId, label, filename, file || null);
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

//search for files in database by any of the following: filename, label, or user id
const searchFiles = async (req, res, next) => {
  try {
    const { fileId, createdBy, label } = req.query;

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    const searchQuery = {
      //if no query params are provided, return all files
      ...(fileId && { _id: new mongoose.Types.ObjectId(fileId) }),
      ...(createdBy && { 'metadata.createdBy': createdBy }),
      ...(label && { 'metadata.label': label }),
    };

    const files = await bucket.find(searchQuery).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "No files found" });
    }

    res.status(200).json({ files });
  } catch (err) {
    next(err);
  }
};


//stream file from database to client
const streamFile = async (req, res, next) => {
  try {
    const { fileId } = req.params;
    console.log({ fileId });
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


//download file from database and server storage folder
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

//get file from database by id
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

//get all files from database for a specific user
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

//get all files under a certain label
const getAllFilesByLabel = async (req, res, next) => {
  try {
    const { label } = req.query;
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'uploads',
    });

    const files = await bucket.find({ 'metadata.label': label }).toArray();

    res.status(200).json(files);
  } catch (err) {
    next(err);
  }
};

//delete files from database provided with fileIds
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
};

