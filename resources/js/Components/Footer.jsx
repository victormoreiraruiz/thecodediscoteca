import React from 'react';
import { Link } from '@inertiajs/react';

const Footer = () => {
  return (
    <footer>
      <img src="/imagenes/logosinfondo.png" alt="logo de la empresa" />
      <Link href="/politica-privacidad">POLÍTICA DE PRIVACIDAD</Link>
      <Link href="/politica-devoluciones">POLÍTICA DE DEVOLUCIONES</Link>
      <Link href="/politica-cookies">POLÍTICA DE COOKIES</Link>
    </footer>
  );
};

export default Footer;
