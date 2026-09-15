//crear un middleware para validar el token de autenticacion

// importo JWT y la voy a usar principalmente mediante jwt.verify()
//que sirve para comporbar si un token es valido
const jwt = require("jsonwebtoken");


//creo el middleware con la estructura tipica de un middleware de Express
//donde:
//req ->informacion de la peticion
//res ->respuesta que podemos enviar
//next -> funcion que permite continuar con el siguiente middleware/controlador

const validarToken = (req, res, next) => {

    //obtenemos el token
    const authHeader = req.headers.authorization;

    //comprobamos si existe
    if (!authHeader) {
        return res.status(401).json({
            mensaje: "Token no proporcionado"
        });
    }
    //Separar Bearer del token
    //con split(" ") dividimos el texto usando el espacio
    //[
    //"Bearer",
    //"abc123"
    //]
    //con [1] obtenemos el segundo elemento del array que es el token
    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            mensaje: "Formato de token invalido"
        });
    }

    try {
        //verificamos el token
        //JWT verifica:
        //Que el token tenga un formato correcto.
        //Que no haya sido modificado.
        //Que haya sido firmado con nuestro JWT_SECRET.
        //Que no esté expirado.
        //Si todo está bien, devuelve el contenido que nosotros habíamos guardado dentro del JWT.
        const usuario = jwt.verify(
            token,
            process.env.JWT_SECRET
        );
        //con la siguiente linea, agregamos y guardamos la info del usuario en la peticion
        //para que pueda ser usada en el controlador
        req.usuario = usuario;

        next(); //esto seria "el token es valido, continua con la siguiente parte de la peticion"

    } catch (error) {

        return res.status(401).json({
            mensaje: "Token invalido o expirado"
        });

    }
}

module.exports = validarToken;