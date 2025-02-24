export const validateTextNotNull = (text) => {
  return text.trim() !== "";
};

export const validateCorreo = (correo) => {
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return correoRegex.test(correo);
};

export const validateTelefono = (telefono) => {
  const telefonoRegex = /^\d{10}$/;
  return telefonoRegex.test(telefono);
};

export const validatePositiveNumber = (number) => {
  return number > 0;
};