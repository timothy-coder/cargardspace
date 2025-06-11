'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { toast } from 'sonner';

export default function HomePage() {
  const [dni, setDni] = useState('');
  const [result, setResult] = useState([]);

  const handleSearch = async () => {
    if (!dni) {
      toast.warning('Por favor ingresa un DNI');
      return;
    }

    const { data, error } = await supabase
      .from('investigaciones')
      .select('titulo, urllink, numero_oficio, observaciones')
      .or(`dni_autor.eq.${dni},dni_autor2.eq.${dni}`);

    if (error) {
      toast.error('Error al buscar');
      setResult([]);
    } else if (data.length === 0) {
      toast.info('No se encontraron resultados');
      setResult([]);
    } else {
      setResult(data);
    }
  };

  return (
    <main className="flex flex-col items-center px-4 py-16 font-sans space-y-10">
      {/* Sección bienvenida */}
      <section className="bg-muted p-10 rounded-xl text-center max-w-xl w-full shadow-md space-y-6">
        <h1 className="text-3xl font-bold">Sistema de Consultas Académicas</h1>
        <p className="text-muted-foreground">
          Accede a información de estudiantes, trámites y más desde esta plataforma.
        </p>

        <div className="flex justify-center flex-wrap gap-4">
          <Link href="/login">
            <Button>Iniciar sesión</Button>
          </Link>
          <Link href="/register">
            <Button variant="secondary">Registrarse</Button>
          </Link>
        </div>
      </section>

      {/* Sección consulta rápida */}
      <section className="bg-background p-8 rounded-xl max-w-xl w-full shadow-sm text-center space-y-4">
        <h2 className="text-xl font-semibold">Consulta rápida</h2>

        <Input
          placeholder="Buscar por DNI"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          className="w-full"
        />

        <Button onClick={handleSearch}>Buscar</Button>

        {/* Resultados */}
        <div className="space-y-4 pt-4">
          {result.map((item, idx) => (
            <Card key={idx}>
              <CardHeader>
                <CardTitle>{item.titulo}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-left text-sm">
                <p>
                  <strong>URL:</strong>{' '}
                  <a
                    href={item.urllink}
                    target="_blank"
                    className="text-blue-600 underline"
                    rel="noopener noreferrer"
                  >
                    {item.urllink}
                  </a>
                </p>
                <p><strong>Número de Oficio:</strong> {item.numero_oficio}</p>
                <p><strong>Observaciones:</strong> {item.observaciones}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
