import React, { useState, useEffect } from 'react';
import axios from 'axios';

const empiezaMayus = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
};

const ComprarEntradasConcierto = ({ eventoId }) => {
    const [carrito, setCarrito] = useState([]);
    const [entradas, setEntradas] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);

    useEffect(() => {
        const fetchEntradas = async () => {
            try {
                const response = await axios.get(`/api/eventos/${eventoId}/entradas`);
                setEntradas(response.data);
            } catch (error) {
                console.error('Error al obtener entradas:', error);
            }
        };

        fetchEntradas();
    }, [eventoId]);

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

    const calcularTotal = () => {
        return carrito.reduce((total, item) => total + item.precio * item.cantidad, 0);
    };

    const finalizarCompra = async () => {
        try {
            const response = await axios.post(`/api/conciertos/${eventoId}/comprar-entradas`, { carrito });
            alert('Compra realizada con éxito');
            setCarrito([]); // Vacía el carrito después de la compra
            setMostrarCarrito(false); // Oculta el carrito
        } catch (error) {
            console.error('Error al finalizar la compra:', error);
            alert('Hubo un problema al procesar la compra. Por favor, inténtalo de nuevo.');
        }
    };

    return (
        <div className="tienda">
            <h1>Comprar Entradas para el Concierto</h1>

            {entradas.map(entrada => (
                <div key={entrada.id} className="entrada">
                    <h3>Entrada {empiezaMayus(entrada.tipo)}</h3>
                    <p>Precio: {entrada.precio}€</p>
                    <button onClick={() => agregarAlCarrito(entrada)}>Agregar al Carrito</button>
                </div>
            ))}

            {carrito.length > 0 && (
                <div className="carrito">
                    <h2>Carrito</h2>
                    <ul>
                        {carrito.map(item => (
                            <li key={item.tipo}>
                                Entrada {empiezaMayus(item.tipo)}: {item.cantidad} x {item.precio}€
                                <input
                                    type="number"
                                    value={item.cantidad}
                                    min="1"
                                    onChange={(e) => actualizarCantidad(item.tipo, parseInt(e.target.value))}
                                />
                                <button onClick={() => eliminarDelCarrito(item.tipo)}>Eliminar</button>
                            </li>
                        ))}
                    </ul>
                    <h3>Total: {calcularTotal()}€</h3>
                    <button onClick={finalizarCompra}>Finalizar Compra</button>
                </div>
            )}
        </div>
    );
};

export default ComprarEntradasConcierto;
