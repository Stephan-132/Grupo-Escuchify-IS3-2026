import { getCatalogoEventos } from "../services/catalogoService";
import api from "../services/api";

jest.mock("../services/api");

describe("Filtros de Catálogo Público", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("Filtro futuros → fecha_inicio >= hoy (RN3)", async () => {
        api.get.mockResolvedValue({ data: [] });

        await getCatalogoEventos({ filtro: "futuros" });

        expect(api.get).toHaveBeenCalledWith("/api/v1/catalogo/eventos", {
            params: { page: 1, limit: 20, filtro: "futuros" }
        });
    });

    test("Filtro pasados → fecha_inicio < hoy (HU2)", async () => {
        api.get.mockResolvedValue({ data: [] });

        await getCatalogoEventos({ filtro: "pasados" });

        expect(api.get).toHaveBeenCalledWith("/api/v1/catalogo/eventos", {
            params: { page: 1, limit: 20, filtro: "pasados" }
        });
    });

    test("Filtro tipo → solo eventos del tipo seleccionado (HU3)", async () => {
        api.get.mockResolvedValue({ data: [] });

        await getCatalogoEventos({ tipo: 1 });

        expect(api.get).toHaveBeenCalledWith("/api/v1/catalogo/eventos", {
            params: { page: 1, limit: 20, tipo: 1 }
        });
    });

    test("Filtro combinado fecha + tipo", async () => {
        api.get.mockResolvedValue({ data: [] });

        await getCatalogoEventos({ filtro: "futuros", tipo: 2 });

        expect(api.get).toHaveBeenCalledWith("/api/v1/catalogo/eventos", {
            params: { page: 1, limit: 20, filtro: "futuros", tipo: 2 }
        });
    });
});
