import React from 'react';
import { usePage } from '@inertiajs/react';

export default function Proximos() {
    const { eventos } = usePage().props; // Recibe eventos desde Inertia

    return (
        <div>
            <h2>Próximos Eventos</h2>
            <ul>
                {eventos.map(evento => ( // itera los eventos
                    <li key={evento.id}>
                        {evento.nombre_evento} - {new Date(evento.fecha_evento).toLocaleDateString()} // muestra nombre y fecha formateada
                    </li>
                ))}
            </ul>
        </div>
    );
}