const pool = require('../config/db');

const obtenerTodas = async (search, limit, offset) => {
    //consulta base
    let query = `SELECT * FROM publicaciones`;
    const values = [];

    //concatenar busqueda si existe
    if (search) {
        query += ` WHERE titulo ILIKE $1`;
        values.push(`%${search}%`);
    }

    //concatenar paginacion
    query += ` LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);

    //ejecutar consulta segura
    const { rows } = await pool.query(query, values);
    return rows;
};

const listarPublicaciones = async (req, res) => {
    try {
        const search = req.query.search || '';
        const limit = Number(req.query.limit) || 10;
        const offset = Number(req.query.offset) || 0;

        const publicaciones = await obtenerTodas(search, limit, offset);
        res.status(200).json(publicaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = { obtenerTodas, listarPublicaciones };