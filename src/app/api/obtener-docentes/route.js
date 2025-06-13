import { NextResponse } from 'next/server';
import { getDatabaseConnection } from '@/lib/dbClient';  // Importa la función para obtener la conexión a la base de datos

export async function GET() {
  const connection = getDatabaseConnection();  // Obtén la conexión de la base de datos

  try {
    console.log('Conectando a la base de datos...');
    await connection.connect(); // Establece la conexión

    const query = 'select au.Dni,au.`Name`,au.MaternalSurname,au.PaternalSurname FROM generals_teachers gt JOIN aspnetusers au ON gt.UserId=au.Id';  // Define tu consulta SQL
    const [rows] = await connection.promise().query(query);  // Ejecuta la consulta

    console.log('Facultades obtenidas:', rows);  // Muestra en consola los resultados obtenidos

    await connection.end();  // Cierra la conexión

    // Devuelve los datos obtenidos como JSON
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error al obtener datos de MySQL:', error);
    return NextResponse.json({ error: 'Error en la conexión a la base de datos' }, { status: 500 });
  }
}
