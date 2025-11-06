import React from 'react';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { CompleteOnboardingRequest } from '../../../types';

interface BasicInfoStepProps {
  formData: Partial<CompleteOnboardingRequest>;
  updateFormData: (data: Partial<CompleteOnboardingRequest>) => void;
  errors: Record<string, string>;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ formData, updateFormData, errors }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Información Básica del Comercio</h3>
        <p className="text-sm text-muted-foreground">
          Ingresa los datos básicos de tu taller o comercio
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">
            Nombre del Comercio <span className="text-destructive">*</span>
          </Label>
          <Input
            id="name"
            placeholder="Ej: Taller Mecánico El Buen Servicio"
            value={formData.name || ''}
            onChange={(e) => updateFormData({ name: e.target.value })}
            className={errors.name ? 'border-destructive' : ''}
            maxLength={100}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {formData.name?.length || 0}/100 caracteres
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">
            Dirección <span className="text-destructive">*</span>
          </Label>
          <textarea
            id="address"
            placeholder="Ej: Av. Principal 1234, Ciudad, Provincia"
            value={formData.address || ''}
            onChange={(e) => updateFormData({ address: e.target.value })}
            className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
              errors.address ? 'border-destructive' : ''
            }`}
            maxLength={200}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address}</p>
          )}
          <p className="text-xs text-muted-foreground">
            {formData.address?.length || 0}/200 caracteres
          </p>
        </div>
      </div>
    </div>
  );
};

export default BasicInfoStep;

