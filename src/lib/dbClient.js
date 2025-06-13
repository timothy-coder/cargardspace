import mysql from 'mysql2';

// Configura la conexión a MySQL
export const getDatabaseConnection = () => {
  return mysql.createConnection({
    host: '119.8.144.226',       // IP de la base de datos externa
    user: 'us_oti',              // Usuario de la base de datos
    password: 'm16A*6EH?#Cv1Ftq', // Contraseña de la base de datos 
    database: 'uncp.sigau.db',   // Nombre de la base de datos
  });
};
