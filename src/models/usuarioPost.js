const pool = require("../config/db")

const crearPost = async (titulo, contenido, autor_id) => {
    const query = `INSERT INTO publicaciones
    (titulo, contenido, autor_id)
    VALUES ($1, $2, $3)
    RETURNING *`;

    const { rows } = await pool.query(query, [
        titulo,
        contenido,
        autor_id
    ]);

    return rows[0];
};

const obtenerPublicacionPorId = async (id) => {
    const query = `
        SELECT *
        FROM publicaciones
        WHERE id = $1    
    `;

    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

const eliminarPostPorId = async (id) => {
    const query = `
        DELETE FROM publicaciones
        WHERE id = $1
        RETURNING *
    `;

    const { rows } = await pool.query(query, [id]);
    return rows[0];
};

const actualizarPostPorId = async (id, { titulo, contenido }) => {
    const query = `
        UPDATE publicaciones
        SET titulo = $1,
            contenido = $2
        WHERE id = $3
        RETURNING *
    `;

    const { rows } = await pool.query(query, [titulo, contenido, id]);
    return rows[0];
};

module.exports = { crearPost, obtenerPublicacionPorId, eliminarPostPorId, actualizarPostPorId };