require('dotenv').config();
const express = require('express');
const cors = require('cors');

//Ejecuto test de conexión a la base de datos
require('./src/config/db');

const app = express();
app.use(cors());
app.use(express.json())

//Todo lo que empiece con '/api/usuarios' va a nuestras rutas.
app.use(
    '/api/usuarios',
    require('./src/routes/usuarioRoutes')
);


const PORT = process.env.PORT || 3000;

app.listen (PORT, () => {
    console.log(`Servidor en puerto ${PORT}`);
});