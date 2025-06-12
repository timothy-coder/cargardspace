import { NextResponse } from 'next/server';
import mysql from 'mysql2';

// Configura la conexión a MySQL
const connection = mysql.createConnection({
  host: '119.8.144.226',       // IP de la base de datos externa
  user: 'us_oti',              // Usuario de la base de datos
  password: 'm16A*6EH?#Cv1Ftq', // Contraseña de la base de datos
  database: 'uncp.sigau.db',   // Nombre de la base de datos
});

// Función GET para obtener las facultades
export async function GET() {
  return new Promise((resolve, reject) => {
    // Realizar la consulta MySQL
    connection.query('SELECT EF.Name FROM enrollment_faculties EF', (err, rows) => {
      if (err) {
        console.error('Error al obtener datos de MySQL:', err);
        reject(new NextResponse('Error al obtener datos de MySQL', { status: 500 }));
      }

      // Mostrar en consola el tipo de los datos
      console.log('Tipo de los datos:', typeof rows); // Muestra el tipo de los datos (debe ser un array)
      console.log('Datos obtenidos:', rows);          // Muestra los datos reales

      // Verificamos si los datos son un array
      if (Array.isArray(rows)) {
        console.log('Es un array:', rows);
      } else {
        console.log('No es un array');
      }

      // Responder con los datos obtenidos
      resolve(NextResponse.json(rows));
    });
  });
}
