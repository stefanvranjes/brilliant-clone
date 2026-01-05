import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add an event title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    type: {
        type: String,
        enum: ['Sprint', 'Marathon', 'Challenge'],
        default: 'Sprint'
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        xpContributed: {
            type: Number,
            default: 0
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    targetXP: {
        type: Number, // Individual or community goal
        default: 1000
    },
    rewards: {
        xpBonus: Number,
        badgeId: String
    },
    status: {
        type: String,
        enum: ['upcoming', 'active', 'completed'],
        default: 'upcoming'
    }
}, {
    timestamps: true
});

// Middleware to update status based on time (optional, can be done in controller)

export default mongoose.model('Event', eventSchema);
