import express from 'express';
import Location from '../models/location.js';
import { authenticateUserDetail } from '../middleware/auth.js';

const router=express.Router();

router.post('/location', authenticateUserDetail, async (req, res) => {
  // Handle location update logic here
  try {
    const { latitude, longitude } = req.body;
    // Example: Save location to database
    const newLocation = new Location({employeeId:req.user, latitude, longitude });
    await newLocation.save();
    res.status(200).json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;