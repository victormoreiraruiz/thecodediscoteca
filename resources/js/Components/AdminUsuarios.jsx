import React, { useState } from 'react';
import Swal from 'sweetalert2';

const AdminUsuarios = ({ usuarios }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usuariosList, setUsuarios] = useState(usuarios);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const filteredUsuarios = usuariosList.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const sortedUsuarios = [...filteredUsuarios].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const cambiarOrden = field => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const cambiarRol = async (userId, nuevoRol, rolActual) => {
    if (rolActual === 'admin') {
      Swal.fire({
        icon: 'error',
        title: 'Acción no permitida',
        text: 'No se puede cambiar el rol de un administrador.',
        confirmButtonColor: '#860303',
      });
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(route('admin.cambiarRol'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({ id: userId, rol: nuevoRol }),
      });

      if (!response.ok) throw new Error('Error al cambiar el rol');

      const updatedUsers = usuariosList.map(user =>
        user.id === userId ? { ...user, rol: nuevoRol } : user
      );
      setUsuarios(updatedUsers);

      Swal.fire({
        icon: 'success',
        title: 'Rol cambiado',
        text: 'El rol del usuario se ha actualizado correctamente.',
        confirmButtonColor: '#e5cc70',
      });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (userId) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      customClass: {
        confirmButton: 'bg-[#860303] text-white px-10 py-2 rounded-lg hover:bg-red-700',
        cancelButton: 'bg-[#e5cc70] text-[#860303] px-10 py-2 rounded-lg hover:bg-yellow-600',
      },
      buttonsStyling: false, // Desactiva los estilos predeterminados de SweetAlert2
    }).then(async (result) => {
      if (!result.isConfirmed) return;

    
  
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(route('admin.eliminarUsuario', { id: userId }), {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.head.querySelector('meta[name="csrf-token"]').content,
          },
        });
  
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Error al eliminar el usuario');
        }
  
        setUsuarios(usuariosList.filter(user => user.id !== userId));
  
        Swal.fire({
          icon: 'success',
          title: 'Usuario eliminado',
          text: 'El usuario ha sido eliminado correctamente.',
          confirmButtonColor: '#e5cc70',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message,
          confirmButtonColor: '#860303',
        });
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });
  };
  

  return (
    <div className="container mx-auto px-6 py-8">
      <h3 className="text-3xl font-bold text-center text-[#e5cc70] mb-6">Gestión de Usuarios</h3>

      {/* Búsqueda */}
      <div className="mb-6 flex flex-col md:flex-row items-center justify-center gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre o correo"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-800 text-white"
        />
      </div>

      {/* Tabla de usuarios */}
      <div className="overflow-x-auto bg-[#860303] p-4 rounded-lg shadow-lg">
        {error && <div className="text-red-500 text-center mb-4">{error}</div>}

        <table className="w-full text-[#e5cc70]">
          <thead>
            <tr className="bg-[#e5cc70] text-[#860303] font-bold">
              {['name', 'email', 'rol', 'membresia'].map(field => (
                <th
                  key={field}
                  onClick={() => cambiarOrden(field)}
                  className="py-3 px-4 cursor-pointer text-left"
                >
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                  {sortField === field && (sortOrder === 'asc' ? ' ▲' : ' ▼')}
                </th>
              ))}
              <th className="py-3 px-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsuarios.length > 0 ? (
              sortedUsuarios.map(user => (
                <tr key={user.id} className="border-b border-[#e5cc70] text-white">
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.rol}</td>
                  <td className="py-3 px-4">{user.membresia}</td>
                  <td className="py-3 px-4 flex flex-wrap gap-2">
                    {['admin', 'camarero', 'cliente', 'promotor'].map(rol => (
                      <button
                        key={rol}
                        onClick={() => cambiarRol(user.id, rol, user.rol)}
                        disabled={loading}
                        className="bg-[#e5cc70] text-[#860303] px-4 py-2 rounded-lg hover:bg-yellow-500 transition-transform hover:scale-105"
                      >
                        {loading ? 'Cambiando...' : `Hacer ${rol.charAt(0).toUpperCase() + rol.slice(1)}`}
                      </button>
                    ))}
                    <button
                      onClick={() => eliminarUsuario(user.id)}
                      disabled={loading}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-transform hover:scale-105"
                    >
                      {loading ? 'Eliminando...' : 'Eliminar'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-white">No hay usuarios disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsuarios;
