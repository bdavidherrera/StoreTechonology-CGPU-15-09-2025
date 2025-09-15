import {Router} from "express";
import { methodHTPP as TecnologiasController} from "../controllers/tecnologia.controllers.js";

/*Creamos el enrutador */
const router = Router();

router.post("/RegistrarProducto", TecnologiasController.postTecnologiaProducto);

router.get("/", TecnologiasController.getTecnologiaProducto);

router.put("/ActualizarProducto", TecnologiasController.putTecnologiaProducto);

router.put("/EliminarProducto/:idProducto", TecnologiasController.deleteTecnologiaProducto);

export default router;