import React, { useState } from "react";
import CatalogoList from "../components/CatalogoList";
import FiltrosFecha from "../components/FiltrosFecha";
import FiltroTipo from "../components/FiltroTipo";

const CatalogoPage = () => {
    const [filtro, setFiltro] = useState(null);
    const [tipo, setTipo] = useState(null);

    return (
        <div className="catalogo-page">
            <h1>Catálogo de Eventos</h1>
            <div className="filtros-bar">
                <FiltrosFecha filtroActual={filtro} onFiltroChange={setFiltro} />
                <FiltroTipo tipoActual={tipo} onTipoChange={setTipo} />
            </div>
            <CatalogoList filtro={filtro} tipo={tipo} />
        </div>
    );
};

export default CatalogoPage;
