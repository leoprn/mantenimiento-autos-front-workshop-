import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import { useOnboardingProgress } from '../../hooks/useOnboardingProgress';

interface OnboardingProgressBadgeProps {
  onContinue: () => void;
}

const OnboardingProgressBadge: React.FC<OnboardingProgressBadgeProps> = ({ onContinue }) => {
  const { status, progressPercentage, isLoading } = useOnboardingProgress();

  if (isLoading || !status || status.onboardingCompleted) {
    return null;
  }

  const percentage = progressPercentage;
  const remaining = 100 - percentage;

  return (
    <div className="fixed bottom-6 right-6 z-[60] animate-in slide-in-from-bottom-5">
      <div className="bg-background border-2 border-primary/20 rounded-lg shadow-lg p-3 max-w-xs">
        <div className="flex items-start gap-2">
          <div className="flex-shrink-0">
            <ExclamationCircleIcon className="h-4 w-4 text-yellow-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-xs mb-1">Onboarding Incompleto</h4>
            <div className="mb-1.5">
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-muted-foreground">Progreso</span>
                <span className="font-medium">{percentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div
                  className="bg-primary h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground mb-2 leading-tight">
              Te falta {remaining}% para completar la configuración de tu comercio
            </p>
            <Button onClick={onContinue} size="sm" className="w-full h-7 text-xs">
              Continuar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingProgressBadge;
