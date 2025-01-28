import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminCrearProducto = () => {
  const [producto, setProducto] = useState({
    nombre: "",
    precio: "",
    descripcion: "",
    stock: "",
    categoria_id: "",
  });
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    axios .get("/admin/categorias", { withCredentials: true }) // Realiza una solicitud GET para obtener las categorías 
    .then((response) => {
        setCategorias(response.data);   // Guarda las categorías obtenidas en el estado correspondiente
      })
      .catch((error) => {
        console.error("Error al obtener categorías:", error);
      });
  }, []);

  // Manejador de cambios en los campos del formulario
  const handleChange = (e) => { // Actualiza el estado del producto con el valor del campo modificado
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recargar la página)
    try {    // Realiza una solicitud POST para crear un nuevo producto
      await axios.post("/admin/productos", producto, { withCredentials: true });

      Swal.fire({
        title: "¡Éxito!",
        text: "Producto creado correctamente",
        icon: "success",
        confirmButtonColor: "#e5cc70",
        confirmButtonText: "Ok",
        customClass: {
          confirmButton: 'bg-[#860303] text-white px-10 py-2 rounded-lg hover:bg-red-700',
        }
      });
       // Limpia el formulario estableciendo los campos del producto a valores iniciales
      setProducto({ nombre: "", precio: "", descripcion: "", stock: "", categoria_id: "" });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: "Hubo un problema al crear el producto",
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
          Crear Nuevo Producto
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-[#e5cc70] font-semibold">Nombre:</label>
            <input
              type="text"
              name="nombre"
              value={producto.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white focus:border-yellow-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#e5cc70] font-semibold">Precio (€):</label>
            <input
              type="number"
              step="0.01"
              name="precio"
              value={producto.precio}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white focus:border-yellow-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#e5cc70] font-semibold">Descripción:</label>
            <textarea
              name="descripcion"
              value={producto.descripcion}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white focus:border-yellow-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#e5cc70] font-semibold">Stock:</label>
            <input
              type="number"
              name="stock"
              value={producto.stock}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white focus:border-yellow-500"
            />
          </div>

          <div className="mb-4">
            <label className="block text-[#e5cc70] font-semibold">Categoría:</label>
            <select
              name="categoria_id"
              value={producto.categoria_id}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white focus:border-yellow-500"
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#e5cc70] text-[#860303] font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500 transition-transform hover:scale-105"
          >
            Crear Producto
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminCrearProducto;
