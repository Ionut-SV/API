const express = require('express');
const fileController = require('../controllers/fileController.js'); 
const commentsController = require('../controllers/commentsController.js');
const { validateToken } = require('../controllers/jwtController.js');
const router = express.Router();

// Use body-parser middleware
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

router.post('/upload', validateToken, fileController.uploadFile);
router.get('/files', fileController.getFiles);
router.get('/:filename', fileController.getFileByName);
router.get('/files/:id',  fileController.getFileById);
router.put('/files/:id', validateToken, fileController.updateFile);

module.exports = router;