"use client";
import Link from "next/link";

const Header = () => {
  return (
    <header className="bg-emerald-600 text-white p-4 flex justify-between items-center">
      <img src="logo.png" alt="Guayaba Logo" className="logo" />
      <nav>
        <ul className="flex space-x-4">
          <li>
            <Link href="/login">Login</Link>
          </li>
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
