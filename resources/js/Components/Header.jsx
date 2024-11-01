// Header.jsx
import React from 'react';
import { Link } from '@inertiajs/react';

const Header = () => {
  return (
    <header>
      <nav className="menu">
        <a href="construccion.html">GALERIA</a>
        <a href="construccion.html">EVENTOS</a>
        <a href="construccion.html">ENTRADAS</a>
        <Link href="/nosotros">NOSOTROS</Link>
        <Link href="/contacto">CONTACTANOS</Link>
      </nav>
    </header>
  );
};

export default Header;
