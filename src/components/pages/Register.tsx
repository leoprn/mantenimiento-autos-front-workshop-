import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { COLORS } from '../../constants/colors';

// Mapa de traducciones de mensajes de error del backend
const errorTranslations: Record<string, string> = {
  'Email already exists': 'Ya tenemos un email registrado con este correo, por favor intenta con otro correo',
  'Username already exists': 'El nombre de usuario ya existe',
  'Email is required': 'El email es requerido',
  'Password is required': 'La contraseña es requerida',
  'Invalid email format': 'El formato del email no es válido',
  'Password must be between 8 and 100 characters': 'La contraseña debe tener entre 8 y 100 caracteres',
  'Username must be between 3 and 50 characters': 'El nombre de usuario debe tener entre 3 y 50 caracteres',
  'Invalid role': 'Rol inválido',
  'Admin users must have \'admin\' in their username': 'Los usuarios administradores deben tener \'admin\' en su nombre de usuario',
  'Admin users must use an organizational email (@carcareconnect.com)': 'Los usuarios administradores deben usar un email organizacional (@carcareconnect.com)'
};

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validar longitud de contraseña
    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
      });
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      // Backend returns {error: "message"} so check both error and message fields
      const englishMessage = err.response?.data?.error || err.response?.data?.message || '';
      // Translate the error message if it exists in our translations map
      const errorMessage = englishMessage && errorTranslations[englishMessage] 
        ? errorTranslations[englishMessage] 
        : (englishMessage || 'Error al registrar workshop');
      setError(errorMessage);
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

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
            <div className="text-green-600 text-5xl mb-4">✓</div>
            <h2 className="text-2xl font-bold text-gray-900">¡Registro exitoso!</h2>
            <p className="text-gray-600 mt-2">Redirigiendo al login...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-center text-sm text-gray-500 mb-2">Iniciá sesión o registrate</h2>
          <h3 className="text-2xl font-bold text-gray-900 text-left">
            Te damos la bienvenida a Workshop
          </h3>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <form className="space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 p-4 transition-all duration-300">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ExclamationCircleIcon className="h-5 w-5 text-orange-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-orange-800">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="tu_email@ejemplo.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Mínimo 8 caracteres"
              />
              <p className="mt-1 text-xs text-gray-500">
                La contraseña debe tener entre 8 y 100 caracteres
              </p>
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirmar Contraseña
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="Repite la contraseña"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 border border-transparent text-base font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              style={{ backgroundColor: COLORS.primary }}
              onMouseEnter={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = COLORS.primaryHover;
              }}
              onMouseLeave={(e) => {
                if (!loading) e.currentTarget.style.backgroundColor = COLORS.primary;
              }}
            >
              {loading ? 'Registrando...' : 'Continuar'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿Ya tienes cuenta?</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="mt-4 w-full py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

