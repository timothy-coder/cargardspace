'use client';

import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function ExcelPage() {
  const [filesData, setFilesData] = useState([]); // Para almacenar los datos de múltiples archivos cargados
  const [validatedDnis, setValidatedDnis] = useState({}); // Para almacenar el estado de validación de los DNIs

  // Función para leer los archivos y extraer los datos
  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      const allData = [];

      // Procesamos cada archivo cargado
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = async (event) => {
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

          // Verificar los DNIs con la API
          const dniAutor1IsValid = await checkDniValid(extractedData.dniAutor1);
          const dniAutor2IsValid = await checkDniValid(extractedData.dniAutor2);
          const dniAsesorIsValid = await checkDniValid(extractedData.dniAsesor);

          // Guardamos los datos extraídos con la validación de los DNIs
          allData.push({
            ...extractedData,
            dniAutor1IsValid,
            dniAutor2IsValid,
            dniAsesorIsValid,
          });

          // Al finalizar la carga de todos los archivos, actualizar el estado
          if (allData.length === files.length) {
            setFilesData(allData);
          }
        };
        reader.readAsBinaryString(file);
      });
    }
  };

  // Función para verificar si el DNI existe en la API
  const checkDniValid = async (dni) => {
    if (!dni) return false;

    try {
      const response = await fetch(`/api/obtener-alumnos?dni=${dni}`);
      const data = await response.json();

      return data?.length > 0; // Si encontramos resultados, el DNI es válido
    } catch (error) {
      toast.error('Error al verificar el DNI');
      return false;
    }
  };

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (e, fileIndex) => {
    const { name, value } = e.target;
    setFilesData((prev) => {
      const updatedData = [...prev];
      updatedData[fileIndex] = { ...updatedData[fileIndex], [name]: value };
      return updatedData;
    });
  };

  // Función para guardar los cambios (esto depende de cómo quieras guardarlo, en este caso usaremos un toast para mostrar que se guardó)
  const handleSave = async (fileIndex) => {
    // Aquí guardas la información donde necesites, por ejemplo, en Supabase.
    // Este ejemplo solo muestra el toast, pero debes agregar tu lógica de guardado.

    // Eliminar los datos guardados del archivo actual
    const newFilesData = [...filesData];
    newFilesData.splice(fileIndex, 1); // Elimina el archivo actual

    setFilesData(newFilesData); // Actualiza el estado con los archivos restantes
    toast.success('Datos guardados correctamente');
    console.log('Datos guardados:', filesData);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Carga de Excel</h1>
      <p>Importa archivos .xlsx con datos de investigación.</p>

      {/* Input para cargar múltiples archivos */}
      <Input
        type="file"
        accept=".xlsx"
        multiple
        onChange={handleFileChange}
        className="mb-4"
      />

      {filesData.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-4">Datos Cargados:</h2>
          {/* Mostrar los datos cargados para cada archivo */}
          {filesData.map((fileData, index) => (
            <div key={index} className="space-y-4 mb-6">
              <h3 className="font-semibold">Archivo {index + 1}</h3>
              <div className="space-y-4">
                {/* Campos con badge Verified */}
                <div className="flex justify-between">
                  <Input
                    name="titulo"
                    label="Título"
                    value={fileData.titulo}
                    onChange={(e) => handleChange(e, index)}
                    className="w-full"
                  />
                  <span className="badge">{fileData.dniAutor1IsValid ? 'Verified' : 'Not Verified'}</span>
                </div>
                {/* Repetir para otros campos */}
                <Input
                  name="dniAutor1"
                  label="DNI Autor 1"
                  value={fileData.dniAutor1}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full"
                />
                <Input
                  name="dniAutor2"
                  label="DNI Autor 2"
                  value={fileData.dniAutor2}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full"
                />
                <Input
                  name="dniAsesor"
                  label="DNI Asesor"
                  value={fileData.dniAsesor}
                  onChange={(e) => handleChange(e, index)}
                  className="w-full"
                />
                <Input
                name="nombreGrado"
                label="Nombre del Grado"
                value={fileData.nombreGrado}
                onChange={(e) => handleChange(e, index)}
                className="w-full"
              />
              <Input
                name="facultad"
                label="Facultad"
                value={fileData.facultad}
                onChange={(e) => handleChange(e, index)}
                className="w-full"
              />
              <Input
                name="tipoTrabajo"
                label="Tipo de Trabajo"
                value={fileData.tipoTrabajo}
                onChange={(e) => handleChange(e, index)}
                className="w-full"
              />
              <Input
                name="jurado1"
                label="Jurado 1"
                value={fileData.jurado1}
                onChange={(e) => handleChange(e, index)}
                className="w-full"
              />
              <Input
                name="jurado2"
                label="Jurado 2"
                value={fileData.jurado2}
                onChange={(e) => handleChange(e, index)}
                className="w-full"
              />
              <Input
                name="jurado3"
                label="Jurado 3"
                value={fileData.jurado3}
                onChange={(e) => handleChange(e, index)}
                className="w-full"
              />
              <Input
                name="gradoAcademico"
                label="Grado Académico"
                value={fileData.gradoAcademico}
                onChange={(e) => handleChange(e, index)}
                className="w-full"
              />
              <Input
                name="palabrasClave"
                label="Palabras Clave"
                value={fileData.palabrasClave}
                onChange={(e) => handleChange(e, index)}
                className="w-full"
              />

              </div>

              <Button onClick={() => handleSave(index)}>Guardar</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
