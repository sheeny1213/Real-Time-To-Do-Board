
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: String,
  assigned: String,
  status: { type: String, enum: ['Todo', 'In Progress', 'Done'], default: 'Todo' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: String,
  version: { type: Number, default: 1 }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task;
