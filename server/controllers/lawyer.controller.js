import { Lawyer } from '../models/lawyer.model.js';

// Get all lawyers with optional filters
export const getLawyers = async (req, res) => {
  try {
    const { search, specialization, location } = req.query;

    let filter = {};
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } }
      ];
    }
    if (specialization) filter.specialization = specialization;
    if (location) filter.location = location;

    const lawyers = await Lawyer.find(filter).sort({ rating: -1, experience: -1 });
    res.status(200).json(lawyers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lawyers', error });
  }
};

// Get single lawyer by ID
export const getLawyerById = async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id);
    if (!lawyer) return res.status(404).json({ message: 'Lawyer not found' });
    res.status(200).json(lawyer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching lawyer', error });
  }
};

// Create new lawyer
export const createLawyer = async (req, res) => {
  try {
    const newLawyer = new Lawyer(req.body);
    await newLawyer.save();
    res.status(201).json(newLawyer);
  } catch (error) {
    res.status(500).json({ message: 'Error creating lawyer', error });
  }
};

// Update lawyer
export const updateLawyer = async (req, res) => {
  try {
    const updatedLawyer = await Lawyer.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedLawyer);
  } catch (error) {
    res.status(500).json({ message: 'Error updating lawyer', error });
  }
};

// Delete lawyer
export const deleteLawyer = async (req, res) => {
  try {
    await Lawyer.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Lawyer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting lawyer', error });
  }
};
