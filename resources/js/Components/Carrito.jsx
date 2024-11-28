// Carrito.js
import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Cookies from 'js-cookie';

const Carrito = ({ carrito, setCarrito, mostrarCarrito, setMostrarCarrito }) => {
    // Función para eliminar un producto del carrito
    const eliminarDelCarrito = (tipo) => {
        setCarrito(carrito.filter(item => item.tipo !== tipo));
    };

    // Función para actualizar la cantidad de un producto
    const actualizarCantidad = (tipo, cantidad) => {
        setCarrito(
            carrito.map(item =>
                item.tipo === tipo
                    ? { ...item, cantidad: cantidad }
                    : item
            )
        );
    };

    // Función para vaciar el carrito
    const vaciarCarrito = () => {
        setCarrito([]);
        setMostrarCarrito(false);
    };

    // Función para calcular el total del carrito
    const calcularTotal = () => {
        return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
    };

    // Función para finalizar la compra
    const finalizarCompra = () => {
        Inertia.post('/iniciar-compra', { carrito });
        // Borrar la cookie después de confirmar la compra
        Cookies.remove('carrito');
        setCarrito([]);
        setMostrarCarrito(false);
    };

    // Calcular el número total de productos en el carrito
    const calcularCantidadTotal = () => {
        return carrito.reduce((total, item) => total + item.cantidad, 0);
    };

    // Leer el carrito desde la cookie cuando se carga la página
    useEffect(() => {
        const carritoGuardado = Cookies.get('carrito');
        if (carritoGuardado) {
            setCarrito(JSON.parse(carritoGuardado));
        }
    }, [setCarrito]);

    // Guardar el carrito en la cookie cada vez que se actualice
    useEffect(() => {
        if (carrito.length > 0) {
            Cookies.set('carrito', JSON.stringify(carrito), { expires: 7 }); // Expira en 7 días
        }
    }, [carrito]);

    return (
        <>
            {/* Icono del carrito con el número de productos */}
            {carrito.length > 0 && (
                <div className="carrito-icono" onClick={() => setMostrarCarrito(true)}>
                    🛒
                    {/* Número de productos en el carrito */}
                    <span className="carrito-cantidad">
                        {calcularCantidadTotal()}
                    </span>
                </div>
            )}

            {/* Panel del carrito */}
            {mostrarCarrito && (
                <div className="carrito-panel">
                    <button className="cerrar-carrito" onClick={() => setMostrarCarrito(false)}>
                        ✖
                    </button>
                    <h2>Carrito de Compras</h2>
                    {carrito.length === 0 ? (
                        <p>El carrito está vacío</p>
                    ) : (
                        <ul>
                            {carrito.map(item => (
                                <li key={item.tipo} className="carrito-item">
                                    <span>Entrada {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.cantidad}
                                        onChange={(e) => actualizarCantidad(item.tipo, parseInt(e.target.value))}
                                    />
                                    <button
                                        className="eliminar"
                                        onClick={() => eliminarDelCarrito(item.tipo)}
                                    >
                                        ❌
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                   <div className="total">
                        <h3>Total: {calcularTotal().toFixed(2)}€</h3>
                    </div>

                    <div className="carrito-botones">
                        <button onClick={vaciarCarrito}>Vaciar Carrito</button>
                        <button onClick={finalizarCompra}>Finalizar Compra</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Carrito;
