import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia'; // Importa Inertia del paquete correcto

export default function Navigation() {
    const { auth } = usePage().props;

    const handleLogout = (e) => {
        e.preventDefault();
        Inertia.post(route('logout')); // Asegúrate de que la ruta de logout esté definida en web.php
    };

    return (
        <nav className="bg-neutral-900 p-4">
            <div className="container mx-auto flex justify-between items-center">
                {auth.user ? (
                    // Usuario autenticado: mostrar solo "Cerrar sesión"
                    <button
                        onClick={handleLogout}
                        className="text-lg md:text-xl text-white hover:text-gray-400"
                    >
                        Cerrar sesión
                    </button>
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
