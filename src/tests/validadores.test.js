const { passRegex } = require("../middlewares/validacionRegEx");

describe("Suite: Seguridad de Contraseñas", () => {
  test("1. Rechaza longitud menor a 8 caracteres", () => {
    expect(passRegex.test("A1bc")).toBe(false);
  });

  test("2. Acepta exactamente 8 caracteres válidos", () => {
    expect(passRegex.test("A1bcdefg")).toBe(true);
  });

  test("3. Rechaza si no tiene mayúscula", () => {
    expect(passRegex.test("a1bcdefg")).toBe(false);
  });

  test("4. Rechaza si no tiene número", () => {
    expect(passRegex.test("Abcdefgh")).toBe(false);
  });

  test("5. Acepta contraseña con muchos caracteres y números", () => {
    expect(passRegex.test("Abcdefg1hijklmnop")).toBe(true);
  });

  test("6. Rechaza si tiene solo letras y una mayúscula", () => {
    expect(passRegex.test("Abcdefgh")).toBe(false);
  });

  test("7. Rechaza si tiene un número pero ninguna mayúscula", () => {
    expect(passRegex.test("12345678")).toBe(false);
  });

  test("8. Acepta contraseña con mayúscula al inicio y número al final", () => {
    expect(passRegex.test("Password1")).toBe(true);
  });

  test("9. Rechaza contraseña vacía", () => {
    expect(passRegex.test("")).toBe(false);
  });

  test("10. Rechaza contraseña con 8 caracteres pero sin mayúscula ni número", () => {
    expect(passRegex.test("abcdefgh")).toBe(false);
  });
});
