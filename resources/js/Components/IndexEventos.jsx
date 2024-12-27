import React, { useState } from 'react';
import { Link } from '@inertiajs/react';

const IndexEventos = ({ eventos }) => {
    const eventosAprobados = eventos
        .filter(evento => evento.estado === 'apto')
        .sort((a, b) => new Date(a.fecha_evento) - new Date(b.fecha_evento));

    const [indiceInicial, setIndiceInicial] = useState(0);

    const eventosVisibles = 4; // Mostrar 4 eventos a la vez

    const avanzar = () => {
        if (indiceInicial + eventosVisibles < eventosAprobados.length) {
            setIndiceInicial(indiceInicial + 1);
        }
    };

    const retroceder = () => {
        if (indiceInicial > 0) {
            setIndiceInicial(indiceInicial - 1);
        }
    };

    return (
        <div className="index-eventos">
            <h2>PRÓXIMOS EVENTOS</h2>
            <div className="carrusel-container">
                <button
                    className="flecha flecha-izquierda"
                    onClick={retroceder}
                    disabled={indiceInicial === 0}
                >
                    &#9664; {/* Flecha izquierda */}
                </button>

                <div className="eventos-grid">
                    {eventosAprobados.slice(indiceInicial, indiceInicial + eventosVisibles).map(evento => (
                        <div key={evento.id} className="evento-card">
                            <Link href={`/conciertos/${evento.id}`}>
                                <img
                                    src={evento.cartel ? `/storage/${evento.cartel}` : '/imagenes/cartel1.png'}
                                    alt={`Cartel del evento ${evento.nombre_evento}`}
                                    className="evento-cartel"
                                    onError={(e) => {
                                        e.target.src = '/imagenes/cartel1.png'; // Imagen por defecto
                                    }}
                                />
                            </Link>
                            <div className="evento-info">
                                <h4>{evento.nombre_evento}</h4>
                                <p>{new Date(evento.fecha_evento).toLocaleDateString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button
                    className="flecha flecha-derecha"
                    onClick={avanzar}
                    disabled={indiceInicial + eventosVisibles >= eventosAprobados.length}
                >
                    &#9654; {/* Flecha derecha */}
                </button>
            </div>
        </div>
    );
};

export default IndexEventos;
