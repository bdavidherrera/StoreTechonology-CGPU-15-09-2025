import { Router } from "express";
import { methodHTTP as gastos } from "../controllers/gastos.controllers.js";

const router = Router();

// Rutas CRUD
router.get("/", gastos.getGastos);
router.post("/", gastos.postGasto);
router.put("/ActualizarGastos", gastos.putGasto);
router.delete("/:idGasto", gastos.deleteGasto);
router.get("/productos", gastos.getProductosForGastos);

export default router;
