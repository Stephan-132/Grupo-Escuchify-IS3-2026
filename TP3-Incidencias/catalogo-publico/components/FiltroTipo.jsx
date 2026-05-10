import React, { useEffect, useState } from "react";
import { getTiposEvento } from "../services/catalogoService";

const FiltroTipo = ({ tipoActual, onTipoChange }) => {
    const [tipos, setTipos] = useState([]);

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const data = await getTiposEvento();
                setTipos(data);
            } catch (err) {
                console.error("Error al cargar tipos de evento", err);
            }
        };
        fetchTipos();
    }, []);

    return (
        <div className="filtro-tipo">
            <select
                value={tipoActual || ""}
                onChange={(e) => onTipoChange(e.target.value || null)}
            >
                <option value="">Todos los tipos</option>
                {tipos.map((tipo) => (
                    <option key={tipo.id_tipo_evento} value={tipo.id_tipo_evento}>
                        {tipo.nombre}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FiltroTipo;
