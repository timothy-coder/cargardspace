'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ExcelPage() {
  const [fileData, setFileData] = useState(null); // Para guardar los datos del archivo cargado
  const [formData, setFormData] = useState({}); // Para guardar los datos editables del formulario

  // Función para leer el archivo y extraer los datos
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Leer el archivo Excel
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = event.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // Selecciona la primera hoja (index 0)
        const sheet = workbook.Sheets[workbook.SheetNames[0]];

        // Extrae los valores de las celdas que necesitas
        const extractedData = {
          titulo: sheet['C7']?.v || '',
          dniAutor1: sheet['C14']?.v || '',
          dniAutor2: sheet['C19']?.v || '',
          dniAsesor: sheet['C24']?.v || '',
          nombreGrado: sheet['C30']?.v || '',
          facultad: sheet['C38']?.v || '',
          tipoTrabajo: sheet['C42']?.v || '',
          jurado1: sheet['C45']?.v || '',
          jurado2: sheet['C46']?.v || '',
          jurado3: sheet['C47']?.v || '',
          gradoAcademico: sheet['C50']?.v || '',
          palabrasClave: sheet['C53']?.v || '',
        };

        // Establecer los datos extraídos en el estado
        setFileData(extractedData);
        // Inicializar el formulario editable con los datos
        setFormData(extractedData);
      };
      reader.readAsBinaryString(file);
    }
  };

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Función para guardar los cambios (esto depende de cómo quieras guardarlo, en este caso usaremos un toast para mostrar que se guardó)
  const handleSave = async () => {
    // Aquí guardas la información donde necesites, por ejemplo, en Supabase.
    // Este ejemplo solo muestra el toast, pero debes agregar tu lógica de guardado.
    toast.success('Datos guardados correctamente');
    console.log('Datos guardados:', formData);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Carga de Excel</h1>
      <p>Importa archivos .xlsx con datos de investigación.</p>

      {/* Input para cargar el archivo */}
      <Input
        type="file"
        accept=".xlsx"
        onChange={handleFileChange}
        className="mb-4"
      />

      {fileData && (
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-4">Datos Cargados:</h2>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {/* Formulario editable con los valores cargados */}
            <Input
              name="titulo"
              label="Título"
              value={formData.titulo}
              onChange={handleChange}
              className="w-full"
            />
            <Input
              name="dniAutor1"
              label="DNI Autor 1"
              value={formData.dniAutor1}
              onChange={handleChange}
              className="w-full"
            />
            <Input
              name="dniAutor2"
              label="DNI Autor 2"
              value={formData.dniAutor2}
              onChange={handleChange}
              className="w-full"
            />
            <Input
              name="dniAsesor"
              label="DNI Asesor"
              value={formData.dniAsesor}
              onChange={handleChange}
              className="w-full"
            />
            <Input
              name="nombreGrado"
              label="Nombre del Grado"
              value={formData.nombreGrado}
              onChange={handleChange}
              className="w-full"
            />
            <Input
              name="facultad"
              label="Facultad"
              value={formData.facultad}
              onChange={handleChange}
              className="w-full"
            />
            <Input
              name="tipoTrabajo"
              label="Tipo de Trabajo"
              value={formData.tipoTrabajo}
              onChange={handleChange}
              className="w-full"
            />
            <Input
              name="jurado1"
              label="Jurado 1"
              value={formData.jurado1}
              onChange={handleChange}
              className="w-full"
            />
            <Input
              name="jurado2"
              label="Jurado 2"
              value={formData.jurado2}
              onChange={handleChange}
              className="w-full"
            />
            <Input
              name="jurado3"
              label="Jurado 3"
              value={formData.jurado3}
              onChange={handleChange}
              className="w-full"
            />
            <Input
              name="gradoAcademico"
              label="Grado Académico"
              value={formData.gradoAcademico}
              onChange={handleChange}
              className="w-full"
            />
            <Input
              name="palabrasClave"
              label="Palabras Clave"
              value={formData.palabrasClave}
              onChange={handleChange}
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button variant="outline" onClick={() => setFormData(fileData)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar</Button>
          </div>
        </div>
      )}
    </div>
  );
}
