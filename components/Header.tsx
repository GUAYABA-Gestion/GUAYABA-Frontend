"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const Header = () => {
  const { data: session } = useSession(); // Obtiene la sesión actual

  return (
    <header className="bg-emerald-600 text-white p-4 flex justify-between items-center">
      <img src="logo.png" alt="Guayaba Logo" className="logo" />
      <nav>
        <ul className="flex space-x-4">
          {/* Si hay sesión, mostrar el botón de logout */}
          {session ? (
            <li>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link href="/login">Login</Link>
              </li>
            </>
          )}
          {/* Enlaces comunes */}
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link href="/services">Services</Link>
          </li>
          <li>
            <Link href="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
