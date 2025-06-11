'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function InvestigacionModal({ open, onClose, data, refresh }) {
  const initialState = {
    codigo: '',
    titulo: '',
    autor: '',
    dni_autor: '',
    autor2: '',
    dni_autor2: '',
    fechasustentacion: '',
    titulo_grado: '',
    denominacion: '',
    tipo: '',
    porcentaje_similitud_oti: '',
    porcentaje_similitud_asesor: '',
    jurado_1: '',
    jurado_2: '',
    jurado_3: '',
    numero_oficio_referencia: '',
    autorizacion: '',
    denominacion_si_no: false,
    titulo_si_no: false,
    tipo_tesis_si_no: false,
    porcentaje_reporte_tesis_si_no: '',
    observaciones: '',
    urllink: '',
    numero_oficio: '',
    palabrasclave: '',
    estado: '',
    ocde_id: '',
    orcid_id: '',
    autoridad_id: '',
  };

  const [form, setForm] = useState(initialState);
  const [ocdeOptions, setOcdeOptions] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [autoridades, setAutoridades] = useState([]);

  useEffect(() => {
    setForm(data ? { ...initialState, ...data } : initialState);
  }, [data]);

  useEffect(() => {
    supabase.from('ocde').select('id, ocde').then(({ data }) => setOcdeOptions(data || []));
    supabase.from('docentes').select('id, nombreapellido').then(({ data }) => setDocentes(data || []));
    supabase.from('autoridades').select('id, nombre').then(({ data }) => setAutoridades(data || []));
  }, []);

  useEffect(() => {
    const generarCodigo = () => {
      const tipo = form.titulo_grado === 'titulo' ? 'T' : form.titulo_grado === 'maestria' ? 'M' : form.titulo_grado === 'segunda especialidad' ? 'S' : '';
      if (!form.dni_autor) return;
      if (form.dni_autor2) {
        return `T010_${form.dni_autor}_${tipo} - T010_${form.dni_autor2}_${tipo}`;
      }
      return `T010_${form.dni_autor}_${tipo}`;
    };
    const nuevoCodigo = generarCodigo();
    if (nuevoCodigo) {
      setForm((prev) => ({ ...prev, codigo: nuevoCodigo }));
    }
  }, [form.dni_autor, form.dni_autor2, form.titulo_grado]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitch = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const payload = { ...form };
    for (const key in payload) {
      if (payload[key] === '') payload[key] = null;
    }

    if (data?.id) {
      await supabase.from('investigaciones').update(payload).eq('id', data.id);
    } else {
      await supabase.from('investigaciones').insert(payload);
    }

    refresh();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-scroll">
        <DialogHeader>
          <DialogTitle>{data ? 'Editar Investigación' : 'Nueva Investigación'}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <Input name="codigo" value={form.codigo} disabled />
          <Input name="titulo" placeholder="Título" value={form.titulo} onChange={handleChange} />
          <Input name="autor" placeholder="Autor" value={form.autor} onChange={handleChange} />
          <Input name="dni_autor" placeholder="DNI Autor" value={form.dni_autor} onChange={handleChange} />
          <Input name="autor2" placeholder="Autor 2" value={form.autor2} onChange={handleChange} />
          <Input name="dni_autor2" placeholder="DNI Autor 2" value={form.dni_autor2} onChange={handleChange} />
          <Input type="date" name="fechasustentacion" value={form.fechasustentacion || ''} onChange={handleChange} />

          <Select value={form.titulo_grado} onValueChange={(val) => setForm((p) => ({ ...p, titulo_grado: val }))}>
            <SelectTrigger><SelectValue placeholder="Título de Grado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="titulo">Título</SelectItem>
              <SelectItem value="maestria">Maestría</SelectItem>
              <SelectItem value="segunda especialidad">Segunda Especialidad</SelectItem>
            </SelectContent>
          </Select>

          <Input name="denominacion" placeholder="Denominación" value={form.denominacion} onChange={handleChange} />
          <Input name="tipo" placeholder="Tipo" value={form.tipo} onChange={handleChange} />
          <Input type="number" name="porcentaje_similitud_oti" placeholder="% Similitud OTI" value={form.porcentaje_similitud_oti || ''} onChange={handleChange} />
          <Input type="number" name="porcentaje_similitud_asesor" placeholder="% Similitud Asesor" value={form.porcentaje_similitud_asesor || ''} onChange={handleChange} />

          {['jurado_1', 'jurado_2', 'jurado_3'].map((jurado) => (
            <Select key={jurado} value={form[jurado]} onValueChange={(val) => setForm((p) => ({ ...p, [jurado]: val }))}>
              <SelectTrigger><SelectValue placeholder={`Seleccionar ${jurado}`} /></SelectTrigger>
              <SelectContent>
                {docentes.map((d) => (
                  <SelectItem key={d.id} value={d.nombreapellido}>{d.nombreapellido}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}

          <Input name="numero_oficio_referencia" type="number" placeholder="Oficio de Referencia" value={form.numero_oficio_referencia || ''} onChange={handleChange} />

          <Select value={form.autorizacion} onValueChange={(val) => setForm((p) => ({ ...p, autorizacion: val }))}>
            <SelectTrigger><SelectValue placeholder="Autorización" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="abierta">Abierta</SelectItem>
              <SelectItem value="confidencial">Confidencial</SelectItem>
              <SelectItem value="restringido">Restringido</SelectItem>
            </SelectContent>
          </Select>

          {['denominacion_si_no', 'titulo_si_no', 'tipo_tesis_si_no'].map((field) => (
            <div key={field} className="flex items-center gap-3">
              <Label>{field.replace(/_/g, ' ')}</Label>
              <Switch checked={form[field]} onCheckedChange={(val) => handleSwitch(field, val)} />
            </div>
          ))}

          <Input type="number" name="porcentaje_reporte_tesis_si_no" placeholder="% Reporte Tesis" value={form.porcentaje_reporte_tesis_si_no || ''} onChange={handleChange} />
          <Textarea name="observaciones" placeholder="Observaciones" value={form.observaciones || ''} onChange={handleChange} />
          <Input name="urllink" placeholder="URL Link" value={form.urllink || ''} onChange={handleChange} />
          <Input name="numero_oficio" type="number" placeholder="Número de Oficio" value={form.numero_oficio || ''} onChange={handleChange} />
          <Input name="palabrasclave" placeholder="Palabras Clave" value={form.palabrasclave || ''} onChange={handleChange} />

          <Select value={form.estado} onValueChange={(val) => setForm((p) => ({ ...p, estado: val }))}>
            <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="enviado">Enviado</SelectItem>
              <SelectItem value="por enviar">Por Enviar</SelectItem>
              <SelectItem value="observado">Observado</SelectItem>
            </SelectContent>
          </Select>

          <select name="ocde_id" value={form.ocde_id || ''} onChange={handleChange} className="p-2 border rounded">
            <option value="">Seleccionar OCDE</option>
            {ocdeOptions.map((o) => (
              <option key={o.id} value={o.id}>{o.ocde}</option>
            ))}
          </select>

          <select name="orcid_id" value={form.orcid_id || ''} onChange={handleChange} className="p-2 border rounded">
            <option value="">Seleccionar Docente ORCID</option>
            {docentes.map((d) => (
              <option key={d.id} value={d.id}>{d.nombreapellido}</option>
            ))}
          </select>

          <select name="autoridad_id" value={form.autoridad_id || ''} onChange={handleChange} className="p-2 border rounded">
            <option value="">Seleccionar Autoridad</option>
            {autoridades.map((a) => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleSubmit}>Guardar</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
