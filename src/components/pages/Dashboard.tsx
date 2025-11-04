import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/api';
import { Workshop } from '../../types';
import { 
  Squares2X2Icon, 
  UsersIcon,
  DocumentTextIcon,
  ClockIcon,
  CurrencyDollarIcon,
  CalculatorIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  TruckIcon,
  ChartBarIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  BellIcon,
  EllipsisVerticalIcon,
  CalendarIcon,
  DocumentArrowUpIcon,
  BriefcaseIcon,
  GlobeAltIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { COLORS } from '../../constants/colors';

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string;
  icon: React.ReactNode;
}

// Interface for future use
// interface TeamMember {
//   id: number;
//   name: string;
//   role: string;
//   type: 'employee' | 'contractor';
// }

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock data para tareas
  const [tasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Revisar solicitud de tiempo libre',
      description: '1 solicitud necesita tu atención.',
      dueDate: 'Hoy',
      icon: <CalendarIcon className="h-5 w-5" />
    },
    {
      id: 2,
      title: 'Procesar facturas de contratistas',
      description: 'Tienes 1 factura de contratista sin pagar para revisar.',
      dueDate: 'Hoy',
      icon: <DocumentTextIcon className="h-5 w-5" />
    },
    {
      id: 3,
      title: 'Subir documentos adicionales para onboarding',
      description: 'Necesitamos algunos detalles más para asegurar que tu onboarding vaya bien.',
      dueDate: 'Hoy',
      icon: <DocumentArrowUpIcon className="h-5 w-5" />
    },
    {
      id: 4,
      title: 'Configurar método de pago',
      description: 'Esto evitará retrasar el pago de facturas y contratistas.',
      dueDate: 'Ayer',
      icon: <CreditCardIcon className="h-5 w-5" />
    },
    {
      id: 5,
      title: 'Completar verificación de empresa',
      description: 'Para pagar empleados y contratistas y mantener seguro el taller, necesitaremos información adicional sobre tu empresa.',
      dueDate: 'Ayer',
      icon: <BriefcaseIcon className="h-5 w-5" />
    }
  ]);

  // Team members data - ready for future use
  // const [teamMembers] = useState<TeamMember[]>([
  //   { id: 1, name: 'Juan Pérez', role: 'Mecánico Senior', type: 'employee' },
  //   { id: 2, name: 'María González', role: 'Mecánico', type: 'contractor' }
  // ]);

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

  const handleTaskClick = (taskId: number) => {
    console.log('Task clicked:', taskId);
    // Aquí puedes agregar navegación o lógica específica
  };

  const handleViewAll = (section: string) => {
    console.log('View all clicked for:', section);
    // Aquí puedes agregar navegación
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
    <div className="min-h-screen bg-gray-50 flex relative">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col h-screen z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close button for mobile */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TruckIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Workshop</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <XMarkIcon className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        {/* Logo - Desktop only */}
        <div className="hidden lg:block p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <TruckIcon className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Workshop</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {/* Dashboard */}
          <button
            onClick={() => {
              setActiveSection('dashboard');
              setSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
              activeSection === 'dashboard'
                ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Squares2X2Icon className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </button>

          {/* Taller Section */}
          <div className="mt-6 mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">TALLER</p>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveSection('team');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'team'
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <UsersIcon className="h-5 w-5" />
                <span>Equipo</span>
              </button>
              <button
                onClick={() => {
                  setActiveSection('onboarding');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'onboarding'
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <UserGroupIcon className="h-5 w-5" />
                <span>Onboarding</span>
              </button>
              <button
                onClick={() => {
                  setActiveSection('timeoff');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'timeoff'
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ClockIcon className="h-5 w-5" />
                <span>Tiempo libre</span>
              </button>
              <button
                onClick={() => {
                  setActiveSection('tracking');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'tracking'
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ChartBarIcon className="h-5 w-5" />
                <span>Seguimiento</span>
              </button>
              <button
                onClick={() => {
                  setActiveSection('expenses');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'expenses'
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CurrencyDollarIcon className="h-5 w-5" />
                <span>Gastos</span>
              </button>
              <button
                onClick={() => {
                  setActiveSection('calculator');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'calculator'
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CalculatorIcon className="h-5 w-5" />
                <span>Calculadora</span>
              </button>
              <button
                onClick={() => {
                  setActiveSection('settings');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'settings'
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Cog6ToothIcon className="h-5 w-5" />
                <span>Configuración</span>
              </button>
            </div>
          </div>

          {/* Pagos Section */}
          <div className="mt-6 mb-2">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">PAGOS</p>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setActiveSection('payroll');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'payroll'
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CurrencyDollarIcon className="h-5 w-5" />
                <span>Nómina</span>
              </button>
              <button
                onClick={() => {
                  setActiveSection('invoices');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'invoices'
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <DocumentTextIcon className="h-5 w-5" />
                <span>Facturas</span>
              </button>
              <button
                onClick={() => {
                  setActiveSection('billing');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  activeSection === 'billing'
                    ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CreditCardIcon className="h-5 w-5" />
                <span>Facturación</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-medium">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{workshop?.name || 'Workshop'}</p>
              </div>
            </div>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <EllipsisVerticalIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          {showProfileMenu && (
            <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg p-2">
              <button
                onClick={() => {
                  setShowProfileMenu(false);
                  setActiveSection('settings');
                }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg"
              >
                Configuración
              </button>
              <button
                onClick={logout}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Bars3Icon className="h-6 w-6 text-gray-600" />
            </button>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                Hola, {displayName} 👋
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Aquí está lo que está pasando hoy.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <QuestionMarkCircleIcon className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={handleNotificationClick}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
            >
              <BellIcon className="h-5 w-5 text-gray-600" />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-50">
          {error && (
            <div className="mb-6 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 p-4">
              <p className="text-orange-800 text-sm">{error}</p>
            </div>
          )}

          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Things to do */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Cosas por hacer</h2>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => handleTaskClick(task.id)}
                      className="w-full text-left p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors flex-shrink-0">
                          <div className="text-blue-600">{task.icon}</div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm sm:text-base text-gray-900 mb-1">{task.title}</h3>
                          <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>
                          <span className={`text-xs font-medium ${
                            task.dueDate === 'Hoy' ? 'text-orange-600' : 'text-gray-500'
                          }`}>
                            Vence: {task.dueDate}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upcoming public holidays */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Próximos feriados</h2>
                <div className="p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <CalendarIcon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xl sm:text-2xl font-bold text-gray-900">13</span>
                        <span className="text-xs sm:text-sm text-gray-500">Nov</span>
                      </div>
                      <p className="font-medium text-sm sm:text-base text-gray-900 truncate">Día de la Independencia</p>
                      <p className="text-xs sm:text-sm text-gray-500">Lun, 13 Nov, 2024</p>
                    </div>
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Sidebar Info */}
            <div className="space-y-6">
              {/* Your team */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Tu equipo (1)</h2>
                  <button
                    onClick={() => handleViewAll('team')}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    Ver todo <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
                <div className="p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <UserGroupIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="font-medium text-sm sm:text-base text-gray-900">1 Contratista</span>
                  </div>
                  <p className="text-xs sm:text-sm text-green-700">+2 en onboarding ahora</p>
                </div>
              </div>

              {/* Team by country */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Equipo por país</h2>
                  <button
                    onClick={() => handleViewAll('countries')}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    Ver todo <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <GlobeAltIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    <span className="flex-1 text-sm sm:text-base text-gray-900">Argentina</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-600">1</span>
                  </div>
                </div>
              </div>

              {/* Who's away */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base sm:text-lg font-semibold text-gray-900">Quién está ausente</h2>
                  <button
                    onClick={() => handleViewAll('away')}
                    className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
                  >
                    Ver todo <ArrowRightIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                      CO
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">CO Abigail</p>
                      <p className="text-xs text-gray-500">24 Oct - 26 Oct</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
