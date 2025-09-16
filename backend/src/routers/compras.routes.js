import { Router } from "express";
import { methodHTTP as Compras} from "../controllers/compra.controllers.js";

const router = Router();

// ✅ Rutas principales de compras
router.get("/", Compras.getCompras);                           // GET /api/compras
router.post("/", Compras.postCompra);                          // POST /api/compras
router.put("/", Compras.putCompra);                            // PUT /api/compras
router.get("/estadisticas", Compras.getEstadisticasCompras);   // GET /api/compras/estadisticas
router.get("/proveedores", Compras.getProveedoresForCompras);  // GET /api/compras/proveedores
router.get("/productos", Compras.getProductosForCompras);      // GET /api/compras/productos
router.get("/:id", Compras.getCompraPorId);                   // GET /api/compras/:id
router.delete("/:id", Compras.deleteCompra);                  // DELETE /api/compras/:id

export default router;