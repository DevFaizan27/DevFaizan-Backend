import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'; // Import JWT for authentication
import Location from './models/location.js';
import { connectToMongo } from './Db/db.js'; // Your MongoDB connection function
import User from './models/user.js'; // Assuming you have a User model
import { authenticateUserDetail } from './middleware/auth.js';
import authRoutes from './routes/auth.js';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://dev-faizan-backend.vercel.app',
    methods: ['GET', 'POST'],
  },
});

// Connect to MongoDB
connectToMongo();

// Middleware to parse JSON bodies
app.use(express.json());

// CORS middleware
app.use(cors());

app.get("/", (req, res) => {
  res.json("Kamal Houing Backend Working Good");
});

app.use('/api/auth',authRoutes)

// POST endpoint to receive location updates
app.post('/location', authenticateUserDetail, async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const newLocation = new Location({
      employeeId: req.user, // Assuming req.user contains the authenticated user's details
      latitude,
      longitude,
    });
    await newLocation.save();

    // Emit location update to all connected clients
    io.emit('locationBroadcast', {
      employeeId: req.user,
      latitude,
      longitude,
    });

    res.status(200).json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating location:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Socket.io middleware for authentication
io.use(async (socket, next) => {
  if (socket.handshake.query && socket.handshake.query.token) {
    try {
      const decoded = jwt.verify(socket.handshake.query.token, '123456'); // Replace with your actual secret key
      socket.user = await User.findById(decoded.id).select('-password'); // Assuming User model exists
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  } else {
    next(new Error('Authentication error'));
  }
});

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
server.listen(4000, () => console.log('Server is running on port 4000'));