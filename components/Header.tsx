"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const Header = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <header className="bg-[#1f6032] text-white p-4 flex justify-between items-center relative">
      {/* Contenedor del logo */}
      <div className="flex justify-center items-center w-1/3">
        <img
          src="/images/Guayaba_LogoTexto.png"
          alt="Guayaba Logo"
          className="w-48 h-auto" // Ajusta el tamaño según sea necesario
        />
      </div>

      {/* Navegación */}
      <nav className="flex-1 flex justify-end">
        {/* Botón hamburguesa visible solo en pantallas pequeñas */}
        <button
          className="block md:hidden text-white"
          onClick={toggleMenu}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </nav>

      {/* Menú en pantallas grandes: horizontal, siempre visible */}
      <ul className="hidden md:flex md:flex-row md:space-x-6 items-center">
        {session ? (
          <li>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="hover:text-gray-300 transition-colors"
            >
              Logout
            </button>
          </li>
        ) : (
          <li>
            <Link href="/login" className="hover:text-gray-300 transition-colors">
              Login
            </Link>
          </li>
        )}
        <li>
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
        </li>
        <li>
          <Link href="/account" className="hover:text-gray-300 transition-colors">
            Account
          </Link>
        </li>
        <li>
          <Link href="/about" className="hover:text-gray-300 transition-colors">
            About
          </Link>
        </li>
        <li>
          <Link href="/services" className="hover:text-gray-300 transition-colors">
            Services
          </Link>
        </li>
        <li>
          <Link href="/contact" className="hover:text-gray-300 transition-colors">
            Contact
          </Link>
        </li>
        <li>
          <Link href="/session" className="hover:text-gray-300 transition-colors">
            Session
          </Link>
        </li>
      </ul>

      {/* Menú desplegable para pantallas pequeñas */}
      <div
        className={`md:hidden absolute top-full right-0 w-48 bg-emerald-800 text-white p-4 space-y-4 transition-all duration-300 ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <ul>
          {session ? (
            <li>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="hover:text-gray-300 transition-colors"
              >
                Logout
              </button>
            </li>
          ) : (
            <li>
              <Link href="/login" className="hover:text-gray-300 transition-colors">
                Login
              </Link>
            </li>
          )}
          <li>
            <Link href="/" className="hover:text-gray-300 transition-colors">
              Home
            </Link>
          </li>
          <li>
            <Link href="/account" className="hover:text-gray-300 transition-colors">
              Account
            </Link>
          </li>
          <li>
            <Link href="/about" className="hover:text-gray-300 transition-colors">
              About
            </Link>
          </li>
          <li>
            <Link href="/services" className="hover:text-gray-300 transition-colors">
              Services
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-gray-300 transition-colors">
              Contact
            </Link>
          </li>
          <li>
            <Link href="/session" className="hover:text-gray-300 transition-colors">
              Session
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
