import express from 'express';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import mongoose from 'mongoose';
import {
  uploadDocument,
  getDocumentFile,
  getDocumentById,
  checkDocumentSafetyHandler,
  generateDraftDocumentHandler,
} from '../controllers/document.controller.js';
import isauthenticated from '../middlewares/isauthenticated.js';

const router = express.Router();

// Use memory storage instead of multer-gridfs-storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Helper middleware to write file buffer to GridFS
const uploadToGridFS = async (req, res, next) => {
  if (!req.file) return next(); // skip if no file

  try {
    const gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: 'documents',
    });

    const filename =
      crypto.randomBytes(16).toString('hex') + path.extname(req.file.originalname);

    const uploadStream = gfs.openUploadStream(filename, {
      contentType: req.file.mimetype,
    });

    uploadStream.end(req.file.buffer); // write buffer

    uploadStream.on('error', (err) => {
      console.error('GridFS upload error:', err);
      return res.status(500).json({ message: 'Error uploading file' });
    });

    uploadStream.on('finish', () => {
      // Attach filename to req.file so controller can save document
      req.file.filename = filename;
      next();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Routes
router.post(
  '/upload',
  isauthenticated,
  upload.single('file'),
  uploadToGridFS,
  uploadDocument
);
router.get('/file/:filename', isauthenticated, getDocumentFile);
router.get('/:id', isauthenticated, getDocumentById);
router.post('/check-safety', isauthenticated, checkDocumentSafetyHandler);
router.post('/draft', isauthenticated, generateDraftDocumentHandler);

export default router;
