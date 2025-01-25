import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import axios from "axios";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const EventosSalaConferencias = () => {
  const [motivo, setMotivo] = useState("");
  const [numeroPersonas, setNumeroPersonas] = useState(250);
  const [precioEntrada, setPrecioEntrada] = useState("");
  const [nombreConcierto, setNombreConcierto] = useState("");
  const [horaInicio, setHoraInicio] = useState("");
  const [horaFin, setHoraFin] = useState("");
  const [cartel, setCartel] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);
  const [acceptPolicies, setAcceptPolicies] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mostrarBotonConvertir, setMostrarBotonConvertir] = useState(false);

  useEffect(() => {
    verificarRolUsuario(); // Verificar el rol del usuario
    fetchBookedDates(); // Cargar fechas reservadas
  }, []);

  const verificarRolUsuario = async () => {
    try {
      const response = await axios.get("/verificar-rol-usuario");
      const { rol } = response.data;

      if (rol !== "promotor" && rol !== "admin") {
        Swal.fire({
          icon: "warning",
          title: "Acceso restringido",
          text: "Para realizar una reserva, debes tener el rol de promotor.",
          confirmButtonText: "Ir",
          buttonsStyling: false,
          customClass: {
            confirmButton:
              "bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700",
            cancelButton:
              "bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/convertir-promotor";
          } else {
            setMostrarBotonConvertir(true);
          }
        });
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: "error",
          title: "No autenticado",
          text: "Debes iniciar sesión para acceder a esta página.",
          confirmButtonText: "Iniciar sesión",
        }).then(() => {
          window.location.href = "/login";
        });
      } else {
        console.error("Error al verificar el rol del usuario:", error);
      }
    }
  };

  const fetchBookedDates = async () => {
    try {
      const response = await axios.get("/api/salas/3/reservas");
      setBookedDates(response.data);
    } catch (error) {
      console.error("Error al cargar las fechas de reservas:", error);
    }
  };

  const handleDateChange = (date) => {
    if (!isDateBooked(date)) {
      setSelectedDate(date);
    }
  };

  const isDateBooked = (date) => {
    return bookedDates.some(
      (bookedDate) => new Date(bookedDate).toDateString() === date.toDateString()
    );
  };

  const handleCartelChange = (e) => {
    setCartel(e.target.files[0]);
  };

  const validateTimes = () => {
    const [horaInicioH] = horaInicio.split(":").map(Number);
    const [horaFinH, horaFinM] = horaFin.split(":").map(Number);

    if (horaInicioH < 14) {
      Swal.fire({
        icon: "warning",
        title: "Hora de inicio inválida",
        text: "La hora de inicio no puede ser antes de las 14:00.",
      });
      return false;
    }


    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptPolicies) {
      Swal.fire({
        icon: "warning",
        title: "Políticas de la sala",
        text: "Debes aceptar las políticas de la sala antes de continuar.",
      });
      return;
    }

    if (!selectedDate) {
      Swal.fire({
        icon: "warning",
        title: "Fecha requerida",
        text: "Por favor, selecciona una fecha disponible en el calendario.",
      });
      return;
    }

    if (!precioEntrada || !nombreConcierto || !horaInicio || !horaFin) {
      Swal.fire({
        icon: "warning",
        title: "Campos obligatorios",
        text: "Por favor, completa todos los campos obligatorios para el concierto.",
      });
      return;
    }

    if (!validateTimes()) {
      return; // Detener si las validaciones de tiempo fallan
    }

    const adjustedDate = new Date(
      selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    const formData = new FormData();
    formData.append("fecha_reserva", adjustedDate);
    formData.append("asistentes", numeroPersonas);
    formData.append("descripcion", motivo);
    formData.append("tipo_reserva", "concierto");
    formData.append("precio_entrada", precioEntrada);
    formData.append("nombre_concierto", nombreConcierto);
    formData.append("hora_inicio", horaInicio);
    formData.append("hora_fin", horaFin);
    if (cartel) {
      formData.append("cartel", cartel);
    }

    try {
      setLoading(true);
      await axios.post("/api/salas/3/reservar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Reserva creada",
        text: "Reserva creada exitosamente. Se ha generado la factura.",
      });

      setMotivo("");
      setPrecioEntrada("");
      setNombreConcierto("");
      setHoraInicio("");
      setHoraFin("");
      setCartel(null);
      setSelectedDate(null);
      setAcceptPolicies(false);
      fetchBookedDates();
    } catch (error) {
      console.error("Error al crear la reserva:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un problema al realizar la reserva. Inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Sala de Conferencias</h2>
      <div className="calendar-container">
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          minDate={new Date()}
          className="w-[380px] p-4 bg-[#e5cc70] rounded-lg shadow-lg border border-gray-300"
          tileClassName={({ date }) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (date < today) {
              return "text-gray-400 pointer-events-none";
            }
            if (isDateBooked(date)) {
              return "bg-[#860303] text-white font-semibold rounded-md";
            }
            if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
              return "bg-black text-white font-semibold rounded-md";
            }
            return "hover:bg-gray-200 rounded-md";
          }}
        />
      </div>

      <form onSubmit={handleSubmit} className="event-form">
        <label>
          <h3>Nombre del concierto:</h3>
          <input
            type="text"
            value={nombreConcierto}
            onChange={(e) => setNombreConcierto(e.target.value)}
            placeholder="Nombre del concierto"
            required
          />
        </label>
        <label>
          <h3>Hora de inicio:</h3>
          <input
            type="time"
            value={horaInicio}
            onChange={(e) => setHoraInicio(e.target.value)}
            required
          />
        </label>
        <label>
          <h3>Hora de fin:</h3>
          <input
            type="time"
            value={horaFin}
            onChange={(e) => setHoraFin(e.target.value)}
            required
          />
        </label>
        <label>
          <h3>Cartel del concierto:</h3>
          <input type="file" onChange={handleCartelChange} accept="image/*" required />
        </label>
        <label>
          <h3>Precio de entrada (€):</h3>
          <input
            type="number"
            value={precioEntrada}
            onChange={(e) => setPrecioEntrada(e.target.value)}
            min="0"
            step="0.01"
            required
          />
        </label>
        <label>
          <h3>Describa en qué consiste el evento:</h3>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Describa el evento o motivo"
            required
            className="event-textarea"
          />
        </label>

        <label className="accept-policies">
          <input
            type="checkbox"
            checked={acceptPolicies}
            onChange={(e) => setAcceptPolicies(e.target.checked)}
          />
          <h3>
            He leído y acepto las{" "}
            <a href="/politica-privacidad">políticas de la sala</a>
          </h3>
        </label>

        <button type="submit" className="event-submit-button" disabled={loading}>
          {loading ? "Reservando..." : "RESERVAR"}
        </button>
      </form>

      {mostrarBotonConvertir && (
        <div className="convertir-promotor">
          <button
            onClick={() => (window.location.href = "/convertir-promotor")}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 focus:outline-none mt-4"
          >
            Convertirme en Promotor
          </button>
        </div>
      )}
    </div>
  );
};

export default EventosSalaConferencias;
