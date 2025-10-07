import { Router } from "express";
import { methodHTTP as analytics} from "../controllers/analytics.controllers.js";

const router = Router();

// 📈 Ruta principal - Dashboard completo
router.get('/dashboard-completo', analytics.obtenerDashboardCompleto);

// 📊 Resumen y métricas generales
router.get('/resumen-general', analytics.obtenerResumenGeneral);
router.get('/kpis', analytics.obtenerKPIs);
router.get('/comparacion-periodica', analytics.obtenerComparacionPeriodica);

// 📈 Análisis de ventas
router.get('/ventas-por-mes', analytics.obtenerVentasPorMes);
router.get('/ventas-por-categoria', analytics.obtenerVentasPorCategoria);
router.get('/analisis-rentabilidad', analytics.obtenerAnalisisRentabilidad);

// 📦 Análisis de productos
router.get('/productos-mas-vendidos', analytics.obtenerProductosMasVendidos);
router.get('/tendencias-inventario', analytics.obtenerTendenciasInventario);

// 👥 Análisis de clientes
router.get('/clientes-top', analytics.obtenerClientesTop);

// 💳 Análisis de pagos y gastos
router.get('/metodos-pago', analytics.obtenerMetodosPagoMasUsados);
router.get('/gastos-por-categoria', analytics.obtenerGastosPorCategoria);


export default router;