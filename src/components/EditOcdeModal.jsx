'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useState, useEffect } from 'react';

export default function EditOcdeModal({ open, onClose, onSubmit, ocde, facultades }) {
  const [form, setForm] = useState({
    ocde: '',
    codigo: '',
    estado: false,
    facultad: '',
  });

  useEffect(() => {
    if (ocde) setForm({ ...ocde });
    else setForm({ ocde: '', codigo: '', estado: false, facultad: '' });
  }, [ocde]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{ocde ? 'Editar OCDE' : 'Agregar OCDE'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            name="ocde"
            placeholder="Nombre OCDE"
            value={form.ocde}
            onChange={handleChange}
          />

          <Input
            name="codigo"
            placeholder="Código"
            type="number"
            value={form.codigo}
            onChange={handleChange}
          />

          <div className="flex items-center space-x-2">
            <Switch
              id="estado"
              checked={form.estado}
              onCheckedChange={(checked) => setForm((prev) => ({ ...prev, estado: checked }))}
            />
            <Label htmlFor="estado">Estado activo</Label>
          </div>

          <div>
            <Label>Facultad</Label>
            <select
              name="facultad"
              value={form.facultad || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Seleccione facultad</option>
              {facultades.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>

          <Button onClick={() => onSubmit(form)}>
            {ocde ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
