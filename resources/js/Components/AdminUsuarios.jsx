import React, { useState } from 'react';

const AdminUsuarios = ({ usuarios }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usuariosList, setUsuarios] = useState(usuarios);
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState('name'); // Campo por el que ordenar
  const [sortOrder, setSortOrder] = useState('asc'); // Orden ascendente o descendente

  // Filtrar usuarios por nombre o correo
  const filteredUsuarios = usuariosList.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase()) ||
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Ordenar usuarios según el campo seleccionado
  const sortedUsuarios = [...filteredUsuarios].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  const cambiarOrden = field => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); // Cambiar el orden
    } else {
      setSortField(field);
      setSortOrder('asc'); // Ordenar ascendente al cambiar de campo
    }
  };

  const cambiarRol = async (userId, nuevoRol) => {
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

      if (!response.ok) {
        throw new Error('Error al cambiar el rol');
      }

      const updatedUsers = usuariosList.map(user => {
        if (user.id === userId) {
          return { ...user, rol: nuevoRol };
        }
        return user;
      });

      setUsuarios(updatedUsers);

      alert('Rol cambiado exitosamente!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (userId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return;
    }

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
        throw new Error('Error al eliminar el usuario');
      }

      const updatedUsers = usuariosList.filter(user => user.id !== userId);
      setUsuarios(updatedUsers);

      alert('Usuario eliminado exitosamente!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Gestión de Usuarios</h3>
     

      {/* Tabla de usuarios */}
      <div className="usuarios-table">
      {error && <div className="error">{error}</div>}

{/* Filtro de búsqueda */}
<div className="busqueda-texto">
  <input
    type="text"
    placeholder="Buscar por nombre o correo"
    value={search}
    onChange={e => setSearch(e.target.value)}
    className="search-input"
  />
  <p>Buscando: <strong>{search}</strong></p> {/* Visualizar lo que se escribe */}
</div>
        <table>
          <thead>
            <tr>
              <th onClick={() => cambiarOrden('name')}>
                Nombre {sortField === 'name' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => cambiarOrden('email')}>
                Email {sortField === 'email' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => cambiarOrden('rol')}>
                Rol {sortField === 'rol' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th onClick={() => cambiarOrden('membresia')}>
                Membresía {sortField === 'membresia' && (sortOrder === 'asc' ? '▲' : '▼')}
              </th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {sortedUsuarios.length > 0 ? (
              sortedUsuarios.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.rol}</td>
                  <td>{user.membresia}</td>
                  <td>
                    <button onClick={() => cambiarRol(user.id, 'admin')} disabled={loading}>
                      {loading ? 'Cambiando...' : 'Hacer Admin'}
                    </button>
                    <button onClick={() => cambiarRol(user.id, 'camarero')} disabled={loading}>
                      {loading ? 'Cambiando...' : 'Hacer Camarero'}
                    </button>
                    <button onClick={() => cambiarRol(user.id, 'cliente')} disabled={loading}>
                      {loading ? 'Cambiando...' : 'Hacer Cliente'}
                    </button>
                    <button onClick={() => cambiarRol(user.id, 'promotor')} disabled={loading}>
                      {loading ? 'Cambiando...' : 'Hacer Promotor'}
                    </button>
                    <button onClick={() => eliminarUsuario(user.id)} disabled={loading}>
                      {loading ? 'Eliminando...' : 'Eliminar Usuario'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay usuarios disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsuarios;
