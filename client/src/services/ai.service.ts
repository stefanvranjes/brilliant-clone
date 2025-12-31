import { apiService } from './api.service';

export interface AiRecommendation {
    courseId: string;
    reason: string;
}

export interface AiSummary {
    strengths: string[];
    weaknesses: string[];
    overallAdvice: string;
}

export const aiService = {
    getRecommendations: async (): Promise<AiRecommendation[]> => {
        try {
            // In a real app, this would call an LLM-powered backend
            const response = await apiService.get('/ai/recommendations');
            return response;
        } catch {
            // Mocked recommendations for now
            return [
                { courseId: 'logic-modeling', reason: 'You excelled at Math Fundamentals! Logic is the next natural step.' },
                { courseId: 'cs-foundations', reason: 'Your progress in modeling shows you are ready for CS basics.' }
            ];
        }
    },

    getSummary: async (): Promise<AiSummary> => {
        try {
            const response = await apiService.get('/ai/summary');
            return response;
        } catch {
            return {
                strengths: ['Quantitative reasoning', 'Algebraic patterns', 'Consistency'],
                weaknesses: ['Formal logic syntax', 'Algorithm complexity'],
                overallAdvice: 'Focus on Logic & Modeling to bridge your math skills with computer science foundations.'
            };
        }
    }
};
