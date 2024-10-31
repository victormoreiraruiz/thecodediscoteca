// EventosVideos.jsx
import React from 'react';

const EventosVideos = () => {
  return (
    <div className="conciertosyeventos">
      <iframe
        src="https://www.youtube.com/embed/lVsZqxQyLfU?si=nsp9UqxuzVYIGPm6"
        title="YouTube video player 1"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
      <iframe
        src="https://www.youtube.com/embed/z_3chx7s2sI?si=haE3OOKwjiUYZOxh"
        title="YouTube video player 2"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default EventosVideos;
