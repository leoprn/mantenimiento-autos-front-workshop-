import { useState, useEffect } from 'react';
import { CompleteOnboardingRequest } from '../types';

const ONBOARDING_STORAGE_KEY = 'workshop_onboarding_progress';

export interface OnboardingProgress {
  formData: Partial<CompleteOnboardingRequest>;
  currentStep: number;
  lastUpdated: number;
}

export const useOnboardingProgress = () => {
  const [progress, setProgress] = useState<OnboardingProgress | null>(null);

  useEffect(() => {
    // Cargar progreso guardado al iniciar
    const saved = localStorage.getItem(ONBOARDING_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProgress(parsed);
      } catch (e) {
        console.error('Error loading onboarding progress:', e);
      }
    }
  }, []);

  const saveProgress = (formData: Partial<CompleteOnboardingRequest>, currentStep: number) => {
    const progressData: OnboardingProgress = {
      formData,
      currentStep,
      lastUpdated: Date.now()
    };
    localStorage.setItem(ONBOARDING_STORAGE_KEY, JSON.stringify(progressData));
    setProgress(progressData);
  };

  const clearProgress = () => {
    localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    setProgress(null);
  };

  const getProgressPercentage = (): number => {
    if (!progress) return 0;

    const { formData, currentStep } = progress;
    let completedFields = 0;
    const totalFields = 6; // Total de campos requeridos (sin contar opcionales)

    // Paso 1: Información básica (2 campos)
    if (formData.name && formData.name.trim()) completedFields++;
    if (formData.address && formData.address.trim()) completedFields++;

    // Paso 2: Logo y fotos (opcional, no cuenta en requeridos)
    
    // Paso 3: Ubicación (2 campos)
    if (formData.latitude !== undefined) completedFields++;
    if (formData.longitude !== undefined) completedFields++;

    // Paso 4: Categoría (1 campo)
    if (formData.categoryId) completedFields++;

    // Paso 5: Servicios (1 campo - al menos uno)
    if (formData.serviceIds && formData.serviceIds.length > 0) completedFields++;

    // Calcular porcentaje basado en pasos completados
    const stepProgress = ((currentStep - 1) / 5) * 100;
    const fieldProgress = (completedFields / totalFields) * 100;
    
    // Promedio ponderado: 60% pasos, 40% campos
    return Math.min(100, Math.round((stepProgress * 0.6) + (fieldProgress * 0.4)));
  };

  return {
    progress,
    saveProgress,
    clearProgress,
    getProgressPercentage
  };
};

