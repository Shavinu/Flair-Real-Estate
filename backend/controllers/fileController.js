const mongoose = require('mongoose');

const uploadSingle = async (req, res, next) => {
    try {
      const files = req.files.files[0];
      const userId = req.body.userIds[0];
      const label = req.body.labels[0];
  
      if (!files) {
        return res.status(400).json({ error: 'No file provided' });
      }
  
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads',
      });
  
      const uploadStream = bucket.openUploadStreamWithId(new mongoose.Types.ObjectId(), files.originalname, {
        metadata: {
          createdBy: userId,
          label: label,
        },
        contentType: files.mimetype,
      });
  
      uploadStream.on('error', (err) => {
        return res.status(500).json({ error: 'Error occurred while uploading file' });
      });
  
      uploadStream.on('finish', () => {
        res.status(201).json({
          message: 'File uploaded successfully',
          file: {
            _id: uploadStream.id,
            filename: files.originalname,
            contentType: files.mimetype,
            metadata: {
              createdBy: userId,
              label: label,
            },
          },
        });
      });
  
      uploadStream.end(files.buffer);
  
    } catch (err) {
      next(err);
    }
  };

  const uploadMultiple = async (req, res, next) => {
    try {
      const { files } = req.files;
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

const updateFile = async (req, res, next) => {
    try {
      const { filesToUpdate, body: { userId, label } } = req;
  
      if (!filesToUpdate || filesToUpdate.length === 0) {
        return res.status(400).json({ error: 'No files provided for update' });
      }
  
      const updatedFiles = await File.updateMany(
        { _id: { $in: filesToUpdate.map(file => file._id) } },
        { $set: { 'metadata.label': label } }
      );
  
      res.status(200).json({
        message: 'Files updated successfully',
        updatedFilesCount: updatedFiles.nModified,
      });
    } catch (err) {
      next(err);
    }
};  

//update file's metadata
const updateFileMetadata = async (req, res, next) => {
    try {
      const { fileId } = req.params;
      const { userId, label } = req.body;
      const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads',
      });
  
      const file = await bucket.find({ _id: new mongoose.Types.ObjectId(fileId) }).next();
  
      if (!file) {
        return res.status(404).json({ error: 'File not found' });
      }
  
      const updatedMetadata = {
        ...file.metadata,
        createdBy: userId || file.metadata.createdBy,
        label: label || file.metadata.label,
      };
  
      await bucket.rename(file._id, file.filename, { metadata: updatedMetadata });
  
      res.status(200).json({
        message: 'File metadata updated successfully',
        file: {
          ...file,
          metadata: updatedMetadata,
        },
      });
    } catch (err) {
      next(err);
    }
};

//search for files in database by any of the following: filename, label, or user id
const searchFiles = async (req, res, next) => {
    try {
      const { fileId, createdBy, label } = req.query;
  
      const searchQuery = {
        $or: [
          ...(fileId ? [{ _id: fileId }] : []),
          ...(createdBy ? [{ "metadata.createdBy": createdBy }] : []),
          ...(label ? [{ "metadata.label": label }] : []),
        ],
      };
  
      const files = await File.find(searchQuery);
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
    updateFileMetadata,
    searchFiles,
    streamFile,
    downloadFile,
    getFileById,
    getAllFilesByUser,
    getAllFilesByLabel,
    deleteFiles,
  };

