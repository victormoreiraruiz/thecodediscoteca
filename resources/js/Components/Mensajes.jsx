import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs"; //  Para formatear la fecha
import "dayjs/locale/es"; // Configura el idioma español

dayjs.locale("es");

const Mensajes = () => {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMensajes();
  }, []);

  const fetchMensajes = async () => {
    try {
      const response = await axios.get("/mensajes");
      setMensajes(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al obtener los mensajes:", error);
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold text-center text-[#e5cc70] mb-6">📩 Mensajes Recibidos</h2>

      {loading ? (
        <p className="text-center text-white">Cargando mensajes...</p>
      ) : mensajes.length === 0 ? (
        <p className="text-center text-white">No hay mensajes pendientes.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-[#860303] text-white border border-[#e5cc70] rounded-lg">
            <thead className="bg-[#e5cc70] text-[#860303]">
              <tr>
                <th className="py-2 px-4 border">Fecha</th>
                <th className="py-2 px-4 border">Nombre</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Teléfono</th>
                <th className="py-2 px-4 border">Asunto</th>
                <th className="py-2 px-4 border">Mensaje</th>
              </tr>
            </thead>
            <tbody>
              {mensajes.map((mensaje) => (
                <tr key={mensaje.id} className="border-t">
                  <td className="py-2 px-4 border">{dayjs(mensaje.created_at).format("DD/MM/YYYY HH:mm")}</td>
                  <td className="py-2 px-4 border">{mensaje.nombre} {mensaje.apellidos}</td>
                  <td className="py-2 px-4 border">{mensaje.email}</td>
                  <td className="py-2 px-4 border">{mensaje.telefono}</td>
                  <td className="py-2 px-4 border">{mensaje.asunto}</td>
                  <td className="py-2 px-4 border">{mensaje.mensaje}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Mensajes;
