import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import Swal from 'sweetalert2';

const CompraEntradaConcierto = ({ eventoId, carrito, setCarrito }) => {
    const [entradas, setEntradas] = useState([]);
    const [evento, setEvento] = useState(null);
    const [eventoPasado, setEventoPasado] = useState(false);

    useEffect(() => {
        const fetchEntradas = async () => {
            try {
                const response = await axios.get(`/eventos/${eventoId}/entradas`);
                setEntradas(response.data);
                if (response.data.length > 0) {
                    const eventoData = response.data[0].evento;
                    setEvento(eventoData);

                    // Verificar si la fecha del evento ya pasó
                    const fechaEvento = dayjs(eventoData.fecha_evento);
                    if (fechaEvento.isBefore(dayjs(), 'day')) {
                        setEventoPasado(true);
                    }
                }
            } catch (error) {
                console.error('Error al obtener entradas:', error);
            }
        };

        fetchEntradas();
    }, [eventoId]);

    const agregarAlCarrito = (entrada) => {
        if (eventoPasado) {
            Swal.fire({
                icon: 'error',
                title: 'Evento pasado',
                text: 'Este evento ya ha pasado. No es posible comprar entradas.',
            });
            return;
        }

        // Lógica normal para agregar al carrito
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
                        <br></br>
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
