import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { CompleteOnboardingRequest, Category } from '../../../types';
import { mockCategories } from '../../../data/mockData';

interface CategoryStepProps {
  formData: Partial<CompleteOnboardingRequest>;
  updateFormData: (data: Partial<CompleteOnboardingRequest>) => void;
  errors: Record<string, string>;
}

const CategoryStep: React.FC<CategoryStepProps> = ({ formData, updateFormData, errors }) => {
  const handleCategorySelect = (categoryId: number) => {
    updateFormData({ categoryId });
    // Al cambiar de categoría, limpiar servicios seleccionados
    updateFormData({ serviceIds: [] });
  };

  const getCategoryIcon = (iconName?: string) => {
    // En producción, esto renderizaría iconos reales
    // Por ahora, mostramos un emoji o texto
    const iconMap: Record<string, string> = {
      'wrench-screwdriver': '🔧',
      'tire': '🛞',
      'paint-brush': '🎨',
      'sparkles': '✨',
      'bolt': '⚡',
      'ellipsis-horizontal-circle': '⋯'
    };
    return iconMap[iconName || ''] || '📋';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Categoría del Comercio</h3>
        <p className="text-sm text-muted-foreground">
          Selecciona la categoría principal de tu negocio
        </p>
      </div>

      {errors.categoryId && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{errors.categoryId}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className={`relative p-6 rounded-lg border-2 transition-all text-left ${
              formData.categoryId === category.id
                ? 'border-primary bg-primary/5 shadow-md'
                : 'border-border hover:border-primary/50 hover:bg-accent'
            }`}
          >
            {formData.categoryId === category.id && (
              <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                <CheckIcon className="h-4 w-4" />
              </div>
            )}
            
            <div className="flex items-start gap-4">
              <div className="text-4xl">{getCategoryIcon(category.icon)}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-lg mb-1">{category.name}</h4>
                {category.description && (
                  <p className="text-sm text-muted-foreground">
                    {category.description}
                  </p>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {formData.categoryId && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm">
            <span className="font-medium">Categoría seleccionada: </span>
            {mockCategories.find(c => c.id === formData.categoryId)?.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default CategoryStep;

