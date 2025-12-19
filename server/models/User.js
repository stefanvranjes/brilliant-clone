import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Problem',
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  xpEarned: {
    type: Number,
    required: true
  }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  totalXP: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  },
  problemsSolved: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },
  history: [historySchema]
}, {
  timestamps: true
});

// Method to calculate level based on XP
userSchema.methods.calculateLevel = function() {
  // Simple formula: 1000 XP per level
  this.level = Math.floor(this.totalXP / 1000) + 1;
};

// Method to update streak
userSchema.methods.updateStreak = function() {
  const now = new Date();
  const last = new Date(this.lastActiveDate);
  
  const isSameDay = now.toDateString() === last.toDateString();
  const isYesterday = new Date(now.setDate(now.getDate() - 1)).toDateString() === last.toDateString();
  
  // Reset date for 'now' variable after mutation above
  const today = new Date(); 

  if (!isSameDay) {
    if (isYesterday) {
      this.currentStreak += 1;
    } else {
      this.currentStreak = 1; // Reset if missed a day
    }
    
    if (this.currentStreak > this.longestStreak) {
      this.longestStreak = this.currentStreak;
    }
    
    this.lastActiveDate = today;
  }
};

export default mongoose.model('User', userSchema);
