import React, { useState } from 'react';
import { apiService } from '../../services/api';
import { Workshop, UpdateWorkshopRequest } from '../../types';
import { BuildingOfficeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { COLORS } from '../../constants/colors';

interface WorkshopProfileProps {
  workshop: Workshop;
  onUpdate: () => void;
}

const WorkshopProfile: React.FC<WorkshopProfileProps> = ({ workshop, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UpdateWorkshopRequest>({
    name: workshop.name,
    address: workshop.address,
    phoneNumber: workshop.phoneNumber,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await apiService.updateWorkshop(workshop.id, formData);
      setIsEditing(false);
      onUpdate();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al actualizar el workshop');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    setFormData({
      name: workshop.name,
      address: workshop.address,
      phoneNumber: workshop.phoneNumber,
    });
    setIsEditing(false);
    setError('');
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-2xl">Información del Workshop</CardTitle>
          {!isEditing && (
            <Button
              onClick={() => setIsEditing(true)}
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = COLORS.primaryHover}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = COLORS.primary}
            >
              Editar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>

      {error && (
        <div className="mb-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 p-4">
          <p className="text-orange-800">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6">
          {/* Tenant ID (read-only) */}
          <div className="bg-gray-50 p-4 rounded-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tenant ID
            </label>
            <p className="text-sm text-gray-900 font-mono">{workshop.tenantId}</p>
            <p className="text-xs text-gray-500 mt-1">ID único del workshop</p>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              <BuildingOfficeIcon className="h-5 w-5 inline-block mr-2" />
              Nombre del Workshop
            </label>
            {isEditing ? (
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              />
            ) : (
              <p className="text-gray-900">{workshop.name}</p>
            )}
          </div>

          {/* Address */}
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPinIcon className="h-5 w-5 inline-block mr-2" />
              Dirección
            </label>
            {isEditing ? (
              <input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              />
            ) : (
              <p className="text-gray-900">{workshop.address}</p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
              <PhoneIcon className="h-5 w-5 inline-block mr-2" />
              Teléfono
            </label>
            {isEditing ? (
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
              />
            ) : (
              <p className="text-gray-900">{workshop.phoneNumber}</p>
            )}
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = COLORS.primaryHover;
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = COLORS.primary;
              }}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        )}
      </form>
      </CardContent>
    </Card>
  );
};

export default WorkshopProfile;

