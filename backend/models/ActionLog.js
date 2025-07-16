
import mongoose from 'mongoose';

const actionLogSchema = new mongoose.Schema({
  user: String,
  action: String,
  taskId: mongoose.Schema.Types.ObjectId,
  taskTitle: String,
  details: String
}, { timestamps: true });

const ActionLog = mongoose.model('ActionLog', actionLogSchema);

export default ActionLog;
