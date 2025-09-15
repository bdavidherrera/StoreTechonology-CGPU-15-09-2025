import getConnection from "../db/database.js"
import { methodHTPP as ventasController } from "./ventas.controllers.js";

// FUNCIÓN CORREGIDA: Actualizar estado del pedido
const putPedidoEstado = async (req, res) => {
    const connection = await getConnection();
    
    try {
        await connection.query("START TRANSACTION");
        
        const { idPedido } = req.params;
        const { estado } = req.body;

        console.log(`Conexión obtenida [PUT /pedido/${idPedido}/estado] - Nuevo estado: ${estado}`);
        
        // Verificar que el pedido existe
        const pedidoExiste = await connection.query(
            "SELECT idPedido, estado FROM pedidos WHERE idPedido = ?", 
            [idPedido]
        );

        if (pedidoExiste.length === 0) {
            await connection.query("ROLLBACK");
            return res.status(404).json({
                success: false,
                message: "Pedido no encontrado"
            });
        }

        const estadoAnterior = pedidoExiste[0].estado;
        console.log(`Estado anterior: ${estadoAnterior} -> Nuevo estado: ${estado}`);
        
        // Actualizar el estado del pedido
        const result = await connection.query(
            "UPDATE pedidos SET estado = ?, fecha_actualizacion = NOW() WHERE idPedido = ?", 
            [estado, idPedido]
        );

        // CORREGIDO: Registrar venta automáticamente cuando el estado cambie a estados que indican confirmación
        const estadosQueGeneranVenta = ['pagado', 'enviado', 'completado', 'confirmado'];
        const estadosAnterioresQueNoGeneranVenta = ['pendiente', 'cancelado', 'anulado'];
        
        if (estadosQueGeneranVenta.includes(estado.toLowerCase()) && 
            estadosAnterioresQueNoGeneranVenta.includes(estadoAnterior.toLowerCase())) {
            
            console.log(`Intentando registrar venta automática para pedido ${idPedido}`);
            
            const resultadoVenta = await ventasController.registrarVentaAutomatica(idPedido, connection);
            
            if (resultadoVenta.success) {
                console.log(`✅ Venta registrada automáticamente - ID: ${resultadoVenta.idVenta}`);
            } else if (!resultadoVenta.message.includes("Ya existe")) {
                console.warn(`⚠️ Advertencia al registrar venta automática: ${resultadoVenta.message}`);
                // No cancelar la transacción, solo advertir
            } else {
                console.log(`ℹ️ La venta ya existe para este pedido`);
            }
        }

        await connection.query("COMMIT");
        
        res.json({
            success: true,
            message: "Estado del pedido actualizado exitosamente",
            estadoAnterior,
            estadoNuevo: estado,
            ventaRegistrada: estadosQueGeneranVenta.includes(estado.toLowerCase()),
            result
        });
        
    } catch (error) {
        await connection.query("ROLLBACK");
        console.error("ERROR 500:", error);
        res.status(500).json({ 
            success: false,
            message: "Error al actualizar el estado del pedido",
            error: error.message 
        });
    } 
};

// FUNCIÓN CORREGIDA: Crear pedido con mejor manejo de ventas
const postPedido = async (req, res) => {
    const connection = await getConnection();
    
    try {
        await connection.query("START TRANSACTION");
        
        const { 
            estado, 
            infopersona, 
            correo_electronico, 
            Direccion, 
            nombresProductos,
            subtotal,
            descuentos_totales,
            impuestos_totales,
            total,
            idUsuario,
            items, // Array de productos con {idProducto, cantidad, precio_unitario}
            datosPago // Datos adicionales para el pago
        } = req.body;

        // Validaciones básicas
        if (!idUsuario || !infopersona || !total) {
            await connection.query("ROLLBACK");
            return res.status(400).json({
                success: false,
                message: "Faltan datos obligatorios: idUsuario, infopersona y total son requeridos"
            });
        }

        // Insertar pedido principal
        const pedido = {
            estado: estado || 'pendiente',
            infopersona,
            correo_electronico,
            Direccion,
            nombresProductos,
            subtotal: parseFloat(subtotal) || 0,
            descuentos_totales: parseFloat(descuentos_totales) || 0,
            impuestos_totales: parseFloat(impuestos_totales) || 0,
            total: parseFloat(total) || 0,
            idUsuario: parseInt(idUsuario)
        };

        console.log("Creando pedido:", pedido);
        
        const pedidoResult = await connection.query("INSERT INTO pedidos SET ?", pedido);
        const idPedido = pedidoResult.insertId;

        console.log(`Pedido creado con ID: ${idPedido}`);

        // Insertar detalles del pedido si se proporcionaron
        if (items && Array.isArray(items) && items.length > 0) {
            console.log(`Procesando ${items.length} items del pedido`);
            
            for (const item of items) {
                // Verificar stock disponible antes de procesar
                const stockDisponible = await connection.query(
                    "SELECT cantidad FROM producto WHERE idProducto = ?",
                    [item.idProducto]
                );

                if (stockDisponible.length === 0) {
                    throw new Error(`Producto con ID ${item.idProducto} no existe`);
                }

                if (stockDisponible[0].cantidad < parseInt(item.cantidad)) {
                    throw new Error(`Stock insuficiente para producto ID ${item.idProducto}. Disponible: ${stockDisponible[0].cantidad}, Solicitado: ${item.cantidad}`);
                }

                const detalle = {
                    idPedido: idPedido,
                    idProducto: parseInt(item.idProducto),
                    cantidad: parseInt(item.cantidad),
                    precio_unitario: parseFloat(item.precio_unitario),
                    descuento_unitario: parseFloat(item.descuento_unitario) || 0,
                    impuesto_unitario: parseFloat(item.impuesto_unitario) || 0,
                    subtotal_linea: parseFloat(item.precio_unitario) * parseInt(item.cantidad),
                    total_linea: parseFloat(item.total_linea) || (parseFloat(item.precio_unitario) * parseInt(item.cantidad))
                };

                await connection.query("INSERT INTO detallepedido SET ?", detalle);

                // Actualizar stock del producto
                const updateResult = await connection.query(
                    "UPDATE producto SET cantidad = cantidad - ? WHERE idProducto = ?",
                    [item.cantidad, item.idProducto]
                );

                if (updateResult.affectedRows === 0) {
                    throw new Error(`No se pudo actualizar el stock del producto ID ${item.idProducto}`);
                }
            }
        }

        // Crear registro de pago si se proporcionaron los datos
        let idPago = null;
        let ventaRegistrada = false;
        
        if (datosPago) {
            console.log("Procesando pago:", datosPago.paymentMethod);
            
            // Buscar el ID correcto de la forma de pago
            let formaPagoId = getFormaPagoId(datosPago.paymentMethod);
            
            const pago = {
                NombrePersona: infopersona.split(' - CC:')[0], // Extraer nombre sin cédula
                Direccion: Direccion,
                idFormaPago: formaPagoId,
                Telefono: datosPago.telefono || null,
                correo_electronico: correo_electronico,
                monto_subtotal: parseFloat(subtotal) || 0,
                descuentos: parseFloat(descuentos_totales) || 0,
                impuestos: parseFloat(impuestos_totales) || 0,
                monto_total: parseFloat(total) || 0,
                estado_pago: 'realizado',
                idUsuario: parseInt(idUsuario),
                idPedido: idPedido,
                referencia_pago: generatePaymentReference(datosPago.paymentMethod, idPedido),
                notas_pago: generatePaymentNotes(datosPago)
            };

            const pagoResult = await connection.query("INSERT INTO pagos SET ?", pago);
            idPago = pagoResult.insertId;

            console.log(`Pago registrado con ID: ${idPago}`);

            // CORREGIDO: Actualizar el estado del pedido a 'pagado' cuando hay pago exitoso
            await connection.query(
                "UPDATE pedidos SET estado = 'pagado' WHERE idPedido = ?",
                [idPedido]
            );

            // **Registrar venta automáticamente cuando hay pago exitoso**
            console.log("Registrando venta automática...");
            
            const resultadoVenta = await ventasController.registrarVentaAutomatica(idPedido, connection);
            
            if (resultadoVenta.success) {
                ventaRegistrada = true;
                console.log(`✅ Venta registrada automáticamente - ID: ${resultadoVenta.idVenta}`);
            } else {
                console.warn(`⚠️ Advertencia al registrar venta automática: ${resultadoVenta.message}`);
                // No cancelar la transacción por esto
            }
        }

        await connection.query("COMMIT");
        console.log("Transacción completada exitosamente");
        
        res.json({
            success: true,
            message: "Pedido creado exitosamente",
            idPedido: idPedido,
            idPago: idPago,
            ventaRegistrada,
            estado: datosPago ? 'pagado' : (estado || 'pendiente'),
            pedido: {
                idPedido,
                ...pedido
            }
        });

    } catch (error) {
        await connection.query("ROLLBACK");
        console.error("ERROR 500:", error);
        res.status(500).json({ 
            success: false,
            message: "Error al crear el pedido", 
            error: error.message,
            details: error.stack
        });
    } 
};

// Función helper para obtener el ID de la forma de pago
function getFormaPagoId(paymentMethod) {
    const paymentMap = {
        'creditCard': 1, // Mastercard (puedes ajustar según tus datos)
        'paypal': 4,     // PayPal
        'transfer': 8,   // Transferencia Bancaria
        'cash': 7        // Efectivo
    };
    return paymentMap[paymentMethod] || 1;
}

// Función helper para generar referencia de pago
function generatePaymentReference(paymentMethod, idPedido) {
    const timestamp = Date.now();
    const methodCode = paymentMethod.toUpperCase();
    return `${methodCode}-${new Date().getFullYear()}-${String(idPedido).padStart(6, '0')}-${timestamp}`;
}

// Función helper para generar notas del pago
function generatePaymentNotes(datosPago) {
    let notes = `Método de pago: ${datosPago.paymentMethod}`;
    
    if (datosPago.paymentMethod === 'creditCard' && datosPago.cardNumber) {
        const lastFour = datosPago.cardNumber.slice(-4);
        notes += ` - Tarjeta terminada en ${lastFour}`;
    }
    
    if (datosPago.paymentMethod === 'cash') {
        notes += ' - Pago contra entrega';
    }
    
    return notes;
}

const getPedidos = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /pedidos]");
        const result = await connection.query(`
            SELECT p.*, u.nombre as nombre_usuario 
            FROM pedidos p 
            LEFT JOIN usuario u ON p.idUsuario = u.idUsuario 
            ORDER BY p.fecha_pedido DESC
        `);
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener los pedidos" });
    }
};

const getPedidosByUser = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /pedidos/usuario/:id]");
        
        const result = await connection.query(`
            SELECT p.*, 
                   GROUP_CONCAT(
                       CONCAT(dp.cantidad, 'x ', pr.nombreProducto) 
                       SEPARATOR ', '
                   ) as productos_detalle
            FROM pedidos p 
            LEFT JOIN detallepedido dp ON p.idPedido = dp.idPedido
            LEFT JOIN producto pr ON dp.idProducto = pr.idProducto
            WHERE p.idUsuario = ? 
            GROUP BY p.idPedido
            ORDER BY p.fecha_pedido DESC
        `, [idUsuario]);
        
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener los pedidos del usuario" });
    }
};

const getPedidoDetalle = async (req, res) => {
    try {
        const { idPedido } = req.params;
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /pedido/:id/detalle]");
        
        // Obtener información del pedido
        const pedido = await connection.query(`
            SELECT p.*, u.nombre as nombre_usuario 
            FROM pedidos p 
            LEFT JOIN usuario u ON p.idUsuario = u.idUsuario 
            WHERE p.idPedido = ?
        `, [idPedido]);

        // Obtener detalles del pedido
        const detalles = await connection.query(`
            SELECT dp.*, pr.nombreProducto, pr.imagen 
            FROM detallepedido dp 
            INNER JOIN producto pr ON dp.idProducto = pr.idProducto 
            WHERE dp.idPedido = ?
        `, [idPedido]);

        res.json({
            pedido: pedido[0] || null,
            detalles: detalles || []
        });
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener el detalle del pedido" });
    }
};


const getPedidosTodo = async (req, res) => {
    try {
        const connection = await getConnection();

       const result= await connection.query("SELECT * FROM pedidos  ")
        res.json(result) ;

    } catch (error) {
        console.error("Error al obtener pedidos:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener pedidos"
        });
    }
};

export const methodHTPP = {
    postPedido,
    getPedidos,
    getPedidosByUser,
    getPedidoDetalle,
    putPedidoEstado,
    getPedidosTodo
}