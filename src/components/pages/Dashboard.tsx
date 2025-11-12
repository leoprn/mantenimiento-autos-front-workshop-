import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { apiService } from '../../services/api';
import { Workshop, CompleteOnboardingRequest, Category, Service } from '../../types';
import WorkshopOnboardingWizard from './WorkshopOnboardingWizard';
import OnboardingProgressBadge from '../common/OnboardingProgressBadge';
import { 
  Squares2X2Icon,
  UsersIcon,
  TruckIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  EllipsisVerticalIcon,
  CalendarIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ShoppingCartIcon,
  MegaphoneIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { Bar, BarChart, CartesianGrid, XAxis, Label as RechartsLabel, PolarGrid, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { User, CreditCard, Bell, LogOut, TrendingUp, Eye } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Separator } from '../ui/separator';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

type AccountFormState = {
  name: string;
  address: string;
  phoneNumber: string;
  latitude: string;
  longitude: string;
  categoryId: string;
  serviceIds: string[];
};

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [notifications, setNotifications] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [accountForm, setAccountForm] = useState<AccountFormState>({
    name: '',
    address: '',
    phoneNumber: '',
    latitude: '',
    longitude: '',
    categoryId: '',
    serviceIds: [],
  });
  const [accountErrors, setAccountErrors] = useState<Record<string, string>>({});
  const [accountMessage, setAccountMessage] = useState('');
  const [accountApiError, setAccountApiError] = useState('');
  const [accountSaving, setAccountSaving] = useState(false);

  // Mock data para estadísticas - últimos 6 meses
  const [ordersChartData] = useState(() => {
    const months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        month: date.toLocaleDateString('es-ES', { month: 'short' }),
        orders: Math.floor(Math.random() * 100) + 50
      });
    }
    return months;
  });

  const [clientsChartData] = useState(() => {
    const months = [];
    const today = new Date();
    for (let i = 5; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push({
        month: date.toLocaleDateString('es-ES', { month: 'short' }),
        clients: Math.floor(Math.random() * 50) + 20
      });
    }
    return months;
  });

  // Mock data para interacciones del perfil público
  const [interactionsData] = useState(() => {
    const totalInteractions = Math.floor(Math.random() * 5000) + 2000;
    const maxInteractions = 10000;
    return {
      interactions: totalInteractions,
      max: maxInteractions,
      fill: 'var(--color-interactions)',
    };
  });

  // Chart configs - usando variables CSS del tema
  const ordersChartConfig: ChartConfig = React.useMemo(() => ({
    orders: {
      label: 'Órdenes',
      color: 'oklch(0.837 0.128 66.29)',
    },
  }), []);

  const clientsChartConfig: ChartConfig = React.useMemo(() => ({
    clients: {
      label: 'Clientes',
      color: 'oklch(0.705 0.213 47.604)',
    },
  }), []);

  const interactionsChartConfig: ChartConfig = React.useMemo(() => ({
    interactions: {
      label: 'Interacciones',
    },
    profile: {
      label: 'Perfil Público',
      color: 'var(--chart-3)',
    },
  }), []);

  const interactionsChartData = [
    { 
      browser: 'profile', 
      visitors: interactionsData.interactions, 
      fill: 'var(--color-profile)',
      max: interactionsData.max 
    },
  ];

  // Mock data para turnos
  const getTodayAppointments = () => {
    return [
      { time: '09:00', client: 'Juan Pérez', service: 'Cambio de aceite' },
      { time: '11:30', client: 'María González', service: 'Revisión general' },
      { time: '14:00', client: 'Carlos Rodríguez', service: 'Alineación y balanceo' },
      { time: '16:30', client: 'Ana Martínez', service: 'Revisión de frenos' }
    ];
  };

  const getWeekAppointments = () => {
    const today = new Date();
    const week = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
      const dayNumber = date.getDate();
      const monthName = date.toLocaleDateString('es-ES', { month: 'short' });
      week.push({
        date: date,
        dayName,
        dayNumber,
        monthName,
        count: i === 0 ? 4 : Math.floor(Math.random() * 8) + 1
      });
    }
    return week;
  };

  // Mock data para notificaciones
  const [notificationsList] = useState([
    {
      id: 1,
      type: 'warning',
      title: 'Orden pendiente',
      message: 'La orden #1234 necesita atención urgente',
      time: 'Hace 2 horas',
      icon: <ExclamationTriangleIcon className="h-5 w-5" />
    },
    {
      id: 2,
      type: 'info',
      title: 'Nuevo cliente',
      message: 'María González se ha registrado como nuevo cliente',
      time: 'Hace 5 horas',
      icon: <InformationCircleIcon className="h-5 w-5" />
    },
    {
      id: 3,
      type: 'success',
      title: 'Orden completada',
      message: 'La orden #1230 ha sido completada exitosamente',
      time: 'Hace 1 día',
      icon: <CheckCircleIcon className="h-5 w-5" />
    },
    {
      id: 4,
      type: 'warning',
      title: 'Turno próximo',
      message: 'Tienes un turno en 30 minutos con Juan Pérez',
      time: 'Hace 2 horas',
      icon: <CalendarIcon className="h-5 w-5" />
    }
  ]);

  useEffect(() => {
    loadWorkshop();
  }, []);

  const loadWorkshop = async () => {
    try {
      setLoading(true);
      const [
        workshopResponse,
        permissions,
        onboardingStatus,
        categoriesResponse,
        servicesResponse,
      ] = await Promise.all([
        apiService.getWorkshop(),
        apiService.getUserPermissions(),
        apiService.getOnboardingStatus(),
        apiService.getCategories(),
        apiService.getServices(),
      ]);
      setWorkshop(workshopResponse);
      setCategories(categoriesResponse);
      setServices(servicesResponse);

      const needsOnboarding =
        permissions.status !== 'ACTIVE' || !onboardingStatus.onboardingCompleted;
      setShowOnboardingWizard(needsOnboarding);
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setWorkshop(null);
        setError('');
        setShowOnboardingWizard(true);
      } else {
        setError(err.response?.data?.message || 'Error al cargar información del workshop');
        setShowOnboardingWizard(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = async (_data?: CompleteOnboardingRequest) => {
    setShowOnboardingWizard(false);
    await loadWorkshop();
  };

  const handleContinueOnboarding = () => {
    setShowOnboardingWizard(true);
  };

  const handleNotificationClick = () => {
    setNotifications(0);
    // Aquí puedes abrir un panel de notificaciones
  };

  const clearAccountError = (field: string) => {
    setAccountErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
  };

  useEffect(() => {
    if (activeSection === 'account') {
      setAccountMessage('');
      setAccountApiError('');
    }

    if (activeSection === 'account' && workshop) {
      setAccountForm({
        name: workshop.name || '',
        address: workshop.address || '',
        phoneNumber: workshop.phoneNumber || '',
        latitude:
          workshop.latitude !== undefined && workshop.latitude !== null ? workshop.latitude.toString() : '',
        longitude:
          workshop.longitude !== undefined && workshop.longitude !== null ? workshop.longitude.toString() : '',
        categoryId: workshop.categoryId || '',
        serviceIds: workshop.serviceIds ?? [],
      });
      setAccountErrors({});
    }
  }, [activeSection, workshop]);

  const handleAccountInputChange =
    (field: keyof AccountFormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;
      setAccountForm((prev) => ({
        ...prev,
        [field]: value,
      }));
      clearAccountError(field);
    };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = event.target;
    setAccountForm((prev) => {
      const validServiceIds = new Set(
        services.filter((service) => service.categoryId === value).map((service) => service.id)
      );
      return {
        ...prev,
        categoryId: value,
        serviceIds: prev.serviceIds.filter((id) => validServiceIds.has(id)),
      };
    });
    clearAccountError('categoryId');
    clearAccountError('serviceIds');
  };

  const handleServiceToggle = (serviceId: string) => {
    setAccountForm((prev) => {
      const exists = prev.serviceIds.includes(serviceId);
      return {
        ...prev,
        serviceIds: exists
          ? prev.serviceIds.filter((id) => id !== serviceId)
          : [...prev.serviceIds, serviceId],
      };
    });
    clearAccountError('serviceIds');
  };

  const handleAccountSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const errors: Record<string, string> = {};

    if (!accountForm.name.trim()) {
      errors.name = 'El nombre es obligatorio';
    }
    if (!accountForm.address.trim()) {
      errors.address = 'La dirección es obligatoria';
    }

    const latitude = parseFloat(accountForm.latitude);
    if (accountForm.latitude.trim() === '' || Number.isNaN(latitude)) {
      errors.latitude = 'Ingresá una latitud válida';
    }

    const longitude = parseFloat(accountForm.longitude);
    if (accountForm.longitude.trim() === '' || Number.isNaN(longitude)) {
      errors.longitude = 'Ingresá una longitud válida';
    }

    if (!accountForm.categoryId) {
      errors.categoryId = 'Seleccioná una categoría';
    }

    const validServiceIds = new Set(
      services.filter((service) => service.categoryId === accountForm.categoryId).map((service) => service.id)
    );
    const normalizedServiceIds = accountForm.serviceIds.filter((id) => validServiceIds.has(id));
    if (normalizedServiceIds.length === 0) {
      errors.serviceIds = 'Seleccioná al menos un servicio';
    }

    setAccountErrors(errors);
    if (Object.keys(errors).length > 0) {
      return;
    }

    if (!workshop) {
      setAccountApiError('No se encontró información del workshop para actualizar.');
      return;
    }

    setAccountSaving(true);
    setAccountApiError('');
    setAccountMessage('');

    try {
      await apiService.updateWorkshop(workshop.id, {
        name: accountForm.name.trim(),
        address: accountForm.address.trim(),
        phoneNumber: accountForm.phoneNumber.trim(),
      });

      await apiService.completeOnboarding({
        name: accountForm.name.trim(),
        address: accountForm.address.trim(),
        latitude,
        longitude,
        categoryId: accountForm.categoryId,
        serviceIds: normalizedServiceIds,
      });

      setAccountMessage('Datos del taller actualizados correctamente.');
      await loadWorkshop();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setAccountApiError(err.response?.data?.message || err.message);
      } else {
        setAccountApiError('No se pudieron guardar los cambios. Intentá nuevamente.');
      }
    } finally {
      setAccountSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Mostrar wizard si es necesario
  if (showOnboardingWizard) {
    return (
      <WorkshopOnboardingWizard
        onComplete={handleOnboardingComplete}
        onClose={() => {
          // Permitir cerrar solo si el usuario realmente quiere salir
          if (window.confirm('¿Estás seguro de que quieres salir? Podrás completar el onboarding más tarde.')) {
            setShowOnboardingWizard(false);
          }
        }}
      />
    );
  }

  const userName = user || 'Usuario';
  const displayName = userName.split('@')[0] || userName;
  const filteredServices = accountForm.categoryId
    ? services.filter((service) => service.categoryId === accountForm.categoryId)
    : [];
  const selectedCategory = categories.find((category) => category.id === accountForm.categoryId);

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation - Desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border flex-col h-screen z-50">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <TruckIcon className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-sidebar-foreground">Workshop</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {/* Dashboard */}
            <Button
              variant="ghost"
              onClick={() => {
                setActiveSection('dashboard');
                setSidebarOpen(false);
              }}
              className={`w-full justify-start gap-3 ${
                activeSection === 'dashboard'
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary'
                  : ''
              }`}
            >
              <Squares2X2Icon className="h-5 w-5" />
              <span className="font-medium">Dashboard</span>
            </Button>

            {/* Ordenes */}
            <Button
              variant="ghost"
              onClick={() => {
                setActiveSection('ordenes');
                setSidebarOpen(false);
              }}
              className={`w-full justify-start gap-3 ${
                activeSection === 'ordenes'
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary'
                  : ''
              }`}
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="font-medium">Ordenes</span>
            </Button>

            {/* Clientes */}
            <Button
              variant="ghost"
              onClick={() => {
                setActiveSection('clientes');
                setSidebarOpen(false);
              }}
              className={`w-full justify-start gap-3 ${
                activeSection === 'clientes'
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary'
                  : ''
              }`}
            >
              <UsersIcon className="h-5 w-5" />
              <span className="font-medium">Clientes</span>
            </Button>

            {/* Turnos */}
            <Button
              variant="ghost"
              onClick={() => {
                setActiveSection('turnos');
                setSidebarOpen(false);
              }}
              className={`w-full justify-start gap-3 ${
                activeSection === 'turnos'
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary'
                  : ''
              }`}
            >
              <CalendarIcon className="h-5 w-5" />
              <span className="font-medium">Turnos</span>
            </Button>

            {/* Publicidades */}
            <Button
              variant="ghost"
              onClick={() => {
                setActiveSection('publicidades');
                setSidebarOpen(false);
              }}
              className={`w-full justify-start gap-3 ${
                activeSection === 'publicidades'
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary'
                  : ''
              }`}
            >
              <MegaphoneIcon className="h-5 w-5" />
              <span className="font-medium">Publicidades</span>
            </Button>
          </div>
        </nav>

        {/* Profile Section - Desktop */}
        <div className="p-2 border-t border-sidebar-border shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start gap-3 group">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {displayName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">{displayName}</p>
                  <p className="text-xs text-muted-foreground truncate">{workshop?.name || 'Workshop'}</p>
                </div>
                <EllipsisVerticalIcon className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="w-64" 
              align="end" 
              side="top"
              sideOffset={8}
            >
              {/* User Profile Header */}
              <DropdownMenuLabel className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user || 'usuario@example.com'}</p>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Menu Items */}
                <DropdownMenuItem
                  onClick={() => {
                    setActiveSection('account');
                    setSidebarOpen(false);
                  }}
                >
                <User className="h-4 w-4 mr-2" />
                <span>Cuenta</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCard className="h-4 w-4 mr-2" />
                <span>Facturación</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleNotificationClick}>
                <Bell className="h-4 w-4 mr-2" />
                <span>Notificaciones</span>
                {notifications > 0 && (
                  <Badge variant="destructive" className="ml-auto h-2 w-2 p-0" />
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={logout}
                className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span>Cerrar Sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <aside
          className={`lg:hidden fixed inset-y-0 left-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col h-screen z-50 transform transition-all duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Close button for mobile */}
          <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TruckIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">Workshop</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
            >
              <XMarkIcon className="h-6 w-6" />
            </Button>
          </div>
          {/* Logo - Mobile */}
          <div className="p-6 border-b border-sidebar-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <TruckIcon className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-sidebar-foreground">Workshop</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <div className="space-y-1">
              {/* Dashboard */}
              <Button
                variant="ghost"
                onClick={() => {
                  setActiveSection('dashboard');
                  setSidebarOpen(false);
                }}
                className={`w-full justify-start gap-3 ${
                  activeSection === 'dashboard'
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary'
                    : ''
                }`}
              >
                <Squares2X2Icon className="h-5 w-5" />
                <span className="font-medium">Dashboard</span>
              </Button>

              {/* Ordenes */}
              <Button
                variant="ghost"
                onClick={() => {
                  setActiveSection('ordenes');
                  setSidebarOpen(false);
                }}
                className={`w-full justify-start gap-3 ${
                  activeSection === 'ordenes'
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary'
                    : ''
                }`}
              >
                <ShoppingCartIcon className="h-5 w-5" />
                <span className="font-medium">Ordenes</span>
              </Button>

              {/* Clientes */}
              <Button
                variant="ghost"
                onClick={() => {
                  setActiveSection('clientes');
                  setSidebarOpen(false);
                }}
                className={`w-full justify-start gap-3 ${
                  activeSection === 'clientes'
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary'
                    : ''
                }`}
              >
                <UsersIcon className="h-5 w-5" />
                <span className="font-medium">Clientes</span>
              </Button>

              {/* Turnos */}
              <Button
                variant="ghost"
                onClick={() => {
                  setActiveSection('turnos');
                  setSidebarOpen(false);
                }}
                className={`w-full justify-start gap-3 ${
                  activeSection === 'turnos'
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary'
                    : ''
                }`}
              >
                <CalendarIcon className="h-5 w-5" />
                <span className="font-medium">Turnos</span>
              </Button>

              {/* Publicidades */}
              <Button
                variant="ghost"
                onClick={() => {
                  setActiveSection('publicidades');
                  setSidebarOpen(false);
                }}
                className={`w-full justify-start gap-3 ${
                  activeSection === 'publicidades'
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground border-l-4 border-sidebar-primary'
                    : ''
                }`}
              >
                <MegaphoneIcon className="h-5 w-5" />
                <span className="font-medium">Publicidades</span>
              </Button>
            </div>
          </nav>

          {/* Profile Section - Mobile */}
          <div className="p-2 border-t border-sidebar-border">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 group">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-sm font-medium text-sidebar-foreground truncate">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{workshop?.name || 'Workshop'}</p>
                  </div>
                  <EllipsisVerticalIcon className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64" 
                align="end" 
                side="top"
                sideOffset={8}
              >
                {/* User Profile Header */}
                <DropdownMenuLabel className="p-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
                        {displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{displayName}</p>
                      <p className="text-xs text-muted-foreground truncate">{user || 'usuario@example.com'}</p>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Menu Items */}
                <DropdownMenuItem
                  onClick={() => {
                    setActiveSection('account');
                    setSidebarOpen(false);
                  }}
                >
                  <User className="h-4 w-4 mr-2" />
                  <span>Cuenta</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCard className="h-4 w-4 mr-2" />
                  <span>Facturación</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleNotificationClick}>
                  <Bell className="h-4 w-4 mr-2" />
                  <span>Notificaciones</span>
                  {notifications > 0 && (
                    <Badge variant="destructive" className="ml-auto h-2 w-2 p-0" />
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={logout}
                  className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* Header */}
        <header className="bg-background border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between z-30 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Bars3Icon className="h-6 w-6" />
            </Button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold truncate">
                Hola, {displayName} 👋
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground hidden sm:block">Aquí está lo que está pasando hoy.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            >
              {isDark ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <MagnifyingGlassIcon className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <QuestionMarkCircleIcon className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNotificationClick}
              className="relative"
            >
              <BellIcon className="h-5 w-5" />
              {notifications > 0 && (
                <Badge variant="destructive" className="absolute top-1 right-1 h-2 w-2 p-0" />
              )}
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-muted/30">
          {error && (
            <div className="mb-6 rounded-lg bg-destructive/10 border border-destructive/20 p-4">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            {/* Dashboard Section */}
            {activeSection === 'dashboard' && (
              <div className="space-y-4">
                {/* Statistics Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Orders Statistics Widget */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                      <CardTitle className="text-sm font-medium">Órdenes (Últimos 6 meses)</CardTitle>
                      <ShoppingCartIcon className="h-4 w-4 text-chart-1" />
                    </CardHeader>
                    <CardContent className="px-4 pb-2">
                      <ChartContainer config={ordersChartConfig} className="h-[200px]">
                        <BarChart accessibilityLayer data={ordersChartData}>
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={8}
                            axisLine={false}
                            tickFormatter={(value) => value}
                            style={{ fontSize: '12px' }}
                          />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Bar 
                            dataKey="orders" 
                            fill="var(--color-orders)" 
                            radius={8} 
                          />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-1 text-xs px-4 pb-4">
                      <div className="flex gap-2 leading-none font-medium">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-bold">
                          {ordersChartData.reduce((sum, item) => sum + item.orders, 0)}
                        </span>
                      </div>
                      <div className="text-muted-foreground leading-none">
                        Últimos 6 meses
                      </div>
                    </CardFooter>
                  </Card>

                  {/* Clients Statistics Widget */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                      <CardTitle className="text-sm font-medium">Clientes (Últimos 6 meses)</CardTitle>
                      <UsersIcon className="h-4 w-4 text-chart-2" />
                    </CardHeader>
                    <CardContent className="px-4 pb-2">
                      <ChartContainer config={clientsChartConfig} className="h-[200px]">
                        <BarChart accessibilityLayer data={clientsChartData}>
                          <CartesianGrid vertical={false} />
                          <XAxis
                            dataKey="month"
                            tickLine={false}
                            tickMargin={8}
                            axisLine={false}
                            tickFormatter={(value) => value}
                            style={{ fontSize: '12px' }}
                          />
                          <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                          />
                          <Bar 
                            dataKey="clients" 
                            fill="var(--color-clients)" 
                            radius={8} 
                          />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-1 text-xs px-4 pb-4">
                      <div className="flex gap-2 leading-none font-medium">
                        <span className="text-muted-foreground">Total:</span>
                        <span className="font-bold">
                          {clientsChartData.reduce((sum, item) => sum + item.clients, 0)}
                        </span>
                      </div>
                      <div className="text-muted-foreground leading-none">
                        Últimos 6 meses
                      </div>
                    </CardFooter>
                  </Card>

                  {/* Interactions Widget */}
                  <Card className="flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                      <CardTitle className="text-sm font-medium">Interacciones del Perfil</CardTitle>
                      <Eye className="h-4 w-4 text-chart-3" />
                    </CardHeader>
                    <CardContent className="flex-1 pb-0 px-4">
                      <ChartContainer
                        config={interactionsChartConfig}
                        className="mx-auto aspect-square max-h-[200px]"
                      >
                        <RadialBarChart
                          data={interactionsChartData}
                          startAngle={0}
                          endAngle={250}
                          innerRadius={60}
                          outerRadius={85}
                        >
                          <PolarGrid
                            gridType="circle"
                            radialLines={false}
                            stroke="none"
                            className="first:fill-muted last:fill-background"
                            polarRadius={[66, 74]}
                          />
                          <RadialBar 
                            dataKey="visitors" 
                            background 
                            cornerRadius={10}
                            fill="var(--color-profile)"
                          />
                          <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                            <RechartsLabel
                              content={({ viewBox }) => {
                                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                  return (
                                    <text
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      textAnchor="middle"
                                      dominantBaseline="middle"
                                    >
                                      <tspan
                                        x={viewBox.cx}
                                        y={viewBox.cy}
                                        className="fill-foreground text-3xl font-bold"
                                      >
                                        {interactionsData.interactions.toLocaleString()}
                                      </tspan>
                                      <tspan
                                        x={viewBox.cx}
                                        y={(viewBox.cy || 0) + 20}
                                        className="fill-muted-foreground text-xs"
                                      >
                                        Interacciones
                                      </tspan>
                                    </text>
                                  )
                                }
                              }}
                            />
                          </PolarRadiusAxis>
                        </RadialBarChart>
                      </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col gap-2 text-xs px-4 pb-4">
                      <div className="flex items-center gap-2 leading-none font-medium">
                        <TrendingUp className="h-4 w-4" />
                        <span>Creciendo este mes</span>
                      </div>
                      <div className="text-muted-foreground leading-none">
                        Perfil público del Workshop
                      </div>
                    </CardFooter>
                  </Card>
                </div>

                {/* Appointments Calendar Widget */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-4 pt-4">
                    <CardTitle className="text-base font-semibold">Turnos del Día</CardTitle>
                    <CalendarIcon className="h-5 w-5 text-chart-4" />
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                  
                  {/* Today's Appointments */}
                  <div className="mb-4">
                    <h3 className="text-xs font-medium text-muted-foreground mb-3">
                      {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h3>
                    <div className="space-y-2">
                      {getTodayAppointments().map((appointment, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 rounded-lg border hover:bg-accent transition-colors"
                        >
                          <div className="w-14 text-center">
                            <span className="text-xs font-semibold">{appointment.time}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{appointment.client}</p>
                            <p className="text-xs text-muted-foreground">{appointment.service}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Week Calendar */}
                  <div className="pt-4">
                    <Separator className="mb-4" />
                    <h3 className="text-xs font-medium text-muted-foreground mb-3">Próximos 7 días</h3>
                    <div className="grid grid-cols-7 gap-1.5">
                      {getWeekAppointments().map((day, index) => (
                        <div
                          key={index}
                          className={`flex flex-col items-center p-2 rounded-lg border transition-colors ${
                            index === 0
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:bg-accent'
                          }`}
                        >
                          <span className="text-xs text-muted-foreground mb-0.5">{day.dayName}</span>
                          <span className={`text-base font-bold mb-0.5 ${
                            index === 0 ? 'text-primary' : ''
                          }`}>
                            {day.dayNumber}
                          </span>
                          <span className="text-xs text-muted-foreground mb-1">{day.monthName}</span>
                          <div className="flex items-center gap-0.5">
                            <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs font-medium">{day.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  </CardContent>
                </Card>

                {/* Notifications Widget */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 px-4 pt-4">
                    <CardTitle className="text-base font-semibold">Novedades y Notificaciones</CardTitle>
                    <BellIcon className="h-5 w-5 text-chart-5" />
                  </CardHeader>
                  <CardContent className="px-4 pb-4">
                  <div className="space-y-3">
                    {notificationsList.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent transition-colors"
                      >
                        <div className={`p-1.5 rounded-lg ${
                          notification.type === 'warning'
                            ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                            : notification.type === 'success'
                            ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                            : 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                        }`}>
                          {notification.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium mb-1">{notification.title}</h3>
                          <p className="text-xs text-muted-foreground mb-1">{notification.message}</p>
                          <span className="text-xs text-muted-foreground">{notification.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  </CardContent>
                  <CardFooter className="px-4 pb-4">
                    <Button 
                      variant="ghost" 
                      className="w-full text-xs"
                    >
                      Ver todas las notificaciones
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            )}

            {/* Account Section */}
            {activeSection === 'account' && (
              <div className="space-y-6">
                <Card className="shadow-md border border-border/60">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold">Datos del taller</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Mantené actualizada la información que mostrás a tus clientes y que utilizamos para recomendar tus servicios.
                    </p>
                  </CardHeader>
                  <CardContent>
                    {accountApiError && (
                      <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive">
                        {accountApiError}
                      </div>
                    )}
                    {accountMessage && (
                      <div className="mb-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-400">
                        {accountMessage}
                      </div>
                    )}

                    {categories.length === 0 || services.length === 0 ? (
                      <div className="bg-muted rounded-lg p-6 text-center text-muted-foreground">
                        Cargando información del taller...
                      </div>
                    ) : (
                      <form onSubmit={handleAccountSubmit} className="space-y-6">
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="sm:col-span-2 space-y-2">
                            <Label htmlFor="account-name">Nombre del taller</Label>
                            <Input
                              id="account-name"
                              value={accountForm.name}
                              onChange={handleAccountInputChange('name')}
                              placeholder="Ej: Taller Mecánico El Buen Servicio"
                            />
                            {accountErrors.name && (
                              <p className="text-sm text-destructive">{accountErrors.name}</p>
                            )}
                          </div>

                          <div className="sm:col-span-2 space-y-2">
                            <Label htmlFor="account-address">Dirección</Label>
                            <textarea
                              id="account-address"
                              value={accountForm.address}
                              onChange={handleAccountInputChange('address')}
                              placeholder="Ej: Av. Principal 1234, Ciudad, Provincia"
                              className="min-h-[90px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                            />
                            {accountErrors.address && (
                              <p className="text-sm text-destructive">{accountErrors.address}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="account-phone">Teléfono de contacto</Label>
                            <Input
                              id="account-phone"
                              value={accountForm.phoneNumber}
                              onChange={handleAccountInputChange('phoneNumber')}
                              placeholder="Ej: +54 11 5555-5555"
                            />
                            {accountErrors.phoneNumber && (
                              <p className="text-sm text-destructive">{accountErrors.phoneNumber}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="account-latitude">Latitud</Label>
                            <Input
                              id="account-latitude"
                              value={accountForm.latitude}
                              onChange={handleAccountInputChange('latitude')}
                              placeholder="-34.6037"
                            />
                            {accountErrors.latitude && (
                              <p className="text-sm text-destructive">{accountErrors.latitude}</p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="account-longitude">Longitud</Label>
                            <Input
                              id="account-longitude"
                              value={accountForm.longitude}
                              onChange={handleAccountInputChange('longitude')}
                              placeholder="-58.3816"
                            />
                            {accountErrors.longitude && (
                              <p className="text-sm text-destructive">{accountErrors.longitude}</p>
                            )}
                          </div>

                          <div className="sm:col-span-2 space-y-2">
                            <Label htmlFor="account-category">Categoría principal</Label>
                            <select
                              id="account-category"
                              value={accountForm.categoryId}
                              onChange={handleCategoryChange}
                              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                            >
                              <option value="">Seleccioná una categoría</option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                  {category.name}
                                </option>
                              ))}
                            </select>
                            {selectedCategory && (
                              <p className="text-xs text-muted-foreground">
                                {selectedCategory.description ||
                                  'Esta categoría agrupa servicios relacionados con tu rubro.'}
                              </p>
                            )}
                            {accountErrors.categoryId && (
                              <p className="text-sm text-destructive">{accountErrors.categoryId}</p>
                            )}
                          </div>

                          <div className="sm:col-span-2 space-y-2">
                            <Label>Servicios ofrecidos</Label>
                            {filteredServices.length === 0 ? (
                              <div className="rounded-lg border border-dashed border-border/60 bg-muted/30 p-4 text-sm text-muted-foreground">
                                {accountForm.categoryId
                                  ? 'No hay servicios configurados para esta categoría aún.'
                                  : 'Seleccioná una categoría para elegir los servicios que brindás.'}
                              </div>
                            ) : (
                              <div className="grid gap-2 sm:grid-cols-2">
                                {filteredServices.map((service) => {
                                  const checked = accountForm.serviceIds.includes(service.id);
                                  return (
                                    <label
                                      key={service.id}
                                      className={`flex items-start gap-3 rounded-lg border p-3 text-sm transition ${
                                        checked
                                          ? 'border-primary bg-primary/5'
                                          : 'border-border hover:border-primary/50 hover:bg-accent/40'
                                      }`}
                                    >
                                      <input
                                        type="checkbox"
                                        className="mt-1 h-4 w-4 accent-primary"
                                        checked={checked}
                                        onChange={() => handleServiceToggle(service.id)}
                                      />
                                      <div className="flex-1">
                                        <p className="font-medium text-sm">{service.name}</p>
                                        {service.description && (
                                          <p className="text-xs text-muted-foreground mt-1">
                                            {service.description}
                                          </p>
                                        )}
                                      </div>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                            {accountErrors.serviceIds && (
                              <p className="text-sm text-destructive">{accountErrors.serviceIds}</p>
                            )}
                          </div>

                          {workshop?.logoUrl && (
                            <div className="sm:col-span-2 space-y-1">
                              <Label>Logo actual</Label>
                              <p className="text-sm text-muted-foreground break-all">{workshop.logoUrl}</p>
                            </div>
                          )}
                        </div>

                        <Separator />

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                          <div className="text-xs text-muted-foreground">
                            Esta información se sincroniza con tu onboarding y con el buscador de talleres.
                          </div>
                          <Button type="submit" disabled={accountSaving} className="w-full sm:w-auto">
                            {accountSaving ? 'Guardando cambios...' : 'Guardar cambios'}
                          </Button>
                        </div>
                      </form>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Ordenes Section */}
            {activeSection === 'ordenes' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl sm:text-3xl">Ordenes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Aquí podrás gestionar todas las órdenes de trabajo.</p>
                </CardContent>
              </Card>
            )}

            {/* Clientes Section */}
            {activeSection === 'clientes' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl sm:text-3xl">Clientes</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Aquí podrás gestionar todos los clientes del taller.</p>
                </CardContent>
              </Card>
            )}

            {/* Turnos Section */}
            {activeSection === 'turnos' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl sm:text-3xl">Turnos</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Aquí podrás gestionar los turnos y citas de los clientes.</p>
                </CardContent>
              </Card>
            )}

            {/* Publicidades Section */}
            {activeSection === 'publicidades' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl sm:text-3xl">Publicidades</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Aquí podrás gestionar las publicidades y promociones del taller.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Onboarding Progress Badge - Solo mostrar si no está completo */}
      {!showOnboardingWizard && (
      <OnboardingProgressBadge
        key={`${workshop?.onboardingCompleted}-${showOnboardingWizard}`}
        onContinue={handleContinueOnboarding}
      />
      )}
    </div>
  );
};

export default Dashboard;
