import React, { useState } from "react";
import { Link } from "@inertiajs/react";

const HeaderSinFoto = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-black text-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/imagenes/logosinfondoajustado.png"
            alt="Logo"
            className="h-14 w-auto mr-4" // Logo mucho más grande
          />
        </div>

        {/* Hamburguesa */}
        <button
          onClick={toggleMenu}
          className="lg:hidden text-white focus:outline-none focus:ring-2 focus:ring-white"
        >
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Navegación */}
        <nav
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:flex lg:items-center lg:space-x-6`}
        >
          <Link
            href="/"
            className="block py-2 px-4 hover:bg-gray-800 rounded lg:inline-block"
          >
            INICIO
          </Link>
          <Link
            href="/conciertos"
            className="block py-2 px-4 hover:bg-gray-800 rounded lg:inline-block"
          >
            CONCIERTOS
          </Link>
          <Link
            href="/eventos"
            className="block py-2 px-4 hover:bg-gray-800 rounded lg:inline-block"
          >
            HAZ TU EVENTO
          </Link>
          <Link
            href="/nosotros"
            className="block py-2 px-4 hover:bg-gray-800 rounded lg:inline-block"
          >
            NOSOTROS
          </Link>
          <Link
            href="/contacto"
            className="block py-2 px-4 hover:bg-gray-800 rounded lg:inline-block"
          >
            CONTACTANOS
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default HeaderSinFoto;
