const { obtenerTodas } = require('../models/publicacionesModel');

const listarPublicaciones = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
        const offset = (page - 1) * limit;

        const publicaciones = await obtenerTodas({
            search: req.query.search || '',
            limit,
            offset
        });

        res.status(200).json(publicaciones);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'error interno del servidor' });
    }
};

module.exports = { listarPublicaciones };