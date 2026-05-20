import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CatalogoPage from "../pages/CatalogoPage";
import { getCatalogoEventos, getTiposEvento } from "../services/catalogoService";

jest.mock("../services/catalogoService");

const eventosMock = [
    { id_evento: 1, titulo: "Curso de React", tipo: "Curso", fecha_inicio: "2026-07-01", descripcion_breve: "Aprende React" },
    { id_evento: 2, titulo: "Congreso de IA", tipo: "Congreso", fecha_inicio: "2026-05-15", descripcion_breve: "Inteligencia Artificial" }
];

const tiposMock = [
    { id_tipo_evento: 1, nombre: "Curso" },
    { id_tipo_evento: 2, nombre: "Congreso" }
];

describe("Verificación criterios HU - Catálogo Público", () => {
    beforeEach(() => {
        getCatalogoEventos.mockResolvedValue(eventosMock);
        getTiposEvento.mockResolvedValue(tiposMock);
    });

    test("HU1: Listado eventos activos con título, tipo, fecha", async () => {
        render(<CatalogoPage />);

        await waitFor(() => {
            expect(screen.getByText("Curso de React")).toBeInTheDocument();
            expect(screen.getByText("Congreso de IA")).toBeInTheDocument();
        });

        expect(screen.getByText("Curso")).toBeInTheDocument();
        expect(screen.getByText("Congreso")).toBeInTheDocument();
    });

    test("HU2: Filtro fecha futuros/pasados", async () => {
        render(<CatalogoPage />);

        await waitFor(() => {
            expect(screen.getByText("Próximos Eventos")).toBeInTheDocument();
        });

        await userEvent.click(screen.getByText("Próximos Eventos"));
        expect(getCatalogoEventos).toHaveBeenCalledWith(
            expect.objectContaining({ filtro: "futuros" })
        );
    });

    test("HU3: Búsqueda por tipo", async () => {
        render(<CatalogoPage />);

        await waitFor(() => {
            expect(screen.getByText("Todos los tipos")).toBeInTheDocument();
        });

        const select = screen.getByRole("combobox");
        await userEvent.selectOptions(select, "1");

        expect(getCatalogoEventos).toHaveBeenCalledWith(
            expect.objectContaining({ tipo: "1" })
        );
    });
});
