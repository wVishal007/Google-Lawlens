import express from 'express';
import {
  getLawyers,
  getLawyerById,
  createLawyer,
  updateLawyer,
  deleteLawyer
} from '../controllers/lawyer.controller.js';
import isAuthenticated from '../middlewares/isauthenticated.js';

const router = express.Router();

// Public routes
router.get('/', getLawyers);
router.get('/:id', getLawyerById);

// Admin/Protected routes
router.post('/addLawyer', isAuthenticated, createLawyer);
router.put('/:id', isAuthenticated, updateLawyer);
router.delete('/:id', isAuthenticated, deleteLawyer);

export default router;
