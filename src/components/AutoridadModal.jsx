'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabaseClient';

export default function AutoridadModal({ open, onClose, data, refresh }) {
  const [form, setForm] = useState({
    facultad: '',
    modelo_oficio: '',
    estado: false,
    grado: '',
    docenteid: '',
  });

  const [facultades, setFacultades] = useState([]);
  const [docentes, setDocentes] = useState([]);

  useEffect(() => {
    if (data) {
      setForm({
        facultad: data.facultad || '',
        modelo_oficio: data.modelo_oficio || '',
        estado: data.estado || false,
        grado: data.grado || '',
        docenteid: data.docenteid || '',
      });
    } else {
      setForm({
        facultad: '',
        modelo_oficio: '',
        estado: false,
        grado: '',
        docenteid: '',
      });
    }
  }, [data]);

  useEffect(() => {
    supabase.from('facultades').select('id, name').then(({ data }) => setFacultades(data || []));
    supabase.from('docentes').select('id, nombreapellido').then(({ data }) => setDocentes(data || []));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitch = (val) => {
    setForm((prev) => ({ ...prev, estado: val }));
  };

  const handleSubmit = async () => {
    if (data?.id) {
      await supabase.from('autoridades').update(form).eq('id', data.id);
    } else {
      await supabase.from('autoridades').insert(form);
    }
    refresh();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{data ? 'Editar Autoridad' : 'Nueva Autoridad'}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <select name="facultad" value={form.facultad} onChange={handleChange} className="p-2 border rounded">
            <option value="">Seleccionar Facultad</option>
            {facultades.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          <Input
            name="modelo_oficio"
            placeholder="Modelo de Oficio"
            value={form.modelo_oficio}
            onChange={handleChange}
          />

          <Input
            name="grado"
            placeholder="Grado"
            value={form.grado}
            onChange={handleChange}
          />

          <div className="flex items-center gap-3">
            <Label>Activo</Label>
            <Switch checked={form.estado} onCheckedChange={handleSwitch} />
          </div>

          <select name="docenteid" value={form.docenteid} onChange={handleChange} className="p-2 border rounded">
            <option value="">Seleccionar Docente</option>
            {docentes.map((d) => (
              <option key={d.id} value={d.id}>
                {d.nombreapellido}
              </option>
            ))}
          </select>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>Guardar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
