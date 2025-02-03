import mongoose from 'mongoose';

const ReportSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: String,
  createdAt: { type: Date, default: Date.now }
});

const Report = mongoose.model('Report', ReportSchema);

export default Report;
