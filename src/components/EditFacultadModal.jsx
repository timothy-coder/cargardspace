'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

export default function EditFacultadModal({ open, onClose, onSubmit, facultad }) {
  const [form, setForm] = useState({ name: '' });

  useEffect(() => {
    if (facultad) setForm({ ...facultad });
    else setForm({ name: '' });
  }, [facultad]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{facultad ? 'Editar Facultad' : 'Agregar Facultad'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Input
            name="name"
            placeholder="Nombre de la facultad"
            value={form.name}
            onChange={handleChange}
          />

          <Button onClick={handleSubmit}>
            {facultad ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
