import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    problemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    aiCritique: {
        logicGrade: { type: String, enum: ['excellent', 'good', 'needs-improvement', 'incorrect'] },
        feedback: String,
        suggestions: [String]
    },
    status: {
        type: String,
        enum: ['pending', 'critiqued', 'flagged'],
        default: 'pending'
    }
}, {
    timestamps: true
});

export default mongoose.model('Submission', submissionSchema);
