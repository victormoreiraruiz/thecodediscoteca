import React from 'react';
import { Link } from '@inertiajs/react';

const Footer = () => {
  return (
    <footer>
      <img src="/imagenes/logosinfondo.png" alt="logo de la empresa" />
      <Link href="/politica-privacidad">POLÍTICA DE PRIVACIDAD</Link>
      <a href="construccion.html">POLÍTICA DE DEVOLUCIONES</a>
      <a href="construccion.html">POLÍTICA DE COOKIES</a>
    </footer>
  );
};

export default Footer;
