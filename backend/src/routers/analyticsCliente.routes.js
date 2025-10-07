import { Router } from "express";
import { methodHTTP } from "../controllers/analyticsClienteController.js";

const router = Router();

// Rutas para analytics del cliente
router.get("/productos-recientes/:idUsuario", methodHTTP.getProductosRecientes);
router.get("/productos-mejor-precio/:idUsuario", methodHTTP.getProductosMejorPrecio);
router.get("/productos-top-cliente/:idUsuario", methodHTTP.getProductosTopCliente);
router.get("/productos-populares/:idUsuario", methodHTTP.getProductosPopulares);
router.get("/estadisticas-personales/:idUsuario", methodHTTP.getEstadisticasPersonales);
router.get("/tendencias-compra/:idUsuario", methodHTTP.getTendenciasCompra);

export default router;