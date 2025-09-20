// controllers/documentController.js

import crypto from 'crypto';
import path from 'path';
import mongoose from 'mongoose';
import {Document} from '../models/document.model.js';
import { checkDocumentSafety, generateDraftDocument } from "../utils/aiIntegration.js"
import { log } from 'console';

// GridFS setup
let gfs;

// Initialize GridFS once DB is connected
mongoose.connection.once('open', () => {
gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
  bucketName: 'documents',
});
});

// @desc    Upload a document
// @route   POST /api/documents/upload
// @access  Private
export const uploadDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    
    const document = new Document({
      owner: req.id,
      fileUrl: `/api/documents/file/${req.file.filename}`,
      filename: req.file.originalname,
      type: req.body.type || 'unknown',
      auditTrail: [{ action: 'uploaded', by: req.id }],
    });

    await document.save();
    res.status(201).json({ message: 'Document uploaded', document });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error on document upload' });
  }
};

// @desc    Get document file by filename
// @route   GET /api/documents/file/:filename
// @access  Private
export const getDocumentFile = async (req, res) => {
  try {
    const file = await mongoose.connection.db
      .collection('documents.files')
      .findOne({ filename: req.params.filename });

    if (!file) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.set('Content-Type', file.contentType || 'application/octet-stream');
    res.set(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(file.filename)}"`
    );

    const downloadStream = gfs.openDownloadStreamByName(req.params.filename);
    downloadStream.on('error', () => {
      res.status(500).json({ message: 'Error streaming file' });
    });
    downloadStream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching file' });
  }
};

// @desc    Get document details by ID
// @route   GET /api/documents/:id
// @access  Private
export const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id).populate(
      'owner',
      'name email role'
    );

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Authorization: owner or lawyer
    if (
      document.owner._id.toString() !== req.id.toString() &&
      req.user.role !== 'lawyer'
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(document);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Check document safety using AI
// @route   POST /api/documents/check-safety
// @access  Private
export const checkDocumentSafetyHandler = async (req, res) => {
  const { documentId } = req.body;
  if (!documentId) {
    return res.status(400).json({ message: 'Document ID required' });
  }

  try {
    const document = await Document.findById(documentId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Authorization
    if (
      document.owner.toString() !== req.id.toString() &&
      req.user.role !== 'lawyer'
    ) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Read file from GridFS
    const chunks = [];
    const downloadStream = gfs.openDownloadStreamByName(
      document.fileUrl.split('/').pop()
    );

    downloadStream.on('data', (chunk) => chunks.push(chunk));
    downloadStream.on('error', () => {
      return res.status(500).json({ message: 'Error reading document' });
    });
    downloadStream.on('end', async () => {
      const fileContent = Buffer.concat(chunks).toString('utf-8');
      const safetyResult = await checkDocumentSafety(fileContent);

      document.status = safetyResult.isSafe ? 'safe' : 'needs_changes';
      await document.save();

      res.json({
        status: document.status,
        details: safetyResult.details,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Generate draft legal document using AI
// @route   POST /api/documents/draft
// @access  Private
export const generateDraftDocumentHandler = async (req, res) => {
  const { type, placeholders } = req.body;
  if (!type) {
    return res.status(400).json({ message: 'Document type is required' });
  }

  try {
    const draft = await generateDraftDocument(type, placeholders || {});
    res.json({ draft });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error generating draft document' });
  }
};