import React, { useState } from 'react';
import { Inertia } from '@inertiajs/inertia';

const empiezaMayus = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

const FiestaEntradas = () => {
    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);

    const agregarAlCarrito = (entrada) => {
        const entradaExistente = carrito.find(item => item.tipo === entrada.tipo);
        if (entradaExistente) {
            setCarrito(
                carrito.map(item =>
                    item.tipo === entrada.tipo
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            );
        } else {
            setCarrito([...carrito, { ...entrada, cantidad: 1 }]);
        }
    };

    const eliminarDelCarrito = (tipo) => {
        setCarrito(carrito.filter(item => item.tipo !== tipo));
    };

    const actualizarCantidad = (tipo, cantidad) => {
        setCarrito(
            carrito.map(item =>
                item.tipo === tipo
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
        Inertia.post('/iniciar-compra', { carrito });
    };



    const entradas = [
        { tipo: 'normal', precio: 10, id: 1 },
        { tipo: 'vip', precio: 30, id: 2 },
        { tipo: 'premium', precio: 50, id: 3 },
    ];

    return (
        <div className="tienda">
            <p>ENTRADAS</p>

            {entradas.map(entrada => (
                <div key={entrada.tipo} className="entrada">
                    <h3>Entrada {empiezaMayus(entrada.tipo)}</h3>
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
                                <li key={item.tipo} className="carrito-item">
                                    <span>{item.tipo}</span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.cantidad}
                                        onChange={(e) => actualizarCantidad(item.tipo, parseInt(e.target.value))}
                                    />
                                    <button className="eliminar" onClick={() => eliminarDelCarrito(item.tipo)}>
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