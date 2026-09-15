const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

//Test de conexion
/*
pool.query('SELECT 1 + 1 AS solucion')
    .then(({ rows }) => {
        console.log('DB conectada. Test query.', rows[0].solucion);
    })
    .catch(err => {
        console.error('Error al conectar a db.', err);
    });
*/


module.exports = pool;

