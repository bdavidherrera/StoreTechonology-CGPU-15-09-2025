import { Router } from "express";
import { getHistorialCompras } from "../controllers/historialClientes.controllers.js";

const router = Router();

// aquí recibe el idUsuario desde la URL
router.get("/historial/:idUsuario", getHistorialCompras);

export default router;
