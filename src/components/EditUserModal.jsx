'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';

export default function EditUserModal({ open, onClose, user, onSave }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (user) setForm({ ...user, password: '' });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (val) => {
    setForm((prev) => ({ ...prev, is_active: val }));
  };

  const handleSubmit = () => {
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Nombre</Label>
            <Input name="nombre" value={form.nombre || ''} onChange={handleChange} />
          </div>
          <div>
            <Label>Apellido</Label>
            <Input name="apellido" value={form.apellido || ''} onChange={handleChange} />
          </div>
          <div className="flex items-center gap-2">
            <Label>Activo</Label>
            <Switch checked={form.is_active} onCheckedChange={handleToggle} />
          </div>
          <div>
            <Label>Contraseña nueva (opcional)</Label>
            <Input
              type="password"
              name="password"
              value={form.password || ''}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
