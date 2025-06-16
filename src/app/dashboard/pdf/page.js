'use client';

import { useState } from 'react';
import * as PDFLib from 'pdf-lib'; // Librería para manejar PDFs
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';

export default function PdfPage() {
  const [formData, setFormData] = useState({
    titulo: '',
    dniAutor1: '',
    dniAutor2: '',
    dniAsesor: '',
    nombreGrado: '',
    facultad: '',
    tipoTrabajo: '',
    jurado1: '',
    jurado2: '',
    jurado3: '',
    gradoAcademico: '',
    palabrasClave: '',
  });

  // Función para leer el archivo PDF y extraer datos
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = event.target.result;
        const pdfDoc = await PDFLib.PDFDocument.load(data);
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];

        // Extraer texto de la primera página
        const text = firstPage.getTextContent();

        // Extraemos la información relevante (esto es solo un ejemplo de cómo puedes hacerlo)
        const titulo = extractData(text, 'Título:');
        const dniAutor1 = extractData(text, 'DNI del autor 1:');
        const dniAutor2 = extractData(text, 'DNI del autor 2:');
        const dniAsesor = extractData(text, 'DNI del asesor:');
        const nombreGrado = extractData(text, 'Grado a obtener (Autor 1):');
        const facultad = extractData(text, 'Facultad o Unidad de Posgrado:');
        const tipoTrabajo = extractData(text, 'Tipo de trabajo de investigación:');
        const jurado1 = extractData(text, 'Jurado 1:');
        const jurado2 = extractData(text, 'Jurado 2:');
        const jurado3 = extractData(text, 'Jurado 3:');
        const gradoAcademico = extractData(text, 'Grado a obtener (Autor 1):');
        const palabrasClave = extractData(text, 'Temas (palabras claves):');

        // Establecer los datos extraídos
        setFormData({
          titulo,
          dniAutor1,
          dniAutor2,
          dniAsesor,
          nombreGrado,
          facultad,
          tipoTrabajo,
          jurado1,
          jurado2,
          jurado3,
          gradoAcademico,
          palabrasClave,
        });
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Función para extraer datos del texto del PDF
  const extractData = (text, label) => {
    const regex = new RegExp(`${label}\\s*([\\w\\s\\d,]+)`);
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Función para guardar los datos
  const handleSave = async () => {
    // Aquí puedes guardar los datos en Supabase o en cualquier otro lugar.
    toast.success('Datos guardados correctamente');
    console.log('Datos guardados:', formData);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Cargar Archivo PDF</h1>
      <p>Importa archivos .pdf con datos de investigación.</p>

      {/* Input para cargar el archivo PDF */}
      <Input
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        className="mb-4"
      />

      {/* Mostrar los datos extraídos en un formulario editable */}
      <div className="mt-6 space-y-4">
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

      <Button onClick={handleSave}>Guardar</Button>
    </div>
  );
}
