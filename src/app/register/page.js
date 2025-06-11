'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
  });
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async () => {
    const { email, password, nombre, apellido } = form;

    const { data, error: signUpError } = await supabase.auth.signUp({ email, password });
    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    const userId = data.user?.id;
    if (userId) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: userId, nombre, apellido }]);

      if (profileError) {
        setError(profileError.message);
        return;
      }

      alert('Registro exitoso. Revisa tu correo para confirmar la cuenta.');
      router.push('/login');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-16 bg-white shadow-md rounded-md p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center">Registro</h2>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          name="nombre"
          type="text"
          value={form.nombre}
          onChange={handleChange}
          placeholder="Nombre"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="apellido">Apellido</Label>
        <Input
          id="apellido"
          name="apellido"
          type="text"
          value={form.apellido}
          onChange={handleChange}
          placeholder="Apellido"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Correo"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Contraseña"
        />
      </div>

      <Button onClick={handleRegister} className="w-full">
        Registrarse
      </Button>
    </div>
  );
}
