import express from 'express';
import {
  getLawyers,
  getLawyerById,
  createLawyer,
  updateLawyer,
  deleteLawyer
} from '../controllers/lawyer.controller.js';
import isAuthenticated from '../middlewares/isauthenticated.js';
import upload from '../utils/multer.js';

const router = express.Router();

// Public routes
router.get('/', getLawyers);
router.get('/:id', getLawyerById);

// Admin/Protected routes
router.post(
  '/register',
  isAuthenticated,
  upload.fields([
    { name: 'profilePic', maxCount: 1 },
    { name: 'document', maxCount: 1 }
  ]),
  createLawyer
);

router.put('/:id', isAuthenticated, updateLawyer);
router.delete('/:id', isAuthenticated, deleteLawyer);

export default router;
