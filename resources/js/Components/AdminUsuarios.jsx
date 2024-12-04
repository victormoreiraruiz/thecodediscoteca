import React, { useState, useEffect } from 'react';

const AdminUsuarios = ({ usuarios }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usuariosList, setUsuarios] = useState(usuarios);  // guarda los usuarios en el estado

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

      // actualiza el rol en el estado local después de un cambio exitoso
      const updatedUsers = usuariosList.map(user => {
        if (user.id === userId) {
          return { ...user, rol: nuevoRol };  // cambia el rol del usuario
        }
        return user;
      });

      setUsuarios(updatedUsers);  // actualiza el estado de los usuarios

      alert('Rol cambiado exitosamente!');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const eliminarUsuario = async (userId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      return; // cancela si el usuario no confirma
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

      // elimina al usuario de la lista de usuarios en el estado local
      const updatedUsers = usuariosList.filter(user => user.id !== userId);
      setUsuarios(updatedUsers);  // actualiza el estado

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
      {error && <div className="error">{error}</div>}

      <div className="usuarios-table">
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosList.length > 0 ? (
              usuariosList.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.rol}</td>
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
                    <button onClick={() => eliminarUsuario(user.id)} disabled={loading}>
                      {loading ? 'Eliminando...' : 'Eliminar Usuario'}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No hay usuarios disponibles.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsuarios;
