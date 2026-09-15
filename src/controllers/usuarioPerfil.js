const usuarioModel = require("../models/usuarioModel");

const perfil = async (req, res) => {
  try {
    const usuario = await usuarioModel.obtenerPorId(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.status(200).json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol
    });
  } catch (error) {
    console.error("[ERROR]:", error);
    return res.status(500).json({ error: "Error en servidor" });
  }
};

module.exports = { perfil };