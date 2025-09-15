import getConnection from "../db/database.js";



// Obtener todas las ventas con información detallada
const getVentas = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /ventas]");
        
        const result = await connection.query(`
            SELECT v.*, 
                   p.infopersona,
                   p.correo_electronico,
                   p.nombresProductos,
                   p.estado as estado_pedido,
                   u.nombre as nombre_usuario,
                   u.cedula as cedula_usuario
            FROM ventas v 
            LEFT JOIN pedidos p ON v.idPedido = p.idPedido
            LEFT JOIN usuario u ON v.idUsuario = u.idUsuario 
            ORDER BY v.fecha_venta DESC
        `);
        
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener las ventas" });
    }
};

// Obtener ventas por rango de fechas - FUNCIÓN CORREGIDA
const getVentasByDateRange = async (req, res) => {
    try {
        const { fecha_inicio, fecha_fin } = req.query;

        if (!fecha_inicio || !fecha_fin) {
            return res.status(400).json({ 
                success: false, 
                message: "Se requieren fecha_inicio y fecha_fin como parámetros" 
            });
        }

        const connection = await getConnection();
        console.log("Conexión obtenida [GET /ventas/rango-fechas]");
        
        // CORREGIDO: Usar DATE() para comparar solo las fechas sin considerar la hora
        // Y agregar un día a fecha_fin para incluir todo ese día
        const result = await connection.query(`
            SELECT v.*, 
                   p.infopersona,
                   p.correo_electronico,
                   p.nombresProductos,
                   p.estado as estado_pedido,
                   u.nombre as nombre_usuario,
                   u.cedula as cedula_usuario
            FROM ventas v 
            LEFT JOIN pedidos p ON v.idPedido = p.idPedido
            LEFT JOIN usuario u ON v.idUsuario = u.idUsuario 
            WHERE DATE(v.fecha_venta) >= DATE(?) 
            AND DATE(v.fecha_venta) <= DATE(?)
            ORDER BY v.fecha_venta DESC
        `, [fecha_inicio, fecha_fin]);
        
        // Calcular estadísticas del período
        const estadisticas = {
            total_ventas: result.length,
            monto_total_periodo: result.reduce((sum, venta) => sum + parseFloat(venta.monto_total), 0),
            promedio_venta: result.length > 0 ? (result.reduce((sum, venta) => sum + parseFloat(venta.monto_total), 0) / result.length) : 0,
            total_descuentos: result.reduce((sum, venta) => sum + parseFloat(venta.descuentos || 0), 0),
            total_impuestos: result.reduce((sum, venta) => sum + parseFloat(venta.impuestos || 0), 0)
        };

        res.json({
            success: true,
            periodo: { fecha_inicio, fecha_fin },
            estadisticas,
            ventas: result
        });
        
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener las ventas por rango de fechas" });
    }
};

// Obtener ventas de un usuario específico
const getVentasByUser = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /ventas/usuario/:id]");
        
        const result = await connection.query(`
            SELECT v.*, 
                   p.infopersona,
                   p.correo_electronico,
                   p.nombresProductos,
                   p.estado as estado_pedido
            FROM ventas v 
            LEFT JOIN pedidos p ON v.idPedido = p.idPedido
            WHERE v.idUsuario = ? 
            ORDER BY v.fecha_venta DESC
        `, [idUsuario]);
        
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener las ventas del usuario" });
    }
};

// Actualizar estado de una venta
const putVentaEstado = async (req, res) => {
    try {
        const { idVenta } = req.params;
        const { estado_venta } = req.body;

        const connection = await getConnection();
        console.log("Conexión obtenida [PUT /venta/:id/estado]");
        
        const result = await connection.query(
            "UPDATE ventas SET estado_venta = ? WHERE idVenta = ?", 
            [estado_venta, idVenta]
        );
        
        res.json({
            success: true,
            message: "Estado de la venta actualizado exitosamente",
            result
        });
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al actualizar el estado de la venta" });
    }
};

// Obtener estadísticas de ventas
const getVentasStats = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /ventas/estadisticas]");
        
        const stats = await connection.query(`
            SELECT 
                COUNT(*) as total_ventas,
                SUM(monto_total) as ingresos_totales,
                AVG(monto_total) as promedio_venta,
                SUM(descuentos) as total_descuentos,
                SUM(impuestos) as total_impuestos,
                COUNT(CASE WHEN estado_venta = 'confirmada' THEN 1 END) as ventas_confirmadas,
                COUNT(CASE WHEN estado_venta = 'anulada' THEN 1 END) as ventas_anuladas,
                COUNT(CASE WHEN estado_venta = 'pendiente' THEN 1 END) as ventas_pendientes
            FROM ventas
        `);
        
        // Estadísticas por mes (últimos 6 meses)
        const ventasPorMes = await connection.query(`
            SELECT 
                YEAR(fecha_venta) as año,
                MONTH(fecha_venta) as mes,
                MONTHNAME(fecha_venta) as nombre_mes,
                COUNT(*) as cantidad_ventas,
                SUM(monto_total) as total_mes
            FROM ventas 
            WHERE fecha_venta >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY YEAR(fecha_venta), MONTH(fecha_venta)
            ORDER BY YEAR(fecha_venta) DESC, MONTH(fecha_venta) DESC
        `);

        res.json({
            estadisticas_generales: stats[0],
            ventas_por_mes: ventasPorMes
        });
        
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener las estadísticas de ventas" });
    }
};

// FUNCIÓN HELPER CORREGIDA para registrar venta automáticamente
const registrarVentaAutomatica = async (idPedido, connection) => {
    try {
        console.log(`Iniciando registro automático de venta para pedido ${idPedido}`);
        
        // Obtener información del pedido con validación
        const pedidoInfo = await connection.query(`
            SELECT idPedido, idUsuario, subtotal, descuentos_totales, 
                   impuestos_totales, total, estado 
            FROM pedidos 
            WHERE idPedido = ?
        `, [idPedido]);

        if (pedidoInfo.length === 0) {
            console.error(`Pedido ${idPedido} no encontrado`);
            return { 
                success: false, 
                message: "Pedido no encontrado",
                error: "PEDIDO_NO_ENCONTRADO"
            };
        }

        const pedido = pedidoInfo[0];
        console.log(`Pedido encontrado - Estado: ${pedido.estado}, Total: ${pedido.total}`);

        // Verificar que no existe ya una venta para este pedido
        const ventaExistente = await connection.query(
            "SELECT idVenta, estado_venta FROM ventas WHERE idPedido = ?", 
            [idPedido]
        );

        if (ventaExistente.length > 0) {
            console.log(`Ya existe venta ${ventaExistente[0].idVenta} para pedido ${idPedido}`);
            return { 
                success: false, 
                message: "Ya existe una venta para este pedido",
                idVentaExistente: ventaExistente[0].idVenta,
                estadoVentaExistente: ventaExistente[0].estado_venta
            };
        }

        // Validar datos del pedido antes de crear la venta
        const montoTotal = parseFloat(pedido.total);
        if (isNaN(montoTotal) || montoTotal <= 0) {
            return {
                success: false,
                message: "El monto total del pedido no es válido",
                error: "MONTO_INVALIDO"
            };
        }

        // Crear la venta con datos validados
        const venta = {
            idPedido: parseInt(pedido.idPedido),
            idUsuario: parseInt(pedido.idUsuario),
            monto_subtotal: parseFloat(pedido.subtotal) || 0,
            descuentos: parseFloat(pedido.descuentos_totales) || 0,
            impuestos: parseFloat(pedido.impuestos_totales) || 0,
            monto_total: montoTotal,
            estado_venta: 'confirmada', // Estado por defecto para ventas automáticas
            fecha_venta: new Date() // Fecha explícita
        };

        console.log("Datos de venta a insertar:", venta);

        // Insertar la venta
        const result = await connection.query("INSERT INTO ventas SET ?", venta);
        
        if (!result.insertId) {
            throw new Error("No se pudo obtener el ID de la venta insertada");
        }

        console.log(`✅ Venta registrada exitosamente - ID: ${result.insertId}`);
        
        return { 
            success: true, 
            idVenta: result.insertId, 
            message: "Venta registrada automáticamente",
            datosVenta: {
                idVenta: result.insertId,
                idPedido: pedido.idPedido,
                monto_total: venta.monto_total,
                estado_venta: venta.estado_venta
            }
        };

    } catch (error) {
        console.error("Error al registrar venta automática:", error);
        return { 
            success: false, 
            error: error.message,
            errorType: error.code || "UNKNOWN_ERROR",
            details: {
                idPedido,
                message: error.message,
                stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
            }
        };
    }
};

// FUNCIÓN CORREGIDA: Crear venta manual con validaciones mejoradas
const postVenta = async (req, res) => {
    try {
        const {
            idPedido,
            idUsuario,
            monto_subtotal,
            descuentos,
            impuestos,
            monto_total,
            estado_venta
        } = req.body;

        // Validaciones de entrada
        if (!idPedido || !idUsuario || !monto_total) {
            return res.status(400).json({ 
                success: false, 
                message: "Faltan datos obligatorios: idPedido, idUsuario y monto_total son requeridos" 
            });
        }

        // Validar que los montos sean números válidos
        const montoTotalNum = parseFloat(monto_total);
        if (isNaN(montoTotalNum) || montoTotalNum <= 0) {
            return res.status(400).json({ 
                success: false, 
                message: "El monto total debe ser un número válido mayor a 0" 
            });
        }

        const venta = {
            idPedido: parseInt(idPedido),
            idUsuario: parseInt(idUsuario),
            monto_subtotal: parseFloat(monto_subtotal) || 0,
            descuentos: parseFloat(descuentos) || 0,
            impuestos: parseFloat(impuestos) || 0,
            monto_total: montoTotalNum,
            estado_venta: estado_venta || 'confirmada'
        };

        const connection = await getConnection();
        console.log("Conexión obtenida [POST /venta]");
        
        // Verificar que el pedido existe
        const pedidoExists = await connection.query(
            "SELECT idPedido, estado, total FROM pedidos WHERE idPedido = ?", 
            [idPedido]
        );

        if (pedidoExists.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "El pedido no existe" 
            });
        }

        // Verificar que no existe ya una venta para este pedido
        const ventaExists = await connection.query(
            "SELECT idVenta FROM ventas WHERE idPedido = ?", 
            [idPedido]
        );

        if (ventaExists.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: "Ya existe una venta registrada para este pedido",
                ventaExistente: ventaExists[0].idVenta
            });
        }

        // Validar que el monto coincida con el pedido (opcional, puede ser diferente por descuentos)
        const diferenciaMonto = Math.abs(parseFloat(pedidoExists[0].total) - montoTotalNum);
        if (diferenciaMonto > 0.01) { // Tolerancia de 1 centavo para redondeos
            console.warn(`Diferencia de monto detectada - Pedido: ${pedidoExists[0].total}, Venta: ${montoTotalNum}`);
        }

        const result = await connection.query("INSERT INTO ventas SET ?", venta);
        
        console.log(`Venta creada manualmente - ID: ${result.insertId}`);
        
        res.json({
            success: true,
            message: "Venta registrada exitosamente",
            idVenta: result.insertId,
            venta: {
                idVenta: result.insertId,
                ...venta
            }
        });

    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ 
            success: false,
            message: "Error al registrar la venta", 
            error: error.message 
        });
    }
};

export const methodHTPP = {
    postVenta,
    getVentas,
    getVentasByDateRange,
    getVentasByUser,
    putVentaEstado,
    getVentasStats,
    registrarVentaAutomatica
};