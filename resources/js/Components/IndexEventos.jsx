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
           <br></br>
            <div className="carrusel-container">
               
                {indiceInicial > 0 && (
                    <button className="flecha" onClick={retroceder}>
                        &lt; 
                    </button>
                )}

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

              
                {indiceInicial + eventosVisibles < eventosAprobados.length && (
                    <button className="flecha" onClick={avanzar}>
                        &gt; 
                    </button>
                )}
            </div>
        </div>
    );
};

export default IndexEventos;
