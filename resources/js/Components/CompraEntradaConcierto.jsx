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
                const response = await axios.get(`/eventos/${eventoId}/entradas`); // consulta para obtener entradas del evento
                setEntradas(response.data); // guarda las entradas obtenidas
                if (response.data.length > 0) {
                    const eventoData = response.data[0].evento; // obtiene la informacion del evento
                    setEvento(eventoData); // la almacena

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

        fetchEntradas(); // llama a la funcion para obtener las entradas
    }, [eventoId]); // Se ejecuta cada vez que cambia el `eventoId`.

    const agregarAlCarrito = (entrada) => {
        if (eventoPasado) {
            Swal.fire({
                icon: 'error',
                title: 'Evento pasado',
                text: 'Este evento ya ha pasado. No es posible comprar entradas.',
                confirmButtonText: 'OK',
                buttonsStyling: false, // Desactiva los estilos por defecto de SweetAlert
                customClass: {
                    confirmButton:
                        'bg-red-600 text-white font-bold py-2 px-9 rounded-md text-lg hover:bg-red-700 flex items-center justify-center', // Asegura centrado vertical y horizontal
                },
            });
            
            return;
        }

        // busca si la entrada ya existe 
        const entradaExistente = carrito.find(
            (item) => item.tipo === entrada.tipo && item.eventoId === eventoId
        );

        if (entradaExistente) { // en caso de existir incrementa la cantidad
            setCarrito(
                carrito.map((item) =>
                    item.tipo === entrada.tipo && item.eventoId === eventoId
                        ? { ...item, cantidad: item.cantidad + 1 }
                        : item
                )
            );
        } else { // eb ncaso contrario se añade al carrito
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
        <div className="w-full flex justify-center">
            <div className="bg-[#860303] text-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
                <h2 className="text-2xl font-bold text-center mb-6">ENTRADAS</h2>

                {entradas.map((entrada) => (
                    <div key={entrada.id} className="bg-gray-800 p-4 rounded-lg mb-4 flex flex-col md:flex-row justify-between items-center">
                        <div className="text-center md:text-left">
                            <h3 className="text-lg font-semibold">{entrada.tipo.charAt(0).toUpperCase() + entrada.tipo.slice(1)}</h3>
                            <p className="text-gray-300 mt-2">Precio: {entrada.precio}€</p>
                        </div>
                        <button
                            className="bg-yellow-500 text-black font-semibold py-2 px-6 rounded-lg hover:bg-yellow-600 transition-transform hover:scale-105 mt-4 md:mt-0"
                            onClick={() => agregarAlCarrito(entrada)}
                        >
                            Añadir
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CompraEntradaConcierto;
