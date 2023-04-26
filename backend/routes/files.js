const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
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
} = require('../controllers/fileController');

// Request body: userId (string), label(string), file (single file). (file should be multipart/form-data)
router.post('/uploadSingle', upload.single('file'), uploadSingle);

// Request body: userIds (array), labels(array), files (array). (files should be multipart/form-data)
router.post('/uploadMultiple', upload.array('files'), uploadMultiple);

// Request params: fileId (ObjectId, required)
// Request body: userId (string, optional), label (string, optional), filename (string, optional), file (file, optional)
// file should be sent as multipart/form-data
router.patch('/update/:fileId', upload.single('file'), updateFile);

// Request body:
    // updates (JSON stringified array of objects with fields:
        // fileId (required), userId (optional), label (optional), filename (optional)),
    // files (array, optional)
        // files should be sent as multipart/form-data with the same order as updates
router.patch('/update', upload.array('files'), updateFiles);

// Query parameters: fileId, createdBy, and/or label
// Example: /search?fileId=123&createdBy=user1&label=report
router.get("/search", searchFiles);

// Request params: fileId
router.get('/stream/:fileId', streamFile);

// Request params: fileId
router.get('/download/:fileId', downloadFile);

// Request params: fileId
router.get('/file/:fileId', getFileById);

// Request query: userId
router.get('/user/files', getAllFilesByUser);

// Request query: label
router.get('/label/files', getAllFilesByLabel);

// Request body: fileIds (array)
router.delete('/delete', deleteFiles);

module.exports = router;
