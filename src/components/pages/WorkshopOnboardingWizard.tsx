import React, { useState, useEffect } from 'react';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { CompleteOnboardingRequest } from '../../types';
import { useOnboardingProgress } from '../../hooks/useOnboardingProgress';
import BasicInfoStep from './wizard/BasicInfoStep';
import LogoAndPhotosStep from './wizard/LogoAndPhotosStep';
import LocationStep from './wizard/LocationStep';
import CategoryStep from './wizard/CategoryStep';
import ServicesStep from './wizard/ServicesStep';

interface WorkshopOnboardingWizardProps {
  onComplete: (data: CompleteOnboardingRequest) => void;
  onClose?: () => void;
}

const TOTAL_STEPS = 5;

const WorkshopOnboardingWizard: React.FC<WorkshopOnboardingWizardProps> = ({ onComplete, onClose }) => {
  const { progress, saveProgress, clearProgress } = useOnboardingProgress();
  
  // Cargar progreso guardado o inicializar
  const [currentStep, setCurrentStep] = useState(progress?.currentStep || 1);
  const [formData, setFormData] = useState<Partial<CompleteOnboardingRequest>>(
    progress?.formData || {
      name: '',
      address: '',
      latitude: undefined,
      longitude: undefined,
      categoryId: undefined,
      serviceIds: [],
      logo: undefined,
      photos: []
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Guardar progreso cada vez que cambia el formData o el paso
  useEffect(() => {
    saveProgress(formData, currentStep);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, currentStep]);

  const updateFormData = (data: Partial<CompleteOnboardingRequest>) => {
    setFormData(prev => ({ ...prev, ...data }));
    // Clear errors when data is updated
    setErrors({});
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1: // Basic Info
        if (!formData.name || formData.name.trim().length === 0) {
          newErrors.name = 'El nombre del comercio es requerido';
        }
        if (!formData.address || formData.address.trim().length === 0) {
          newErrors.address = 'La dirección es requerida';
        }
        break;
      case 2: // Logo and Photos (optional, no validation needed)
        break;
      case 3: // Location
        if (formData.latitude === undefined || formData.longitude === undefined) {
          newErrors.location = 'Debe seleccionar una ubicación en el mapa';
        }
        break;
      case 4: // Category
        if (!formData.categoryId) {
          newErrors.categoryId = 'Debe seleccionar una categoría';
        }
        break;
      case 5: // Services
        if (!formData.serviceIds || formData.serviceIds.length === 0) {
          newErrors.serviceIds = 'Debe seleccionar al menos un servicio';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setErrors({});
    }
  };

  const handleComplete = () => {
    if (validateStep(currentStep)) {
      // Final validation of all required fields
      const finalData: CompleteOnboardingRequest = {
        name: formData.name!,
        address: formData.address!,
        latitude: formData.latitude!,
        longitude: formData.longitude!,
        categoryId: formData.categoryId!,
        serviceIds: formData.serviceIds!,
        logo: formData.logo,
        photos: formData.photos as File[]
      };
      // Limpiar progreso guardado al completar
      clearProgress();
      onComplete(finalData);
    }
  };

  const handleClose = () => {
    // Guardar progreso antes de cerrar
    saveProgress(formData, currentStep);
    if (onClose) {
      onClose();
    }
  };

  const getStepTitle = (step: number): string => {
    const titles = {
      1: 'Información Básica',
      2: 'Logo y Fotos',
      3: 'Ubicación',
      4: 'Categoría',
      5: 'Servicios'
    };
    return titles[step as keyof typeof titles] || '';
  };

  const getStepDescription = (step: number): string => {
    const descriptions = {
      1: 'Ingresa el nombre y dirección de tu comercio',
      2: 'Sube el logo y fotos de tu taller (opcional)',
      3: 'Selecciona la ubicación de tu taller en el mapa',
      4: 'Elige la categoría principal de tu negocio',
      5: 'Selecciona los servicios que ofreces'
    };
    return descriptions[step as keyof typeof descriptions] || '';
  };

  const stepProgress = (currentStep / TOTAL_STEPS) * 100;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Configuración Inicial del Taller</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Paso {currentStep} de {TOTAL_STEPS}: {getStepTitle(currentStep)}
              </p>
            </div>
            {onClose && (
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <XMarkIcon className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-muted-foreground">{getStepDescription(currentStep)}</span>
              <span className="text-xs text-muted-foreground">{Math.round(stepProgress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${stepProgress}%` }}
              />
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between mt-4">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
              <div
                key={step}
                className={`flex-1 flex items-center ${
                  step < TOTAL_STEPS ? 'mr-2' : ''
                }`}
              >
                <div
                  className={`flex-1 h-1 rounded ${
                    step <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium mx-2 ${
                    step < currentStep
                      ? 'bg-primary text-primary-foreground'
                      : step === currentStep
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {step < currentStep ? '✓' : step}
                </div>
                {step < TOTAL_STEPS && (
                  <div
                    className={`flex-1 h-1 rounded ${
                      step < currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6">
          {/* Step Content */}
          {currentStep === 1 && (
            <BasicInfoStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          {currentStep === 2 && (
            <LogoAndPhotosStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          {currentStep === 3 && (
            <LocationStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          {currentStep === 4 && (
            <CategoryStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
          {currentStep === 5 && (
            <ServicesStep
              formData={formData}
              updateFormData={updateFormData}
              errors={errors}
            />
          )}
        </CardContent>

        {/* Footer with Navigation */}
        <div className="flex-shrink-0 border-t p-4 flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ChevronLeftIcon className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={Object.keys(errors).length > 0}
          >
            {currentStep === TOTAL_STEPS ? 'Completar' : 'Siguiente'}
            {currentStep !== TOTAL_STEPS && <ChevronRightIcon className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default WorkshopOnboardingWizard;

