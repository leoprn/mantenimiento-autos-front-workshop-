import React, { useState, useEffect } from 'react';
import { MapPinIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { CompleteOnboardingRequest } from '../../../types';

interface LocationStepProps {
  formData: Partial<CompleteOnboardingRequest>;
  updateFormData: (data: Partial<CompleteOnboardingRequest>) => void;
  errors: Record<string, string>;
}

const LocationStep: React.FC<LocationStepProps> = ({ formData, updateFormData, errors }) => {
  const [searchAddress, setSearchAddress] = useState(formData.address || '');
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  // Mock coordinates (en producción esto vendría de geocodificación)
  const mockCoordinates = {
    lat: -34.6037, // Buenos Aires
    lng: -58.3816
  };

  useEffect(() => {
    // Si ya hay coordenadas, centrar el mapa ahí
    if (formData.latitude && formData.longitude) {
      setMapCenter({ lat: formData.latitude, lng: formData.longitude });
    } else {
      // Intentar geolocalización del navegador
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setMapCenter({ lat: latitude, lng: longitude });
            updateFormData({ latitude, longitude });
          },
          () => {
            // Si falla, usar coordenadas por defecto
            setMapCenter(mockCoordinates);
          }
        );
      } else {
        setMapCenter(mockCoordinates);
      }
    }
  }, []);

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // En producción, esto obtendría las coordenadas reales del click en el mapa
    // Por ahora, usamos coordenadas mock
    const lat = mockCoordinates.lat + (Math.random() - 0.5) * 0.01;
    const lng = mockCoordinates.lng + (Math.random() - 0.5) * 0.01;
    updateFormData({ latitude: lat, longitude: lng });
    setMapCenter({ lat, lng });
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateFormData({ latitude, longitude });
          setMapCenter({ lat: latitude, lng: longitude });
        },
        () => {
          alert('No se pudo obtener tu ubicación actual');
        }
      );
    } else {
      alert('Tu navegador no soporta geolocalización');
    }
  };

  const handleSearch = () => {
    // En producción, esto haría geocodificación real
    // Por ahora, usamos coordenadas mock
    if (searchAddress.trim()) {
      const lat = mockCoordinates.lat + (Math.random() - 0.5) * 0.01;
      const lng = mockCoordinates.lng + (Math.random() - 0.5) * 0.01;
      updateFormData({ 
        address: searchAddress,
        latitude: lat, 
        longitude: lng 
      });
      setMapCenter({ lat, lng });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Ubicación del Taller</h3>
        <p className="text-sm text-muted-foreground">
          Selecciona la ubicación de tu taller en el mapa o busca por dirección
        </p>
      </div>

      {/* Search Bar */}
      <div className="space-y-2">
        <Label>Buscar Dirección</Label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Ej: Av. Principal 1234, Ciudad"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSearch}>Buscar</Button>
          <Button variant="outline" onClick={handleUseCurrentLocation}>
            <MapPinIcon className="h-4 w-4 mr-2" />
            Mi Ubicación
          </Button>
        </div>
      </div>

      {/* Map Container (Mock) */}
      <div className="space-y-2">
        <Label>
          Selecciona en el Mapa <span className="text-destructive">*</span>
        </Label>
        <div
          onClick={handleMapClick}
          className="w-full h-96 bg-muted rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors relative overflow-hidden"
        >
          {/* Mock Map - En producción esto sería un mapa real (Google Maps, Mapbox, etc.) */}
          <div className="text-center">
            <MapPinIcon className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-2">Haz clic en el mapa para seleccionar la ubicación</p>
            <p className="text-xs text-muted-foreground">
              (Mapa interactivo - Mock para diseño)
            </p>
          </div>
          
          {/* Marker */}
          {formData.latitude && formData.longitude && (
            <div
              className="absolute"
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 10
              }}
            >
              <div className="bg-primary text-primary-foreground rounded-full p-2 shadow-lg">
                <MapPinIcon className="h-6 w-6" />
              </div>
            </div>
          )}
        </div>
        {errors.location && (
          <p className="text-sm text-destructive">{errors.location}</p>
        )}
      </div>

      {/* Coordinates Display */}
      {formData.latitude && formData.longitude && (
        <div className="bg-muted p-4 rounded-lg">
          <p className="text-sm font-medium mb-2">Coordenadas seleccionadas:</p>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Latitud: </span>
              <span className="font-mono">{formData.latitude.toFixed(6)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Longitud: </span>
              <span className="font-mono">{formData.longitude.toFixed(6)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationStep;

