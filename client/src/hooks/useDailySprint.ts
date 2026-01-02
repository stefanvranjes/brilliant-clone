import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import { Problem } from '../mockData';
import { useAuth } from '../context/AuthContext';

export const useDailySprint = () => {
    const { user } = useAuth();
    const [sprint, setSprint] = useState<Problem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSprint = async () => {
            if (!user) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const data = await apiService.getDailySprint();
                setSprint(data);
            } catch (err) {
                setError('Failed to load personalized sprint');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSprint();
    }, [user]);

    return { sprint, loading, error };
};
