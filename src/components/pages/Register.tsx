import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">Te damos la bienvenida a Workshop</h1>
          <p className="text-muted-foreground">Creá tu cuenta para comenzar</p>
        </div>

        {/* Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Crear cuenta</CardTitle>
            <CardDescription>
              Ingresá tu información para crear una nueva cuenta
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              {error && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4">
                  <div className="flex items-center gap-2">
                    <ExclamationCircleIcon className="h-5 w-5 text-destructive" />
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu_email@ejemplo.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mínimo 8 caracteres"
                />
                <p className="text-xs text-muted-foreground">
                  La contraseña debe tener entre 8 y 100 caracteres
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repite la contraseña"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full"
                style={{ backgroundColor: COLORS.primary }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = COLORS.primaryHover;
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.backgroundColor = COLORS.primary;
                }}
              >
                {loading ? 'Registrando...' : 'Continuar'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">¿Ya tienes cuenta?</span>
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="mt-4 w-full"
                onClick={() => navigate('/login')}
              >
                Iniciar Sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Register;

