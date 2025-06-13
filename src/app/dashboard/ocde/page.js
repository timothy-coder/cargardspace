'use client';

import { useEffect, useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import EditOcdeModal from '@/components/EditOcdeModal';
import { Plus, Trash2, Edit, Download } from 'lucide-react';

export default function OcdePage() {
  const [data, setData] = useState([]);
  const [facultades, setFacultades] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');

  const fetchData = async () => {
    const [{ data: ocdeData }, { data: facuData }] = await Promise.all([
      supabase.from('ocde').select('*').order('id'),
      supabase.from('facultades').select('id, name')
    ]);

    setData(ocdeData || []);
    setFacultades(facuData || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (form) => {
    const { id, ...rest } = form;
    const result = id
      ? await supabase.from('ocde').update(rest).eq('id', id)
      : await supabase.from('ocde').insert([rest]);

    if (result.error) toast.error('Error al guardar');
    else {
      toast.success('Guardado correctamente');
      fetchData();
    }

    setModalOpen(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('ocde').delete().eq('id', id);
    if (error) toast.error('Error al eliminar');
    else {
      toast.success('Eliminado');
      fetchData();
    }
  };


  const columns = useMemo(() => [
    {
      accessorKey: 'ocde',
      header: 'OCDE',
    },
    {
      accessorKey: 'codigo',
      header: 'Código',
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ getValue }) => (getValue() ? 'Activo' : 'Inactivo'),
    },
    {
      accessorKey: 'facultad',
      header: 'Facultad',
      cell: ({ getValue }) => {
        const fac = facultades.find(f => f.id === getValue());
        return fac?.name || '—';
      },
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
  ], [facultades]);

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
        <h1 className="text-xl font-bold">Gestión de OCDE</h1>
        <Button onClick={() => {
          setSelected(null);
          setModalOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
        
      </div>

      <Input
        placeholder="Buscar por OCDE o código"
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="mb-4 max-w-md"
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

      <EditOcdeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        ocde={selected}
        facultades={facultades}
      />
    </div>
  );
}
