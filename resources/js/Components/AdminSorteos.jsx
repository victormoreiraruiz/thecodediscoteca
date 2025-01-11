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

    // Filtra usuarios por nivel de membresía
    const usuariosFiltrados = usuarios.filter(user => user.membresia === nivel);

    if (usuariosFiltrados.length === 0) {
      setError(`No hay usuarios con membresía ${nivel}`);
      setLoading(false);
      return;
    }

    // Selecciona un ganador aleatorio
    const ganador = usuariosFiltrados[Math.floor(Math.random() * usuariosFiltrados.length)];

    try {
      console.log('Ganador seleccionado:', ganador);

      // Actualiza saldo del ganador y envía la notificación
      const response = await fetch(route('admin.actualizarSaldo'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({
          id: ganador.id,
          saldo: premio, // Enviar premio
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
    <div className="container mx-auto px-6 py-8 text-center">
      <h3 className="text-3xl font-bold text-[#e5cc70] mb-6">Gestión de Sorteos</h3>

      {/* Mensaje de error */}
      {error && <div className="text-red-500 font-semibold mb-4">{error}</div>}

      {/* Resultado del sorteo */}
      {resultado && (
        <div className="bg-[#e5cc70] text-[#860303] p-4 rounded-lg shadow-lg mb-6">
          <p className="font-semibold">
            Ganador del sorteo para <strong>{resultado.nivel}</strong>: 
            <strong> {resultado.ganador.name}</strong> ({resultado.ganador.email}) ha ganado {resultado.premio}€.
          </p>
        </div>
      )}

      {/* Botones de sorteos */}
      <div className="flex flex-col md:flex-row justify-center gap-4">
        <button
          onClick={() => realizarSorteo('plata', 10)}
          disabled={loading}
          className="w-full md:w-1/3 bg-[#860303] text-[#e5cc70] font-semibold py-2 px-6 rounded-lg 
                     hover:bg-red-700 hover:text-yellow-500 transition-transform hover:scale-105"
        >
          {loading ? 'Realizando sorteo...' : 'Sorteo para Plata (10€)'}
        </button>

        <button
          onClick={() => realizarSorteo('oro', 20)}
          disabled={loading}
          className="w-full md:w-1/3 bg-[#860303] text-[#e5cc70] font-semibold py-2 px-6 rounded-lg 
                     hover:bg-red-700 hover:text-yellow-500 transition-transform hover:scale-105"
        >
          {loading ? 'Realizando sorteo...' : 'Sorteo para Oro (20€)'}
        </button>

        <button
          onClick={() => realizarSorteo('diamante', 30)}
          disabled={loading}
          className="w-full md:w-1/3 bg-[#860303] text-[#e5cc70] font-semibold py-2 px-6 rounded-lg 
                     hover:bg-red-700 hover:text-yellow-500 transition-transform hover:scale-105"
        >
          {loading ? 'Realizando sorteo...' : 'Sorteo para Diamante (30€)'}
        </button>
      </div>
    </div>
  );
};

export default AdminSorteos;
