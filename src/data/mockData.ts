import { Category, Service } from '../types';

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Taller Mecánico',
    description: 'Servicios de reparación y mantenimiento mecánico de vehículos',
    icon: 'wrench-screwdriver'
  },
  {
    id: 2,
    name: 'Gomería',
    description: 'Alineación, balanceo y servicios relacionados con neumáticos',
    icon: 'tire'
  },
  {
    id: 3,
    name: 'Taller de Chapa y Pintura',
    description: 'Reparación de carrocería y pintura de vehículos',
    icon: 'paint-brush'
  },
  {
    id: 4,
    name: 'Lavadero',
    description: 'Lavado y limpieza de vehículos',
    icon: 'sparkles'
  },
  {
    id: 5,
    name: 'Taller de Electricidad',
    description: 'Reparación y mantenimiento del sistema eléctrico',
    icon: 'bolt'
  },
  {
    id: 6,
    name: 'Otros',
    description: 'Otros servicios automotrices',
    icon: 'ellipsis-horizontal-circle'
  }
];

// Mock Services (independientes, sin categoryId)
export const mockServices: Service[] = [
  {
    id: 1,
    name: 'Cambio de bujías',
    description: 'Reemplazo de bujías del motor'
  },
  {
    id: 2,
    name: 'Cambio de aceite',
    description: 'Cambio de aceite y filtro de aceite'
  },
  {
    id: 3,
    name: 'Revisión de frenos',
    description: 'Revisión y reparación del sistema de frenos'
  },
  {
    id: 4,
    name: 'Alineación y balanceo',
    description: 'Alineación de dirección y balanceo de ruedas'
  },
  {
    id: 5,
    name: 'Lavado completo',
    description: 'Lavado exterior e interior del vehículo'
  },
  {
    id: 6,
    name: 'Lavado básico',
    description: 'Lavado exterior del vehículo'
  },
  {
    id: 7,
    name: 'Alineación de luces',
    description: 'Regulación y alineación del sistema de iluminación'
  },
  {
    id: 8,
    name: 'Reparación de chapa',
    description: 'Reparación de abolladuras y daños en la carrocería'
  },
  {
    id: 9,
    name: 'Pintura',
    description: 'Pintura y retoques de carrocería'
  },
  {
    id: 10,
    name: 'Revisión general',
    description: 'Revisión completa del vehículo'
  }
];

// Mock Correlation: Category -> Services
// Esta correlación se usa para filtrar servicios por categoría en el wizard
export const mockCategoryServices: Record<number, number[]> = {
  1: [1, 2, 3, 10], // Taller Mecánico -> Cambio de bujías, Cambio de aceite, Revisión de frenos, Revisión general
  2: [4], // Gomería -> Alineación y balanceo
  3: [8, 9], // Taller de Chapa y Pintura -> Reparación de chapa, Pintura
  4: [5, 6], // Lavadero -> Lavado completo, Lavado básico
  5: [7], // Taller de Electricidad -> Alineación de luces
  6: [10] // Otros -> Revisión general
};

// Helper function to get services by category
export const getServicesByCategory = (categoryId: number): Service[] => {
  const serviceIds = mockCategoryServices[categoryId] || [];
  return mockServices.filter(service => serviceIds.includes(service.id));
};

