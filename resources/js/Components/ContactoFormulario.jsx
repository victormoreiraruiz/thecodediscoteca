import React, { useState } from 'react';

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

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio.';
    }

    if (!formData.apellidos.trim()) {
      newErrors.apellidos = 'Los apellidos son obligatorios.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido.';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es obligatorio.';
    } else if (!/^\+[0-9]{2} [0-9]{9}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe tener el formato +XX XXXXXXXXX.';
    }

    if (!formData.asunto.trim()) {
      newErrors.asunto = 'El asunto es obligatorio.';
    } else if (formData.asunto.length > 50) {
      newErrors.asunto = 'El asunto no debe exceder 50 caracteres.';
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es obligatorio.';
    } else if (formData.mensaje.length < 10 || formData.mensaje.length > 300) {
      newErrors.mensaje = 'El mensaje debe tener entre 10 y 300 caracteres.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Formulario enviado con éxito:', formData);
      // Aquí puedes agregar la lógica para enviar los datos al backend
    } else {
      console.log('Errores en el formulario:', errors);
    }
  };

  return (
    <div>
      <h2>Escríbenos.</h2>
      <h6>Complete el formulario</h6>
      <form onSubmit={handleSubmit}>
        <div className="grupoformulario">
          <div className="mitad">
            <label htmlFor="nombre"><h3>Nombre:</h3></label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              placeholder="Nombre"
            />
            {errors.nombre && <span className="error">{errors.nombre}</span>}
          </div>

          <div className="mitad">
            <label htmlFor="apellidos"><h3>Apellidos:</h3></label>
            <input
              type="text"
              id="apellidos"
              name="apellidos"
              value={formData.apellidos}
              onChange={handleInputChange}
              placeholder="Apellidos"
            />
            {errors.apellidos && <span className="error">{errors.apellidos}</span>}
          </div>
        </div>

        <div className="grupoformulario">
          <div className="mitad">
            <label htmlFor="email"><h3>Email:</h3></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>

          <div className="mitad">
            <label htmlFor="telefono"><h3>Teléfono:</h3></label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleInputChange}
              placeholder="+34 XXXXXXXXX"
            />
            {errors.telefono && <span className="error">{errors.telefono}</span>}
          </div>
        </div>

        <label htmlFor="asunto"><h3>Asunto:</h3></label>
        <input
          type="text"
          id="asunto"
          name="asunto"
          value={formData.asunto}
          onChange={handleInputChange}
          placeholder="Asunto"
        />
        {errors.asunto && <span className="error">{errors.asunto}</span>}

        <label htmlFor="mensaje"><h3>Mensaje:</h3></label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows="4"
          value={formData.mensaje}
          onChange={handleInputChange}
          placeholder="Mensaje"
        ></textarea>
        {errors.mensaje && <span className="error">{errors.mensaje}</span>}

        <button type="submit">ENVIAR</button>
      </form>
    </div>
  );
};

export default ContactoFormulario;
