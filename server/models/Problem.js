import mongoose from 'mongoose';

const hintSchema = new mongoose.Schema({
  content: { type: String, required: true },
  order: { type: Number, required: true },
  xpCost: { type: Number, default: 0 }
});

const solutionSchema = new mongoose.Schema({
  answer: { type: mongoose.Schema.Types.Mixed, required: true },
  explanation: { type: String, required: true }
});

const problemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  type: {
    type: String,
    enum: ['multiple-choice', 'numerical', 'code', 'interactive'],
    required: true
  },
  category: {
    type: String,
    required: true
  },
  tags: {
    type: [String],
    default: []
  },
  hints: [hintSchema],
  options: {
    type: [String],
    default: undefined
  },
  solution: {
    type: solutionSchema,
    required: true
  },
  xpReward: {
    type: Number,
    default: 100
  },
  estimatedTime: {
    type: Number,
    default: 5
  },
  visualizationId: {
    type: String
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['draft', 'pending_review', 'published', 'rejected'],
    default: 'published'
  },
  reviewFeedback: {
    type: String
  },
  isCommunityContributed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

export default mongoose.model('Problem', problemSchema);
