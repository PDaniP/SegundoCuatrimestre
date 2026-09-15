const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const usuarioModel = require('../models/usuarioModel');


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Buscar el usuario en la BD
        const usuario = await usuarioModel.obtenerPorEmail(email);

        // 2. Si no existe, cortamos el flujo
        if (!usuario) {
            return res.status(401).json({
                error: 'Credenciales invalidas.'
            });
        }

        // 3. Comparar password plana vs hash BD
        const passValida = await bcrypt.compare(
            password,            //Lo que mando hoy
            usuario.password     //Lo que esta en postgresSQL
        );

        // 4. Si fallo la comparacion, rechazar
        if (!passValida) {
            return res.status(401).json({
                error: 'Credenciales invalidas.'
            });
        }

        // 5. El "Payload": Datos utiles
        // IMPORTANTE: NUNCA poner contraseña aca
        const payload = {
            id: usuario.id,
            rol: usuario.rol
        };

        // 6. Firmar el Token usando el .env
        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '2h' }  // Caduca en 2 hs
        );

        // 7. Responder 200 OK y entregar el token
        res.status(200).json({ token });

    } catch (error) {
        // ... manejo de catch generico
        console.error("[ERROR]:", error);
        res.status(500).json({ error: "Error en servidor" });
    }

}

module.exports = { login };