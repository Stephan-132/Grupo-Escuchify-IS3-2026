import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import CatalogoList from "../components/CatalogoList";
import { getCatalogoEventos } from "../services/catalogoService";

jest.mock("../services/catalogoService");

const eventosMock = [
    { id_evento: 1, titulo: "Evento Activo", tipo: "Curso", fecha_inicio: "2026-06-15", descripcion_breve: "Curso activo" },
    { id_evento: 2, titulo: "Evento Finalizado", tipo: "Congreso", fecha_inicio: "2026-03-10", descripcion_breve: "Ya terminó" }
];

describe("CatalogoList - Listado de eventos", () => {
    test("Solo ACTIVO/FINALIZADO aparecen (RN1)", async () => {
        getCatalogoEventos.mockResolvedValue(eventosMock);

        render(<CatalogoList />);

        await waitFor(() => {
            expect(screen.getByText("Evento Activo")).toBeInTheDocument();
            expect(screen.getByText("Evento Finalizado")).toBeInTheDocument();
        });
    });

    test("No se muestran eventos cancelados (RN2)", async () => {
        getCatalogoEventos.mockResolvedValue(eventosMock);

        render(<CatalogoList />);

        await waitFor(() => {
            expect(screen.queryByText("Evento Cancelado")).not.toBeInTheDocument();
        });
    });

    test("Campos requeridos visibles: título, tipo, fecha (HU1)", async () => {
        getCatalogoEventos.mockResolvedValue(eventosMock);

        render(<CatalogoList />);

        await waitFor(() => {
            expect(screen.getByText("Evento Activo")).toBeInTheDocument();
            expect(screen.getByText("Curso")).toBeInTheDocument();
            expect(screen.getByText(/15 de junio/i)).toBeInTheDocument();
        });
    });
});
