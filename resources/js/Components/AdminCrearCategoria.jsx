import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminCrearCategoria = () => {
  const [nombre, setNombre] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/admin/categorias", { nombre }, { withCredentials: true });

      Swal.fire("Éxito", "Categoría creada correctamente", "success");
      setNombre("");
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al crear la categoría", "error");
    }
  };

  return (
    <div>
      <h2>Crear Nueva Categoría</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label><h3>Nombre de la categoría:</h3></label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <button type="submit">Crear Categoría</button>
      </form>
    </div>
  );
};

export default AdminCrearCategoria;
