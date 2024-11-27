import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Navigation() {
    const { auth } = usePage().props;

    return (
        <nav className="bg-neutral-900 p-4">
            <div className="container mx-auto flex justify-end items-center">
                {/* Usuario autenticado o no autenticado: contenido alineado a la derecha */}
                <div className="flex space-x-4 items-center">
                    {auth.user ? (
                        // Usuario autenticado: mostrar el nombre a la derecha
                        <Link
                            href="/mi-cuenta"
                            className="text-lg md:text-xl text-white hover:text-gray-400"
                        >
                            {auth.user.name}
                        </Link>
                    ) : (
                        // Usuario no autenticado: "Iniciar sesión" y "Registrarse"
                        <div className="flex space-x-4">
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
            </div>
        </nav>
    );
}
