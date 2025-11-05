import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { apiService } from '../../services/api';
import { Workshop } from '../../types';
import { 
  Squares2X2Icon,
  UsersIcon,
  TruckIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  EllipsisVerticalIcon,
  CalendarIcon,
  ChatBubbleLeftIcon,
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
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '../ui/chart';
import { User, CreditCard, Bell, LogOut } from 'lucide-react';
import { COLORS } from '../../constants/colors';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

  // Chart configs - se actualizan con el tema
  const ordersChartConfig: ChartConfig = React.useMemo(() => ({
    orders: {
      label: 'Órdenes',
      color: isDark ? '#3b82f6' : '#2563eb',
    },
  }), [isDark]);

  const clientsChartConfig: ChartConfig = React.useMemo(() => ({
    clients: {
      label: 'Clientes',
      color: isDark ? '#10b981' : '#059669',
    },
  }), [isDark]);

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
      const data = await apiService.getWorkshop();
      setWorkshop(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar información del workshop');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationClick = () => {
    setNotifications(0);
    // Aquí puedes abrir un panel de notificaciones
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: COLORS.primary }}></div>
      </div>
    );
  }

  const userName = user || 'Usuario';
  const displayName = userName.split('@')[0] || userName;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex relative transition-colors duration-200">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col h-screen z-50 transform transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TruckIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Workshop</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        {/* Logo - Desktop only */}
        <div className="hidden lg:block p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TruckIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">Workshop</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {/* Dashboard */}
            <button
              onClick={() => {
                setActiveSection('dashboard');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                activeSection === 'dashboard'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <Squares2X2Icon className="h-5 w-5" />
              <span className="font-medium">Dashboard</span>
            </button>

            {/* Ordenes */}
            <button
              onClick={() => {
                setActiveSection('ordenes');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeSection === 'ordenes'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <ShoppingCartIcon className="h-5 w-5" />
              <span className="font-medium">Ordenes</span>
            </button>

            {/* Clientes */}
            <button
              onClick={() => {
                setActiveSection('clientes');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeSection === 'clientes'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <UsersIcon className="h-5 w-5" />
              <span className="font-medium">Clientes</span>
            </button>

            {/* Turnos */}
            <button
              onClick={() => {
                setActiveSection('turnos');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeSection === 'turnos'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <CalendarIcon className="h-5 w-5" />
              <span className="font-medium">Turnos</span>
            </button>

            {/* Publicidades */}
            <button
              onClick={() => {
                setActiveSection('publicidades');
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                activeSection === 'publicidades'
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-l-4 border-blue-600 dark:border-blue-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <MegaphoneIcon className="h-5 w-5" />
              <span className="font-medium">Publicidades</span>
            </button>
          </div>
        </nav>

        {/* Profile Section - Shadcn Style */}
        <div className="p-2 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-medium text-sm flex-shrink-0">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{displayName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{workshop?.name || 'Workshop'}</p>
            </div>
            <EllipsisVerticalIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </aside>

      {/* User Dropdown Menu - Shadcn Style */}
      {showProfileMenu && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 lg:left-64"
            onClick={() => setShowProfileMenu(false)}
          />
          {/* Dropdown */}
          <div className="fixed left-4 lg:left-auto lg:right-4 bottom-20 lg:top-16 z-50 w-64 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
            {/* User Profile Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user || 'usuario@example.com'}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>Cuenta</span>
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <CreditCard className="h-4 w-4" />
                <span>Facturación</span>
              </button>
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  handleNotificationClick();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Bell className="h-4 w-4" />
                <span>Notificaciones</span>
                {notifications > 0 && (
                  <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              <div className="my-1 h-px bg-gray-200 dark:bg-gray-700" />
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30 transition-colors">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Bars3Icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white truncate">
                Hola, {displayName} 👋
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Aquí está lo que está pasando hoy.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
            >
              {isDark ? (
                <SunIcon className="h-5 w-5 text-yellow-500" />
              ) : (
                <MoonIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
              <QuestionMarkCircleIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={handleNotificationClick}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
            >
              <BellIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50 dark:bg-gray-900 transition-colors">
          {error && (
            <div className="mb-6 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 p-4">
              <p className="text-orange-800 dark:text-orange-300 text-sm">{error}</p>
            </div>
          )}

          <div className="max-w-7xl mx-auto">
            {/* Dashboard Section */}
            {activeSection === 'dashboard' && (
              <div className="space-y-4">
                {/* Statistics Widgets */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Orders Statistics Widget */}
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-4 pt-4">
                      <CardTitle className="text-sm font-medium">Órdenes (Últimos 6 meses)</CardTitle>
                      <ShoppingCartIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
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
                            fill={isDark ? "#3b82f6" : "#2563eb"} 
                            radius={8} 
                          />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-1 text-xs px-4 pb-4">
                      <div className="flex gap-2 leading-none font-medium">
                        <span className="text-gray-600 dark:text-gray-400">Total:</span>
                        <span className="text-gray-900 dark:text-white font-bold">
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
                      <UsersIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
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
                            fill={isDark ? "#10b981" : "#059669"} 
                            radius={8} 
                          />
                        </BarChart>
                      </ChartContainer>
                    </CardContent>
                    <CardFooter className="flex-col items-start gap-1 text-xs px-4 pb-4">
                      <div className="flex gap-2 leading-none font-medium">
                        <span className="text-gray-600 dark:text-gray-400">Total:</span>
                        <span className="text-gray-900 dark:text-white font-bold">
                          {clientsChartData.reduce((sum, item) => sum + item.clients, 0)}
                        </span>
                      </div>
                      <div className="text-muted-foreground leading-none">
                        Últimos 6 meses
                      </div>
                    </CardFooter>
                  </Card>
                </div>

                {/* Appointments Calendar Widget */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">Turnos del Día</h2>
                    <CalendarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  
                  {/* Today's Appointments */}
                  <div className="mb-4">
                    <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">
                      {new Date().toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </h3>
                    <div className="space-y-2">
                      {getTodayAppointments().map((appointment, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="w-14 text-center">
                            <span className="text-xs font-semibold text-gray-900 dark:text-white">{appointment.time}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{appointment.client}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">{appointment.service}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Week Calendar */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <h3 className="text-xs font-medium text-gray-700 dark:text-gray-300 mb-3">Próximos 7 días</h3>
                    <div className="grid grid-cols-7 gap-1.5">
                      {getWeekAppointments().map((day, index) => (
                        <div
                          key={index}
                          className={`flex flex-col items-center p-2 rounded-lg border transition-colors ${
                            index === 0
                              ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <span className="text-xs text-gray-600 dark:text-gray-400 mb-0.5">{day.dayName}</span>
                          <span className={`text-base font-bold mb-0.5 ${
                            index === 0
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-900 dark:text-white'
                          }`}>
                            {day.dayNumber}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">{day.monthName}</span>
                          <div className="flex items-center gap-0.5">
                            <CalendarIcon className="h-3 w-3 text-gray-400 dark:text-gray-500" />
                            <span className="text-xs font-medium text-gray-900 dark:text-white">{day.count}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notifications Widget */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-semibold text-gray-900 dark:text-white">Novedades y Notificaciones</h2>
                    <BellIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="space-y-3">
                    {notificationsList.map((notification) => (
                      <div
                        key={notification.id}
                        className="flex items-start gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className={`p-1.5 rounded-lg ${
                          notification.type === 'warning'
                            ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                            : notification.type === 'success'
                            ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                            : 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        }`}>
                          {notification.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1">{notification.title}</h3>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">{notification.message}</p>
                          <span className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    Ver todas las notificaciones
                  </button>
                </div>
              </div>
            )}

            {/* Ordenes Section */}
            {activeSection === 'ordenes' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Ordenes</h1>
                <p className="text-gray-600 dark:text-gray-400">Aquí podrás gestionar todas las órdenes de trabajo.</p>
              </div>
            )}

            {/* Clientes Section */}
            {activeSection === 'clientes' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Clientes</h1>
                <p className="text-gray-600 dark:text-gray-400">Aquí podrás gestionar todos los clientes del taller.</p>
              </div>
            )}

            {/* Turnos Section */}
            {activeSection === 'turnos' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Turnos</h1>
                <p className="text-gray-600 dark:text-gray-400">Aquí podrás gestionar los turnos y citas de los clientes.</p>
              </div>
            )}

            {/* Publicidades Section */}
            {activeSection === 'publicidades' && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 sm:p-8 transition-colors">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">Publicidades</h1>
                <p className="text-gray-600 dark:text-gray-400">Aquí podrás gestionar las publicidades y promociones del taller.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <button
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-20"
        onClick={() => console.log('Chat opened')}
      >
        <ChatBubbleLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
      </button>
    </div>
  );
};

export default Dashboard;
