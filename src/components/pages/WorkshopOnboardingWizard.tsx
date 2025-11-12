import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import {
  CompleteOnboardingRequest,
  Category,
  Service,
  WorkshopOnboardingDraftRequest,
} from '../../types';
import BasicInfoStep from './wizard/BasicInfoStep';
import LogoAndPhotosStep from './wizard/LogoAndPhotosStep';
import LocationStep from './wizard/LocationStep';
import CategoryStep from './wizard/CategoryStep';
import ServicesStep from './wizard/ServicesStep';
import { apiService } from '../../services/api';

interface WorkshopOnboardingWizardProps {
  onComplete: (data: CompleteOnboardingRequest) => void;
  onClose?: () => void;
}

const TOTAL_STEPS = 5;

const DEFAULT_FORM_DATA: Partial<CompleteOnboardingRequest> = {
  name: '',
  address: '',
  latitude: undefined,
  longitude: undefined,
  categoryId: undefined,
  serviceIds: [],
  logo: undefined,
  photos: [],
};

const WorkshopOnboardingWizard: React.FC<WorkshopOnboardingWizardProps> = ({ onComplete, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CompleteOnboardingRequest>>(DEFAULT_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      setIsLoading(true);
      try {
        const [permissions, categoriesResponse, servicesResponse] = await Promise.all([
          apiService.getUserPermissions(),
          apiService.getCategories(),
          apiService.getServices(),
        ]);

        setCategories(categoriesResponse);
        setServices(servicesResponse);

        try {
          const onboardingStatus = await apiService.getOnboardingStatus();
          setFormData({
            name: onboardingStatus.name ?? '',
            address: onboardingStatus.address ?? '',
            latitude: onboardingStatus.latitude,
            longitude: onboardingStatus.longitude,
            categoryId: onboardingStatus.categoryId,
            serviceIds: onboardingStatus.serviceIds ?? [],
            logo: undefined,
            photos: [],
          });
          const initialStep = determineInitialStep(onboardingStatus.missingSteps);
          setCurrentStep(initialStep);
          if (permissions.status === 'ACTIVE') {
            setGlobalError(null);
          }
        } catch (statusError) {
          if (axios.isAxiosError(statusError) && statusError.response?.status === 404) {
            setFormData(DEFAULT_FORM_DATA);
            setCurrentStep(1);
            setGlobalError(null);
          } else {
            throw statusError;
          }
        }
      } catch (error) {
        console.error('Error al cargar el wizard de onboarding', error);
        setGlobalError('No se pudieron cargar los datos iniciales. Intentá nuevamente en unos instantes.');
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  const determineInitialStep = (missingSteps: string[] = []) => {
    if (missingSteps.includes('BASIC_INFO')) return 1;
    if (missingSteps.includes('LOCATION')) return 3;
    if (missingSteps.includes('CATEGORY')) return 4;
    if (missingSteps.includes('SERVICES')) return 5;
    return TOTAL_STEPS;
  };

  const updateFormData = (data: Partial<CompleteOnboardingRequest>) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setErrors({});
    setGlobalError(null);
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.name || formData.name.trim().length === 0) {
          newErrors.name = 'El nombre del comercio es requerido';
        }
        if (!formData.address || formData.address.trim().length === 0) {
          newErrors.address = 'La dirección es requerida';
        }
        break;
      case 3:
        if (formData.latitude === undefined || formData.longitude === undefined) {
          newErrors.location = 'Debe seleccionar una ubicación en el mapa';
        }
        break;
      case 4:
        if (!formData.categoryId) {
          newErrors.categoryId = 'Debe seleccionar una categoría';
        }
        break;
      case 5:
        if (!formData.serviceIds || formData.serviceIds.length === 0) {
          newErrors.serviceIds = 'Debe seleccionar al menos un servicio';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildDraftPayload = (): WorkshopOnboardingDraftRequest => ({
    name: formData.name,
    address: formData.address,
    latitude: formData.latitude,
    longitude: formData.longitude,
    categoryId: formData.categoryId,
    serviceIds: formData.serviceIds,
    logoUrl: formData.logo ? formData.logo.name : undefined,
    photoUrls: (formData.photos as File[] | undefined)?.map((photo) => photo.name) ?? [],
  });

  const buildCompletePayload = (): CompleteOnboardingRequest => ({
    name: formData.name!,
    address: formData.address!,
    latitude: formData.latitude!,
    longitude: formData.longitude!,
    categoryId: formData.categoryId!,
    serviceIds: formData.serviceIds!,
    logo: formData.logo,
    photos: formData.photos as File[] | undefined,
  });

  const persistDraft = async () => {
    try {
      await apiService.saveOnboardingDraft(buildDraftPayload());
    } catch (error) {
      console.error('Error al guardar el borrador del onboarding', error);
      setGlobalError('No pudimos guardar el progreso. Verificá tu conexión e intentá nuevamente.');
      throw error;
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await persistDraft();
      if (currentStep < TOTAL_STEPS) {
        setCurrentStep((prev) => prev + 1);
      } else {
        await handleComplete();
      }
    } catch (error) {
      // Error already handled in persistDraft
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
    }
  };

  const handleComplete = async () => {
    if (!validateStep(TOTAL_STEPS)) {
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.completeOnboarding(buildCompletePayload());
      onComplete(buildCompletePayload());
    } catch (error: any) {
      console.error('Error al completar el onboarding', error);
      setGlobalError(
        error?.response?.data?.message ||
        'No pudimos completar el onboarding. Revisá los datos e intentá nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
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
      5: 'Servicios',
    };
    return titles[step as keyof typeof titles] || '';
  };

  const getStepDescription = (step: number): string => {
    const descriptions = {
      1: 'Ingresa el nombre y dirección de tu comercio',
      2: 'Sube el logo y fotos de tu taller (opcional)',
      3: 'Selecciona la ubicación de tu taller en el mapa',
      4: 'Elige la categoría principal de tu negocio',
      5: 'Selecciona los servicios que ofreces',
    };
    return descriptions[step as keyof typeof descriptions] || '';
  };

  const stepProgress = useMemo(() => (currentStep / TOTAL_STEPS) * 100, [currentStep]);

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

          <div className="flex justify-between mt-4">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((step) => (
              <div key={step} className={`flex-1 flex items-center ${step < TOTAL_STEPS ? 'mr-2' : ''}`}>
                <div className={`flex-1 h-1 rounded ${step <= currentStep ? 'bg-primary' : 'bg-muted'}`} />
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
                  <div className={`flex-1 h-1 rounded ${step < currentStep ? 'bg-primary' : 'bg-muted'}`} />
                )}
              </div>
            ))}
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-6">
          {globalError && (
            <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {globalError}
            </div>
          )}

          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-muted-foreground">Cargando wizard de onboarding...</p>
            </div>
          ) : (
            <>
              {currentStep === 1 && (
                <BasicInfoStep formData={formData} updateFormData={updateFormData} errors={errors} />
              )}
              {currentStep === 2 && (
                <LogoAndPhotosStep formData={formData} updateFormData={updateFormData} errors={errors} />
              )}
              {currentStep === 3 && (
                <LocationStep formData={formData} updateFormData={updateFormData} errors={errors} />
              )}
              {currentStep === 4 && (
                <CategoryStep
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                  categories={categories}
                  isLoading={isLoading}
                />
              )}
              {currentStep === 5 && (
                <ServicesStep
                  formData={formData}
                  updateFormData={updateFormData}
                  errors={errors}
                  services={services}
                  isLoading={isLoading}
                />
              )}
            </>
          )}
        </CardContent>

        <div className="flex-shrink-0 border-t p-4 flex justify-between">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1 || isSubmitting || isLoading}>
            <ChevronLeftIcon className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          <Button onClick={handleNext} disabled={isSubmitting || isLoading}>
            {isSubmitting ? 'Guardando...' : currentStep === TOTAL_STEPS ? 'Completar' : 'Siguiente'}
            {!isSubmitting && currentStep !== TOTAL_STEPS && <ChevronRightIcon className="h-4 w-4 ml-2" />}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default WorkshopOnboardingWizard;

