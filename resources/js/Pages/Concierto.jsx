import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Navigation from "../Components/Navigation";
import CompraEntradaConcierto from "../Components/CompraEntradaConcierto";
import Carrito from "../Components/Carrito";
import HacerComanda from "../Components/HacerComanda"; // Importar el componente de pedidos
import dayjs from "dayjs"; // Para manejar fechas
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export default function Concierto({ concierto }) {
    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    const [eventoActivo, setEventoActivo] = useState(false);

    useEffect(() => {
        if (concierto) {
            console.log("Datos del concierto:", concierto);

            const ahora = dayjs(); // Fecha y hora actual
            const horaInicio = dayjs(`${concierto.fecha_evento} ${concierto.hora_inicio}`, "YYYY-MM-DD HH:mm:ss");
            const horaFinal = dayjs(`${concierto.fecha_evento} ${concierto.hora_final}`, "YYYY-MM-DD HH:mm:ss");

            console.log("Hora actual:", ahora.format());
            console.log("Hora de inicio:", horaInicio.format());
            console.log("Hora final:", horaFinal.format());

            if (horaInicio.isValid() && horaFinal.isValid()) {
                setEventoActivo(ahora.isAfter(horaInicio) && ahora.isBefore(horaFinal));
            } else {
                console.error("Las horas no son válidas.");
            }
        }
    }, [concierto]);

    return (
        <div>
            <Navigation />
            <Header />

            {/* Contenedor con cartel e información */}
            <div className="container mx-auto px-6 py-8 flex flex-col md:flex-row items-center gap-8">
                {/* Imagen del cartel */}
                <div className="w-full md:w-1/2 flex justify-center">
                    <img
                        src={concierto.cartel ? `/storage/${concierto.cartel}` : "/imagenes/cartel1.png"}
                        alt={`Cartel del concierto ${concierto.nombre_evento}`}
                        className="w-full max-w-md rounded-lg shadow-lg"
                    />
                </div>

                {/* Información del evento */}
                <div className="w-full md:w-1/2 text-center md:text-left">
                    <h2 className="text-4xl font-bold text-[#860303]">Concierto de {concierto.nombre_evento}</h2>
                    <p className="text-lg text-gray-200 mt-4">{concierto.descripcion}</p>
                    <p className="text-lg text-gray-300 mt-2">📅 <strong>Fecha:</strong> {concierto.fecha_evento}</p>
                    <p className="text-lg text-gray-300">⏰ <strong>Hora:</strong> {concierto.hora_inicio} - {concierto.hora_final}</p>
                    <p className="text-lg text-gray-300">📍 <strong>Sala:</strong> {concierto.sala?.descripcion || "No especificada"}</p>
                </div>
            </div>

            {/* Cuadrado de compra de entradas */}
            <div className="flex justify-center mt-8">
                <div className="bg-[#860303] text-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
                    <CompraEntradaConcierto eventoId={concierto.id} carrito={carrito} setCarrito={setCarrito} />
                </div>
            </div>

            {/* Mostrar la opción de hacer pedidos solo si el evento está activo */}
            {eventoActivo && (
                <div className="mt-12 text-center">
                    <h2 className="text-2xl font-bold text-white-500">📢 El evento está en curso, ¡haz tu pedido desde la mesa!</h2>
                    <HacerComanda eventoId={concierto.id} />
                </div>
            )}

            {/* Carrito de compras */}
            <Carrito carrito={carrito} setCarrito={setCarrito} mostrarCarrito={mostrarCarrito} setMostrarCarrito={setMostrarCarrito} />

            <Footer />
        </div>
    );
}
