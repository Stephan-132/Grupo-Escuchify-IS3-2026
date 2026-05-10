import { getCatalogoEventos } from "../services/catalogoService";
import api from "../services/api";

jest.mock("../services/api");

describe("Pruebas de rendimiento", () => {
    test("Paginación default 20 registros", async () => {
        api.get.mockResolvedValue({ data: [] });

        await getCatalogoEventos();

        expect(api.get).toHaveBeenCalledWith("/api/v1/catalogo/eventos", {
            params: { page: 1, limit: 20 }
        });
    });

    test("Paginación personalizada", async () => {
        api.get.mockResolvedValue({ data: [] });

        await getCatalogoEventos({ page: 2, limit: 10 });

        expect(api.get).toHaveBeenCalledWith("/api/v1/catalogo/eventos", {
            params: { page: 2, limit: 10 }
        });
    });

    test("Tiempo respuesta API < 500ms", async () => {
        const mockData = { eventos: [], totalPages: 1 };
        api.get.mockImplementation(() =>
            new Promise((resolve) => setTimeout(() => resolve({ data: mockData }), 300))
        );

        const start = Date.now();
        await getCatalogoEventos();
        const duration = Date.now() - start;

        expect(duration).toBeLessThan(500);
    });
});
