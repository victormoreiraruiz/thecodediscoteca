import React, { useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Cookies from 'js-cookie';
import { usePage } from '@inertiajs/react';

const Carrito = ({ carrito, setCarrito, mostrarCarrito, setMostrarCarrito }) => {
    const { auth } = usePage().props;

    useEffect(() => {
        const carritoGuardado = Cookies.get('carrito');
        if (carritoGuardado) {
            const parsedCarrito = JSON.parse(carritoGuardado);
            if (parsedCarrito.userId !== auth.user?.id) {
                Cookies.remove('carrito', { path: '/' });
                setCarrito([]);
            } else {
                setCarrito(parsedCarrito.items || []);
            }
        }
    }, [auth.user?.id, setCarrito]);

    useEffect(() => {
        if (carrito.length > 0) {
            Cookies.set(
                'carrito',
                JSON.stringify({ userId: auth.user?.id, items: carrito }),
                { expires: 7, path: '/' }
            );
        } else {
            Cookies.remove('carrito', { path: '/' });
        }
    }, [carrito, auth.user?.id]);

    const eliminarDelCarrito = (tipo, eventoId) => {
        setCarrito(carrito.filter(item => !(item.tipo === tipo && item.eventoId === eventoId)));
    };

    const actualizarCantidad = (tipo, eventoId, cantidad) => {
        setCarrito(
            carrito.map(item =>
                item.tipo === tipo && item.eventoId === eventoId
                    ? { ...item, cantidad }
                    : item
            )
        );
    };

    const calcularTotal = () => {
        return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
    };

    const finalizarCompra = () => {
        Inertia.post('/iniciar-compra', { carrito });
        Cookies.remove('carrito');
        setCarrito([]);
        setMostrarCarrito(false);
    };

    const calcularCantidadTotal = () => {
        return carrito.reduce((total, item) => total + item.cantidad, 0);
    };

    useEffect(() => {
        console.log('Estado del carrito:', carrito);
    }, [carrito]);

    return (
        <>
            {carrito.length > 0 && (
                <div className="carrito-icono" onClick={() => setMostrarCarrito(true)}>
                    🛒
                    <span className="carrito-cantidad">
                        {calcularCantidadTotal()}
                    </span>
                </div>
            )}

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
                                <li key={`${item.tipo}-${item.eventoId}`} className="carrito-item">
                                    <span>
                                        {item.nombre_evento || 'Evento desconocido'} - Entrada {item.tipo.charAt(0).toUpperCase() + item.tipo.slice(1)}
                                    </span>
                                    <input
                                        type="number"
                                        min="1"
                                        value={item.cantidad}
                                        onChange={(e) => actualizarCantidad(item.tipo, item.eventoId, parseInt(e.target.value))}
                                    />
                                    <button
                                        className="eliminar"
                                        onClick={() => eliminarDelCarrito(item.tipo, item.eventoId)}
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
                        <button onClick={() => setCarrito([])}>Vaciar Carrito</button>
                        <button onClick={finalizarCompra}>Finalizar Compra</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Carrito;