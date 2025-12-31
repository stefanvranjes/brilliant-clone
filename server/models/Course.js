import mongoose from 'mongoose';

const chapterSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    order: {
        type: Number,
        required: true
    },
    problems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Problem'
    }],
    isLocked: {
        type: Boolean,
        default: true
    }
});

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'beginner'
    },
    chapters: [chapterSchema],
    estimatedHours: {
        type: Number,
        default: 0
    },
    enrollmentCount: {
        type: Number,
        default: 0
    },
    prerequisites: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    }]
}, {
    timestamps: true
});

const Course = mongoose.model('Course', courseSchema);

// Add text index for search
courseSchema.index({
    title: 'text',
    description: 'text',
    category: 'text'
});

export default Course;
