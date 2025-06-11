'use client';
import { generateOficio } from '@/lib/generateOficio';
import { useMemo } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useReactTable, getCoreRowModel, getFilteredRowModel, flexRender } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function InvestigacionesTable({ data, onEdit, onOpen }) {
  const handleImprimir = async (investigacion) => {
  const autoridadId = investigacion.autoridad_id;

  const { data: autoridad } = await supabase
    .from('autoridades')
    .select('grado, nombreapellidodecano, denominacion')
    .eq('id', autoridadId)
    .single();

  if (autoridad) {
    const { generateOficio } = await import('@/lib/generateOficio');
    generateOficio(investigacion, autoridad);
  } else {
    alert('No se encontró la autoridad correspondiente');
  }
};


  const columns = useMemo(() => [
    { accessorKey: 'codigo', header: 'Código' },
    { accessorKey: 'titulo', header: 'Título' },
    { accessorKey: 'autor', header: 'Autor' },
    { accessorKey: 'dni_autor', header: 'DNI Autor' },
    { accessorKey: 'autor2', header: 'Autor 2' },
    { accessorKey: 'dni_autor2', header: 'DNI Autor 2' },
    { accessorKey: 'fechasustentacion', header: 'Fecha Sustentación' },
    { accessorKey: 'titulo_grado', header: 'Título Grado' },
    { accessorKey: 'denominacion', header: 'Denominación' },
    { accessorKey: 'tipo', header: 'Tipo' },
    { accessorKey: 'porcentaje_similitud_oti', header: '% OTI' },
    { accessorKey: 'porcentaje_similitud_asesor', header: '% Asesor' },
    { accessorKey: 'jurado_1', header: 'Jurado 1' },
    { accessorKey: 'jurado_2', header: 'Jurado 2' },
    { accessorKey: 'jurado_3', header: 'Jurado 3' },
    { accessorKey: 'numero_oficio_referencia', header: 'Oficio Referencia' },
    { accessorKey: 'autorizacion', header: 'Autorización' },
    { accessorKey: 'denominacion_si_no', header: 'Denominación?', cell: ({ getValue }) => getValue() ? '✅' : '❌' },
    { accessorKey: 'titulo_si_no', header: 'Título?', cell: ({ getValue }) => getValue() ? '✅' : '❌' },
    { accessorKey: 'tipo_tesis_si_no', header: 'Tipo Tesis?', cell: ({ getValue }) => getValue() ? '✅' : '❌' },
    { accessorKey: 'porcentaje_reporte_tesis_si_no', header: '% Reporte Tesis' },
    { accessorKey: 'observaciones', header: 'Observaciones' },
    { accessorKey: 'urllink', header: 'URL Link' },
    { accessorKey: 'numero_oficio', header: 'Número Oficio' },
    { accessorKey: 'palabrasclave', header: 'Palabras Clave' },
    { accessorKey: 'estado', header: 'Estado' },
    {
  id: 'acciones',
  header: 'Opciones',
  cell: ({ row }) => (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={() => onEdit(row.original) || onOpen(true)}>
        Editar
      </Button>
      <Button size="sm" variant="outline" onClick={() => handleImprimir(row.original)}>
        Imprimir
      </Button>
    </div>
  )
},

  ], []);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { globalFilter: '' },
  });

  return (
    <div className="overflow-x-auto">
      <div className="mb-2">
        <Input
          placeholder="Filtrar..."
          value={table.getState().globalFilter ?? ''}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
        />
      </div>
      <table className="min-w-full text-sm border">
        <thead className="bg-gray-100">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-2 border text-left">
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
                <td key={cell.id} className="p-2 border">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
