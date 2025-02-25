export const validateTextNotNull = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value.trim() !== "";
};

export const validateCorreo = (correo: string) => {
  const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return correoRegex.test(correo);
};

export const validateTelefono = (telefono : string) => {
  const telefonoRegex = /^\d{10}$/;
  return telefonoRegex.test(telefono);
};

export const validatePositiveNumber = (number: number) => {
  return number > 0;
};