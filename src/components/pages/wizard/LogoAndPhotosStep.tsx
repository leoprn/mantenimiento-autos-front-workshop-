import React, { useRef, useState } from 'react';
import { PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';
import { CompleteOnboardingRequest } from '../../../types';

interface LogoAndPhotosStepProps {
  formData: Partial<CompleteOnboardingRequest>;
  updateFormData: (data: Partial<CompleteOnboardingRequest>) => void;
  errors: Record<string, string>;
}

const LogoAndPhotosStep: React.FC<LogoAndPhotosStepProps> = ({ formData, updateFormData, errors }) => {
  const logoInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

  const MAX_PHOTOS = 10;
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        alert('El archivo es demasiado grande. Máximo 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Solo se permiten archivos de imagen');
        return;
      }
      updateFormData({ logo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePhotosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const currentPhotos = (formData.photos as File[]) || [];
    
    if (currentPhotos.length + files.length > MAX_PHOTOS) {
      alert(`Solo puedes subir máximo ${MAX_PHOTOS} fotos`);
      return;
    }

    const validFiles: File[] = [];
    const previews: string[] = [];

    files.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} es demasiado grande. Máximo 5MB`);
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} no es una imagen válida`);
        return;
      }
      validFiles.push(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result as string);
        if (previews.length === validFiles.length) {
          setPhotoPreviews([...photoPreviews, ...previews]);
        }
      };
      reader.readAsDataURL(file);
    });

    updateFormData({ photos: [...currentPhotos, ...validFiles] });
  };

  const removeLogo = () => {
    updateFormData({ logo: undefined });
    setLogoPreview(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    const currentPhotos = (formData.photos as File[]) || [];
    const newPhotos = currentPhotos.filter((_, i) => i !== index);
    updateFormData({ photos: newPhotos });
    const newPreviews = photoPreviews.filter((_, i) => i !== index);
    setPhotoPreviews(newPreviews);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Logo y Fotos del Comercio</h3>
        <p className="text-sm text-muted-foreground">
          Sube el logo y fotos de tu taller (opcional, pero recomendado)
        </p>
      </div>

      {/* Logo Section */}
      <div className="space-y-4">
        <div>
          <Label>Logo del Comercio</Label>
          <p className="text-xs text-muted-foreground mb-2">
            Formato: JPG, PNG, WebP. Máximo 5MB
          </p>
          {logoPreview ? (
            <div className="relative inline-block">
              <img
                src={logoPreview}
                alt="Vista previa del logo del taller"
                className="h-32 w-32 object-cover rounded-lg border"
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={removeLogo}
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              onClick={() => logoInputRef.current?.click()}
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-accent transition-colors"
            >
              <PhotoIcon className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Haz clic para subir logo</p>
              <p className="text-xs text-muted-foreground mt-1">
                o arrastra y suelta aquí
              </p>
            </div>
          )}
          <input
            ref={logoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleLogoChange}
            className="hidden"
          />
        </div>

        {/* Photos Section */}
        <div>
          <Label>Fotos del Comercio</Label>
          <p className="text-xs text-muted-foreground mb-2">
            Puedes subir hasta {MAX_PHOTOS} fotos. Formato: JPG, PNG, WebP. Máximo 5MB cada una
          </p>
          
          {photoPreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-4 mb-4">
              {photoPreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Vista previa ${index + 1} del taller`}
                    className="h-24 w-full object-cover rounded-lg border"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                    onClick={() => removePhoto(index)}
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {(formData.photos as File[])?.length < MAX_PHOTOS && (
            <div
              onClick={() => photosInputRef.current?.click()}
              className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-accent transition-colors"
            >
              <PhotoIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm font-medium">
                Agregar fotos ({photoPreviews.length}/{MAX_PHOTOS})
              </p>
            </div>
          )}
          <input
            ref={photosInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handlePhotosChange}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
};

export default LogoAndPhotosStep;

