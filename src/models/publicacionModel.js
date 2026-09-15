const pool = require('../db');

const obtenerTodas = async ({ search = '', limit = 10, offset = 0 }) => {
    let query = `
        SELECT id, titulo, contenido, autor_id
        FROM publicaciones
    `;

    const values = [];

    if (search) {
        query += ` WHERE titulo ILIKE $1 OR contenido ILIKE $1 `;
        values.push(`%${search}%`);
    }

    query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2} `;
    values.push(Number(limit), Number(offset));

    const { rows } = await pool.query(query, values);
    return rows;
};

module.exports = { obtenerTodas };