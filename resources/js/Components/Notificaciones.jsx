import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Notificaciones = () => {
    const [notificaciones, setNotificaciones] = useState([]);

    useEffect(() => {
        fetchNotificaciones();
    }, []);

    const fetchNotificaciones = async () => {
        const response = await axios.get('/notificaciones');
        setNotificaciones(response.data);
    };

    const marcarComoVista = async (id) => {
        await axios.put(`/notificaciones/${id}/visto`);
        fetchNotificaciones();
    };

    return (
        <div>
            <h2>Notificaciones</h2>
            <ul>
                {notificaciones.map((notificacion) => (
                    <li key={notificacion.id} style={{ opacity: notificacion.visto ? 0.5 : 1 }}>
                        <p>{notificacion.mensaje}</p>
                        {!notificacion.visto && (
                            <button onClick={() => marcarComoVista(notificacion.id)}>Marcar como vista</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notificaciones;
