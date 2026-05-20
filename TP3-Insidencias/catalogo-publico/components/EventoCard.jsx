import React from "react";

const EventoCard = ({ evento }) => {
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("es-AR", {
            year: "numeric", month: "long", day: "numeric"
        });
    };

    return (
        <div className="evento-card">
            <h3>{evento.titulo}</h3>
            <span className="evento-tipo">{evento.tipo}</span>
            <p className="evento-fecha">{formatDate(evento.fecha_inicio)}</p>
            {evento.descripcion_breve && (
                <p className="evento-descripcion">{evento.descripcion_breve}</p>
            )}
        </div>
    );
};

export default EventoCard;
