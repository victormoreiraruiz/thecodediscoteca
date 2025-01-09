import React, { useState, useEffect } from "react";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import Navigation from "../Components/Navigation";
import CompraEntradaConcierto from "../Components/CompraEntradaConcierto";
import Carrito from "../Components/Carrito";
import HacerComanda from "../Components/HacerComanda"; // Importar el componente de pedidos
import dayjs from "dayjs"; // Para manejar fechas

export default function Concierto({ concierto }) {
    const [carrito, setCarrito] = useState([]);
    const [mostrarCarrito, setMostrarCarrito] = useState(false);
    const [eventoActivo, setEventoActivo] = useState(false);

    useEffect(() => {
        if (concierto) {
            console.log("Datos del concierto:", concierto);
    
            const ahora = dayjs();
            const horaInicioStr = concierto.hora_inicio ? String(concierto.hora_inicio).trim() : null;
            const horaFinalStr = concierto.hora_final ? String(concierto.hora_final).trim() : null;
    
            if (!horaInicioStr || !horaFinalStr) {
                console.log("Error: hora_inicio o hora_final es null o undefined");
                return;
            }
    
            console.log("Hora inicio (string):", horaInicioStr);
            console.log("Hora final (string):", horaFinalStr);
    
            // Forzar el formato correcto "HH:mm:ss"
            const horaInicio = dayjs(`2025-01-09 ${horaInicioStr}`, "YYYY-MM-DD HH:mm:ss");
            const horaFinal = dayjs(`2025-01-09 ${horaFinalStr}`, "YYYY-MM-DD HH:mm:ss");
    
            console.log("Hora inicio (convertida):", horaInicio.format("YYYY-MM-DD HH:mm:ss"));
            console.log("Hora final (convertida):", horaFinal.format("YYYY-MM-DD HH:mm:ss"));
    
            if (!horaInicio.isValid() || !horaFinal.isValid()) {
                console.log("Error: `dayjs` no pudo convertir las horas.");
                return;
            }
    
            setEventoActivo(ahora.isAfter(horaInicio) && ahora.isBefore(horaFinal));
            console.log("Evento activo:", ahora.isAfter(horaInicio) && ahora.isBefore(horaFinal));
        }
    }, [concierto]);
    
    

    return (
        <div>
            <Navigation />
            <Header />
            <div className="fiesta">
                <img
                    src={concierto.cartel ? `/storage/${concierto.cartel}` : "/imagenes/cartel1.png"}
                    alt={`Cartel del concierto ${concierto.nombre_evento}`}
                    className="fiestacartel"
                />
                <div className="fiestatexto">
                    <h2>Concierto de {concierto.nombre_evento}</h2>
                    <h3>{concierto.descripcion}</h3>
                    <h3>Fecha: {concierto.fecha_evento}</h3>
                    <h3>Hora: {concierto.hora_inicio} - {concierto.hora_final}</h3>
                    <h3>Sala: {concierto.sala?.descripcion || "No especificada"}</h3>
                </div>
            </div>

            {/* Componente para comprar entradas */}
            <CompraEntradaConcierto eventoId={concierto.id} carrito={carrito} setCarrito={setCarrito} />

            {/* Mostrar la opción de hacer pedidos solo si el evento está activo */}
            {eventoActivo && (
                <div className="mt-6">
                    <h2 className="text-center text-xl font-bold text-green-600">📢 El evento está en curso, ¡haz tu pedido desde la mesa!</h2>
                    <HacerComanda eventoId={concierto.id} />
                </div>
            )}

            {/* Carrito de compras */}
            <Carrito carrito={carrito} setCarrito={setCarrito} mostrarCarrito={mostrarCarrito} setMostrarCarrito={setMostrarCarrito} />

            <Footer />
        </div>
    );
}
