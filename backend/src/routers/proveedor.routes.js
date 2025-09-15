import { Router } from "express";
import { methodHTPP as proveedor  } from "../controllers/proveedor.controllers.js";

const router = Router();

// Rutas CRUD
router.get("/", proveedor.getProveedor);// Obtener todos
router.post("/", proveedor.postProveedor);// Crear nuevo
router.put("/ActualizarProveedor", proveedor.putProveedor); // Actualizar
router.delete("/:idProveedor", proveedor.deleteProveedor); // Eliminar

export default router;
