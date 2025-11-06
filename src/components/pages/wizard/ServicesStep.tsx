import React, { useMemo } from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { CompleteOnboardingRequest, Service } from '../../../types';
import { getServicesByCategory, mockServices } from '../../../data/mockData';

interface ServicesStepProps {
  formData: Partial<CompleteOnboardingRequest>;
  updateFormData: (data: Partial<CompleteOnboardingRequest>) => void;
  errors: Record<string, string>;
}

const ServicesStep: React.FC<ServicesStepProps> = ({ formData, updateFormData, errors }) => {
  const selectedServiceIds = formData.serviceIds || [];

  // Obtener servicios filtrados por categoría
  const availableServices = useMemo(() => {
    if (formData.categoryId) {
      return getServicesByCategory(formData.categoryId);
    }
    return mockServices; // Si no hay categoría, mostrar todos
  }, [formData.categoryId]);

  const handleServiceToggle = (serviceId: number) => {
    const currentIds = selectedServiceIds;
    const newIds = currentIds.includes(serviceId)
      ? currentIds.filter(id => id !== serviceId)
      : [...currentIds, serviceId];
    updateFormData({ serviceIds: newIds });
  };

  if (!formData.categoryId) {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <p className="text-sm text-yellow-600 dark:text-yellow-400">
            Por favor, selecciona una categoría en el paso anterior para ver los servicios disponibles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Servicios Ofrecidos</h3>
        <p className="text-sm text-muted-foreground">
          Selecciona los servicios que ofrece tu taller. Puedes seleccionar múltiples servicios.
        </p>
      </div>

      {errors.serviceIds && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{errors.serviceIds}</p>
        </div>
      )}

      {availableServices.length === 0 ? (
        <div className="bg-muted rounded-lg p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No hay servicios disponibles para esta categoría.
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableServices.map((service) => {
              const isSelected = selectedServiceIds.includes(service.id);
              return (
                <button
                  key={service.id}
                  onClick={() => handleServiceToggle(service.id)}
                  className={`relative p-4 rounded-lg border-2 transition-all text-left ${
                    isSelected
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:border-primary/50 hover:bg-accent'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                      <CheckIcon className="h-4 w-4" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <div className={`h-5 w-5 rounded border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'border-primary bg-primary' 
                        : 'border-muted-foreground'
                    }`}>
                      {isSelected && (
                        <CheckIcon className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{service.name}</h4>
                      {service.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-muted rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">
                  Servicios seleccionados: {selectedServiceIds.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {selectedServiceIds.length === 0 && 'Debes seleccionar al menos un servicio'}
                </p>
              </div>
              {selectedServiceIds.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedServiceIds.map((serviceId) => {
                    const service = mockServices.find(s => s.id === serviceId);
                    return service ? (
                      <span
                        key={serviceId}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs"
                      >
                        {service.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ServicesStep;

