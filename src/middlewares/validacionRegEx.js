const passRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
//la Regex pide:
//minimo 8 caracteres
//una letra mayuscula
//al menos un numero


const registrarUsuario = (req, res, next) => {
  const { password } = req.body || {};

  if (typeof password !== "string" || !passRegex.test(password)) {
    return res.status(400).json({
      error: "La contraseña debe tener al menos 8 caracteres, una mayúscula y un número"
    });
  }

  return next();
};

module.exports = { passRegex, registrarUsuario};
