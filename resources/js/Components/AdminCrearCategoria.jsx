import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminCrearCategoria = () => {
  const [nombre, setNombre] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página).
    try {    // Realiza una solicitud POST a la URL '/admin/categorias' para crear una nueva categoría.
      // Envía el nombre de la categoría en el cuerpo de la solicitud y usa credenciales de sesión.
      await axios.post("/admin/categorias", { nombre }, { withCredentials: true });

      Swal.fire({
        title: "¡Éxito!",
        text: "Categoría creada correctamente",
        icon: "success",
        confirmButtonColor: "#e5cc70",
        confirmButtonText: "Ok",
        customClass: {
          confirmButton: 'bg-[#860303] text-white px-10 py-2 rounded-lg hover:bg-red-700',
        },
      });

      setNombre("");
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al crear la categoría",
        icon: "error",
        confirmButtonColor: "#860303",
        confirmButtonText: "Intentar de nuevo",
      });
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 flex justify-center">
      <div className="bg-[#860303] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-[#e5cc70] mb-6">
          Crear Nueva Categoría
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#e5cc70] font-semibold">Nombre de la categoría:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white focus:border-yellow-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-[#e5cc70] text-[#860303] font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-transform hover:scale-105"
          >
            Crear Categoría
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCrearCategoria;
