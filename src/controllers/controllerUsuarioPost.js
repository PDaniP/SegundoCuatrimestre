const usuarioPost = require("../models/usuarioPost");

//para publicar
const publicar = async (req, res) => {
    try {
        const { titulo, contenido } = req.body;

        if (!titulo || !contenido) {
            return res.status(400).json({
                error: "El titulo y el contenido son obligatorios"
            });
        }

        const publicacion = await usuarioPost.crearPost(
            titulo,
            contenido,
            req.usuario.id
        );

        return res.status(201).json(publicacion);
    } catch (error) {
        console.error("[ERROR:", error);
        return res.status(500).json({
            error: "Error al crear la publicacion"
        });
    }
};

//para eliminar publicacion
const eliminarPublicacion = async (req, res) => {
    try {
        const { id } = req.params;

        //1- buscamos la publicacion en la BD
        const post = await usuarioPost.obtenerPublicacionPorId(id);

        if (!post) {
            return res.status(404).json({ error: "Publicacion no encontrada" });
        }

        //2- comparamos el dueño con el usuario actual
        if (Number(post.autor_id) !== Number(req.usuario.id)) {
            return res.status(403).json({
                error: "Prohibido, no sos el autor de la publicacion"
            });
        }

        //3- solo si es el autor se elimina
        await usuarioPost.eliminarPostPorId(id);

        return res.status(200).json({
            mensaje: "Publicacion eliminada"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Error al eliminar la publicacion"});
    }  
};

//para editar publicacion
const editarPublicacion = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, contenido } = req.body;

        const post = await usuarioPost.obtenerPublicacionPorId(id);

        if (!post) {
            return res.status(404).json({ error: "publicacion no encontrada"});
        }

        if (Number(post.autor_id) !== Number(req.usuario.id)) {
            return res.status(403).json({
                error: "prohibido, no tener permiso para modificar la publicacion"
            });
        }

        const publicacionEditada = await usuarioPost.actualizarPostPorId(id, {
            titulo,
            contenido
        });

        return res.status(200).json(publicacionEditada);

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "error al editar la publicacion"})
    }  
};


module.exports = { publicar, eliminarPublicacion, editarPublicacion }