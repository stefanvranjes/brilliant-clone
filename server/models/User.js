import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false
  },
  displayName: {
    type: String
  },
  avatar: {
    type: String
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
  currentLeague: {
    type: String,
    enum: ['Bronze', 'Silver', 'Gold', 'Diamond', 'Master'],
    default: 'Bronze'
  },
  weeklyXP: {
    type: Number,
    default: 0
  },
  lastLeagueReset: {
    type: Date,
    default: Date.now
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  lastActiveDate: {
    type: Date,
    default: Date.now
  },
  dailyChallengeCompleted: {
    type: Boolean,
    default: false
  },
  achievements: [{
    id: String,
    unlockedAt: { type: Date, default: Date.now }
  }],
  xpBalance: {
    type: Number,
    default: 0
  },
  purchasedItemIds: [String],
  role: {
    type: String,
    enum: ['user', 'admin', 'editor'],
    default: 'user'
  },
  failedAttempts: [{
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
    lastFailed: { type: Date, default: Date.now },
    retryCount: { type: Number, default: 1 },
    nextRetryDate: { type: Date }
  }],
  history: [historySchema]
}, {
  timestamps: true
});

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to calculate level based on XP
userSchema.methods.calculateLevel = function () {
  // Simple formula: 1000 XP per level
  this.level = Math.floor(this.totalXP / 1000) + 1;
};

// Method to update streak
userSchema.methods.updateStreak = function () {
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
