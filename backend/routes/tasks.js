
import express from 'express';
import Task from '../models/Task.js';
import ActionLog from '../models/ActionLog.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Helper: log action
async function logAction({ user, action, taskId, taskTitle, details }) {
  await ActionLog.create({ user, action, taskId, taskTitle, details });
}

// Get all tasks
router.get('/', auth, async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Create task
router.post('/', auth, async (req, res) => {
  const { title, description, assigned, status, priority } = req.body;
  if (!title || !assigned) return res.status(400).json({ message: 'Title and assigned user required' });
  if (["Todo", "In Progress", "Done"].includes(title.trim())) return res.status(400).json({ message: 'Title cannot match column name' });
  const exists = await Task.findOne({ title });
  if (exists) return res.status(409).json({ message: 'Title must be unique' });
  const task = await Task.create({ title, description, assigned, status, priority, updatedBy: req.user.username });
  await logAction({ user: req.user.username, action: 'created', taskId: task._id, taskTitle: title });
  res.status(201).json(task);
});

// Update task (with conflict detection)
router.put('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const { title, description, assigned, status, priority, version } = req.body;
  const task = await Task.findById(id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  if (version && version !== task.version) {
    return res.status(409).json({ message: 'Conflict', serverTask: task });
  }
  task.title = title;
  task.description = description;
  task.assigned = assigned;
  task.status = status;
  task.priority = priority;
  task.updatedAt = new Date();
  task.updatedBy = req.user.username;
  task.version += 1;
  await task.save();
  await logAction({ user: req.user.username, action: 'updated', taskId: task._id, taskTitle: title });
  res.json(task);
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  if (task) await logAction({ user: req.user.username, action: 'deleted', taskId: id, taskTitle: task.title });
  res.json({ message: 'Deleted' });
});

// Get last 20 actions
router.get('/actions/log', auth, async (req, res) => {
  const logs = await ActionLog.find().sort({ createdAt: -1 }).limit(20);
  res.json(logs);
});

export default router;
