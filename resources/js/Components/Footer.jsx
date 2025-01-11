import React from 'react';
import { Link } from '@inertiajs/react';

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row justify-center items-center text-center md:text-left py-6 gap-8">
      <img src="/imagenes/logosinfondo.png" alt="logo de la empresa" className="w-96" />
      <div className="flex flex-col md:flex-row gap-6">
        <Link href="/politica-privacidad" className="hover:underline">POLÍTICA DE PRIVACIDAD</Link>
        <Link href="/politica-devoluciones" className="hover:underline">POLÍTICA DE DEVOLUCIONES</Link>
        <Link href="/politica-cookies" className="hover:underline">POLÍTICA DE COOKIES</Link>
      </div>
    </footer>
  );
};

export default Footer;
