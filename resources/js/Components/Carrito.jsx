import React, { useEffect } from 'react';
import { Inertia } from '@inertiajs/inertia';
import Cookies from 'js-cookie';
import { usePage } from '@inertiajs/react';

const Carrito = ({ carrito, setCarrito, mostrarCarrito, setMostrarCarrito }) => {
    const { auth } = usePage().props; // Obtiene la información del usuario autenticado desde las props de Inertia.

    useEffect(() => { // carga el carrito de las cookies
        const carritoGuardado = Cookies.get('carrito'); // intenta obtener el carrito de las cookies
        if (carritoGuardado) {
            const parsedCarrito = JSON.parse(carritoGuardado);
            if (parsedCarrito.userId !== auth.user?.id) {  // Si el carrito pertenece a otro usuario, lo eliminamos.
                Cookies.remove('carrito', { path: '/' });
                setCarrito([]);
            } else {
                setCarrito(parsedCarrito.items || []);
            }
        }
    }, [auth.user?.id, setCarrito]);

     // useEffect para guardar el carrito en las cookies cada vez que cambia
    useEffect(() => {
        if (carrito.length > 0) {
            Cookies.set(  // Guarda el carrito en las cookies si contiene elementos.
                'carrito',
                JSON.stringify({ userId: auth.user?.id, items: carrito }),
                { expires: 7, path: '/' } // Configura las cookies con una duración de 7 días.
            );
        } else {
            Cookies.remove('carrito', { path: '/' });
        }
    }, [carrito, auth.user?.id]); // Se ejecuta cada vez que cambian `carrito` o el usuario autenticado.

    // Función para eliminar un elemento específico del carrito
    const eliminarDelCarrito = (tipo, eventoId) => {
        setCarrito(carrito.filter(item => !(item.tipo === tipo && item.eventoId === eventoId)));
    };

     // Función para actualizar la cantidad de un elemento específico
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
                        <button onClick={finalizarCompra}>Tramitar Compra</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Carrito;