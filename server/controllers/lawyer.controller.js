import { Lawyer } from '../models/lawyer.model.js';
import { User } from '../models/user.model.js';
import cloudinary from '../utils/cloudinary.js'
import getDataUri from '../utils/datauri.js';

// ✅ Get all lawyers with filters
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

    const lawyers = await Lawyer.find(filter)
      .populate("userId", "email profilePicture") // optional: show linked user info
      .sort({ rating: -1, experience: -1 });

    res.status(200).json(lawyers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lawyers", error });
  }
};

// ✅ Get single lawyer
export const getLawyerById = async (req, res) => {
  try {
    const lawyer = await Lawyer.findById(req.params.id).populate("userId", "email profilePicture");
    if (!lawyer) return res.status(404).json({ message: "Lawyer not found" });
    res.status(200).json(lawyer);
  } catch (error) {
    res.status(500).json({ message: "Error fetching lawyer", error });
  }
};

// ✅ Register a new lawyer (only once per user)
// ✅ Register a new lawyer (only once per user)

export const createLawyer = async (req, res) => {
  try {
    const userId = req.id; // from isAuthenticated middleware

    // check if already registered
    const existing = await Lawyer.findOne({ userId });
    if (existing) {
      return res.status(400).json({ message: "You are already registered as a lawyer." });
    }

    const { name, specialization, location, experience, hourlyRate, bio, phone } = req.body;

    let profilePic = "";
    let documentUrl = "";

    // handle profilePic upload
    if (req.files?.profilePic) {
      const fileUri = getDataUri(req.files.profilePic[0]);
      const uploadResponse = await cloudinary.uploader.upload(fileUri, { folder: "lawyers/profilePics" });
      profilePic = uploadResponse.secure_url;
    }

    // handle document upload
    if (req.files?.document) {
      const fileUri = getDataUri(req.files.document[0]);
      const uploadResponse = await cloudinary.uploader.upload(fileUri, { folder: "lawyers/documents" });
      documentUrl = uploadResponse.secure_url;
    }

    // create new lawyer
    const newLawyer = new Lawyer({
      userId,
      name,
      specialization,
      location,
      experience,
      hourlyRate,
      bio,
      phone,
      profilePic,
      documentUrl
    });

    await newLawyer.save();

    // ✅ Update user to set islawyer: true
    await User.findByIdAndUpdate(userId, { islawyer: true });

    res.status(201).json(newLawyer);
  } catch (error) {
    res.status(500).json({ message: "Error creating lawyer", error });
  }
};

// ✅ Update lawyer
export const updateLawyer = async (req, res) => {
  try {
    const userId = req.id;

    const updatedLawyer = await Lawyer.findOneAndUpdate(
      { userId },
      req.body,
      { new: true }
    );

    if (!updatedLawyer) return res.status(404).json({ message: "Lawyer profile not found" });

    res.status(200).json(updatedLawyer);
  } catch (error) {
    res.status(500).json({ message: "Error updating lawyer", error });
  }
};

// ✅ Delete lawyer
export const deleteLawyer = async (req, res) => {
  try {
    const userId = req.id;

    const deleted = await Lawyer.findOneAndDelete({ userId });
    if (!deleted) return res.status(404).json({ message: "Lawyer profile not found" });

    res.status(200).json({ message: "Lawyer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting lawyer", error });
  }
};
