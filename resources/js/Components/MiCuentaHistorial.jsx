import React, { useState } from 'react';
import { usePage } from '@inertiajs/react';
import axios from 'axios';

const MiCuentaHistorial = () => {
  const { compras = [], reservas = [] } = usePage().props; // Asegura que compras y reservas sean arrays

  // Estado para controlar el orden de las reservas
  const [orderBy, setOrderBy] = useState('creation'); // 'creation' o 'proximity'

  // Función para ordenar las reservas
  const sortedReservas = reservas.sort((a, b) => {
    if (orderBy === 'creation') {
      // Orden por creación (cronológico inverso)
      return new Date(b.created_at) - new Date(a.created_at);
    } else if (orderBy === 'proximity') {
      // Orden por proximidad (fechas más cercanas primero)
      return new Date(a.fecha_reserva) - new Date(b.fecha_reserva);
    }
    return 0;
  });

  // Función para verificar si una fecha ya ha pasado
  const isPastDate = (fecha) => {
    return new Date(fecha) < new Date();
  };

  // Función para verificar si se puede cancelar la reserva (más de un día en el futuro)
  const canCancel = (fecha) => {
    const today = new Date();
    const reservaDate = new Date(fecha);
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;

    return reservaDate - today > oneDayInMilliseconds;
  };

  // Función para cancelar una reserva
  const handleCancel = async (id) => {
    if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) return;

    try {
      await axios.delete(`/api/reservas/${id}`); // Supone que existe una ruta DELETE para cancelar reservas
      alert('Reserva cancelada con éxito.');
      location.reload(); // Recarga la página para actualizar el estado
    } catch (error) {
      console.error('Error al cancelar la reserva:', error);
      alert('Hubo un problema al intentar cancelar la reserva. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="historial">
      <h2>Historial de Compras</h2>
      {compras.length === 0 ? (
        <h3>No tienes compras registradas.</h3>
      ) : (
        compras.map((compra, index) => (
          <div key={index} className="compra">
            <h3>Compra realizada el {new Date(compra.fecha_compra).toLocaleDateString()}</h3>
            <h2>Total: {compra.total}€</h2>
            <h3>Detalles de los productos:</h3>
            <ul>
              {compra.entradas.map((entrada, i) => (
                <li key={i} className="li-estilo-h3">
                  {entrada.tipo.charAt(0).toUpperCase() + entrada.tipo.slice(1)} x {entrada.pivot.cantidad}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      <h2>Mis Reservas</h2>
      {reservas.length === 0 ? (
        <h3>No tienes reservas registradas.</h3>
      ) : (
        <>
          {/* Select para elegir el criterio de ordenación */}
          <label htmlFor="order-reservas" className="order-label">
            Ordenar por:
            <select
              id="order-reservas"
              value={orderBy}
              onChange={(e) => setOrderBy(e.target.value)}
              className="order-select"
            >
              <option value="creation">Orden de creación</option>
              <option value="proximity">Proximidad</option>
            </select>
          </label>

          {/* Lista de reservas ordenadas */}
          {sortedReservas.map((reserva, index) => (
            <div
              key={index}
              className={`reserva ${isPastDate(reserva.fecha_reserva) ? 'reserva-pasada' : ''}`}
            >
              <h3>Reserva para el {new Date(reserva.fecha_reserva).toLocaleDateString()}</h3>
              <h2>Tipo de Sala: {reserva.sala.tipo_sala.charAt(0).toUpperCase() + reserva.sala.tipo_sala.slice(1)}</h2>
              <h3>Asistentes: {reserva.asistentes}</h3>
              <h3>Descripción: {reserva.descripcion}</h3>

              {/* Botón para cancelar reserva si es futura */}
              {canCancel(reserva.fecha_reserva) && (
                <button
                  onClick={() => handleCancel(reserva.id)}
                  className="cancel-button"
                >
                  Cancelar Reserva
                </button>
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default MiCuentaHistorial;
