import React, { useState, useEffect } from "react";
import { Stage, Layer, Image as KonvaImage, Circle } from "react-konva";

// Hook personalizado para cargar imágenes
const useImage = (src) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => setImage(img);
    img.onerror = () => console.error("Error al cargar la imagen:", src);
  }, [src]);

  return [image];
};

const MapaPersonalizado = ({ onMesaReservada }) => {
  const [background] = useImage("/imagenes/planosdiscoteca.png"); // Ruta de la imagen de fondo
  const [mesas, setMesas] = useState([
    { id: 1, x: 47, y: 226, disponible: true, nombre: "Mesa 1", precio: 150 },
    { id: 2, x: 47, y: 299, disponible: true, nombre: "Mesa 2", precio: 150 },
    { id: 3, x: 47, y: 373, disponible: true, nombre: "Mesa 3", precio: 150 },
    { id: 4, x: 47, y: 447, disponible: true, nombre: "Mesa 4", precio: 150 },
  ]);

  // Cargar disponibilidad de las mesas desde el backend
  useEffect(() => {
    const cargarDisponibilidad = async () => {
      try {
        const response = await fetch("/api/mesas");
        if (!response.ok) throw new Error("Error al cargar la disponibilidad de las mesas");
        const data = await response.json();

        // Actualiza solo la disponibilidad de las mesas en el estado local
        setMesas((prevMesas) =>
          prevMesas.map((mesa) => {
            const mesaEnDb = data.find((m) => m.id === mesa.id);
            return mesaEnDb
              ? { ...mesa, disponible: !mesaEnDb.reservada }
              : mesa;
          })
        );
      } catch (error) {
        console.error("Error al cargar las mesas desde el backend:", error);
      }
    };

    cargarDisponibilidad();
  }, []);

  // Reservar una mesa
  const seleccionarMesa = async (mesa) => {
    if (!mesa.disponible) {
      alert("Esta mesa ya está reservada.");
      return;
    }

    try {
      const response = await fetch("/reservar-mesa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
        },
        body: JSON.stringify({
          mesa_id: mesa.id,
          cantidad: 1, // Reservar una mesa
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Error al reservar la mesa");

      alert(data.message);

      // Actualiza el estado de la mesa
      setMesas((prevMesas) =>
        prevMesas.map((m) =>
          m.id === mesa.id ? { ...m, disponible: false } : m
        )
      );

      // Notificar al componente padre
      onMesaReservada({ id: mesa.id, nombre: mesa.nombre, precio: mesa.precio });
    } catch (error) {
      console.error("Error al reservar la mesa:", error);
      alert("No se pudo reservar la mesa. Inténtalo de nuevo.");
    }
  };

  return (
    <Stage
      width={600} // Ajustamos el ancho del lienzo
      height={600} // Ajustamos el alto del lienzo
      style={{
        margin: "0 auto",
        display: "block",
        border: "1px solid black", // Opcional, para visualizar el contenedor
        backgroundColor: "#860303", // Fondo del contenedor (para encajar con el diseño)
      }}
    >
      <Layer>
        {/* Imagen de fondo */}
        {background && <KonvaImage image={background} width={600} height={600} />}

        {/* Mesas */}
        {mesas.map((mesa) => (
          <Circle
            key={mesa.id}
            x={mesa.x} // Posición X estática
            y={mesa.y} // Posición Y estática
            radius={28}
            fill={mesa.disponible ? "green" : "red"} // Verde si disponible, rojo si reservada
            onClick={() => seleccionarMesa(mesa)}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default MapaPersonalizado;
