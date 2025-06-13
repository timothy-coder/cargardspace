'use client';

import { useEffect, useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, Download } from 'lucide-react';
import DocentesDialog from '@/components/DocentesDialog'; // Dialog para docentes
import EditDocenteModal from '@/components/EditDocenteModal'; // Modal para editar docentes

export default function OrcidPage() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false); // Estado para abrir el modal de edición
  const [obtenerOpen, setObtenerOpen] = useState(false); // Estado para abrir el dialogo de selección de docentes
  const [selected, setSelected] = useState(null); // Docente seleccionado para editar
  const [selectedDocentes, setSelectedDocentes] = useState([]); // Docentes seleccionados
  const [globalFilter, setGlobalFilter] = useState('');
  const [docentesExternos, setDocentesExternos] = useState([]);

  const fetchData = async () => {
    const { data, error } = await supabase.from('docentes').select('*').order('id');
    if (!error) setData(data);
    else toast.error('Error al cargar docentes');
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Obtener docentes desde la API
  const handleObtener = async () => {
    const res = await fetch('/api/obtener-docentes');
    const data = await res.json();

    if (res.ok) {
      setDocentesExternos(data);
      setObtenerOpen(true); // Abrir el dialogo para seleccionar docentes
    } else {
      toast.error('Error al obtener los datos');
    }
  };
const handleSave = async (form) => {
    const { id, ...rest } = form;
    let result;

    if (id) {
      result = await supabase.from('docentes').update(rest).eq('id', id);
    } else {
      result = await supabase.from('docentes').insert([rest]);
    }

    if (result.error) toast.error('Error al guardar');
    else {
      toast.success('Guardado correctamente');
      fetchData();
    }

    setModalOpen(false);
  };
    const handleDelete = async (id) => {
    const { error } = await supabase.from('docentes').delete().eq('id', id);
    if (error) toast.error('Error al eliminar');
    else {
      toast.success('Eliminado');
      fetchData();
    }
  };
  // Manejar el cambio de selección de los checkboxes
  const handleCheckboxChange = (id) => {
    setSelectedDocentes((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Guardar los docentes seleccionados
 const handleSaveDocentes = async () => {
  const docentesSeleccionados = docentesExternos.filter((docente) =>
    selectedDocentes.includes(docente.username)
  );

  for (const docente of docentesSeleccionados) {
    // Limpiar espacios y dividir el nombre completo por los espacios
    const nombreCompleto = docente.Name.trim().split(' ');

    // Si solo hay un nombre, lo asignamos como nombre, y el resto lo asignamos como apellidos
    const nombre = nombreCompleto[0] || '';
    const apellidoPaterno = nombreCompleto.length > 1 ? nombreCompleto[1] : '';  // Paterno
    const apellidoMaterno = nombreCompleto.length > 2 ? nombreCompleto[2] : '';  // Materno si existe

    // Si el nombre tiene más de tres partes (se asume que son más nombres o apellidos)
    if (nombreCompleto.length > 3) {
      // Aseguramos que solo tomamos las dos primeras partes como apellidos si hay más de 3 partes
      const apellidoPaterno = nombreCompleto[1];
      const apellidoMaterno = nombreCompleto.slice(2).join(' '); // Si hay más de dos partes, lo consideramos apellido materno
    }

    // Capitalizamos correctamente los nombres y apellidos
    const formattedPaterno = apellidoPaterno.charAt(0).toUpperCase() + apellidoPaterno.slice(1).toLowerCase();
    const formattedMaterno = apellidoMaterno.charAt(0).toUpperCase() + apellidoMaterno.slice(1).toLowerCase();
    const formattedNombre = nombre.charAt(0).toUpperCase() + nombre.slice(1).toLowerCase();

    // Guardamos los datos del docente en la base de datos
    const { error } = await supabase.from('docentes').insert([
      {
        nombreapellido: `${formattedNombre} ${formattedPaterno} ${formattedMaterno}`,
        dni: docente.username, // Usamos el "username" como el DNI
        orcid: null, // Usamos null para el ORCID por ahora
        isDecano: false, // Inicializamos como false
        isDirector: false, // Inicializamos como false
      },
    ]);

    if (error) {
      toast.error('Error al guardar el docente');
    } else {
      toast.success('Docente guardado correctamente');
    }
  }

  setObtenerOpen(false); // Cierra el dialogo después de guardar
};



  const columns = useMemo(() => [
    {
      accessorKey: 'nombreapellido',
      header: 'Nombre',
    },
    {
      accessorKey: 'dni',
      header: 'DNI',
    },
    {
      accessorKey: 'orcid',
      header: 'ORCID',
    },
    {
      accessorKey: 'isDecano',
      header: 'Decano',
      cell: ({ getValue }) => (getValue() ? '✅' : '❌'),
    },
    {
      accessorKey: 'isDirector',
      header: 'Director',
      cell: ({ getValue }) => (getValue() ? '✅' : '❌'),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => {
            setSelected(row.original);
            setModalOpen(true);
          }}>
            <Edit className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="destructive" onClick={() => handleDelete(row.original.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ], []);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Gestión de Docentes</h1>
        <Button size="sm" onClick={handleObtener}>
          <Download className="w-4 h-4" />
          Obtener
        </Button>
      </div>

      <Input
        placeholder="Buscar por nombre o DNI"
        value={globalFilter ?? ''}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="mb-4 w-full max-w-md"
      />

      {/* Dialog para mostrar y seleccionar los docentes */}
      <DocentesDialog
        open={obtenerOpen}
        onClose={() => setObtenerOpen(false)}
        selectedDocentes={selectedDocentes}
        setSelectedDocentes={setSelectedDocentes}// Pasamos la función para actualizar el estado
        handleCheckboxChange={handleCheckboxChange}
        handleSubmitDocentes={handleSaveDocentes}
      />

      <div className="border rounded-md overflow-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="p-2 border text-left">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="p-2 border">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal para editar el docente */}
      <EditDocenteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        docente={selected}
      />
    </div>
  );
}
