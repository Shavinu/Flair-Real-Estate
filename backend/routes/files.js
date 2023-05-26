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
    getAllFilesByName,
    getAllFilesByLabel,
    deleteFile,
    deleteFiles,
    getFilesByParentId,
    getFilesByType,
} = require('../controllers/fileController');

// Upload a single file
// Request body: userId (string), label(string), displayOnTop(boolean), parentId(string), type(string), file (file). (file should be multipart/form-data)
router.post('/uploadSingle', upload.single('file'), uploadSingle);

// Upload multiple files
// Request body: userIds (array), labels(array), displayOnTops(array), parentIds(array), types(array), files (array). (files should be multipart/form-data)
router.post('/uploadMultiple', upload.array('files'), uploadMultiple);

// Update a specific file
// Request params: fileId (ObjectId, required)
// Request body: userId (string, optional), label (string, optional), displayOnTop(bool, optional), parentId (string, optional), type (string, optional), filename (string, optional), file (file, optional)
// file should be sent as multipart/form-data
router.patch('/update/:fileId', upload.single('file'), updateFile);

// Update multiple files
// Request body: updates (JSON stringified array of objects with fields: _id (required), filename (optional), metadata (optional object with fields: userId (optional), label (optional), displayOnTop (optional), parentId (optional), type (optional)))
// files (array, optional) files should be sent as multipart/form-data with the same order as updates
router.patch('/update', upload.array('files'), updateFiles);

// Search files by fileId, filename, createdBy, label, parentId, and/or type
// Query parameters: fileId, filename, createdBy, label, displayOnTop, parentId, type
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
router.get('/user/:userId', getAllFilesByUser);

// Get all files with a specific name
// Request query: filename
router.get('/filename/:filename', getAllFilesByName);

// Get all files with a specific label
// Request query: label
router.get('/label/:label', getAllFilesByLabel);

// Delete a specific file
// Request params: fileId
router.delete('/delete/:fileId', deleteFile);

// Delete specific files
// Request body: fileIds (array)
router.post('/delete', deleteFiles);

// Get all files with a specific parentId
// Request params: parentId
router.get('/parent/:parentId', getFilesByParentId);

// Get all files of a specific type
// Request params: type
router.get('/type/:type', getFilesByType);

module.exports = router;