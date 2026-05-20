import React, { useEffect, useState } from "react";
import EventoCard from "./EventoCard";
import { getCatalogoEventos } from "../services/catalogoService";

const CatalogoList = ({ filtro, tipo }) => {
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        const fetchEventos = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await getCatalogoEventos({ filtro, tipo, page });
                setEventos(data.eventos || data);
                setTotalPages(data.totalPages || 1);
            } catch (err) {
                setError("Error al cargar eventos");
            } finally {
                setLoading(false);
            }
        };
        fetchEventos();
    }, [filtro, tipo, page]);

    if (loading) return <div className="loading">Cargando eventos...</div>;
    if (error) return <div className="error-message">{error}</div>;
    if (eventos.length === 0) return <div className="empty-message">No hay eventos disponibles</div>;

    return (
        <div className="catalogo-list">
            <div className="eventos-grid">
                {eventos.map((evento) => (
                    <EventoCard key={evento.id_evento} evento={evento} />
                ))}
            </div>
            {totalPages > 1 && (
                <div className="pagination">
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button>
                    <span>Página {page} de {totalPages}</span>
                    <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Siguiente</button>
                </div>
            )}
        </div>
    );
};

export default CatalogoList;
