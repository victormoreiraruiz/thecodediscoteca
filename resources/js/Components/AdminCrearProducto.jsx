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
    axios.get("/admin/categorias", { withCredentials: true }).then((response) => {
      setCategorias(response.data);
    }).catch(error => {
      console.error("Error al obtener categorías:", error);
    });
  }, []);

  const handleChange = (e) => {
    setProducto({ ...producto, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/admin/productos", producto, { withCredentials: true });

      Swal.fire("Éxito", "Producto creado correctamente", "success");
      setProducto({ nombre: "", precio: "", descripcion: "", stock: "", categoria_id: "" });
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al crear el producto", "error");
    }
  };

  return (
    <div>
      <h2>Crear Nuevo Producto</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label><h3>Nombre:</h3></label>
          <input type="text" name="nombre" value={producto.nombre} onChange={handleChange} required />
        </div>
        <div>
          <label><h3>Precio (€):</h3></label>
          <input type="number" step="0.01" name="precio" value={producto.precio} onChange={handleChange} required />
        </div>
        <div>
          <label><h3>Descripción:</h3></label>
          <textarea name="descripcion" value={producto.descripcion} onChange={handleChange} required />
        </div>
        <div>
          <label><h3>Stock:</h3></label>
          <input type="number" name="stock" value={producto.stock} onChange={handleChange} required />
        </div>
        <div>
          <label><h3>Categoría:</h3></label>
          <select name="categoria_id" value={producto.categoria_id} onChange={handleChange} required>
            <option value="">Selecciona una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
            ))}
          </select>
        </div>
        <button type="submit">Crear Producto</button>
      </form>
    </div>
  );
};

export default AdminCrearProducto;
