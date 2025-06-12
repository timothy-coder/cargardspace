'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox'; // Usamos los checkboxes de Shadcn
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function FacultadesDialog({ open, onClose, facultadesExternas, selectedFacultades, handleCheckboxChange, handleSubmitFacultades }) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Seleccionar Facultades</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {facultadesExternas.map((facultad) => (
            <div key={facultad.id} className="flex items-center gap-2">
              <Checkbox
                checked={selectedFacultades.includes(facultad.id)}
                onCheckedChange={() => handleCheckboxChange(facultad.id)} // Cambiar estado cuando se haga clic
              />
              <label>{facultad.Name}</label>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmitFacultades}>Guardar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
