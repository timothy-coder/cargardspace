'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox'; // Usamos los checkboxes de Shadcn
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input'; // Importamos el Input para el buscador
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function DocentesDialog({
  open,
  onClose,
  selectedDocentes,
  handleCheckboxChange,
  setSelectedDocentes,
  handleSubmitDocentes,
}) {
  const [searchTerm, setSearchTerm] = useState('');  // Estado para el buscador
  const [docentesExternas, setDocentesExternas] = useState([]); // Estado para los docentes externos

  // Obtener docentes desde la API
  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        const response = await fetch('/api/obtener-docentes');
        const data = await response.json();

        if (response.ok) {
          setDocentesExternas(data); // Guardamos los docentes obtenidos
        } else {
          toast.error('Error al obtener los docentes');
        }
      } catch (error) {
        toast.error('Error al obtener los docentes');
      }
    };

    fetchDocentes();
  }, []);  // Ejecutar solo una vez al montar el componente

  // Filtrar docentes por el término de búsqueda (buscando en nombre, apellido o DNI)
  const filteredDocentes = docentesExternas.filter((docente) => {
    const fullName = `${docente.Name} ${docente.MaternalSurname} ${docente.PaternalSurname}`;
    const searchLowerCase = searchTerm.toLowerCase();
    
    return (
      fullName.toLowerCase().includes(searchLowerCase) || docente.username.includes(searchLowerCase)
    );
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Seleccionar Docentes</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Buscador */}
          <Input
            placeholder="Buscar por nombre, apellido o DNI de docente"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-4"
          />

          {/* Contenedor de docentes con grid de 3 columnas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
            {filteredDocentes.map((docente) => (
              <div key={docente.username} className="flex items-center gap-2">
                <Checkbox
                  checked={selectedDocentes.includes(docente.username)}  // Verifica si está seleccionado
                  onCheckedChange={() => handleCheckboxChange(docente.username)}  // Llama a la función que maneja el cambio de estado
                />
                <label>{`${docente.Name} ${docente.MaternalSurname} ${docente.PaternalSurname} - ${docente.username}`}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmitDocentes}>Guardar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
