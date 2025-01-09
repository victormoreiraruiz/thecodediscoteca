import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const SeleccionarMesaPedido = ({ evento }) => {
  const [mesas, setMesas] = useState([]);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);

  useEffect(() => {
    axios.get("/api/mesas").then((response) => {
      setMesas(response.data);
    });
  }, []);

  const hacerPedido = async () => {
    if (!mesaSeleccionada) {
      Swal.fire("Error", "Debes seleccionar una mesa", "error");
      return;
    }

    try {
      await axios.post("/api/comandas", { mesa_id: mesaSeleccionada, evento_id: evento.id });
      Swal.fire("Pedido realizado", "Tu pedido ha sido enviado a los camareros.", "success");
    } catch (error) {
      Swal.fire("Error", "Hubo un problema con tu pedido.", "error");
    }
  };

  return (
    <div>
      <h3>Selecciona tu mesa</h3>
      <select onChange={(e) => setMesaSeleccionada(e.target.value)}>
        <option value="">Elige una mesa</option>
        {mesas.map((mesa) => (
          <option key={mesa.id} value={mesa.id}>Mesa {mesa.numero}</option>
        ))}
      </select>
      <button onClick={hacerPedido} disabled={!mesaSeleccionada}>Confirmar Pedido</button>
    </div>
  );
};

export default SeleccionarMesaPedido;
