const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const {
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
} = require('../controllers/files');

// upload a new file
// needs to pass userId, file, label in the request body. file should be multipart/form-data
router.post('/upload', upload.single('file'), upload);

// upload multiple files
// needs following in the request body:
// 'files': An array of files to be uploaded to the server. 
//   Each file in the array should have the following properties:
//      filename: The name of the file.
//      mimetype: The MIME type of the file.
//      path: The path of the file on the local system.
//      label: A label to attach to the file.
// 'userId'
router.post('/upload-multiple', upload.array('files'), uploadMultiple);

// update a file by id
// needs to pass a 'file' multipart/form-data and 'fileId' in the request parameters
router.put('/update/:fileId', upload.single('file'), updateFile);

// stream a file by id
// needs to pass a 'fileId' in the request parameters
router.get('/stream/:fileId', streamFile);

// download a file by id
// needs to pass a 'fileId' in the request parameters
router.get('/download/:fileId', download);

// search for files by filename, label, or user id
// needs to pass 'q' with search query
router.get('/search', searchFiles);

// get all files
// need to pass userId in the request parameters
router.get('/all/:userId', getAll);

// get a file by id
// needs to pass a 'fileId' in the request parameters
router.get('/:fileId', getById);

// delete a file by id
// needs to pass a 'fileId' in the request parameters
router.delete('/:fileId', deleteFile);

// delete all files
// need to pass userId in the request parameters
router.delete('/all/:userId', deleteAll);

module.exports = router;
