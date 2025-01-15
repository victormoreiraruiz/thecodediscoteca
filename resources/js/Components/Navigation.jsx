import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Inertia } from '@inertiajs/inertia';

export default function Navigation() {
    const { auth } = usePage().props;
    const [menuAbierto, setMenuAbierto] = useState(false);

    const toggleMenu = () => {
        setMenuAbierto(!menuAbierto);
    };

    const handleLogout = () => {
        Inertia.post('/logout', {}, {
            onFinish: () => {
                Inertia.visit('/');
            },
        });
    };

    return (
        <nav className="bg-neutral-900 p-4 relative">
            <div className="container mx-auto flex justify-end items-center">
                <div className="flex space-x-4 items-center">
                    {auth.user ? (
                        // Usuario autenticado: Nombre con menú desplegable
                        <div className="relative">
                            <span
                                onClick={toggleMenu}
                                className="text-lg md:text-xl text-[#e5cc70] hover:text-gray-400 cursor-pointer"
                            >
                                {auth.user.name}
                            </span>

                            {menuAbierto && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                                    <Link
                                        href="/mi-cuenta"
                                        className="block px-4 py-2 text-gray-900 hover:bg-gray-200"
                                    >
                                        Mi Cuenta
                                    </Link>

                                    {/* Mostrar "Camarero" si el usuario es camarero o admin */}
                                    {(auth.user.rol === 'camarero' || auth.user.rol === 'admin') && (
                                        <Link
                                            href="/camarero"
                                            className="block px-4 py-2 text-gray-900 hover:bg-gray-200"
                                        >
                                            Camarero
                                        </Link>
                                    )}

                                    {/* Mostrar "Admin" solo si el usuario es administrador */}
                                    {auth.user.rol === 'admin' && (
                                        <Link
                                            href="/admin"
                                            className="block px-4 py-2 text-gray-900 hover:bg-gray-200"
                                        >
                                            Admin
                                        </Link>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-200"
                                    >
                                        Salir
                                    </button>
                                </div>
                            )}
                        </div>
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
