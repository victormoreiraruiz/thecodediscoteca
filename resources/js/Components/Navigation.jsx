// Navigation.jsx
import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Navigation() {
    const { auth } = usePage().props;

    return (
        <nav className="bg-neutral-900 p-4">
            <div className="container mx-auto flex justify-between items-center">
                {auth.user ? (
                    // Usuario autenticado: mostrar enlace a "Mi Cuenta"
                    <Link
                        href="/mi-cuenta"
                        className="text-lg md:text-xl text-white hover:text-gray-400"
                    >
                        Mi Cuenta
                    </Link>
                ) : (
                    // Usuario no autenticado: mostrar "Iniciar sesión" y "Registrarse"
                    <div className="flex space-x-4 font-serif">
                        <Link
                            href="/login"
                            className="text-lg md:text-xl text-white hover:text-gray-400"
                        >
                            Iniciar sesión
                        </Link>
                        <Link
                            href="/register"
                            className="text-lg md:text-xl text-white hover:text-gray-400"
                        >
                            Registrarse
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
