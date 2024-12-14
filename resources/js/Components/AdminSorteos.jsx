import React, { useState } from 'react';

const AdminSorteos = ({ usuarios = [] }) => {
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const realizarSorteo = async (nivel, premio) => {
    if (!usuarios || usuarios.length === 0) {
      setError('No hay usuarios disponibles para realizar el sorteo.');
      return;
    }

    setLoading(true);
    setError(null);

    // filtra usuarios por nivel de miembro
    const usuariosFiltrados = usuarios.filter(user => user.membresia === nivel);

    if (usuariosFiltrados.length === 0) {
      setError(`No hay usuarios con membresía ${nivel}`);
      setLoading(false);
      return;
    }

    // selecciona un ganador random
    const ganador = usuariosFiltrados[Math.floor(Math.random() * usuariosFiltrados.length)];

    try {
      console.log('Ganador seleccionado:', ganador);

      // actuaiza saldo del ganador y envia la ntfcn
      const response = await fetch(route('admin.actualizarSaldo'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({
          id: ganador.id,
          saldo: premio, // envia premio
          mensaje: `¡Felicidades ${ganador.name}! Has ganado el sorteo mensual y tu saldo ha sido incrementado en ${premio} euros.`,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el saldo del ganador');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      setResultado({ nivel, premio, ganador });
      alert(`¡Ganador seleccionado! ${ganador.name} (${ganador.email}) ha ganado ${premio} euros.`);
    } catch (err) {
      console.error('Error al realizar el sorteo:', err);
      setError('Hubo un error al realizar el sorteo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Gestión de Sorteos</h3>
      {error && <div className="error">{error}</div>}
      {resultado && (
        <div className="resultado">
          <p>
            Ganador del sorteo para <strong>{resultado.nivel}</strong>: <strong>{resultado.ganador.name}</strong> 
            ({resultado.ganador.email}) ha ganado {resultado.premio} euros.
          </p>
        </div>
      )}
      <div className="sorteos">
        <button onClick={() => realizarSorteo('plata', 10)} disabled={loading}>
          {loading ? 'Realizando sorteo...' : 'Sorteo para Plata (10€)'}
        </button>
        <button onClick={() => realizarSorteo('oro', 20)} disabled={loading}>
          {loading ? 'Realizando sorteo...' : 'Sorteo para Oro (20€)'}
        </button>
        <button onClick={() => realizarSorteo('diamante', 30)} disabled={loading}>
          {loading ? 'Realizando sorteo...' : 'Sorteo para Diamante (30€)'}
        </button>
      </div>
    </div>
  );
};

export default AdminSorteos;
