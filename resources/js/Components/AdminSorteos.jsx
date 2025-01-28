import React, { useState } from "react";
import Swal from "sweetalert2";

const AdminSorteos = ({ usuarios = [] }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const realizarSorteo = async (nivel, premio) => {
    if (!usuarios || usuarios.length === 0) {
      setError("No hay usuarios disponibles para realizar el sorteo.");
      return;
    }

    setLoading(true);
    setError(null);

    const usuariosFiltrados = usuarios.filter(user => user.membresia === nivel);

    if (usuariosFiltrados.length === 0) {
      setError(`No hay usuarios con membresía ${nivel}`);
      setLoading(false);
      return;
    }

    // Selecciona un ganador aleatorio
    const ganador = usuariosFiltrados[Math.floor(Math.random() * usuariosFiltrados.length)];


    const ruletaHTML = `
      <style>
        .ruleta-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 200px;
        }
        .ruleta {
          width: 120px; /* misma anchura y altura para q sea circular , radius al 50% para que sea redonda */
          height: 120px;
          border-radius: 50%;
          border: 8px solid #860303;
          position: relative;
          background: conic-gradient( /* alternacion de colores */
            #e5cc70 0deg 45deg,
            #860303 45deg 90deg, 
            #e5cc70 90deg 135deg,
            #860303 135deg 180deg,
            #e5cc70 180deg 225deg,
            #860303 225deg 270deg,
            #e5cc70 270deg 315deg,
            #860303 315deg 360deg
          );
          animation: girar 3s ease-out forwards;
        }
        @keyframes girar {  /* Animación de giro de la ruleta */
          0% { transform: rotate(0deg); } /* Comienza sin girar */
          100% { transform: rotate(${Math.floor(Math.random() * 360) + 1080}deg); }
        }  /* Rota entre 1080 grados (3 vueltas completas) más un ángulo aleatorio entre 0 y 360 */
      </style>
      <div class="ruleta-container">
        <div class="ruleta"></div>
      </div>
    `;

    await Swal.fire({
      title: "Girando la ruleta...",
      html: ruletaHTML, // Contenido del HTML 
      timer: 3000,
      showConfirmButton: false, // Oculta el botón de confirmación
      allowOutsideClick: false, // Evita que el usuario cierre el modal al hacer clic fuera
      allowEscapeKey: false, // Lo mismo pero con scape
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      console.log("Ganador seleccionado:", ganador);

      const response = await fetch(route("admin.actualizarSaldo"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.head.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({
          id: ganador.id,
          saldo: premio,
          mensaje: `¡Felicidades ${ganador.name}! Has ganado el sorteo mensual y tu saldo ha sido incrementado en ${premio} euros.`,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el saldo del ganador");
      }

      // Mostrar mensaje con el ganador
      await Swal.fire({
        title: "¡Ganador seleccionado!",
        html: `<p class="text-lg"><strong>${ganador.name}</strong> (${ganador.email}) ha ganado <strong>${premio}€</strong>!</p>`,
        icon: "success",
        customClass: {
          confirmButton: 'bg-[#860303] text-white px-10 py-2 rounded-lg hover:bg-red-700',
        
        },
      });
    } catch (err) {
      console.error("Error al realizar el sorteo:", err);
      setError("Hubo un error al realizar el sorteo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 text-center">
      <h3 className="text-3xl font-bold text-[#e5cc70] mb-6">Gestión de Sorteos</h3>

      {error && <div className="text-red-500 font-semibold mb-4">{error}</div>}

      <div className="flex flex-col md:flex-row justify-center gap-4">
        <button
          onClick={() => realizarSorteo("plata", 10)}
          disabled={loading}
          className="w-full md:w-1/3 bg-[#860303] text-[#e5cc70] font-semibold py-2 px-6 rounded-lg 
                     hover:bg-red-700 hover:text-yellow-500 transition-transform hover:scale-105"
        >
          {loading ? "Realizando sorteo..." : "Sorteo para Plata (10€)"}
        </button>

        <button
          onClick={() => realizarSorteo("oro", 20)}
          disabled={loading}
          className="w-full md:w-1/3 bg-[#860303] text-[#e5cc70] font-semibold py-2 px-6 rounded-lg 
                     hover:bg-red-700 hover:text-yellow-500 transition-transform hover:scale-105"
        >
          {loading ? "Realizando sorteo..." : "Sorteo para Oro (20€)"}
        </button>

        <button
          onClick={() => realizarSorteo("diamante", 30)}
          disabled={loading}
          className="w-full md:w-1/3 bg-[#860303] text-[#e5cc70] font-semibold py-2 px-6 rounded-lg 
                     hover:bg-red-700 hover:text-yellow-500 transition-transform hover:scale-105"
        >
          {loading ? "Realizando sorteo..." : "Sorteo para Diamante (30€)"}
        </button>
      </div>
    </div>
  );
};

export default AdminSorteos;
