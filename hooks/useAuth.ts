// hooks/useAuth.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

export const useAuth = (redirectOnError = true) => {
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const jwt = Cookies.get('jwt');
      
      try {
        if (!jwt) throw new Error('NO_TOKEN');

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/me`,
          {
            headers: { Authorization: `Bearer ${jwt}` }
          }
        );

        const data = await response.json();

        if (!response.ok) {
          // Manejar diferentes tipos de error
          switch (data.error) {
            case 'TOKEN_EXPIRED':
              Cookies.remove('jwt');
              router.push('/login');
              break;
            
            case 'INVALID_USER':
              Cookies.remove('jwt');
              router.push('/register');
              break;

            default:
              throw new Error(data.error || 'UNKNOWN_ERROR');
          }
          return;
        }

        // Renovar token si viene en headers
        const newToken = response.headers.get('x-new-token');
        if (newToken) {
          Cookies.set('jwt', newToken, {
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
          });
        }

      } catch (error) {
        if (redirectOnError) {
          router.push(`/login`);
        }
      }
    };

    verifyAuth();
  }, [router, redirectOnError]);
};