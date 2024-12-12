import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ComprarEntradasConcierto = ({ eventoId, carrito, setCarrito }) => {
    const [entradas, setEntradas] = useState([]);

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
        const entradaExistente = carrito.find(
            (item) => item.tipo === entrada.tipo && item.eventoId === eventoId
        );
        if (entradaExistente) {
            setCarrito(
                carrito.map((item) =>
                    item.tipo === entrada.tipo && item.eventoId === eventoId
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            );
        } else {
            setCarrito([...carrito, { ...entrada, eventoId, cantidad: 1, tipo: 'concierto' }]);
        }
    };

    return (
        <div className="tienda">
            <h1>Entradas para el Concierto</h1>
            {entradas.map((entrada) => (
                <div key={entrada.id} className="entrada">
                    <h3>{entrada.tipo.charAt(0).toUpperCase() + entrada.tipo.slice(1)}</h3>
                    <p>Precio: {entrada.precio}€</p>
                    <button onClick={() => agregarAlCarrito(entrada)}>Agregar al Carrito</button>
                </div>
            ))}
        </div>
    );
};

export default ComprarEntradasConcierto;
