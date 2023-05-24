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
    getFilesByParentId,
    getFilesByType,
} = require('../controllers/fileController');

// Upload a single file
// Request body: userId (string), label(string), parentId(string), type(string), file (single file). (file should be multipart/form-data)
router.post('/uploadSingle', upload.single('file'), uploadSingle);

// Upload multiple files
// Request body: userIds (array), labels(array), parentIds(array), types(array), files (array). (files should be multipart/form-data)
router.post('/uploadMultiple', upload.array('files'), uploadMultiple);

// Update a specific file
// Request params: fileId (ObjectId, required)
// Request body: userId (string, optional), label (string, optional), parentId (string, optional), type (string, optional), filename (string, optional), file (file, optional)
// file should be sent as multipart/form-data
router.patch('/update/:fileId', upload.single('file'), updateFile);

// Update multiple files
// Request body: updates (JSON stringified array of objects with fields: fileId (required), userId (optional), label (optional), filename (optional), parentId (optional), type (optional)),
// files (array, optional) files should be sent as multipart/form-data with the same order as updates
router.patch('/update', upload.array('files'), updateFiles);

// Search files by fileId, filename, createdBy, label, parentId, and/or type
// Query parameters: fileId, filename, createdBy, label, parentId, type
// Example: /search?fileId=123&filename=test&createdBy=user1&label=report&parentId=321&type=xyz
router.get("/search", searchFiles);

// Stream a specific file
// Request params: fileId
router.get('/stream/:fileId', streamFile);

// Download a specific file
// Request params: fileId
router.get('/download/:fileId', downloadFile);

// Get a specific file by id
// Request params: fileId
router.get('/file/:fileId', getFileById);

// Get all files by a specific user
// Request query: userId
router.get('/user/files', getAllFilesByUser);

// Get all files with a specific label
// Request query: label
router.get('/label/files', getAllFilesByLabel);

// Delete specific files
// Request body: fileIds (array)
router.delete('/delete', deleteFiles);

// Get all files with a specific parentId
// Request params: parentId
router.get('/parent/:parentId', getFilesByParentId);

// Get all files of a specific type
// Request params: type
router.get('/type/:type', getFilesByType);

module.exports = router;