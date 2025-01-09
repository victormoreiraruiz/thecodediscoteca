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

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Productos</h2>

      {productoSeleccionado ? (
        <div className="bg-white p-6 shadow-md rounded-md">
          <h3 className="text-xl font-semibold mb-4">Editar Producto</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium">Nombre:</label>
              <input type="text" name="nombre" value={productoEditado.nombre} onChange={handleChange} required className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block font-medium">Precio (€):</label>
              <input type="number" step="0.01" name="precio" value={productoEditado.precio} onChange={handleChange} required className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block font-medium">Descripción:</label>
              <textarea name="descripcion" value={productoEditado.descripcion} onChange={handleChange} required className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block font-medium">Stock:</label>
              <input type="number" name="stock" value={productoEditado.stock} onChange={handleChange} required className="w-full border rounded p-2" />
            </div>
            <div>
              <label className="block font-medium">Categoría:</label>
              <select name="categoria_id" value={productoEditado.categoria_id} onChange={handleChange} required className="w-full border rounded p-2">
                <option value="">Selecciona una categoría</option>
                {categorias.map((categoria) => (
                  <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Guardar Cambios</button>
              <button type="button" onClick={cancelarEdicion} className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600">Cancelar</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white p-6 shadow-md rounded-md">
          <h3 className="text-xl font-semibold mb-4">Lista de Productos</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border">Nombre</th>
                  <th className="py-2 px-4 border">Precio (€)</th>
                  <th className="py-2 px-4 border">Stock</th>
                  <th className="py-2 px-4 border">Categoría</th>
                  <th className="py-2 px-4 border">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productos.map((producto) => (
                  <tr key={producto.id} className="border-t">
                    <td className="py-2 px-4 border">{producto.nombre}</td>
                    <td className="py-2 px-4 border">{producto.precio} €</td>
                    <td className="py-2 px-4 border">{producto.stock}</td>
                    <td className="py-2 px-4 border">{producto.categoria ? producto.categoria.nombre : "Sin categoría"}</td>
                    <td className="py-2 px-4 border flex gap-2">
                      <button onClick={() => seleccionarProductoParaEditar(producto)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Editar</button>
                      <button onClick={() => eliminarProducto(producto.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminGestionProductos;
