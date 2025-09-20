// routes/activities.js

import express from 'express';
import { body, validationResult } from 'express-validator';
import { addActivity, getUserActivities } from '../controllers/activity.controller.js';
import isauthenticated from '../middlewares/isauthenticated.js'; // 👈 You said you use this

const router = express.Router();

// @route   POST /api/activities/add
// @desc    Add activity/reminder
// @access  Private
router.post(
  '/add',
  isauthenticated,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('date').isISO8601().toDate().withMessage('Valid date required'),
    body('time').matches(/^([01]\d|2[0-3]):([0-5]\d)$/).withMessage('Time must be HH:mm'),
    body('repeatFrequency').optional().isIn(['none', 'daily', 'weekly', 'monthly']),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  addActivity
);

// @route   GET /api/activities
// @desc    Get activities for logged-in user
// @access  Private
router.get('/', isauthenticated, getUserActivities);

export default router;