import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

const FiestaEntradas = () => {
    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);

    const agregarAlCarrito = (entrada) => {
        const entradaExistente = carrito.find(item => item.nombre === entrada.nombre);
        if (entradaExistente) {
            setCarrito(
                carrito.map(item =>
                    item.nombre === entrada.nombre
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            );
        } else {
            setCarrito([...carrito, { ...entrada, cantidad: 1 }]);
        }
    };

    const eliminarDelCarrito = (nombre) => {
        setCarrito(carrito.filter(item => item.nombre !== nombre));
    };

    const actualizarCantidad = (nombre, cantidad) => {
        setCarrito(
            carrito.map(item =>
                item.nombre === nombre
                    ? { ...item, cantidad: cantidad }
                    : item
            )
        );
    };

    const vaciarCarrito = () => {
        setCarrito([]);
        setMostrarCarrito(false);
    };

    const calcularTotal = () => {
        return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
    };

    const finalizarCompra = () => {
        Inertia.visit('/resumen-compra', {
            method: 'get',
            data: { carrito },
            preserveState: true
        });
    };

    const entradas = [
        { nombre: 'Entrada General', precio: 10 },
        { nombre: 'Entrada VIP', precio: 30 },
        { nombre: 'Entrada Premium', precio: 50 },
    ];

    return (
        <div className="tienda">
            <p>ENTRADAS</p>

            {entradas.map(entrada => (
                <div key={entrada.nombre} className="entrada">
                    <h3>{entrada.nombre}</h3>
                    <br />
                    <div className="precio">Precio: {entrada.precio}€</div>
                    <button className="reservar" onClick={() => agregarAlCarrito(entrada)}>
                        COMPRAR
                    </button>
                </div>
            ))}

            {carrito.length > 0 && (
                <div className="carrito-icono" onClick={() => setMostrarCarrito(!mostrarCarrito)}>
                    🛒 <span>Carrito ({carrito.length})</span>
                </div>
            )}

            {mostrarCarrito && (
                <div className="carrito-panel">
                    <button className="cerrar-carrito" onClick={() => setMostrarCarrito(false)}>✖</button>
                    <h2>Carrito de Compras</h2>
                    {carrito.length === 0 ? (
                        <p>El carrito está vacío</p>
                    ) : (
                        <ul>
                            {carrito.map(item => (
                                <li key={item.nombre} className="carrito-item">
                                    <span>{item.nombre}</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.cantidad}
                                        onChange={(e) => actualizarCantidad(item.nombre, parseInt(e.target.value))}
                                    />
                                    <button className="eliminar" onClick={() => eliminarDelCarrito(item.nombre)}>
                                        🗑️
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
        </div>
    );
};

export default FiestaEntradas;
