import React from "react";

const FiltrosFecha = ({ filtroActual, onFiltroChange }) => {
    return (
        <div className="filtros-fecha">
            <button
                className={filtroActual === "futuros" ? "active" : ""}
                onClick={() => onFiltroChange("futuros")}
            >
                Próximos Eventos
            </button>
            <button
                className={filtroActual === "pasados" ? "active" : ""}
                onClick={() => onFiltroChange("pasados")}
            >
                Eventos Pasados
            </button>
            {filtroActual && (
                <button className="limpiar" onClick={() => onFiltroChange(null)}>
                    Mostrar Todos
                </button>
            )}
        </div>
    );
};

export default FiltrosFecha;
