import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import { Problem } from '../mockData';
import { useAuth } from '../context/AuthContext';

export const useDailyChallenge = () => {
    const { user } = useAuth();
    const [challenge, setChallenge] = useState<Problem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        const fetchDaily = async () => {
            if (!user) {
                // If not logged in, we can still show a challenge but completion state won't be known
                try {
                    const dailyProblem = await apiService.getDailyChallenge();
                    setChallenge(dailyProblem);
                } catch (err) {
                    console.error('Failed to load guest daily challenge');
                }
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const [dailyProblem, progress] = await Promise.all([
                    apiService.getDailyChallenge(),
                    apiService.getUserProgress()
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
    }, [user]);

    return { challenge, loading, error, isCompleted };
};
