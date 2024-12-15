// Header.jsx
import React from 'react';
import { Link } from '@inertiajs/react';

const Header = () => {
  return (
    <header>
      <nav className="menu">
        <Link href="/">INICIO</Link>
        <Link href="/conciertos">CONCIERTOS</Link>
        <Link href="/eventos">HAZ TU EVENTO</Link>
        <Link href="/nosotros">NOSOTROS</Link>
        <Link href="/contacto">CONTACTANOS</Link>
      </nav>
    </header>
  );
};

export default Header;
