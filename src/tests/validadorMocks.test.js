const validarToken = require('../middlewares/validacion')

const {
  publicar,
  eliminarPublicacion,
  editarPublicacion,
} = require("../controllers/controllerUsuarioPost");

const usuarioPost = require("../models/usuarioPost");

jest.mock("../models/usuarioPost");

test('Debe bloquar si no hay Token', () => {

    const req = { headers: {} };
    const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
    };
    const next = jest.fn();

    validarToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();

})

describe("Suite: Publicaciones", () => {
  test("1. Crea una publicación cuando recibe titulo y contenido", async () => {
    const req = {
      body: { titulo: "Mi publicación", contenido: "Contenido de prueba" },
      usuario: { id: 1 },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    usuarioPost.crearPost.mockResolvedValue({
      id: 1,
      titulo: "Mi publicación",
      contenido: "Contenido de prueba",
      autor_id: 1,
    });

    await publicar(req, res);

    expect(usuarioPost.crearPost).toHaveBeenCalledWith(
      "Mi publicación",
      "Contenido de prueba",
      1
    );
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("2. Rechaza la creación si falta titulo o contenido", async () => {
    const req = {
      body: { titulo: "Mi publicación" },
      usuario: { id: 1 },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await publicar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "El titulo y el contenido son obligatorios",
    });
  });

  test("3. Edita una publicación cuando el usuario es el autor", async () => {
    const req = {
      params: { id: 10 },
      body: { titulo: "Nuevo titulo", contenido: "Nuevo contenido" },
      usuario: { id: 1 },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    usuarioPost.obtenerPublicacionPorId.mockResolvedValue({
      id: 10,
      titulo: "Viejo titulo",
      contenido: "Viejo contenido",
      autor_id: 1,
    });

    usuarioPost.actualizarPostPorId.mockResolvedValue({
      id: 10,
      titulo: "Nuevo titulo",
      contenido: "Nuevo contenido",
    });

    await editarPublicacion(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      id: 10,
      titulo: "Nuevo titulo",
      contenido: "Nuevo contenido",
    });
  });

  test("4. Rechaza la edición si el usuario no es el autor", async () => {
    const req = {
      params: { id: 10 },
      body: { titulo: "Nuevo titulo", contenido: "Nuevo contenido" },
      usuario: { id: 2 },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    usuarioPost.obtenerPublicacionPorId.mockResolvedValue({
      id: 10,
      titulo: "Viejo titulo",
      contenido: "Viejo contenido",
      autor_id: 1,
    });

    await editarPublicacion(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "prohibido, no tener permiso para modificar la publicacion",
    });
  });

  test("5. Elimina una publicación cuando el usuario es el autor", async () => {
    const req = {
      params: { id: 10 },
      usuario: { id: 1 },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    usuarioPost.obtenerPublicacionPorId.mockResolvedValue({
      id: 10,
      titulo: "Titulo",
      contenido: "Contenido",
      autor_id: 1,
    });

    usuarioPost.eliminarPostPorId.mockResolvedValue({
      id: 10,
      titulo: "Titulo",
      contenido: "Contenido",
    });

    await eliminarPublicacion(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      mensaje: "Publicacion eliminada",
    });
  });

  test("6. Rechaza la eliminación si el usuario no es el autor", async () => {
    const req = {
      params: { id: 10 },
      usuario: { id: 2 },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    usuarioPost.obtenerPublicacionPorId.mockResolvedValue({
      id: 10,
      titulo: "Titulo",
      contenido: "Contenido",
      autor_id: 1,
    });

    await eliminarPublicacion(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: "Prohibido, no sos el autor de la publicacion",
    });
  });

  test("7. Rechaza la edición si la publicación no existe", async () => {
    const req = {
      params: { id: 999 },
      body: { titulo: "Nuevo titulo", contenido: "Nuevo contenido" },
      usuario: { id: 1 },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    usuarioPost.obtenerPublicacionPorId.mockResolvedValue(null);

    await editarPublicacion(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "publicacion no encontrada",
    });
  });

  test("8. Rechaza la eliminación si la publicación no existe", async () => {
    const req = {
      params: { id: 999 },
      usuario: { id: 1 },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    usuarioPost.obtenerPublicacionPorId.mockResolvedValue(null);

    await eliminarPublicacion(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      error: "Publicacion no encontrada",
    });
  });
});