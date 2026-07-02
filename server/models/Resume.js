import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
    default: 'Untitled Resume'
  },
  data: {
    type: Object,
    required: true,
    default: {}
  }
}, { timestamps: true });

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
