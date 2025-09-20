// controllers/activityController.js

import { Activity } from "../models/activity.model.js";

// @desc    Add new activity/reminder
// @access  Private
export const addActivity = async (req, res) => {
  const { title, description, date, time, repeatFrequency = 'none' } = req.body;

  try {
    const activity = new Activity({
      user: req.id,
      title,
      description,
      date,
      time,
      repeatFrequency,
    });

    await activity.save();
    res.status(201).json({ message: 'Activity added', activity });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all activities for logged-in user
// @access  Private
export const getUserActivities = async (req, res) => {
  try {
    const activities = await Activity.find({ user: req.id })
      .sort({ date: 1, time: 1 });

    res.json(activities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};