import mongoose from 'mongoose';

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'fill-in-the-blank', 'interactive'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  hints: {
    type: [String],
    default: []
  },
  options: {
    type: [String], // For multiple-choice
    default: undefined
  },
  correctAnswer: {
    type: mongoose.Schema.Types.Mixed, // Can be String or Number
    required: [true, 'Please provide a correct answer']
  },
  xpReward: {
    type: Number,
    default: 100
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model('Problem', problemSchema);
