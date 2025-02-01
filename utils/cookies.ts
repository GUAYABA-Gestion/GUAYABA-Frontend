import Cookies from 'js-cookie';

// Guardar JWT en una cookie segura
export const setAuthCookie = (token: string): void => {
  Cookies.set('jwt', token, {
    expires: 1, // Expira en 1 día
    secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
    sameSite: 'strict', // Prevenir ataques CSRF
  });
};

// Obtener JWT de la cookie
export const getAuthCookie = (): string | undefined => {
  return Cookies.get('jwt');
};

// Eliminar la cookie del JWT
export const removeAuthCookie = (): void => {
    Cookies.remove("jwt", {
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  };

export const setTempMessage = (message: string): void => {
    Cookies.set("tempMessage", message, {
      expires: 1 / 24, // 1 hora
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
  };
  
  export const getTempMessage = (): string | undefined => {
    return Cookies.get("tempMessage");
  };
  
  export const removeTempMessage = (): void => {
    Cookies.remove("tempMessage");
  };