import React from 'react';

const ContactoFormulario = () => {
  return (
    <div>
      <h2>Escríbenos.</h2>
      <h6>Complete el formulario</h6>
      <form>
        <div className="grupoformulario">
          <div className="mitad">
            <label htmlFor="nombre">Nombre:</label>
            <input type="text" id="nombre" name="nombre" required placeholder="Nombre" />
          </div>

          <div className="mitad">
            <label htmlFor="apellidos">Apellidos:</label>
            <input type="text" id="apellidos" name="apellidos" required placeholder="Apellidos" />
          </div>
        </div>

        <div className="grupoformulario">
          <div className="mitad">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required placeholder="Email" />
          </div>

          <div className="mitad">
            <label htmlFor="telefono">Teléfono:</label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              required
              placeholder="Teléfono"
              pattern="\+[0-9]{2} [0-9]{9}"
            />
          </div>
        </div>

        <label htmlFor="asunto">Asunto:</label>
        <input
          type="text"
          id="asunto"
          name="asunto"
          required
          placeholder="Asunto"
          minLength="1"
          maxLength="50"
        />

        <label htmlFor="mensaje">Mensaje:</label>
        <textarea
          id="mensaje"
          name="mensaje"
          rows="4"
          required
          placeholder="Mensaje"
          minLength="10"
          maxLength="300"
        ></textarea>

        <button type="submit">ENVIAR</button>
      </form>
    </div>
  );
};

export default ContactoFormulario;
