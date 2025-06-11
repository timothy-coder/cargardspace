'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setError('');

    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError('Correo o contraseña incorrectos');
      return;
    }

    const userId = signInData.user?.id;
    if (!userId) {
      setError('No se pudo obtener el usuario');
      return;
    }

    // Verificamos si está activo en la tabla `profiles`
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_active')
      .eq('id', userId)
      .single();

    if (profileError || !profile?.is_active) {
      // Cierra sesión si no está activo
      await supabase.auth.signOut();
      setError('Tu cuenta está inactiva. Contacta con el administrador.');
      return;
    }

    // Usuario activo: lo redirigimos
    router.push('/dashboard');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-5">
        <h2 className="text-2xl font-semibold text-center">Iniciar Sesión</h2>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <div className="space-y-2">
          <Label htmlFor="email">Correo electrónico</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <Button onClick={handleLogin} className="w-full mt-4">
          Entrar
        </Button>

        <p className="text-center text-sm mt-4">
          ¿No tienes cuenta?{' '}
          <a href="/register" className="text-blue-600 hover:underline">
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}
