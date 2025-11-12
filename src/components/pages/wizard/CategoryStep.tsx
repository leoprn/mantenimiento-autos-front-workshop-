import React from 'react';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Button } from '../../ui/button';
import { CompleteOnboardingRequest, Category } from '../../../types';

interface CategoryStepProps {
  formData: Partial<CompleteOnboardingRequest>;
  updateFormData: (data: Partial<CompleteOnboardingRequest>) => void;
  errors: Record<string, string>;
  categories: Category[];
  isLoading: boolean;
}

const CategoryStep: React.FC<CategoryStepProps> = ({ formData, updateFormData, errors, categories, isLoading }) => {
  const handleCategorySelect = (categoryId: string) => {
    updateFormData({ categoryId, serviceIds: [] });
  };

  const getCategoryIcon = (iconName?: string) => {
    const iconMap: Record<string, string> = {
      'wrench': '🔧',
      'wrench-screwdriver': '🔧',
      'tire': '🛞',
      'paint-brush': '🎨',
      'sparkles': '✨',
      'bolt': '⚡',
      'snowflake': '❄️',
    };
    return iconMap[iconName || ''] || '📋';
  };

  const selectedCategoryName = categories.find((c) => c.id === formData.categoryId)?.name;

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

      {isLoading ? (
        <div className="bg-muted rounded-lg p-6 text-center text-muted-foreground">
          Cargando categorías...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category) => (
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
      )}

      {formData.categoryId && selectedCategoryName && (
        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
          <p className="text-sm">
            <span className="font-medium">Categoría seleccionada: </span>
            {selectedCategoryName}
          </p>
          <Button
            variant="ghost"
            className="mt-2 text-xs px-0 text-muted-foreground"
            onClick={() => updateFormData({ categoryId: undefined, serviceIds: [] })}
          >
            Cambiar categoría
          </Button>
        </div>
      )}
    </div>
  );
};

export default CategoryStep;

