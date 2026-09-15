# API de usuarios y publicaciones

Esta aplicación es una API REST desarrollada con Node.js y Express que permite registrar usuarios, iniciar sesión, autenticar peticiones con JWT y gestionar publicaciones asociadas a cada usuario.

## ¿Qué hace la aplicación?

La aplicación se encarga de:

- Registrar nuevos usuarios.
- Validar la contraseña antes de guardar datos.
- Verificar credenciales de login.
- Generar y validar tokens JWT para proteger rutas privadas.
- Consultar el perfil del usuario autenticado.
- Crear, listar, editar y eliminar publicaciones.
- Conectarse a una base de datos PostgreSQL.

## Arquitectura general

El proyecto está organizado en distintas carpetas:

- `index.js`: arranca el servidor y monta las rutas principales.
- `src/config/db.js`: configura la conexión con PostgreSQL.
- `src/routes/usuarioRoutes.js`: define los endpoints disponibles.
- `src/controllers/`: contiene la lógica de cada operación.
- `src/models/`: encapsula las consultas SQL.
- `src/middlewares/`: incluye validaciones y protección por token.
- `src/tests/`: pruebas automatizadas de validadores.

## Inicio del servidor

La app se inicia con:

```bash
npm start
```

Esto ejecuta el archivo `index.js`, que levanta el servidor Express en el puerto configurado por la variable `PORT` o, si no existe, en el puerto `3000`.

## Flujo de funcionamiento

### 1. Registro de usuario

La ruta:

```http
POST /api/usuarios/registro
```

Recibe en el body algo como:

```json
{
  "nombre": "Pablo",
  "email": "Pablo@mail.com",
  "password": "Clave123"
}
```

Antes de guardar el usuario, se valida la contraseña con una expresión regular. La contraseña debe cumplir:

- mínimo 8 caracteres
- al menos una mayúscula
- al menos un número

Si es válida, la contraseña se hashea con `bcrypt` y se guarda en la base de datos, junto con el nombre y el email.

### 2. Login

La ruta:

```http
POST /api/usuarios/login
```

Recibe:

```json
{
  "email": "Pablo@mail.com",
  "password": "Clave123"
}
```

La aplicación busca al usuario por email. Si existe, compara la contraseña ingresada con el hash almacenado usando `bcrypt.compare()`. Si coincide, genera un token JWT con la información del usuario (`id` y `rol`) y lo devuelve al cliente.

Este token se usa luego para acceder a rutas protegidas.

### 3. Protección de rutas con JWT

La aplicación define un middleware llamado `validarToken`, que se aplica a todas las rutas que vienen después del login.

Cuando se hace una solicitud a una ruta protegida, el cliente debe enviar el encabezado:

```http
Authorization: Bearer <token>
```

El middleware:

- verifica que exista el token
- valida que el formato sea correcto
- comprueba que el token no haya expirado ni haya sido alterado
- agrega los datos del usuario a `req.usuario`
- permite continuar con el controlador correspondiente

Si el token falla, responde con un error `401`.

## Endpoints principales

### Rutas públicas

#### Registro
```http
POST /api/usuarios/registro
```
Crea un nuevo usuario.

#### Login
```http
POST /api/usuarios/login
```
Devuelve un JWT si las credenciales son correctas.

### Rutas protegidas

#### Perfil del usuario
```http
GET /api/usuarios/perfil
```
Devuelve los datos del usuario autenticado según el ID extraído del token.

#### Listar publicaciones
```http
GET /api/usuarios/publicaciones?search=texto&limit=10&offset=0
```
Permite buscar publicaciones por título y paginar resultados. La búsqueda es dinámica y usa filtros SQL seguros.

#### Crear publicación
```http
POST /api/usuarios/publicar
```
Recibe:

```json
{
  "titulo": "Mi primer post",
  "contenido": "Contenido de la publicación"
}
```

Asocia la publicación con el usuario autenticado mediante `req.usuario.id`.

#### Editar publicación
```http
PUT /api/usuarios/publicaciones/:id
```
Actualiza una publicación solo si el usuario autenticado es el autor original.

#### Eliminar publicación
```http
DELETE /api/usuarios/publicaciones/:id
```
Elimina una publicación solo si pertenece al usuario autenticado.

## Base de datos

La conexión se realiza con PostgreSQL a través del módulo `pg`.

La configuración de conexión se encuentra en:

```js
src/config/db.js
```

Se leen variables de entorno como:

- `DB_USER`
- `DB_HOST`
- `DB_PORT`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET`

Estas variables deben estar definidas en un archivo `.env` para que el sistema funcione correctamente.

## Seguridad aplicada en la app

La aplicación utiliza varias medidas de seguridad básicas:

- `bcrypt` para guardar contraseñas hasheadas.
- validación de contraseña antes del registro.
- JWT para autenticar peticiones privadas.
- comprobación de permisos del autor antes de editar o eliminar publicaciones.
- uso de consultas parametrizadas con `$1`, `$2`, etc. para evitar SQL injection.

## Resumen del funcionamiento

En resumen, la aplicación funciona así:

1. El cliente se registra o inicia sesión.
2. El servidor valida los datos y, si son correctos, genera un JWT.
3. El cliente guarda el token y lo envía en cada petición privada.
4. El middleware analiza la autorización y permite o bloquea el acceso.
5. El usuario puede consultar su perfil y gestionar sus publicaciones.
6. Todas las operaciones se persisten en PostgreSQL.

## Pruebas con Jest

Este proyecto incluye pruebas automáticas con Jest para validar reglas y comportamientos principales, especialmente la lógica de validación.

### Comando para ejecutar las pruebas

Desde la raíz del proyecto, ejecuta:

```bash
npm test
```

Este comando busca todos los archivos de prueba que termine en `.test.js` y los ejecuta con Jest.

### ¿Qué se prueba?

Las pruebas sirven para verificar que:

- la validación de contraseñas funciona correctamente
- se aceptan datos válidos
- se rechazan datos inválidos
- la lógica de negocio se comporta como se espera

Si querés correr una prueba específica, podés hacer algo como:

```bash
npx jest src/tests/validadores.test.js
```

Esto permite ejecutar únicamente un archivo de test concreto, útil cuando estás corrigiendo o desarrollando una funcionalidad en particular.

## Tecnologías usadas

- Node.js
- Express
- PostgreSQL
- JWT
- bcrypt
- dotenv
- Jest (para pruebas)

Este proyecto sirve como ejemplo de una API REST con autenticación, validaciones y operaciones CRUD sobre datos de usuarios y publicaciones.
