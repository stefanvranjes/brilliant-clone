import mongoose from 'mongoose';
import crypto from 'crypto';

const classroomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a classroom name'],
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    inviteCode: {
        type: String,
        unique: true
    },
    assignments: [{
        problemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Problem'
        },
        title: String,
        dueDate: Date,
        assignedAt: {
            type: Date,
            default: Date.now
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Generate unique invite code before saving
classroomSchema.pre('save', function (next) {
    if (!this.inviteCode) {
        this.inviteCode = crypto.randomBytes(4).toString('hex').toUpperCase();
    }
    next();
});

export default mongoose.model('Classroom', classroomSchema);
