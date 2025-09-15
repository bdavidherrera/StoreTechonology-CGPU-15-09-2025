import { Router } from "express";
import { methodHTPP as ventasController } from "../controllers/ventas.controllers.js";

/* Creamos el enrutador */
const router = Router();

// Crear nueva venta
router.post("/", ventasController.postVenta);

// Obtener todas las ventas (para admin)
router.get("/", ventasController.getVentas);

// Obtener ventas por rango de fechas
router.get("/rango-fechas", ventasController.getVentasByDateRange);

// Obtener estadísticas de ventas
router.get("/estadisticas", ventasController.getVentasStats);

// Obtener ventas de un usuario específico
router.get("/usuario/:idUsuario", ventasController.getVentasByUser);

// Actualizar estado de una venta
router.put("/:idVenta/estado", ventasController.putVentaEstado);

export default router;