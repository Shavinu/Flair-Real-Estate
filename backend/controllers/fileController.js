const File = require('../models/file');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

//gridfs bucket for file storage in mongodb database
const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
    bucketName: 'uploads'
});

//create file in database and upload file to server storage folder (uploads) under the user's id
const upload = async (req, res, next) => {
    try {
        const uploadStream = bucket.openUploadStream(req.file.filename, {
            metadata: {
                createdBy: req.body.userId,
                //use label to specify usecase of file
                label: req.body.label
            }
        });
        fs.createReadStream(req.file.path).pipe(uploadStream);
        uploadStream.on('error', (err) => {
            return next({
                log: `Error uploading file: ${err}`,
                message: { err: 'Error occurred while uploading file' }
            });
        });
        uploadStream.on('finish', async () => {
            try {
                const file = new File({
                    filename: req.file.filename,
                    contentType: req.file.mimetype,
                    metadata: {
                        createdBy: req.body.userId,
                        label: req.body.label
                    },
                    length: req.file.size,
                    chunkSize: req.file.size,
                    uploadDate: Date.now(),
                    md5: uploadStream.adapter.fileId.toHexString()
                });
                await file.save();
                fs.unlinkSync(req.file.path);
                res.status(201).json({
                    message: 'File uploaded successfully',
                    file: file
                });
            } catch (err) {
                next(err);
            }
        });
    } catch (err) {
        next(err);
    }
}

//upload multiple files to server storage folder (uploads)
const uploadMultiple = async (req, res, next) => {
    try {
      const uploadPromises = req.files.map(file => {
        return new Promise((resolve, reject) => {
          const uploadStream = bucket.openUploadStream(file.filename, {
            metadata: {
              createdBy: req.body.userId,
              label: file.label
            }
          });
          const id = uploadStream.id;
          fs.createReadStream(file.path).pipe(uploadStream);
          uploadStream.on('error', (err) => {
            reject({
              log: `Error uploading file: ${err}`,
              message: { err: 'Error occurred while uploading file' }
            });
          });
          uploadStream.on('finish', async () => {
            try {
              const fileObj = new File({
                filename: file.filename,
                contentType: file.mimetype,
                metadata: {
                  createdBy: req.body.userId,
                  label: file.label
                },
                length: file.size,
                chunkSize: file.size,
                uploadDate: Date.now(),
                md5: uploadStream.adapter.fileId.toHexString()
              });
              await fileObj.save();
              fs.unlinkSync(file.path);
              resolve(fileObj);
            } catch (err) {
              reject(err);
            }
          });
        });
      });
  
      const uploadedFiles = await Promise.all(uploadPromises);
      res.status(201).json({
        message: 'Files uploaded successfully',
        files: uploadedFiles
      });
    } catch (err) {
      next(err);
    }
};

//update file in database and server storage folder (uploads) under the user's id
const updateFile = async (req, res, next) => {
    const fileId = req.params.fileId;
    const label = req.body.label;
    const file = await File.findById(fileId);
  
    if (!file) {
        return res.status(404).json({
            message: `File not found with id: ${fileId}`,
        });
    }
  
    const uploadStream = bucket.openUploadStreamWithId(file.md5, req.file.filename, {
      metadata: {
        createdBy: req.body.userId,
        label: label || file.metadata.label // if label not specified in request, use the existing label
      }
    });
  
    fs.createReadStream(req.file.path).pipe(uploadStream);
  
    uploadStream.on('error', (err) => {
      return next({
        log: `Error uploading file: ${err}`,
        message: { err: 'Error occurred while uploading file' }
      });
    });
  
    uploadStream.on('finish', async () => {
      try {
        const updatedFile = await File.findByIdAndUpdate(fileId, {
          filename: req.file.filename,
          contentType: req.file.mimetype,
          metadata: {
            createdBy: req.body.userId,
            label: label || file.metadata.label // if label not specified in request, use the existing label
          },
          length: req.file.size,
          chunkSize: req.file.size,
          uploadDate: Date.now(),
          md5: uploadStream.adapter.fileId.toHexString()
        }, { new: true });
        fs.unlinkSync(req.file.path);
        res.status(200).json({
          message: 'File updated successfully',
          file: updatedFile
        });
      } catch (err) {
        next(err);
      }
    });
};

//search for files in database by any of the following: filename, label, or user id
const searchFiles = async (req, res, next) => {
    try {
        const query = req.query.q;
        const files = await File.find({
            $or: [
                { filename: { $regex: query, $options: 'i' } },
                { 'metadata.label': { $regex: query, $options: 'i' } },
                { 'metadata.createdBy': { $regex: query, $options: 'i' } }
            ]
        });
        res.status(200).json({
            message: 'Files retrieved successfully',
            files: files
        });
    } catch (err) {
        next(err);
    }
};


//stream file from database to client
const streamFile = async (req, res, next) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            const error = new Error('File not found');
            error.statusCode = 404;
            throw error;
        }
        const downloadStream = bucket.openDownloadStream(file.md5);
        res.set('Content-Type', file.contentType);
        res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
        downloadStream.on('data', (chunk) => {
            res.write(chunk);
        });
        downloadStream.on('error', (err) => {
            next(err);
        });
        downloadStream.on('end', () => {
            res.end();
        });
    } catch (err) {
        next(err);
    }
}

//download file from database and server storage folder
const download = async (req, res, next) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            const error = new Error('File not found');
            error.statusCode = 404;
            throw error;
        }
        const downloadStream = bucket.openDownloadStreamByName(file.filename);
        downloadStream.pipe(res);
    } catch (err) {
        return next({
            log: `Error downloading file: ${err}`,
            message: { err: 'Error downloading file.' }
        });
    }
}

//get all files from database for a specific user
const getAll = async (req, res, next) => {
    try {
        const files = await File.find({ 'metadata.createdBy': req.body.userId });
        if (files.length === 0) {
            const error = new Error('Files not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'Files fetched successfully',
            files: files
        });
    } catch (err) {
        next(err);
    }
}

//get file from database by id
const getById = async (req, res, next) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            const error = new Error('File not found');
            error.statusCode = 404;
            throw error;
        }
        res.status(200).json({
            message: 'File fetched successfully',
            file: file
        });
    } catch (err) {
        next(err);
    }
};

//delete file from database and server storage folder (uploads) under the user's id
const deleteFile = async (req, res, next) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            const error = new Error('File not found');
            error.statusCode = 404;
            throw error;
        }
        await File.findByIdAndDelete(req.params.id);
        await bucket.delete(file._id);
        res.status(200).json({
            message: 'File deleted successfully'
        });
    } catch (err) {
        next(err);
    }
}

//delete all files from database and delete all files from server storage folder (uploads) under the user's id
const deleteAll = async (req, res, next) => {
    try {
        const files = await File.find({ 'metadata.createdBy': req.body.userId });
        if (files.length === 0) {
            const error = new Error('Files not found');
            error.statusCode = 404;
            throw error;
        }
        await File.deleteMany({ 'metadata.createdBy': req.body.userId });
        for (let file of files) {
            await bucket.delete(file._id);
        }
        res.status(200).json({
            message: 'Files deleted successfully'
        });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    upload,
    uploadMultiple,
    updateFile,
    streamFile,
    download,
    searchFiles,
    getAll,
    getById,
    deleteFile,
    deleteAll
};

