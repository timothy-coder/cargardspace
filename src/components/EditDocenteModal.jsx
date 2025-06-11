'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function EditDocenteModal({ open, onClose, onSubmit, docente }) {
  const [form, setForm] = useState({
    nombreapellido: '',
    orcid: '',
    dni: '',
    isDecano: false,
    isDirector: false,
  });

  useEffect(() => {
    if (docente) {
      setForm({
        nombreapellido: docente.nombreapellido || '',
        orcid: docente.orcid || '',
        dni: docente.dni || '',
        isDecano: docente.isDecano || false,
        isDirector: docente.isDirector || false,
        id: docente.id,
      });
    }
  }, [docente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    onSubmit(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{form.id ? 'Editar' : 'Agregar'} Docente</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Nombre y Apellido</Label>
            <Input
              name="nombreapellido"
              value={form.nombreapellido}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label>ORCID</Label>
            <Input name="orcid" value={form.orcid} onChange={handleChange} />
          </div>
          <div>
            <Label>DNI</Label>
            <Input
              name="dni"
              type="number"
              value={form.dni}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>Decano</Label>
            <Switch
              checked={form.isDecano}
              onCheckedChange={(val) => handleToggle('isDecano', val)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>Director</Label>
            <Switch
              checked={form.isDirector}
              onCheckedChange={(val) => handleToggle('isDirector', val)}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full">
            Guardar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
