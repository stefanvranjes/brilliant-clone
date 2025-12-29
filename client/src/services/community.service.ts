import { apiService as api } from './api.service';

export interface Comment {
    _id: string;
    problemId: string;
    author: {
        _id: string;
        username: string;
        displayName: string;
        avatar?: string;
    };
    content: string;
    parentComment: string | null;
    likes: string[];
    isEdited: boolean;
    createdAt: string;
}

export interface LeaderboardUser {
    _id: string;
    username: string;
    displayName: string;
    avatar?: string;
    totalXP: number;
    currentStreak: number;
    level: number;
}

export interface PublicProfile extends LeaderboardUser {
    longestStreak: number;
    problemsSolved: number;
    createdAt: string;
}

const communityService = {
    // Comments
    getComments: async (problemId: string): Promise<Comment[]> => {
        const response = await api.get(`/comments/${problemId}`);
        return response.data;
    },

    postComment: async (problemId: string, content: string, parentComment?: string): Promise<Comment> => {
        const response = await api.post('/comments', { problemId, content, parentComment });
        return response.data;
    },

    toggleLike: async (commentId: string): Promise<Comment> => {
        const response = await api.post(`/comments/${commentId}/like`);
        return response.data;
    },

    // Leaderboard
    getLeaderboard: async (): Promise<LeaderboardUser[]> => {
        const response = await api.get('/users/leaderboard');
        return response.data;
    },

    getPublicProfile: async (userId: string): Promise<PublicProfile> => {
        const response = await api.get(`/users/profile/${userId}`);
        return response.data;
    }
};

export default communityService;
