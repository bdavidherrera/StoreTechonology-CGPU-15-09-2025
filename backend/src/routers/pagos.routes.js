import {Router} from "express";
import { methodHTPP as pagosController} from "../controllers/pagos.controllers.js";

/*Creamos el enrutador */
const router = Router();

// Crear nuevo pago
router.post("/", pagosController.postPago);

// Obtener todos los pagos (para admin)
router.get("/", pagosController.getPagos);

// Obtener pagos de un usuario específico
router.get("/usuario/:idUsuario", pagosController.getPagosByUser);

// Obtener formas de pago disponibles
router.get("/formas-pago", pagosController.getFormasPago);

// Actualizar estado de un pago
router.put("/:idPago/estado", pagosController.putPagoEstado);

//Mostrar todo del pago
router.get("/MostrarP",pagosController.getPagosTodo)

//Contador de pagos

router.get("/count", pagosController.countPagos)

export default router;