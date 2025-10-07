import { Router } from "express";
import { methodHTTP } from "../controllers/crm.controllers.js";

const router = Router();

// =============================================
// 📋 GRUPO: CASOS DE SOPORTE
// =============================================
router.route("/casos-soporte")
  .get(methodHTTP.getCasosSoporte)
  .post(methodHTTP.postCasoSoporte)
  .put(methodHTTP.putCasoSoporte);

router.route("/casos-soporte/:id_caso")
  .delete(methodHTTP.deleteCasoSoporte);

// =============================================
// 📅 GRUPO: ACTIVIDADES
// =============================================
router.route("/actividades")
  .get(methodHTTP.getActividades)
  .post(methodHTTP.postActividad)
  .put(methodHTTP.putActividad);

router.route("/actividades/:id_actividad")
  .delete(methodHTTP.deleteActividad);

// =============================================
// 💬 GRUPO: INTERACCIONES
// =============================================
router.route("/interacciones")
  .get(methodHTTP.getInteracciones)
  .post(methodHTTP.postInteraccion)
  .put(methodHTTP.putInteraccion);

router.route("/interacciones/:id_interaccion")
  .delete(methodHTTP.deleteInteraccion);

// =============================================
// 💼 GRUPO: OPORTUNIDADES
// =============================================
router.route("/oportunidades")
  .get(methodHTTP.getOportunidades)
  .post(methodHTTP.postOportunidad)
  .put(methodHTTP.putOportunidad);

router.route("/oportunidades/:id_oportunidad")
  .delete(methodHTTP.deleteOportunidad);

// =============================================
// 🔍 GRUPO: BÚSQUEDA Y MÉTRICAS
// =============================================
router.route("/buscar")
  .get(methodHTTP.buscarCRM);

router.route("/dashboard")
  .get(methodHTTP.getDashboardCRM);

router.route("/metricas/tasa-conversion")
  .get(methodHTTP.getTasaConversion);

router.route("/metricas/satisfaccion")
  .get(methodHTTP.getSatisfaccionCliente);

router.route("/metricas/retencion")
  .get(methodHTTP.getRetencionClientes);

router.route("/metricas/churn-rate")
  .get(methodHTTP.getChurnRate);

// Nueva ruta para obtener interacciones por cliente
router.route("/interacciones/cliente/:id_cliente")
  .get(methodHTTP.getInteraccionesPorCliente);

export default router;