const bcrypt = require("bcrypt");
const usuarioModel = require("../models/usuarioModel");

const registrar = async (req, res) => {
  try {
    //1. Extraemos los datos del usuario (body)
    const { nombre, email, password } = req.body;

    //2. Costo del algoritmo (saltRounds)
    const saltRounds = 10;

    //3.Aplicamos el Hash (esperamos el proceso)
    const passwordHasheada = await bcrypt.hash(password, saltRounds);

    //4. Llamamos al modelo
    await usuarioModel.crearUsuario(nombre, email, passwordHasheada);

    //5. Respondmos HTTP 201 (Created)
    res.status(201).json({ message: "Usuario registrado" });
  } catch (error) {
    //6. Menejo de Errores
    console.error("[ERROR]:", error);
    res.status(500).json({ error: "Error en servidor" });
  }
};

module.exports = { registrar };
