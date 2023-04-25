const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const {
    uploadSingle,
    uploadMultiple,
    updateFileMetadata,
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

// Request body: userId, label
// Request params: fileId
router.put('/update/:fileId', updateFileMetadata);

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
