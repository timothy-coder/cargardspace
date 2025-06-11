'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import InvestigacionesTable from '@/components/InvestigacionesTable';
import InvestigacionModal from '@/components/InvestigacionModal';
import { Button } from '@/components/ui/button';

export default function InvestigacionesPage() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('investigaciones')
      .select('*');
    if (!error) setData(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manejo de Investigaciones</h1>
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>Agregar</Button>
          <Button variant="outline" onClick={() => alert('Obtener clicked')}>
            Obtener
          </Button>
        </div>
      </div>

      <InvestigacionesTable data={data} onEdit={setSelected} onOpen={setOpen} />

      <InvestigacionModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelected(null);
        }}
        data={selected}
        refresh={fetchData}
      />
    </div>
  );
}
