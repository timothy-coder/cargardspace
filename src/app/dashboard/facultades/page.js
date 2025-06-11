'use client';

import { useEffect, useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EditFacultadModal from '@/components/EditFacultadModal';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, Download } from 'lucide-react';

export default function FacultadesPage() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');

  const fetchData = async () => {
    const { data, error } = await supabase.from('facultades').select('*').order('id');
    if (!error) setData(data);
    else toast.error('Error al cargar facultades');
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleDelete = async (id) => {
    const { error } = await supabase.from('facultades').delete().eq('id', id);
    if (error) toast.error('Error al eliminar');
    else {
      toast.success('Eliminado');
      fetchData();
    }
  };

 const handleObtener = () => {
    toast.info('Aquí se podría ejecutar una función personalizada de "obtener"');
  };

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
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Gestión de Facultades</h1>
        <Button onClick={() => {
          setSelected(null);
          setModalOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
        <Button size="sm" variant="secondary" onClick={() => handleObtener()}>
            <Download className="w-4 h-4" />Obtener
          </Button>
      </div>

      <Input
        placeholder="Buscar por nombre"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="mb-4 w-full max-w-md"
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
