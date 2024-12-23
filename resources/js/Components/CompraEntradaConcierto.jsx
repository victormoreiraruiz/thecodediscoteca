import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CompraEntradaConcierto = ({ eventoId, carrito, setCarrito }) => {
    const [entradas, setEntradas] = useState([]);
    const [evento, setEvento] = useState(null); // Detalles del evento

    useEffect(() => {
        const fetchEntradas = async () => {
            try {
                const response = await axios.get(`/eventos/${eventoId}/entradas`);
                setEntradas(response.data);
                if (response.data.length > 0) {
                    setEvento(response.data[0].evento); // Extraer datos del evento
                }
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
            setCarrito([
                ...carrito,
                {
                    ...entrada,
                    eventoId,
                    nombre_evento: evento?.nombre_evento || 'Evento desconocido',
                    cantidad: 1,
                    tipo: 'concierto',
                },
            ]);
        }
    };

    return (
        <div className="compra-entrada-concierto">
            <div className="tienda">
                <h2>ENTRADAS</h2>
                {entradas.map((entrada) => (
                    <div key={entrada.id} className="entrada">
                        <h3>{entrada.tipo.charAt(0).toUpperCase() + entrada.tipo.slice(1)}</h3>
                        <br />
                        <div className="precio">Precio: {entrada.precio}€</div>
                        <button
                            className="reservar"
                            onClick={() => agregarAlCarrito(entrada)}
                        >
                            Comprar
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompraEntradaConcierto;
