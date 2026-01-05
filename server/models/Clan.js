import mongoose from 'mongoose';

const clanSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a clan name'],
        unique: true,
        trim: true,
        maxlength: [40, 'Name cannot be more than 40 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [200, 'Description cannot be more than 200 characters']
    },
    insignia: {
        type: String, // Emoji or icon key
        default: '🛡️'
    },
    leader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    totalXP: {
        type: Number,
        default: 0
    },
    weeklyGoal: {
        type: Number,
        default: 5000
    },
    privacy: {
        type: String,
        enum: ['public', 'private', 'invite-only'],
        default: 'public'
    }
}, {
    timestamps: true
});

// Avoid duplicate members across different clans? 
// For now, let's allow users to belong to only one clan at a time.
// We'll manage this in the controller logic and potentially add a clan field to the User model later.

export default mongoose.model('Clan', clanSchema);
