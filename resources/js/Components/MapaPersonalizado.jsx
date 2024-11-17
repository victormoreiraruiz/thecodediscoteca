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

const MapaPersonalizado = ({ onMesaSeleccionada }) => {
  const [background] = useImage("/imagenes/planosdiscoteca.png"); // Ruta de la imagen de fondo
  const [mesas, setMesas] = useState([
    { id: 1, x: 47, y: 226, disponible: true, nombre: "Mesa 1" },
    { id: 2, x: 47, y: 299, disponible: true, nombre: "Mesa 2" },
    { id: 3, x: 47, y: 373, disponible: true, nombre: "Mesa 3" },
    { id: 4, x: 47, y: 447, disponible: true, nombre: "Mesa 4" },
  ]);

  useEffect(() => {
    const cargarMesas = async () => {
      try {
        const response = await fetch("/api/mesas");
        const data = await response.json();

        // Actualizar disponibilidad según la base de datos
        const mesasActualizadas = mesas.map((mesa) => {
          const mesaEnDb = data.find((m) => m.id === mesa.id);
          return mesaEnDb
            ? { ...mesa, disponible: !mesaEnDb.reservada }
            : mesa;
        });

        setMesas(mesasActualizadas);
      } catch (error) {
        console.error("Error al cargar las mesas desde el backend:", error);
      }
    };

    cargarMesas();
  }, []);

  const seleccionarMesa = (mesa) => {
    if (!mesa.disponible) {
      alert("Esta mesa ya está reservada.");
      return;
    }

    alert(`Has seleccionado la ${mesa.nombre}.`);
    onMesaSeleccionada(mesa); // Notifica al componente padre sobre la selección
  };

  return (
    <Stage
      width={600}
      height={600}
      style={{
        margin: "0 auto",
        display: "block",
        border: "1px solid black",
        backgroundColor: "#860303",
      }}
    >
      <Layer>
        {/* Imagen de fondo */}
        {background && <KonvaImage image={background} width={600} height={600} />}

        {/* Mesas */}
        {mesas.map((mesa) => (
          <Circle
            key={mesa.id}
            x={mesa.x}
            y={mesa.y}
            radius={28}
            fill={mesa.disponible ? "green" : "red"}
            onClick={() => seleccionarMesa(mesa)}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default MapaPersonalizado;
