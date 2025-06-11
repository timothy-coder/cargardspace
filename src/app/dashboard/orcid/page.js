'use client';

import { useEffect, useMemo, useState } from 'react';
import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import EditDocenteModal from '@/components/EditDocenteModal';
import { toast } from 'sonner';
import { Plus, Trash2, Edit,Download } from 'lucide-react';

export default function OrcidPage() {
  const [data, setData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState(null);
  const [globalFilter, setGlobalFilter] = useState('');

  const fetchData = async () => {
    const { data, error } = await supabase.from('docentes').select('*').order('id');
    if (!error) setData(data);
    else toast.error('Error al cargar docentes');
  };

  useEffect(() => {
    fetchData();
  }, []);

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
const handleObtener = () => {
    toast.info('Aquí se podría ejecutar una función personalizada de "obtener"');
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
            setSelectedDocente(row.original);
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
        <Button onClick={() => {
          setSelectedDocente(null);
          setModalOpen(true);
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Agregar
        </Button>
        <Button variant="outline" onClick={handleObtener}>
            <Download className="mr-2 h-4 w-4" /> Obtener
          </Button>
      </div>

      <Input
        placeholder="Buscar por nombre o DNI"
        value={globalFilter ?? ''}
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

      <EditDocenteModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSave}
        docente={selectedDocente}
      />
    </div>
  );
}
