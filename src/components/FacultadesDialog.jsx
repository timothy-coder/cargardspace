'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox'; // Usamos los checkboxes de Shadcn
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Importamos el Input para el buscador
import { useState } from 'react';

export default function FacultadesDialog({
  open,
  onClose,
  facultadesExternas,
  selectedFacultades,
  handleCheckboxChange,
  handleSubmitFacultades,
}) {
  const [searchTerm, setSearchTerm] = useState('');  // Estado para el buscador

  // Filtrar facultades por el término de búsqueda
  const filteredFacultades = facultadesExternas.filter((facultad) =>
    facultad.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Seleccionar Facultades</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Buscador */}
          <Input
            placeholder="Buscar por nombre de facultad"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />

          {/* Contenedor de facultades con grid de 3 columnas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredFacultades.map((facultad) => (
              <div key={facultad.relationid} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedFacultades.includes(facultad.relationid)}  // Verifica si está seleccionado
                  onCheckedChange={() => handleCheckboxChange(facultad.relationid)}  // Llama a la función que maneja el cambio de estado
                />
                <label>{facultad.Name}</label>
              </div>
            ))}
          </div>
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
