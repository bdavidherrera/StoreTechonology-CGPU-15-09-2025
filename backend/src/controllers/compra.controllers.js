import getConnection from "../db/database.js";

// ✅ Crear una nueva compra
const postCompra = async (req, res) => {
    const connection = await getConnection();
    
    try {
        await connection.beginTransaction();
        
        const {
            idProveedor,
            productos, // Array de productos: [{idProducto, cantidad, precio_unitario}, ...]
            aplicarRetefuente = false
        } = req.body;

        // Validaciones básicas
        if (!idProveedor || !productos || productos.length === 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Proveedor y productos son requeridos'
            });
        }

        // Verificar que el proveedor existe
        const proveedorExists = await connection.query(
            'SELECT idProveedor, porcentaje_retefuente FROM proveedor WHERE idProveedor = ?',
            [idProveedor]
        );

        console.log("🔍 Resultado consulta proveedor:", proveedorExists);
        console.log("🔍 Primer elemento:", proveedorExists[0]);

        if (proveedorExists.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Proveedor no encontrado'
            });
        }

        // Manejar caso donde porcentaje_retefuente puede ser null o undefined
        const porcentajeRetefuente = proveedorExists[0].porcentaje_retefuente || 0;
        console.log("🔍 Porcentaje retefuente:", porcentajeRetefuente);

        // Calcular totales
        let subtotal = 0;
        const productosValidados = [];

        // Validar productos y calcular subtotal
        for (const producto of productos) {
            const { idProducto, cantidad, precio_unitario } = producto;

            if (!idProducto || !cantidad || !precio_unitario || cantidad <= 0 || precio_unitario <= 0) {
                await connection.rollback();
                return res.status(400).json({
                    success: false,
                    message: 'Datos de producto inválidos'
                });
            }

            // Verificar que el producto existe
            const productoExists = await connection.query(
                'SELECT idProducto, nombreProducto FROM producto WHERE idProducto = ?',
                [idProducto]
            );

            if (productoExists.length === 0) {
                await connection.rollback();
                return res.status(404).json({
                    success: false,
                    message: `Producto con ID ${idProducto} no encontrado`
                });
            }

            const subtotal_linea = cantidad * precio_unitario;
            subtotal += subtotal_linea;

            productosValidados.push({
                idProducto,
                cantidad,
                precio_unitario,
                subtotal_linea,
                nombreProducto: productoExists[0].nombreProducto
            });
        }

        // Calcular retefuente si aplica
        const valor_retefuente = aplicarRetefuente ? (subtotal * porcentajeRetefuente / 100) : 0;
        const total_pagado = subtotal - valor_retefuente;

        // Insertar cabecera de compra
        const compraResult = await connection.query(
            `INSERT INTO compra (idProveedor, subtotal, valor_retefuente, total_pagado) 
             VALUES (?, ?, ?, ?)`,
            [idProveedor, subtotal.toFixed(2), valor_retefuente.toFixed(2), total_pagado.toFixed(2)]
        );

        const idCompra = compraResult.insertId;

        // Insertar detalle de compra y actualizar inventario
        for (const producto of productosValidados) {
            // Insertar detalle de compra
            await connection.query(
                `INSERT INTO detalle_compra (idCompra, idProducto, cantidad, precio_unitario, subtotal_linea)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    idCompra,
                    producto.idProducto,
                    producto.cantidad,
                    producto.precio_unitario.toFixed(2),
                    producto.subtotal_linea.toFixed(2)
                ]
            );

            // Actualizar inventario en producto
            await connection.query(
                `UPDATE producto 
                 SET cantidad = cantidad + ?, 
                     precio_costo = ?
                 WHERE idProducto = ?`,
                [producto.cantidad, producto.precio_unitario.toFixed(2), producto.idProducto]
            );
        }

        await connection.commit();
        console.log("Compra creada exitosamente [POST /compras]");

        res.status(201).json({
            success: true,
            message: 'Compra registrada exitosamente',
            data: {
                idCompra,
                idProveedor,
                subtotal: subtotal.toFixed(2),
                valor_retefuente: valor_retefuente.toFixed(2),
                total_pagado: total_pagado.toFixed(2),
                productos: productosValidados
            }
        });

    } catch (error) {
        await connection.rollback();
        console.error('ERROR 500:', error);
        res.status(500).json({
            success: false,
            message: 'Error al crear la compra',
            error: error.message
        });
    }
};

// ✅ Obtener todas las compras con detalles
const getCompras = async (req, res) => {
    try {
        const { page = 1, limit = 10, idProveedor } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = '';
        let queryParams = [];

        if (idProveedor) {
            whereClause = 'WHERE c.idProveedor = ?';
            queryParams.push(idProveedor);
        }

        const query = `
            SELECT 
                c.idCompra,
                c.idProveedor,
                p.nombre as nombreProveedor,
                p.nit as nitProveedor,
                c.fecha,
                c.subtotal,
                c.valor_retefuente,
                c.total_pagado
            FROM compra c
            JOIN proveedor p ON c.idProveedor = p.idProveedor
            ${whereClause}
            ORDER BY c.fecha DESC
            LIMIT ? OFFSET ?
        `;

        queryParams.push(parseInt(limit), offset);

        const connection = await getConnection();
        console.log("Conexión obtenida [GET /compras]");
        
        const compras = await connection.query(query, queryParams);

        // Obtener el conteo total
        const countQuery = `
            SELECT COUNT(*) as total
            FROM compra c
            ${whereClause}
        `;
        
        const countParams = idProveedor ? [idProveedor] : [];
        const countResult = await connection.query(countQuery, countParams);
        const total = countResult[0].total;

        res.json({
            success: true,
            data: compras,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: total,
                totalPages: Math.ceil(total / limit)
            }
        });

    } catch (error) {
        console.error('ERROR 500:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener las compras',
            error: error.message
        });
    }
};

// ✅ Obtener una compra específica con sus detalles
const getCompraPorId = async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /compras/:id]");

        // Obtener cabecera de compra
        const compra = await connection.query(`
            SELECT 
                c.idCompra,
                c.idProveedor,
                p.nombre as nombreProveedor,
                p.nit as nitProveedor,
                p.direccion as direccionProveedor,
                p.telefono as telefonoProveedor,
                p.correo as correoProveedor,
                c.fecha,
                c.subtotal,
                c.valor_retefuente,
                c.total_pagado
            FROM compra c
            JOIN proveedor p ON c.idProveedor = p.idProveedor
            WHERE c.idCompra = ?
        `, [id]);

        if (compra.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Compra no encontrada'
            });
        }

        // Obtener detalles de compra
        const detalles = await connection.query(`
            SELECT 
                dc.idDetalleCompra,
                dc.idProducto,
                pr.nombreProducto,
                pr.imagen,
                dc.cantidad,
                dc.precio_unitario,
                dc.subtotal_linea
            FROM detalle_compra dc
            JOIN producto pr ON dc.idProducto = pr.idProducto
            WHERE dc.idCompra = ?
            ORDER BY dc.idDetalleCompra
        `, [id]);

        res.json({
            success: true,
            data: {
                compra: compra[0],
                detalles: detalles
            }
        });

    } catch (error) {
        console.error('ERROR 500:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener la compra',
            error: error.message
        });
    }
};

// ✅ Actualizar una compra
const putCompra = async (req, res) => {
    const connection = await getConnection();
    
    try {
        await connection.beginTransaction();
        
        const {
            idCompra,
            idProveedor,
            productos, // Array de productos: [{idProducto, cantidad, precio_unitario}, ...]
            aplicarRetefuente = false
        } = req.body;

        // Validaciones básicas
        if (!idCompra) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'El idCompra es requerido'
            });
        }

        if (!idProveedor || !productos || productos.length === 0) {
            await connection.rollback();
            return res.status(400).json({
                success: false,
                message: 'Proveedor y productos son requeridos'
            });
        }

        // Verificar que la compra existe
        const compraExists = await connection.query(
            'SELECT idCompra FROM compra WHERE idCompra = ?',
            [idCompra]
        );

        if (compraExists.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Compra no encontrada'
            });
        }

        // Verificar que el proveedor existe
        const proveedorExists = await connection.query(
            'SELECT idProveedor, porcentaje_retefuente FROM proveedor WHERE idProveedor = ?',
            [idProveedor]
        );

        if (proveedorExists.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Proveedor no encontrado'
            });
        }

        const porcentajeRetefuente = proveedorExists[0].porcentaje_retefuente || 0;

        // Primero, revertir el inventario de la compra actual
        const detallesAnteriores = await connection.query(
            'SELECT idProducto, cantidad FROM detalle_compra WHERE idCompra = ?',
            [idCompra]
        );

        for (const detalle of detallesAnteriores) {
            await connection.query(
                'UPDATE producto SET cantidad = cantidad - ? WHERE idProducto = ?',
                [detalle.cantidad, detalle.idProducto]
            );
        }

        // Eliminar detalles anteriores
        await connection.query('DELETE FROM detalle_compra WHERE idCompra = ?', [idCompra]);

        // Validar y procesar nuevos productos
        let subtotal = 0;
        const productosValidados = [];

        for (const producto of productos) {
            const { idProducto, cantidad, precio_unitario } = producto;

            if (!idProducto || !cantidad || !precio_unitario || cantidad <= 0 || precio_unitario <= 0) {
                await connection.rollback();
                return res.status(400).json({
                    success: false,
                    message: 'Datos de producto inválidos'
                });
            }

            // Verificar que el producto existe
            const productoExists = await connection.query(
                'SELECT idProducto, nombreProducto FROM producto WHERE idProducto = ?',
                [idProducto]
            );

            if (productoExists.length === 0) {
                await connection.rollback();
                return res.status(404).json({
                    success: false,
                    message: `Producto con ID ${idProducto} no encontrado`
                });
            }

            const subtotal_linea = cantidad * precio_unitario;
            subtotal += subtotal_linea;

            productosValidados.push({
                idProducto,
                cantidad,
                precio_unitario,
                subtotal_linea,
                nombreProducto: productoExists[0].nombreProducto
            });
        }

        // Calcular nuevos totales
        const valor_retefuente = aplicarRetefuente ? (subtotal * porcentajeRetefuente / 100) : 0;
        const total_pagado = subtotal - valor_retefuente;

        // Actualizar cabecera de compra
        await connection.query(
            `UPDATE compra 
             SET idProveedor = ?, subtotal = ?, valor_retefuente = ?, total_pagado = ?
             WHERE idCompra = ?`,
            [idProveedor, subtotal.toFixed(2), valor_retefuente.toFixed(2), total_pagado.toFixed(2), idCompra]
        );

        // Insertar nuevos detalles y actualizar inventario
        for (const producto of productosValidados) {
            // Insertar nuevo detalle
            await connection.query(
                `INSERT INTO detalle_compra (idCompra, idProducto, cantidad, precio_unitario, subtotal_linea)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    idCompra,
                    producto.idProducto,
                    producto.cantidad,
                    producto.precio_unitario.toFixed(2),
                    producto.subtotal_linea.toFixed(2)
                ]
            );

            // Actualizar inventario
            await connection.query(
                `UPDATE producto 
                 SET cantidad = cantidad + ?, 
                     precio_costo = ?
                 WHERE idProducto = ?`,
                [producto.cantidad, producto.precio_unitario.toFixed(2), producto.idProducto]
            );
        }

        await connection.commit();
        console.log("Compra actualizada exitosamente [PUT /compras/:id]");

        res.json({
            success: true,
            message: 'Compra actualizada exitosamente',
            data: {
                idCompra: idCompra,
                idProveedor,
                subtotal: subtotal.toFixed(2),
                valor_retefuente: valor_retefuente.toFixed(2),
                total_pagado: total_pagado.toFixed(2),
                productos: productosValidados
            }
        });

    } catch (error) {
        await connection.rollback();
        console.error('ERROR 500:', error);
        res.status(500).json({
            success: false,
            message: 'Error al actualizar la compra',
            error: error.message
        });
    }
};

// ✅ Eliminar una compra
const deleteCompra = async (req, res) => {
    const connection = await getConnection();
    
    try {
        await connection.beginTransaction();
        
        const { id } = req.params;

        // Verificar que la compra existe
        const compraExists = await connection.query(
            'SELECT idCompra FROM compra WHERE idCompra = ?',
            [id]
        );

        if (compraExists.length === 0) {
            await connection.rollback();
            return res.status(404).json({
                success: false,
                message: 'Compra no encontrada'
            });
        }

        // Obtener detalles de compra para revertir inventario
        const detalles = await connection.query(
            'SELECT idProducto, cantidad FROM detalle_compra WHERE idCompra = ?',
            [id]
        );

        // Revertir inventario (restar las cantidades que se sumaron)
        for (const detalle of detalles) {
            await connection.query(
                'UPDATE producto SET cantidad = cantidad - ? WHERE idProducto = ?',
                [detalle.cantidad, detalle.idProducto]
            );
        }

        // Eliminar compra (detalles se eliminan por CASCADE)
        await connection.query('DELETE FROM compra WHERE idCompra = ?', [id]);

        await connection.commit();
        console.log("Compra eliminada exitosamente [DELETE /compras/:id]");

        res.json({
            success: true,
            message: 'Compra eliminada exitosamente y inventario revertido'
        });

    } catch (error) {
        await connection.rollback();
        console.error('ERROR 500:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar la compra',
            error: error.message
        });
    }
};

// ✅ Obtener estadísticas de compras
const getEstadisticasCompras = async (req, res) => {
    try {
        const { fechaInicio, fechaFin } = req.query;
        
        let whereClause = '';
        let queryParams = [];

        if (fechaInicio && fechaFin) {
            whereClause = 'WHERE DATE(c.fecha) BETWEEN ? AND ?';
            queryParams.push(fechaInicio, fechaFin);
        }

        const connection = await getConnection();
        console.log("Conexión obtenida [GET /compras/estadisticas]");

        const estadisticas = await connection.query(`
            SELECT 
                COUNT(*) as totalCompras,
                SUM(c.subtotal) as totalSubtotal,
                SUM(c.valor_retefuente) as totalRetefuente,
                SUM(c.total_pagado) as totalPagado,
                AVG(c.total_pagado) as promedioCompra
            FROM compra c
            ${whereClause}
        `, queryParams);

        // Compras por proveedor
        const comprasPorProveedor = await connection.query(`
            SELECT 
                p.nombre as proveedor,
                COUNT(c.idCompra) as numeroCompras,
                SUM(c.total_pagado) as totalPagado
            FROM compra c
            JOIN proveedor p ON c.idProveedor = p.idProveedor
            ${whereClause}
            GROUP BY c.idProveedor, p.nombre
            ORDER BY totalPagado DESC
        `, queryParams);

        res.json({
            success: true,
            data: {
                resumen: estadisticas[0],
                comprasPorProveedor: comprasPorProveedor
            }
        });

    } catch (error) {
        console.error('ERROR 500:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas',
            error: error.message
        });
    }
};

// ✅ Obtener proveedores para combo box
const getProveedoresForCompras = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /compras/proveedores]");
        
        const rows = await connection.query(
            "SELECT idProveedor, nombre, nit, porcentaje_retefuente FROM proveedor ORDER BY nombre"
        );
        
        res.json(rows);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ 
            success: false,
            message: "Error al obtener proveedores para compras" 
        });
    }
};

// ✅ Obtener productos para compras
const getProductosForCompras = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /compras/productos]");
        
        const rows = await connection.query(
            "SELECT idProducto, nombreProducto, precio_costo, cantidad FROM producto WHERE activo = '1' ORDER BY nombreProducto"
        );
        
        res.json(rows);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ 
            success: false,
            message: "Error al obtener productos para compras" 
        });
    }
};

export const methodHTTP = {
    getCompras,
    postCompra,
    putCompra,
    getCompraPorId,
    deleteCompra,
    getEstadisticasCompras,
    getProveedoresForCompras,
    getProductosForCompras
};