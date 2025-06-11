'use client';

import { useEffect, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import EditUserModal from '@/components/EditUserModal';
import { supabase } from '@/lib/supabaseClient';

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsuarios = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, nombre, apellido, is_active');

    if (!error) setUsuarios(data);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleOpenEdit = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleSave = async (form) => {
    const { id, nombre, apellido, is_active, password } = form;

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ nombre, apellido, is_active })
      .eq('id', id);

    if (updateError) {
      toast.error('Error al actualizar usuario');
      return;
    }

    if (password) {
      const { error: passError } = await supabase.auth.admin.updateUserById(id, {
        password,
      });

      if (passError) {
        toast.error('Error al cambiar contraseña');
        return;
      }
    }

    toast.success('Usuario actualizado');
    fetchUsuarios();
  };

  const columns = [
    {
      accessorKey: 'nombre',
      header: 'Nombre',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'apellido',
      header: 'Apellido',
      cell: (info) => info.getValue(),
    },
    {
      accessorKey: 'is_active',
      header: 'Activo',
      cell: (info) => (info.getValue() ? '✅' : '❌'),
    },
    {
      id: 'acciones',
      header: 'Acciones',
      cell: ({ row }) => (
        <Button size="sm" onClick={() => handleOpenEdit(row.original)}>
          Editar
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: usuarios,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return String(value).toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manejo de Usuarios</h1>

      <Input
        placeholder="Buscar por nombre o apellido..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="max-w-md mb-4"
      />

      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {hg.headers.map((header) => (
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

      <EditUserModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectedUser}
        onSave={handleSave}
      />
    </div>
  );
}
