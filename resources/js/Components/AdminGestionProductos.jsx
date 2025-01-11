import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminGestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productoEditado, setProductoEditado] = useState({
    id: "",
    nombre: "",
    precio: "",
    descripcion: "",
    stock: "",
    categoria_id: "",
  });

  const [orden, setOrden] = useState({ campo: "nombre", ascendente: true });

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
  }, []);

  const cargarProductos = async () => {
    try {
      const response = await axios.get("/admin/productos");
      setProductos(response.data);
    } catch (error) {
      console.error("Error al obtener los productos:", error);
    }
  };

  const cargarCategorias = async () => {
    try {
      const response = await axios.get("/admin/categorias");
      setCategorias(response.data);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const eliminarProducto = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará el producto permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e5cc70",
      cancelButtonColor: "#860303",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/admin/productos/${id}`);
          Swal.fire("Eliminado", "El producto ha sido eliminado.", "success");
          cargarProductos();
        } catch (error) {
          Swal.fire("Error", "Hubo un problema al eliminar el producto.", "error");
        }
      }
    });
  };

  const seleccionarProductoParaEditar = (producto) => {
    setProductoSeleccionado(producto);
    setProductoEditado({ ...producto });
  };

  const cancelarEdicion = () => {
    setProductoSeleccionado(null);
  };

  const handleChange = (e) => {
    setProductoEditado({ ...productoEditado, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/productos/${productoEditado.id}`, productoEditado);
      Swal.fire("Éxito", "Producto actualizado correctamente", "success");
      cargarProductos();
      setProductoSeleccionado(null);
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al actualizar el producto", "error");
    }
  };

  const ordenarPor = (campo) => {
    const esAscendente = orden.campo === campo ? !orden.ascendente : true;
    setOrden({ campo, ascendente: esAscendente });

    const productosOrdenados = [...productos].sort((a, b) => {
      if (a[campo] < b[campo]) return esAscendente ? -1 : 1;
      if (a[campo] > b[campo]) return esAscendente ? 1 : -1;
      return 0;
    });

    setProductos(productosOrdenados);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-center text-[#e5cc70] mb-6">Gestión de Productos</h2>

      {productoSeleccionado ? (
        <div className="bg-[#860303] p-6 rounded-lg shadow-lg max-w-lg mx-auto">
          <h3 className="text-xl font-semibold text-[#e5cc70] mb-4">Editar Producto</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#e5cc70] font-semibold">Nombre:</label>
              <input type="text" name="nombre" value={productoEditado.nombre} onChange={handleChange} required className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white" />
            </div>
            <div>
              <label className="block text-[#e5cc70] font-semibold">Precio (€):</label>
              <input type="number" step="0.01" name="precio" value={productoEditado.precio} onChange={handleChange} required className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white" />
            </div>
            <div>
              <label className="block text-[#e5cc70] font-semibold">Descripción:</label>
              <textarea name="descripcion" value={productoEditado.descripcion} onChange={handleChange} required className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white" />
            </div>
            <div>
              <label className="block text-[#e5cc70] font-semibold">Categoría:</label>
              <select name="categoria_id" value={productoEditado.categoria_id} onChange={handleChange} required className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white">
                <option value="">Selecciona una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="w-full bg-[#e5cc70] text-[#860303] font-semibold py-2 rounded-lg hover:bg-yellow-500">Guardar Cambios</button>
            <button type="button" onClick={cancelarEdicion} className="w-full bg-gray-600 text-white font-semibold py-2 mt-2 rounded-lg hover:bg-gray-500">Cancelar</button>
          </form>
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#860303] p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-[#e5cc70] mb-4">Lista de Productos</h3>
          <table className="w-full text-[#e5cc70]">
            <thead>
              <tr className="bg-[#e5cc70] text-[#860303] font-bold">
                {["nombre", "precio", "stock", "categoria_id"].map((campo) => (
                  <th key={campo} onClick={() => ordenarPor(campo)} className="py-3 px-4 cursor-pointer text-left">
                    {campo.charAt(0).toUpperCase() + campo.slice(1)}
                    {orden.campo === campo && (orden.ascendente ? " ▲" : " ▼")}
                  </th>
                ))}
                <th className="py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id} className="border-b border-[#e5cc70] text-white">
                  <td className="py-3 px-4">{producto.nombre}</td>
                  <td className="py-3 px-4">{producto.precio} €</td>
                  <td className="py-3 px-4">{producto.stock}</td>
                  <td className="py-3 px-4">{producto.categoria?.nombre || "Sin categoría"}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button onClick={() => seleccionarProductoParaEditar(producto)} className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600">Editar</button>
                    <button onClick={() => eliminarProducto(producto.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminGestionProductos;
