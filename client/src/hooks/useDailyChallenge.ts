import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import { Problem } from '../mockData';

export const useDailyChallenge = (userId: string = 'user-123') => {
    const [challenge, setChallenge] = useState<Problem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const fetchDaily = async () => {
            try {
                setLoading(true);
                const [dailyProblem, progress] = await Promise.all([
                    apiService.getDailyChallenge(),
                    apiService.getUserProgress(userId)
                ]);

                setChallenge(dailyProblem);
                setIsCompleted(progress.dailyChallengeCompleted);
            } catch (err) {
                setError('Failed to load daily challenge');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchDaily();
    }, [userId]);

    return { challenge, loading, error, isCompleted };
};
