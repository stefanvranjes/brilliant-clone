import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['LEVEL_UP', 'ACHIEVEMENT_UNLOCKED', 'COURSE_COMPLETED', 'STREAK_MILESTONE', 'CLAN_JOINED'],
        required: true
    },
    content: {
        type: String, // Dynamic message like "reached Level 10!"
        required: true
    },
    metadata: {
        level: Number,
        achievementId: String,
        courseId: String,
        streakCount: Number,
        clanName: String
    },
    kudos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
}, {
    timestamps: true
});

// We can add a static method to easily create activities from other controllers
activitySchema.statics.log = async function (userId, type, content, metadata = {}) {
    return await this.create({
        user: userId,
        type,
        content,
        metadata
    });
};

export default mongoose.model('Activity', activitySchema);
