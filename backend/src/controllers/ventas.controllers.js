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
                   u.cedula as cedula_usuario,
                   u.rol as rol_usuario
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
        
        const result = await connection.query(`
            SELECT v.*, 
                   p.infopersona,
                   p.correo_electronico,
                   p.nombresProductos,
                   p.estado as estado_pedido,
                   u.nombre as nombre_usuario,
                   u.cedula as cedula_usuario,
                   u.rol as rol_usuario
            FROM ventas v 
            LEFT JOIN pedidos p ON v.idPedido = p.idPedido
            LEFT JOIN usuario u ON v.idUsuario = u.idUsuario 
            WHERE DATE(v.fecha_venta) >= DATE(?) 
            AND DATE(v.fecha_venta) <= DATE(?)
            ORDER BY v.fecha_venta DESC
        `, [fecha_inicio, fecha_fin]);
        
        // Calcular estadísticas del período con datos empresariales
        const estadisticas = {
            total_ventas: result.length,
            monto_total_periodo: result.reduce((sum, venta) => sum + parseFloat(venta.monto_total), 0),
            promedio_venta: result.length > 0 ? (result.reduce((sum, venta) => sum + parseFloat(venta.monto_total), 0) / result.length) : 0,
            total_descuentos: result.reduce((sum, venta) => sum + parseFloat(venta.descuentos || 0), 0),
            total_impuestos: result.reduce((sum, venta) => sum + parseFloat(venta.impuestos || 0), 0),
            // NUEVO: Estadísticas empresariales
            costo_total_periodo: result.reduce((sum, venta) => sum + parseFloat(venta.costo_total || 0), 0),
            utilidad_total_periodo: result.reduce((sum, venta) => sum + parseFloat(venta.utilidad || 0), 0),
            total_retefuente: result.reduce((sum, venta) => sum + parseFloat(venta.retencion_fuente || 0), 0),
            ventas_con_retefuente: result.filter(venta => venta.aplica_retefuente).length,
            margen_promedio: 0
        };

        // Calcular margen promedio
        if (estadisticas.monto_total_periodo > 0) {
            estadisticas.margen_promedio = (estadisticas.utilidad_total_periodo / estadisticas.monto_total_periodo) * 100;
        }

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
                   p.estado as estado_pedido,
                   u.rol as rol_usuario
            FROM ventas v 
            LEFT JOIN pedidos p ON v.idPedido = p.idPedido
            LEFT JOIN usuario u ON v.idUsuario = u.idUsuario
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

// FUNCIÓN MEJORADA: Obtener estadísticas de ventas con análisis empresarial
const getVentasStats = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /ventas/estadisticas]");
        
        // Estadísticas generales con datos empresariales
        const stats = await connection.query(`
            SELECT 
                COUNT(*) as total_ventas,
                SUM(monto_total) as ingresos_totales,
                AVG(monto_total) as promedio_venta,
                SUM(descuentos) as total_descuentos,
                SUM(impuestos) as total_impuestos,
                SUM(costo_total) as costos_totales,
                SUM(utilidad) as utilidad_total,
                SUM(retencion_fuente) as retefuente_total,
                COUNT(CASE WHEN aplica_retefuente = 1 THEN 1 END) as ventas_con_retefuente,
                COUNT(CASE WHEN estado_venta = 'confirmada' THEN 1 END) as ventas_confirmadas,
                COUNT(CASE WHEN estado_venta = 'anulada' THEN 1 END) as ventas_anuladas,
                COUNT(CASE WHEN estado_venta = 'pendiente' THEN 1 END) as ventas_pendientes,
                AVG(CASE WHEN monto_total > 0 THEN (utilidad / monto_total) * 100 ELSE 0 END) as margen_promedio
            FROM ventas
        `);
        
        // Estadísticas por mes (últimos 6 meses) con datos empresariales
        const ventasPorMes = await connection.query(`
            SELECT 
                YEAR(fecha_venta) as año,
                MONTH(fecha_venta) as mes,
                MONTHNAME(fecha_venta) as nombre_mes,
                COUNT(*) as cantidad_ventas,
                SUM(monto_total) as total_mes,
                SUM(costo_total) as costos_mes,
                SUM(utilidad) as utilidad_mes,
                SUM(retencion_fuente) as retefuente_mes,
                AVG(CASE WHEN monto_total > 0 THEN (utilidad / monto_total) * 100 ELSE 0 END) as margen_mes
            FROM ventas 
            WHERE fecha_venta >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY YEAR(fecha_venta), MONTH(fecha_venta)
            ORDER BY YEAR(fecha_venta) DESC, MONTH(fecha_venta) DESC
        `);

        // NUEVO: Top productos más rentables
        const topProductosRentables = await connection.query(`
            SELECT 
                pr.nombreProducto,
                SUM(dp.cantidad) as total_vendido,
                SUM(dp.total_linea) as ingresos_producto,
                SUM(dp.cantidad * pr.precio_costo) as costos_producto,
                (SUM(dp.total_linea) - SUM(dp.cantidad * pr.precio_costo)) as utilidad_producto,
                CASE 
                    WHEN SUM(dp.total_linea) > 0 
                    THEN ((SUM(dp.total_linea) - SUM(dp.cantidad * pr.precio_costo)) / SUM(dp.total_linea)) * 100 
                    ELSE 0 
                END as margen_producto
            FROM ventas v
            JOIN pedidos p ON v.idPedido = p.idPedido
            JOIN detallepedido dp ON p.idPedido = dp.idPedido
            JOIN producto pr ON dp.idProducto = pr.idProducto
            WHERE v.estado_venta = 'confirmada'
            GROUP BY pr.idProducto, pr.nombreProducto
            HAVING total_vendido > 0
            ORDER BY utilidad_producto DESC
            LIMIT 10
        `);

        // NUEVO: Análisis de clientes empresa vs regulares
        const analisisClientes = await connection.query(`
            SELECT 
                u.rol as tipo_cliente,
                COUNT(DISTINCT v.idVenta) as total_ventas,
                SUM(v.monto_total) as ingresos_totales,
                AVG(v.monto_total) as ticket_promedio,
                SUM(v.utilidad) as utilidad_total,
                SUM(v.retencion_fuente) as retefuente_total,
                COUNT(CASE WHEN v.aplica_retefuente = 1 THEN 1 END) as ventas_con_retefuente
            FROM ventas v
            JOIN usuario u ON v.idUsuario = u.idUsuario
            WHERE v.estado_venta = 'confirmada'
            GROUP BY u.rol
        `);

        res.json({
            estadisticas_generales: stats[0],
            ventas_por_mes: ventasPorMes,
            top_productos_rentables: topProductosRentables,
            analisis_clientes: analisisClientes
        });
        
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener las estadísticas de ventas" });
    }
};

// FUNCIÓN MEJORADA: Registrar venta automáticamente con cálculos empresariales
const registrarVentaAutomatica = async (idPedido, connection, datosEmpresariales = null) => {
    try {
        console.log(`Iniciando registro automático de venta para pedido ${idPedido}`);
        
        // Obtener información del pedido con validación
        const pedidoInfo = await connection.query(`
            SELECT p.idPedido, p.idUsuario, p.subtotal, p.descuentos_totales, 
                   p.impuestos_totales, p.total, p.estado,
                   u.rol as rol_usuario
            FROM pedidos p
            JOIN usuario u ON p.idUsuario = u.idUsuario
            WHERE p.idPedido = ?
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
        const esEmpresa = pedido.rol_usuario === 'empresa';
        
        console.log(`Pedido encontrado - Estado: ${pedido.estado}, Total: ${pedido.total}, Es empresa: ${esEmpresa}`);

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

        // NUEVO: Calcular costos y utilidades si no se proporcionaron datos empresariales
        let costoTotalCalculado = 0;
        let valorRetefuenteCalculado = 0;
        let aplicaRetefuenteCalculado = false;

        if (!datosEmpresariales) {
            // Calcular costos basados en los detalles del pedido
            const detallesPedido = await connection.query(`
                SELECT dp.cantidad, dp.precio_unitario, p.precio_costo,
                       p.porcentaje_retefuente, pr.porcentaje_retefuente as proveedor_retefuente
                FROM detallepedido dp
                JOIN producto p ON dp.idProducto = p.idProducto
                LEFT JOIN proveedor pr ON p.idProveedor = pr.idProveedor
                WHERE dp.idPedido = ?
            `, [idPedido]);

            for (const detalle of detallesPedido) {
                // Calcular costo total
                const costoUnitario = parseFloat(detalle.precio_costo) || 0;
                costoTotalCalculado += costoUnitario * parseInt(detalle.cantidad);

                // Calcular retención en la fuente para empresas
                if (esEmpresa) {
                    const porcentajeRetefuente = parseFloat(detalle.proveedor_retefuente) || 
                                               parseFloat(detalle.porcentaje_retefuente) || 0;
                    
                    if (porcentajeRetefuente > 0) {
                        const valorItem = parseFloat(detalle.precio_unitario) * parseInt(detalle.cantidad);
                        const retefuenteItem = valorItem * (porcentajeRetefuente / 100);
                        valorRetefuenteCalculado += retefuenteItem;
                        aplicaRetefuenteCalculado = true;
                    }
                }
            }
        } else {
            // Usar los datos proporcionados
            costoTotalCalculado = datosEmpresariales.costoTotal || 0;
            valorRetefuenteCalculado = datosEmpresariales.valorRetefuente || 0;
            aplicaRetefuenteCalculado = datosEmpresariales.aplicaRetefuente || false;
        }

        // Calcular utilidad
        const utilidadCalculada = montoTotal - costoTotalCalculado;

        // Crear la venta con datos empresariales calculados
        const venta = {
            idPedido: parseInt(pedido.idPedido),
            idUsuario: parseInt(pedido.idUsuario),
            monto_subtotal: parseFloat(pedido.subtotal) || 0,
            descuentos: parseFloat(pedido.descuentos_totales) || 0,
            impuestos: parseFloat(pedido.impuestos_totales) || 0,
            monto_total: montoTotal,
            estado_venta: 'confirmada',
            fecha_venta: new Date(),
            // NUEVOS CAMPOS EMPRESARIALES
            costo_total: costoTotalCalculado,
            utilidad: utilidadCalculada,
            retencion_fuente: valorRetefuenteCalculado,
            aplica_retefuente: aplicaRetefuenteCalculado && esEmpresa ? 1 : 0
        };

        console.log("Datos de venta a insertar con cálculos empresariales:", venta);

        // Insertar la venta
        const result = await connection.query("INSERT INTO ventas SET ?", venta);
        
        if (!result.insertId) {
            throw new Error("No se pudo obtener el ID de la venta insertada");
        }

        console.log(`✅ Venta registrada exitosamente con cálculos empresariales - ID: ${result.insertId}`);
        
        return { 
            success: true, 
            idVenta: result.insertId, 
            message: "Venta registrada automáticamente con cálculos empresariales",
            datosVenta: {
                idVenta: result.insertId,
                idPedido: pedido.idPedido,
                monto_total: venta.monto_total,
                estado_venta: venta.estado_venta,
                costo_total: venta.costo_total,
                utilidad: venta.utilidad,
                retencion_fuente: venta.retencion_fuente,
                aplica_retefuente: venta.aplica_retefuente,
                margen_porcentual: venta.monto_total > 0 ? (venta.utilidad / venta.monto_total) * 100 : 0
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

// FUNCIÓN MEJORADA: Crear venta manual con validaciones mejoradas y cálculos empresariales
const postVenta = async (req, res) => {
    try {
        const {
            idPedido,
            idUsuario,
            monto_subtotal,
            descuentos,
            impuestos,
            monto_total,
            estado_venta,
            // NUEVOS CAMPOS OPCIONALES
            costo_total,
            aplica_retefuente,
            calcular_automaticamente = true
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

        const connection = await getConnection();
        console.log("Conexión obtenida [POST /venta]");
        
        // Obtener información del pedido y usuario
        const pedidoUsuario = await connection.query(`
            SELECT p.idPedido, p.estado, p.total, u.rol as rol_usuario
            FROM pedidos p
            JOIN usuario u ON p.idUsuario = u.idUsuario 
            WHERE p.idPedido = ? AND p.idUsuario = ?
        `, [idPedido, idUsuario]);

        if (pedidoUsuario.length === 0) {
            return res.status(400).json({ 
                success: false, 
                message: "El pedido no existe o no pertenece al usuario especificado" 
            });
        }

        const esEmpresa = pedidoUsuario[0].rol_usuario === 'empresa';

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

        // Preparar datos de la venta
        let ventaData = {
            idPedido: parseInt(idPedido),
            idUsuario: parseInt(idUsuario),
            monto_subtotal: parseFloat(monto_subtotal) || 0,
            descuentos: parseFloat(descuentos) || 0,
            impuestos: parseFloat(impuestos) || 0,
            monto_total: montoTotalNum,
            estado_venta: estado_venta || 'confirmada'
        };

        // NUEVO: Calcular o usar datos empresariales proporcionados
        if (calcular_automaticamente) {
            // Calcular automáticamente usando la función de registro automático
            const resultado = await registrarVentaAutomatica(idPedido, connection);
            
            if (resultado.success) {
                return res.json({
                    success: true,
                    message: "Venta registrada exitosamente con cálculos automáticos",
                    idVenta: resultado.idVenta,
                    venta: resultado.datosVenta
                });
            } else {
                throw new Error(resultado.message || "Error en cálculos automáticos");
            }
        } else {
            // Usar datos manuales o calcular básicos
            let costoTotalFinal = parseFloat(costo_total) || 0;
            let valorRetefuente = 0;
            let aplicaRetefuenteFinal = false;

            if (costoTotalFinal === 0) {
                // Calcular costo básico si no se proporciona
                const costosBasicos = await connection.query(`
                    SELECT SUM(dp.cantidad * COALESCE(p.precio_costo, 0)) as costo_calculado
                    FROM detallepedido dp
                    JOIN producto p ON dp.idProducto = p.idProducto
                    WHERE dp.idPedido = ?
                `, [idPedido]);

                costoTotalFinal = parseFloat(costosBasicos[0]?.costo_calculado) || 0;
            }

            // Calcular retención si es empresa
            if (esEmpresa && aplica_retefuente) {
                const retefuenteInfo = await connection.query(`
                    SELECT SUM(
                        dp.precio_unitario * dp.cantidad * 
                        (COALESCE(pr.porcentaje_retefuente, p.porcentaje_retefuente, 0) / 100)
                    ) as retefuente_calculada
                    FROM detallepedido dp
                    JOIN producto p ON dp.idProducto = p.idProducto
                    LEFT JOIN proveedor pr ON p.idProveedor = pr.idProveedor
                    WHERE dp.idPedido = ?
                `, [idPedido]);

                valorRetefuente = parseFloat(retefuenteInfo[0]?.retefuente_calculada) || 0;
                aplicaRetefuenteFinal = valorRetefuente > 0;
            }

            // Agregar campos empresariales
            ventaData.costo_total = costoTotalFinal;
            ventaData.utilidad = montoTotalNum - costoTotalFinal;
            ventaData.retencion_fuente = valorRetefuente;
            ventaData.aplica_retefuente = aplicaRetefuenteFinal ? 1 : 0;

            const result = await connection.query("INSERT INTO ventas SET ?", ventaData);
            
            console.log(`Venta creada manualmente con cálculos empresariales - ID: ${result.insertId}`);
            
            res.json({
                success: true,
                message: "Venta registrada exitosamente",
                idVenta: result.insertId,
                venta: {
                    idVenta: result.insertId,
                    ...ventaData,
                    margen_porcentual: ventaData.monto_total > 0 ? (ventaData.utilidad / ventaData.monto_total) * 100 : 0
                }
            });
        }

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