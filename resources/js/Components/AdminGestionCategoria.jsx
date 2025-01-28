import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AdminGestionCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [nombreEditado, setNombreEditado] = useState("");
  const [orden, setOrden] = useState({ campo: "nombre", ascendente: true });

  useEffect(() => { // Se ejecuta una vez cuando el componente se monta.
    cargarCategorias();  // Llama a la función para cargar las categorías desde el servidor.
  }, []);

  const cargarCategorias = async () => { // Función asíncrona para obtener las categorías desde el servidor.
    try {
      const response = await axios.get("/admin/categorias"); // Realiza una solicitud GET a '/admin/categorias'.
      setCategorias(response.data); // Almacena las categorías obtenidas en el estado correspondiente
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const eliminarCategoria = async (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la categoría permanentemente.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e5cc70",
      cancelButtonColor: "#860303",
      confirmButtonText: "Sí",
      cancelButtonText: "No",
      customClass: {
        confirmButton: 'bg-[#860303] text-white px-10 py-2 rounded-lg hover:bg-red-700',
        cancelButton: 'bg-[#e5cc70] text-[#ffffff] px-10 py-2 rounded-lg hover:bg-yellow-600',
      },
    }).then(async (result) => {
      if (result.isConfirmed) {  // Si el usuario confirma la acción, lo borra
        try {
          // Realiza una solicitud DELETE al servidor para eliminar la categoría.
          const response = await axios.delete(`/admin/categorias/${id}`);
  
          Swal.fire({
            title: "Eliminado",
            text: "La categoría ha sido eliminada correctamente.",
            icon: "success",
            confirmButtonColor: "#e5cc70",
            customClass: {
              confirmButton: 'bg-[#860303] text-white px-10 py-2 rounded-lg hover:bg-red-700',
            }
          });
  
          cargarCategorias();      // Recarga la lista de categorías actualizando el estado.
        } catch (error) {
          if (error.response && error.response.status === 400) {
            // Mensaje específico si la categoría tiene productos asociados
            Swal.fire({
              title: "No se puede eliminar",
              text: error.response.data.error,
              icon: "error",
              confirmButtonColor: "#e5cc70",
            });
          } else {
            Swal.fire({
              title: "Error",
              text: "Hubo un problema al eliminar la categoría.",
              icon: "error",
              confirmButtonColor: "#e5cc70",
            });
          }
        }
      }
    });
  };

  const seleccionarCategoriaParaEditar = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setNombreEditado(categoria.nombre);
  };

  const cancelarEdicion = () => {
    setCategoriaSeleccionada(null);
  };

  const handleChange = (e) => {
    setNombreEditado(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/admin/categorias/${categoriaSeleccionada.id}`, { nombre: nombreEditado });
      Swal.fire("Éxito", "Categoría actualizada correctamente", "success");
      cargarCategorias();
      setCategoriaSeleccionada(null);
    } catch (error) {
      Swal.fire("Error", "Hubo un problema al actualizar la categoría", "error");
    }
  };

  const ordenarPor = (campo) => {
    const esAscendente = orden.campo === campo ? !orden.ascendente : true;  // Determina si el orden será ascendente o descendente.
    setOrden({ campo, ascendente: esAscendente });   // Actualiza el estado de orden con el nuevo campo y la dirección.

    // copia del array para no cambiar el original
    const categoriasOrdenadas = [...categorias].sort((a, b) => { 
      if (a[campo] < b[campo]) return esAscendente ? -1 : 1; // compara los valores
      if (a[campo] > b[campo]) return esAscendente ? 1 : -1;
      return 0; // si es igual no cambia nada
    });

    setCategorias(categoriasOrdenadas);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-center text-[#e5cc70] mb-6">Gestión de Categorías</h2>

      {categoriaSeleccionada ? (
        <div className="bg-[#860303] p-6 rounded-lg shadow-lg max-w-lg mx-auto">
          <h3 className="text-xl font-semibold text-[#e5cc70] mb-4">Editar Categoría</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[#e5cc70] font-semibold">Nombre de la categoría:</label>
              <input
                type="text"
                name="nombre"
                value={nombreEditado}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white"
              />
            </div>
            <button type="submit" className="w-full bg-[#e5cc70] text-[#860303] font-semibold py-2 rounded-lg hover:bg-yellow-500">
              Guardar Cambios
            </button>
            <button type="button" onClick={cancelarEdicion} className="w-full bg-gray-600 text-white font-semibold py-2 mt-2 rounded-lg hover:bg-gray-500">
              Cancelar
            </button>
          </form>
        </div>
      ) : (
        <div className="overflow-x-auto bg-[#860303] p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-[#e5cc70] mb-4">Lista de Categorías</h3>
          <table className="w-full text-[#e5cc70]">
            <thead>
              <tr className="bg-[#e5cc70] text-[#860303] font-bold">
                <th onClick={() => ordenarPor("nombre")} className="py-3 px-4 cursor-pointer text-left">
                  Nombre
                  {orden.campo === "nombre" && (orden.ascendente ? " ▲" : " ▼")}
                </th>
                <th className="py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categoria) => (
                <tr key={categoria.id} className="border-b border-[#e5cc70] text-white">
                  <td className="py-3 px-4">{categoria.nombre}</td>
                  <td className="py-3 px-4 flex gap-2">
                    <button onClick={() => seleccionarCategoriaParaEditar(categoria)} className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600">
                      Editar
                    </button>
                    <button onClick={() => eliminarCategoria(categoria.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">
                      Eliminar
                    </button>
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

export default AdminGestionCategorias;
