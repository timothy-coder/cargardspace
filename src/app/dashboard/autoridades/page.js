'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AutoridadModal from '@/components/AutoridadModal';
import { Button } from '@/components/ui/button';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';

export default function AutoridadesPage() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({ facultad: '', grado: '' });

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('autoridades')
      .select('id, facultad, modelo_oficio, estado, grado, docenteid, docentes (nombreapellido)');
    if (!error) setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      accessorKey: 'facultad',
      header: 'Facultad',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'modelo_oficio',
      header: 'Modelo Oficio',
    },
    {
      accessorKey: 'grado',
      header: 'Grado',
    },
    {
      accessorKey: 'estado',
      header: 'Estado',
      cell: ({ getValue }) => (getValue() ? '✅' : '❌'),
    },
    {
      accessorKey: 'docentes.nombreapellido',
      header: 'Docente',
      cell: ({ row }) => row.original.docentes?.nombreapellido || 'Sin asignar',
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelected(row.original);
              setOpen(true);
            }}
          >
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              await supabase.from('autoridades').delete().eq('id', row.original.id);
              fetchData();
            }}
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter: `${filters.facultad} ${filters.grado}`,
    },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Manejo de Autoridades</h1>
        <Button onClick={() => { setSelected(null); setOpen(true); }}>Agregar nuevo</Button>
      </div>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Filtrar por facultad"
          value={filters.facultad}
          onChange={(e) => setFilters((f) => ({ ...f, facultad: e.target.value }))}
        />
        <Input
          placeholder="Filtrar por grado"
          value={filters.grado}
          onChange={(e) => setFilters((f) => ({ ...f, grado: e.target.value }))}
        />
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="text-left px-4 py-2">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AutoridadModal
        open={open}
        onClose={() => setOpen(false)}
        data={selected}
        refresh={fetchData}
      />
    </div>
  );
}
