import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const ContactoFormulario = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    asunto: '',
    mensaje: '',
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar nombre
    if (!formData.nombre.trim()) {
        newErrors.nombre = 'El nombre es obligatorio.';
    }
    
    // Validar apellidos
    if (!formData.apellidos.trim()) {
        newErrors.apellidos = 'Los apellidos son obligatorios.';
    }
    
    // Validar email
    if (!formData.email.trim()) {
        newErrors.email = 'El email es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'El email no es válido.';
    }
    
    // Validar teléfono
    if (!formData.telefono.trim()) {
        newErrors.telefono = 'El teléfono es obligatorio.';
    } else if (!/^\d{9}$/.test(formData.telefono)) { // Teléfono debe tener 9 dígitos numéricos
        newErrors.telefono = 'El teléfono debe tener 9 dígitos.';
    }

    // Validar asunto
    if (!formData.asunto.trim()) {
        newErrors.asunto = 'El asunto es obligatorio.';
    } else if (formData.asunto.length < 5) { // Longitud mínima de 5 caracteres
        newErrors.asunto = 'El asunto debe tener al menos 5 caracteres.';
    }

    // Validar mensaje
    if (!formData.mensaje.trim()) {
        newErrors.mensaje = 'El mensaje es obligatorio.';
    } else if (formData.mensaje.length < 10) { // Longitud mínima de 10 caracteres
        newErrors.mensaje = 'El mensaje debe tener al menos 10 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Si no hay errores, el formulario es válido
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
        await axios.post("/mensajes", formData, {
            headers: {
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
            }
        });

        Swal.fire('Mensaje enviado', 'Tu mensaje ha sido enviado con éxito.', 'success');
        setFormData({ nombre: '', apellidos: '', email: '', telefono: '', asunto: '', mensaje: '' });

    } catch (error) {
        if (error.response && error.response.status === 422) {
            console.error("Errores de validación:", error.response.data.errors);
            Swal.fire("Error", "Hay errores en el formulario. Revisa los campos.", "error");
        } else {
            console.error("Error al enviar el mensaje:", error);
            Swal.fire("Error", "Hubo un problema al enviar el mensaje.", "error");
        }
    }
};

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-center text-[#e5cc70] mb-6">Escríbenos</h2>
      <form onSubmit={handleSubmit} className="bg-[#860303] p-6 rounded-lg shadow-lg max-w-lg mx-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-[#e5cc70] font-semibold">Nombre:</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white" />
            {errors.nombre && <p className="text-red-500">{errors.nombre}</p>}
          </div>
          <div>
            <label className="block text-[#e5cc70] font-semibold">Apellidos:</label>
            <input type="text" name="apellidos" value={formData.apellidos} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white" />
            {errors.apellidos && <p className="text-red-500">{errors.apellidos}</p>}
          </div>
          <div>
            <label className="block text-[#e5cc70] font-semibold">Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white" />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div>
            <label className="block text-[#e5cc70] font-semibold">Teléfono:</label>
            <input type="tel" name="telefono" value={formData.telefono} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white" />
            {errors.telefono && <p className="text-red-500">{errors.telefono}</p>}
          </div>
          <div>
            <label className="block text-[#e5cc70] font-semibold">Asunto:</label>
            <input type="text" name="asunto" value={formData.asunto} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white" />
            {errors.asunto && <p className="text-red-500">{errors.asunto}</p>}
          </div>
          <div>
            <label className="block text-[#e5cc70] font-semibold">Mensaje:</label>
            <textarea name="mensaje" value={formData.mensaje} onChange={handleInputChange} className="w-full px-4 py-2 border border-[#e5cc70] rounded-lg bg-gray-900 text-white" rows="4"></textarea>
            {errors.mensaje && <p className="text-red-500">{errors.mensaje}</p>}
          </div>
          <button type="submit" className="w-full bg-[#e5cc70] text-[#860303] font-semibold py-2 rounded-lg hover:bg-yellow-500">ENVIAR</button>
        </div>
      </form>
    </div>
  );
};

export default ContactoFormulario;
