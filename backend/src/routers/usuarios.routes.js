import {Router} from "express";
import { methodHTPP as usuariosController} from "../controllers/usuarios.controllers.js";

/*Creamos el enrutador */
const router = Router();

router.post("/", usuariosController.postUsuarios);

router.get("/admin", usuariosController.getUsuriosAdmin);

router.put("/Actualizar", usuariosController.putUsuarios);

router.put("/EliminarUsuario/:idusuarios", usuariosController.deleteUsuarios);



export default router;