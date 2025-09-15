import {Router} from "express";
import { methodHTPP as pedidosController} from "../controllers/pedidos.controllers.js";

/*Creamos el enrutador */
const router = Router();

// Crear nuevo pedido
router.post("/", pedidosController.postPedido);

// Obtener todos los pedidos (para admin)
router.get("/", pedidosController.getPedidos);

// Obtener pedidos de un usuario específico
router.get("/usuario/:idUsuario", pedidosController.getPedidosByUser);

// Obtener detalle completo de un pedido
router.get("/:idPedido/detalle", pedidosController.getPedidoDetalle);

// Actualizar estado de un pedido
router.put("/:idPedido/estado", pedidosController.putPedidoEstado);

//Mostrar todo de pedidos
router.get("/mostrarPedidos", pedidosController.getPedidosTodo)

export default router;