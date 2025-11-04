import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { COLORS } from '../../constants/colors';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
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
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username o Email
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={formData.username}
                onChange={handleChange}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm"
                placeholder="tu_usuario_o_email"
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
                placeholder="Tu contraseña"
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
              {loading ? 'Iniciando sesión...' : 'Continuar'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">¿No tienes cuenta?</span>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="mt-4 w-full py-3 px-4 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            >
              Registrarse
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

