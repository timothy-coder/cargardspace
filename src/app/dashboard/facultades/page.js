'use client';

import { useEffect, useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FacultadesDialog from '@/components/FacultadesDialog'; // Importamos el Dialog con checkboxes
import { toast } from 'sonner';
import { Plus, Trash2, Edit, Download } from 'lucide-react';
import EditFacultadModal from '@/components/EditFacultadModal';
export default function FacultadesPage() {
  const [data, setData] = useState([]);
  const [facultadesExternas, setFacultadesExternas] = useState([]); // Facultades obtenidas
  const [modalOpen, setModalOpen] = useState(false);
  const [obtenerOpen, setObtenerOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedFacultades, setSelectedFacultades] = useState([]); // Facultades seleccionadas
  const [globalFilter, setGlobalFilter] = useState('');

  // Función para obtener los datos de facultades desde Supabase
  const fetchData = async () => {
    const { data, error } = await supabase.from('facultades').select('*').order('id');
    if (!error) setData(data);
    else toast.error('Error al cargar facultades');
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Función para guardar una facultad
  const handleSave = async (form) => {
    const { id, ...rest } = form;
    const result = id
      ? await supabase.from('facultades').update(rest).eq('id', id)
      : await supabase.from('facultades').insert([rest]);

    if (result.error) toast.error('Error al guardar');
    else {
      toast.success('Guardado correctamente');
      fetchData();
    }

    setModalOpen(false);
  };

  // Función para eliminar una facultad
  const handleDelete = async (id) => {
    const { error } = await supabase.from('facultades').delete().eq('id', id);
    if (error) toast.error('Error al eliminar');
    else {
      toast.success('Eliminado');
      fetchData();
    }
  };

  // Función para obtener facultades desde la base de datos externa
  const handleObtener = async () => {
    const res = await fetch('/api/obtener-facultades');
    const data = await res.json();

    if (res.ok) {
      setFacultadesExternas(data);  // Guardamos las facultades obtenidas
      setObtenerOpen(true);  // Abrimos el diálogo para mostrar las facultades
    } else {
      toast.error('Error al obtener los datos');
    }
  };

  // Cambiar la selección de un checkbox
 // Cambiar la selección de un checkbox
const handleCheckboxChange = (id) => {
  setSelectedFacultades((prev) => {
    // Si el ID está en la lista, lo eliminamos (desmarcamos)
    if (prev.includes(id)) {
      return prev.filter((item) => item !== id);
    }
    // Si no está en la lista, lo agregamos (marcamos)
    return [...prev, id];
  });
};


  // Función para guardar las facultades seleccionadas
 const handleSubmitFacultades = async () => {
  if (selectedFacultades.length === 0) {
    toast.warning('No se seleccionaron facultades');
    return;
  }

  // Filtramos las facultades externas seleccionadas
  const facultadesAInsertar = facultadesExternas.filter(facultad =>
    selectedFacultades.includes(facultad.relationid)
  ).map(facultad => ({
    name: facultad.Name,  // Solo necesitamos el nombre
  }));

  // Realizamos el upsert para guardar las facultades seleccionadas
  const { data, error } = await supabase
    .from('facultades')
    .upsert(facultadesAInsertar, { onConflict: ['name'] });  // 'name' es el campo por el que gestionamos el conflicto

  if (error) {
    toast.error('Error al guardar las facultades');
    console.error('Error:', error);
  } else {
    toast.success('Facultades guardadas correctamente');
    setObtenerOpen(false);
    fetchData();  // Refresca los datos
  }
};



  // Configuración de columnas para la tabla
  const columns = useMemo(() => [
    {
      accessorKey: 'name',
      header: 'Nombre de Facultad',
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
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Gestión de Facultades</h1>
        <Button onClick={() => {
          setSelected(null);
          setModalOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
        <Button size="sm" variant="secondary" onClick={handleObtener}>
          <Download className="w-4 h-4" />
          Obtener
        </Button>
      </div>

      <Input
        placeholder="Buscar por nombre"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="mb-4 w-full max-w-md"
      />

      {/* Dialog para obtener facultades externas */}
      <FacultadesDialog
        open={obtenerOpen}
        onClose={() => setObtenerOpen(false)}
        facultadesExternas={facultadesExternas}
        selectedFacultades={selectedFacultades}
        handleCheckboxChange={handleCheckboxChange}
        handleSubmitFacultades={handleSubmitFacultades}
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

      <EditFacultadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        facultad={selected}
      />
    </div>
  );
}
