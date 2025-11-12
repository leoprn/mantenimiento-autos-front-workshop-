import { useCallback, useEffect, useMemo, useState } from 'react';
import { WorkshopOnboardingStatus } from '../types';
import { apiService } from '../services/api';

export const useOnboardingProgress = () => {
  const [status, setStatus] = useState<WorkshopOnboardingStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getOnboardingStatus();
      setStatus(response);
    } catch (err) {
      console.error('Error obteniendo el estado de onboarding', err);
      setError('No se pudo obtener el estado del onboarding');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  const progressPercentage = useMemo(() => {
    if (!status) {
      return 0;
    }
    const totalSteps = 4;
    const completedSteps = totalSteps - (status.missingSteps?.length ?? totalSteps);
    return Math.round((completedSteps / totalSteps) * 100);
  }, [status]);

  const refresh = () => {
    fetchStatus();
  };

  return {
    status,
    isLoading,
    error,
    refresh,
    progressPercentage,
  };
};

