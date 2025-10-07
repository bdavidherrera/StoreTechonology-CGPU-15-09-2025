import getConnection  from "../db/database.js";

// 📈 Obtener resumen general del dashboard
export const obtenerResumenGeneral = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /analytics/resumen-general]");
        
        const result = await connection.query(`
            SELECT 
                (SELECT COUNT(*) FROM ventas WHERE estado_venta = 'confirmada') as total_ventas,
                (SELECT COALESCE(SUM(monto_total), 0) FROM ventas WHERE estado_venta = 'confirmada') as ingresos_totales,
                (SELECT COALESCE(AVG(monto_total), 0) FROM ventas WHERE estado_venta = 'confirmada') as ticket_promedio,
                (SELECT COALESCE(SUM(utilidad), 0) FROM ventas WHERE estado_venta = 'confirmada') as utilidad_total,
                (SELECT COUNT(*) FROM compra) as total_compras,
                (SELECT COALESCE(SUM(total_pagado), 0) FROM compra) as gastos_compras,
                (SELECT COUNT(*) FROM gastos) as total_gastos,
                (SELECT COALESCE(SUM(monto), 0) FROM gastos) as total_gastos_operativos,
                (SELECT COUNT(*) FROM usuario WHERE rol = 'cliente' AND activo = 1 ) as total_clientes,
                (SELECT COUNT(*) FROM producto WHERE activo = 1 AND cantidad > 0) as total_productos,
                (SELECT COALESCE(SUM(cantidad), 0) FROM producto WHERE activo = 1) as stock_total,
                (SELECT COALESCE(SUM(valor * cantidad), 0) FROM producto WHERE activo = 1) as valor_inventario,
                (SELECT COUNT(*) FROM pedidos) as total_pedidos,
                (SELECT COUNT(*) FROM pedidos WHERE estado = 'pendiente') as pendientes,
                (SELECT COUNT(*) FROM pedidos WHERE estado = 'entregado') as entregados
        `);
        
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener el resumen general" });
    }
};

// 📊 Ventas por mes (últimos 12 meses)
export const obtenerVentasPorMes = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /analytics/ventas-por-mes]");
        
        const result = await connection.query(`
            SELECT 
                DATE_FORMAT(fecha_venta, '%Y-%m') as mes,
                COUNT(*) as cantidad_ventas,
                COALESCE(SUM(monto_total), 0) as total_ventas,
                COALESCE(SUM(utilidad), 0) as utilidad
            FROM ventas
            WHERE fecha_venta >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            AND estado_venta = 'confirmada'
            GROUP BY DATE_FORMAT(fecha_venta, '%Y-%m')
            ORDER BY mes ASC
        `);
        
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener ventas por mes" });
    }
};

// 📦 Productos más vendidos
export const obtenerProductosMasVendidos = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /analytics/productos-mas-vendidos]");
        
        const result = await connection.query(`
            SELECT 
                p.nombreProducto,
                p.imagen,
                COALESCE(SUM(dp.cantidad), 0) as cantidad_vendida,
                COALESCE(SUM(dp.total_linea), 0) as ingresos_generados,
                COUNT(DISTINCT dp.idPedido) as num_pedidos
            FROM detallepedido dp
            INNER JOIN producto p ON dp.idProducto = p.idProducto
            INNER JOIN pedidos ped ON dp.idPedido = ped.idPedido
            WHERE ped.estado != 'cancelado'
            GROUP BY p.idProducto, p.nombreProducto, p.imagen
            ORDER BY cantidad_vendida DESC
            LIMIT 10
        `);
        
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener productos más vendidos" });
    }
};

// 💰 Análisis de rentabilidad
export const obtenerAnalisisRentabilidad = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /analytics/analisis-rentabilidad]");
        
        const result = await connection.query(`
            SELECT 
                (SELECT COALESCE(SUM(monto_total), 0) FROM ventas WHERE estado_venta = 'confirmada' AND YEAR(fecha_venta) = YEAR(CURDATE())) as ingresos_totales,
                (SELECT COALESCE(SUM(monto_subtotal), 0) FROM ventas WHERE estado_venta = 'confirmada' AND YEAR(fecha_venta) = YEAR(CURDATE())) as subtotal,
                (SELECT COALESCE(SUM(descuentos), 0) FROM ventas WHERE estado_venta = 'confirmada' AND YEAR(fecha_venta) = YEAR(CURDATE())) as descuentos_totales,
                (SELECT COALESCE(SUM(impuestos), 0) FROM ventas WHERE estado_venta = 'confirmada' AND YEAR(fecha_venta) = YEAR(CURDATE())) as impuestos_totales,
                (SELECT COALESCE(SUM(total_pagado), 0) FROM compra WHERE YEAR(fecha) = YEAR(CURDATE())) as compras,
                (SELECT COALESCE(SUM(monto), 0) FROM gastos WHERE YEAR(fecha) = YEAR(CURDATE())) as gastos_operativos
        `);
        
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener análisis de rentabilidad" });
    }
};

// 👥 Clientes top
export const obtenerClientesTop = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /analytics/clientes-top]");
        
        const result = await connection.query(`
            SELECT 
                u.nombre,
                u.correo,
                u.telefono,
                COUNT(DISTINCT v.idVenta) as num_compras,
                COALESCE(SUM(v.monto_total), 0) as total_gastado,
                COALESCE(AVG(v.monto_total), 0) as ticket_promedio,
                MAX(v.fecha_venta) as ultima_compra
            FROM usuario u
            INNER JOIN ventas v ON u.idUsuario = v.idUsuario
            WHERE u.rol = 'cliente' AND v.estado_venta = 'confirmada'
            GROUP BY u.idUsuario, u.nombre, u.correo, u.telefono
            ORDER BY total_gastado DESC
            LIMIT 10
        `);
        
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener clientes top" });
    }
};

// 📊 Ventas por categoría/producto
export const obtenerVentasPorCategoria = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /analytics/ventas-por-categoria]");
        
        const result = await connection.query(`
            SELECT 
                p.nombreProducto as categoria,
                COUNT(DISTINCT dp.idPedido) as num_pedidos,
                COALESCE(SUM(dp.cantidad), 0) as unidades_vendidas,
                COALESCE(SUM(dp.total_linea), 0) as ingresos
            FROM detallepedido dp
            INNER JOIN producto p ON dp.idProducto = p.idProducto
            INNER JOIN pedidos ped ON dp.idPedido = ped.idPedido
            WHERE ped.estado != 'cancelado'
            GROUP BY p.idProducto, p.nombreProducto
            ORDER BY ingresos DESC
        `);
        
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener ventas por categoría" });
    }
};

// 📈 Tendencias de inventario
export const obtenerTendenciasInventario = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /analytics/tendencias-inventario]");
        
        const result = await connection.query(`
            SELECT 
                p.nombreProducto,
                p.cantidad as stock_actual,
                p.valor as precio,
                COALESCE(SUM(dp.cantidad), 0) as total_vendido,
                COUNT(DISTINCT dp.idPedido) as veces_vendido,
                (p.cantidad * p.valor) as valor_stock
            FROM producto p
            LEFT JOIN detallepedido dp ON p.idProducto = dp.idProducto
            WHERE p.activo = 1
            GROUP BY p.idProducto, p.nombreProducto, p.cantidad, p.valor
            ORDER BY total_vendido DESC
        `);
        
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener tendencias de inventario" });
    }
};

// 💳 Métodos de pago más utilizados
export const obtenerMetodosPagoMasUsados = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /analytics/metodos-pago]");
        
        const result = await connection.query(`
            SELECT 
                fp.nombre as metodo_pago,
                COUNT(*) as num_transacciones,
                COALESCE(SUM(p.monto_total), 0) as total_procesado,
                COALESCE(AVG(p.monto_total), 0) as ticket_promedio
            FROM pagos p
            INNER JOIN formaspago fp ON p.idFormaPago = fp.idFormaPago
            WHERE p.estado_pago = 'realizado'
            GROUP BY fp.idFormaPago, fp.nombre
            ORDER BY num_transacciones DESC
        `);
        
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener métodos de pago" });
    }
};

// 📊 Análisis de gastos por categoría
export const obtenerGastosPorCategoria = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /analytics/gastos-por-categoria]");
        
        const result = await connection.query(`
            SELECT 
                categoria,
                COUNT(*) as num_gastos,
                COALESCE(SUM(monto), 0) as total_gastado,
                COALESCE(AVG(monto), 0) as promedio
            FROM gastos
            GROUP BY categoria
            ORDER BY total_gastado DESC
        `);
        
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener gastos por categoría" });
    }
};

// 📅 Comparación periódica (mes actual vs mes anterior)
export const obtenerComparacionPeriodica = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /analytics/comparacion-periodica]");
        
        const result = await connection.query(`
            SELECT 
                'actual' as periodo,
                COUNT(*) as ventas,
                COALESCE(SUM(monto_total), 0) as ingresos,
                COALESCE(AVG(monto_total), 0) as ticket_promedio
            FROM ventas
            WHERE MONTH(fecha_venta) = MONTH(CURDATE())
            AND YEAR(fecha_venta) = YEAR(CURDATE())
            AND estado_venta = 'confirmada'
            UNION ALL
            SELECT 
                'anterior' as periodo,
                COUNT(*) as ventas,
                COALESCE(SUM(monto_total), 0) as ingresos,
                COALESCE(AVG(monto_total), 0) as ticket_promedio
            FROM ventas
            WHERE MONTH(fecha_venta) = MONTH(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
            AND YEAR(fecha_venta) = YEAR(DATE_SUB(CURDATE(), INTERVAL 1 MONTH))
            AND estado_venta = 'confirmada'
        `);
        
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener comparación periódica" });
    }
};

// 🎯 KPIs principales
export const obtenerKPIs = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /analytics/kpis]");
        
        const result = await connection.query(`
            SELECT 
                (SELECT COUNT(*) FROM pedidos WHERE fecha_pedido >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as total_pedidos,
                (SELECT COUNT(*) FROM pedidos WHERE estado = 'entregado' AND fecha_pedido >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as entregados,
                (SELECT COALESCE(AVG(monto_total), 0) FROM ventas WHERE estado_venta = 'confirmada' AND fecha_venta >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as valor_promedio_orden,
                (SELECT COALESCE(SUM(cantidad), 0) FROM producto WHERE activo = 1) as stock_total,
                (SELECT COALESCE(SUM(dp.cantidad), 0) FROM detallepedido dp 
                 INNER JOIN pedidos ped ON dp.idPedido = ped.idPedido 
                 WHERE ped.fecha_pedido >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as unidades_vendidas
        `);
        
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener KPIs" });
    }
};

// 📊 Dashboard completo
export const obtenerDashboardCompleto = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /analytics/dashboard-completo]");
        
        const result = await connection.query(`
            SELECT 
                'resumen' as tipo,
                (SELECT COUNT(*) FROM ventas WHERE estado_venta = 'confirmada') as total_ventas,
                (SELECT COALESCE(SUM(monto_total), 0) FROM ventas WHERE estado_venta = 'confirmada') as ingresos_totales,
                (SELECT COALESCE(AVG(monto_total), 0) FROM ventas WHERE estado_venta = 'confirmada') as ticket_promedio,
                (SELECT COUNT(*) FROM usuario WHERE rol = 'cliente' AND activo = 1) as total_clientes,
                (SELECT COUNT(*) FROM producto WHERE activo = 1) as total_productos,
                (SELECT COALESCE(SUM(cantidad), 0) FROM producto WHERE activo = 1) as stock_total
        `);
        
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener dashboard completo" });
    }
};

export const methodHTTP = {
    obtenerResumenGeneral,
    obtenerVentasPorMes,
    obtenerProductosMasVendidos,
    obtenerAnalisisRentabilidad,
    obtenerClientesTop,
    obtenerVentasPorCategoria,
    obtenerTendenciasInventario,
    obtenerMetodosPagoMasUsados,
    obtenerGastosPorCategoria,
    obtenerComparacionPeriodica,
    obtenerKPIs,
    obtenerDashboardCompleto
};