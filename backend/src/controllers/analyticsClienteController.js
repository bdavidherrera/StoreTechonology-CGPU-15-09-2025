import getConnection from "../db/database.js";

// Obtener productos recientemente agregados
const getProductosRecientes = async (req, res) => {
  try {
    const connection = await getConnection();
    console.log("Conexión obtenida [GET /analytics-cliente/productos-recientes]");
    
    const { idUsuario } = req.params;
    const { limite = 10 } = req.query;
    
    // Verificar que el usuario existe y es cliente
    const usuario = await connection.query(
      "SELECT idUsuario, nombre, rol FROM usuario WHERE idUsuario = ? AND rol = 'cliente'",
      [idUsuario]
    );
    
    if (usuario.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Cliente no encontrado" 
      });
    }
    
    // Obtener productos recientes (últimos 30 días)
    const productosRecientes = await connection.query(`
      SELECT 
        p.idProducto,
        p.nombreProducto,
        p.imagen,
        p.valor,
        p.cantidad,
        p.informacion,
        p.fecha_creacion,
        pr.nombre as proveedor_nombre,
        (SELECT COUNT(*) FROM detallepedido dp 
         JOIN pedidos ped ON dp.idPedido = ped.idPedido 
         WHERE dp.idProducto = p.idProducto AND ped.idUsuario = ?) as veces_comprado
      FROM producto p
      LEFT JOIN proveedor pr ON p.idProveedor = pr.idProveedor
      WHERE p.activo = 1 
        AND p.fecha_creacion >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      ORDER BY p.fecha_creacion DESC
      LIMIT ?
    `, [idUsuario, parseInt(limite)]);
    
    res.json({
      success: true,
      data: productosRecientes
    });
    
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ 
      success: false,
      message: "Error al obtener productos recientes" 
    });
  }
};

// Obtener productos con mejores descuentos
const getProductosMejorPrecio = async (req, res) => {
  try {
    const connection = await getConnection();
    console.log("Conexión obtenida [GET /analytics-cliente/productos-mejor-precio]");
    
    const { idUsuario } = req.params;
    const { limite = 10 } = req.query;
    
    // Verificar que el usuario existe y es cliente
    const usuario = await connection.query(
      "SELECT idUsuario, nombre, rol FROM usuario WHERE idUsuario = ? AND rol = 'cliente'",
      [idUsuario]
    );
    
    if (usuario.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Cliente no encontrado" 
      });
    }
    
    // Obtener productos con mejor relación calidad-precio (basado en descuentos históricos)
    const productosMejorPrecio = await connection.query(`
      SELECT 
        p.idProducto,
        p.nombreProducto,
        p.imagen,
        p.valor as precio_actual,
        p.cantidad,
        p.informacion,
        pr.nombre as proveedor_nombre,
        COALESCE(AVG(dp.descuento_unitario), 0) as descuento_promedio,
        COALESCE(MAX(dp.descuento_unitario), 0) as max_descuento,
        (p.valor - COALESCE(AVG(dp.descuento_unitario), 0)) as precio_con_descuento_promedio,
        COUNT(DISTINCT dp.idDetallePedido) as total_compras,
        (SELECT COUNT(*) FROM detallepedido dp2 
         JOIN pedidos ped2 ON dp2.idPedido = ped2.idPedido 
         WHERE dp2.idProducto = p.idProducto AND ped2.idUsuario = ?) as veces_comprado_cliente
      FROM producto p
      LEFT JOIN proveedor pr ON p.idProveedor = pr.idProveedor
      LEFT JOIN detallepedido dp ON p.idProducto = dp.idProducto
      WHERE p.activo = 1
      GROUP BY p.idProducto, p.nombreProducto, p.imagen, p.valor, p.cantidad, p.informacion, pr.nombre
      HAVING descuento_promedio > 0 OR max_descuento > 0
      ORDER BY descuento_promedio DESC, max_descuento DESC
      LIMIT ?
    `, [idUsuario, parseInt(limite)]);
    
    res.json({
      success: true,
      data: productosMejorPrecio
    });
    
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ 
      success: false,
      message: "Error al obtener productos con mejor precio" 
    });
  }
};

// Obtener productos más comprados por el cliente
const getProductosTopCliente = async (req, res) => {
  try {
    const connection = await getConnection();
    console.log("Conexión obtenida [GET /analytics-cliente/productos-top-cliente]");
    
    const { idUsuario } = req.params;
    const { limite = 10, periodo = '6 MONTH' } = req.query;
    
    // Verificar que el usuario existe y es cliente
    const usuario = await connection.query(
      "SELECT idUsuario, nombre, rol FROM usuario WHERE idUsuario = ? AND rol = 'cliente'",
      [idUsuario]
    );
    
    if (usuario.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Cliente no encontrado" 
      });
    }
    
    // Obtener productos más comprados por este cliente en el período especificado
    const productosTopCliente = await connection.query(`
      SELECT 
        p.idProducto,
        p.nombreProducto,
        p.imagen,
        p.valor as precio_actual,
        p.cantidad,
        p.informacion,
        pr.nombre as proveedor_nombre,
        SUM(dp.cantidad) as total_unidades_compradas,
        COUNT(DISTINCT dp.idPedido) as total_pedidos,
        SUM(dp.total_linea) as total_gastado,
        AVG(dp.precio_unitario) as precio_promedio_pagado,
        MAX(ped.fecha_pedido) as ultima_compra
      FROM producto p
      LEFT JOIN proveedor pr ON p.idProveedor = pr.idProveedor
      INNER JOIN detallepedido dp ON p.idProducto = dp.idProducto
      INNER JOIN pedidos ped ON dp.idPedido = ped.idPedido
      WHERE ped.idUsuario = ?
        AND ped.fecha_pedido >= DATE_SUB(NOW(), INTERVAL ${periodo})
      GROUP BY p.idProducto, p.nombreProducto, p.imagen, p.valor, p.cantidad, p.informacion, pr.nombre
      ORDER BY total_unidades_compradas DESC, total_gastado DESC
      LIMIT ?
    `, [idUsuario, parseInt(limite)]);
    
    res.json({
      success: true,
      data: productosTopCliente,
      periodo: periodo
    });
    
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ 
      success: false,
      message: "Error al obtener productos top del cliente" 
    });
  }
};

// Obtener productos populares en general
const getProductosPopulares = async (req, res) => {
  try {
    const connection = await getConnection();
    console.log("Conexión obtenida [GET /analytics-cliente/productos-populares]");
    
    const { idUsuario } = req.params;
    const { limite = 10, periodo = '3 MONTH' } = req.query;
    
    // Verificar que el usuario existe y es cliente
    const usuario = await connection.query(
      "SELECT idUsuario, nombre, rol FROM usuario WHERE idUsuario = ? AND rol = 'cliente'",
      [idUsuario]
    );
    
    if (usuario.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Cliente no encontrado" 
      });
    }
    
    // Obtener productos más populares en general
    const productosPopulares = await connection.query(`
      SELECT 
        p.idProducto,
        p.nombreProducto,
        p.imagen,
        p.valor,
        p.cantidad,
        p.informacion,
        pr.nombre as proveedor_nombre,
        SUM(dp.cantidad) as total_unidades_vendidas,
        COUNT(DISTINCT dp.idPedido) as total_pedidos,
        COUNT(DISTINCT ped.idUsuario) as total_clientes,
        (SELECT COUNT(*) FROM detallepedido dp2 
         JOIN pedidos ped2 ON dp2.idPedido = ped2.idPedido 
         WHERE dp2.idProducto = p.idProducto AND ped2.idUsuario = ?) as comprado_por_cliente
      FROM producto p
      LEFT JOIN proveedor pr ON p.idProveedor = pr.idProveedor
      INNER JOIN detallepedido dp ON p.idProducto = dp.idProducto
      INNER JOIN pedidos ped ON dp.idPedido = ped.idPedido
      WHERE ped.fecha_pedido >= DATE_SUB(NOW(), INTERVAL ${periodo})
        AND p.activo = 1
      GROUP BY p.idProducto, p.nombreProducto, p.imagen, p.valor, p.cantidad, p.informacion, pr.nombre
      ORDER BY total_unidades_vendidas DESC, total_pedidos DESC
      LIMIT ?
    `, [idUsuario, parseInt(limite)]);
    
    res.json({
      success: true,
      data: productosPopulares,
      periodo: periodo
    });
    
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ 
      success: false,
      message: "Error al obtener productos populares" 
    });
  }
};

// Obtener estadísticas personales del cliente
const getEstadisticasPersonales = async (req, res) => {
  try {
    const connection = await getConnection();
    console.log("Conexión obtenida [GET /analytics-cliente/estadisticas-personales]");
    
    const { idUsuario } = req.params;
    
    // Verificar que el usuario existe y es cliente
    const usuario = await connection.query(
      "SELECT idUsuario, nombre, rol FROM usuario WHERE idUsuario = ? AND rol = 'cliente'",
      [idUsuario]
    );
    
    if (usuario.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Cliente no encontrado" 
      });
    }
    
    // Obtener estadísticas personales del cliente
    const estadisticas = await connection.query(`
      SELECT 
        -- Estadísticas generales
        COUNT(DISTINCT ped.idPedido) as total_pedidos,
        SUM(dp.cantidad) as total_productos_comprados,
        SUM(pag.monto_total) as total_gastado,
        AVG(pag.monto_total) as ticket_promedio,
        MIN(ped.fecha_pedido) as primera_compra,
        MAX(ped.fecha_pedido) as ultima_compra,
        
        -- Métodos de pago preferidos
        (SELECT fp.nombre FROM formaspago fp 
         INNER JOIN pagos p ON fp.idFormaPago = p.idFormaPago 
         WHERE p.idUsuario = ? 
         GROUP BY fp.nombre 
         ORDER BY COUNT(*) DESC 
         LIMIT 1) as metodo_pago_favorito,
         
        -- Categorías preferidas (basado en productos más comprados)
        (SELECT p.nombreProducto FROM producto p 
         INNER JOIN detallepedido dp ON p.idProducto = dp.idProducto 
         INNER JOIN pedidos ped ON dp.idPedido = ped.idPedido 
         WHERE ped.idUsuario = ? 
         GROUP BY p.idProducto 
         ORDER BY SUM(dp.cantidad) DESC 
         LIMIT 1) as producto_favorito,
         
        -- Frecuencia de compra
        DATEDIFF(MAX(ped.fecha_pedido), MIN(ped.fecha_pedido)) / 
          GREATEST(COUNT(DISTINCT ped.idPedido) - 1, 1) as dias_promedio_entre_compras,
          
        -- Estado de pedidos recientes
        SUM(CASE WHEN ped.estado = 'entregado' THEN 1 ELSE 0 END) as pedidos_entregados,
        SUM(CASE WHEN ped.estado = 'pendiente' THEN 1 ELSE 0 END) as pedidos_pendientes,
        SUM(CASE WHEN ped.estado = 'cancelado' THEN 1 ELSE 0 END) as pedidos_cancelados
        
      FROM pedidos ped
      INNER JOIN detallepedido dp ON ped.idPedido = dp.idPedido
      LEFT JOIN pagos pag ON ped.idPedido = pag.idPedido
      WHERE ped.idUsuario = ?
    `, [idUsuario, idUsuario, idUsuario]);
    
    // Obtener productos con mejor valoración (si tuvieramos sistema de valoraciones)
    const productosRecomendados = await connection.query(`
      SELECT 
        p.idProducto,
        p.nombreProducto,
        p.imagen,
        p.valor,
        p.informacion,
        (SELECT COUNT(*) FROM detallepedido dp2 
         JOIN pedidos ped2 ON dp2.idPedido = ped2.idPedido 
         WHERE dp2.idProducto = p.idProducto) as popularidad,
        (p.cantidad > 0) as disponible
      FROM producto p
      WHERE p.activo = 1 
        AND p.idProducto NOT IN (
          SELECT DISTINCT dp.idProducto 
          FROM detallepedido dp 
          JOIN pedidos ped ON dp.idPedido = ped.idPedido 
          WHERE ped.idUsuario = ?
        )
      ORDER BY popularidad DESC, p.fecha_creacion DESC
      LIMIT 5
    `, [idUsuario]);
    
    res.json({
      success: true,
      data: {
        estadisticas: estadisticas[0] || {},
        productos_recomendados: productosRecomendados
      }
    });
    
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ 
      success: false,
      message: "Error al obtener estadísticas personales" 
    });
  }
};

// Obtener tendencias de compra del cliente
const getTendenciasCompra = async (req, res) => {
  try {
    const connection = await getConnection();
    console.log("Conexión obtenida [GET /analytics-cliente/tendencias-compra]");
    
    const { idUsuario } = req.params;
    const { meses = 6 } = req.query;
    
    // Verificar que el usuario existe y es cliente
    const usuario = await connection.query(
      "SELECT idUsuario, nombre, rol FROM usuario WHERE idUsuario = ? AND rol = 'cliente'",
      [idUsuario]
    );
    
    if (usuario.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "Cliente no encontrado" 
      });
    }
    
    // Obtener tendencias de compra por mes
    const tendencias = await connection.query(`
      SELECT 
        DATE_FORMAT(ped.fecha_pedido, '%Y-%m') as mes,
        COUNT(DISTINCT ped.idPedido) as total_pedidos,
        SUM(dp.cantidad) as total_productos,
        SUM(pag.monto_total) as total_gastado,
        AVG(pag.monto_total) as ticket_promedio
      FROM pedidos ped
      INNER JOIN detallepedido dp ON ped.idPedido = dp.idPedido
      LEFT JOIN pagos pag ON ped.idPedido = pag.idPedido
      WHERE ped.idUsuario = ?
        AND ped.fecha_pedido >= DATE_SUB(NOW(), INTERVAL ? MONTH)
      GROUP BY DATE_FORMAT(ped.fecha_pedido, '%Y-%m')
      ORDER BY mes DESC
    `, [idUsuario, parseInt(meses)]);
    
    res.json({
      success: true,
      data: tendencias,
      periodo_meses: meses
    });
    
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ 
      success: false,
      message: "Error al obtener tendencias de compra" 
    });
  }
};

export const methodHTTP = {
  getProductosRecientes,
  getProductosMejorPrecio,
  getProductosTopCliente,
  getProductosPopulares,
  getEstadisticasPersonales,
  getTendenciasCompra
};