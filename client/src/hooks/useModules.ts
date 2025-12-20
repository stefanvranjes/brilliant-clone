import { useState, useEffect } from 'react';
import { apiService } from '../services/api.service';
import { Module } from '../mockData';

export const useModules = () => {
    const [modules, setModules] = useState<Module[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchModules = async () => {
            try {
                setLoading(true);
                const data = await apiService.getAllModules();
                setModules(data);
            } catch (err) {
                setError('Failed to fetch modules');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchModules();
    }, []);

    return { modules, loading, error };
};
