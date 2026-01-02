import mongoose from 'mongoose';

const trackSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        default: '📚'
    },
    bannerImage: {
        type: String
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }],
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    category: {
        type: String,
        required: true
    },
    badgeId: {
        type: String
    }
}, {
    timestamps: true
});

export default mongoose.model('Track', trackSchema);
