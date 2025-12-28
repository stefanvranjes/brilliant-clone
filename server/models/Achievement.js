import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: true
    },
    xpRequired: {
        type: Number
    },
    problemsRequired: {
        type: Number
    },
    streakRequired: {
        type: Number
    }
}, {
    timestamps: true
});

export default mongoose.model('Achievement', achievementSchema);
