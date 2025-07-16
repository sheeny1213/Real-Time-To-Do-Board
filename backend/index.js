

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import { Server } from 'socket.io';

import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import { getTasks, addTask, moveTask, assignTask } from './tasks.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/todo-collab', {
    dbName: 'todo-collab',
  })
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Health check
app.get('/', (req, res) => {
  res.send('✅ API Running');
});

// Socket.IO task logic
io.on('connection', (socket) => {
  console.log('🔌 A user connected:', socket.id);

  // Send tasks initially
  socket.emit('tasks:update', getTasks());

  socket.on('task:add', (task) => {
    addTask(task);
    io.emit('tasks:update', getTasks());
  });

  socket.on('task:move', ({ id, status }) => {
    moveTask({ id, status });
    io.emit('tasks:update', getTasks());
  });

  socket.on('task:assign', ({ id, assigned }) => {
    assignTask({ id, assigned });
    io.emit('tasks:update', getTasks());
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
