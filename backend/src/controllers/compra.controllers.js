import getConnection from "../db/database.js";

// ✅ Crear una nueva compra
const postCompra = async (req, res) => {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    const { idProveedor, productos, aplicarRetefuente = false } = req.body;

    if (!idProveedor || !productos || productos.length === 0) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: "Proveedor y productos son requeridos",
      });
    }

    // ✅ Verificar proveedor
    const proveedorRows = await connection.query(
      "SELECT idProveedor, porcentaje_retefuente FROM proveedor WHERE idProveedor = ?",
      [idProveedor]
    );

    if (!proveedorRows || proveedorRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Proveedor no encontrado" });
    }

    const porcentajeRetefuente = proveedorRows[0].porcentaje_retefuente || 0;

    // ✅ Validar productos
    let subtotal = 0;
    const productosValidados = [];

    for (const p of productos) {
      const idProducto = parseInt(p.idProducto, 10);
      const cantidad = parseFloat(p.cantidad);
      const precio_unitario = parseFloat(p.precio_unitario);

      if (!idProducto || isNaN(cantidad) || isNaN(precio_unitario) || cantidad <= 0 || precio_unitario <= 0) {
        await connection.rollback();
        return res.status(400).json({ success: false, message: "Datos de producto inválidos" });
      }

      const productoRows = await connection.query(
        "SELECT idProducto, nombreProducto FROM producto WHERE idProducto = ?",
        [idProducto]
      );

      if (!productoRows || productoRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({ success: false, message: `Producto con ID ${idProducto} no encontrado` });
      }

      const subtotal_linea = cantidad * precio_unitario;
      subtotal += subtotal_linea;

      productosValidados.push({
        idProducto,
        cantidad,
        precio_unitario,
        subtotal_linea,
        nombreProducto: productoRows[0].nombreProducto,
      });
    }

    const valor_retefuente = aplicarRetefuente ? (subtotal * porcentajeRetefuente) / 100 : 0;
    const total_pagado = subtotal - valor_retefuente;

    // ✅ Insertar cabecera
    const compraResult = await connection.query(
      `INSERT INTO compra (idProveedor, subtotal, valor_retefuente, total_pagado)
       VALUES (?, ?, ?, ?)`,
      [idProveedor, subtotal, valor_retefuente, total_pagado]
    );

    const idCompra = compraResult.insertId;

    // ✅ Insertar detalles
    for (const p of productosValidados) {
      await connection.query(
        `INSERT INTO detalle_compra (idCompra, idProducto, cantidad, precio_unitario, subtotal_linea)
         VALUES (?, ?, ?, ?, ?)`,
        [idCompra, p.idProducto, p.cantidad, p.precio_unitario, p.subtotal_linea]
      );

      await connection.query(
        `UPDATE producto
         SET cantidad = cantidad + ?, precio_costo = ?
         WHERE idProducto = ?`,
        [p.cantidad, p.precio_unitario, p.idProducto]
      );
    }

    await connection.commit();

    res.status(201).json({
      success: true,
      message: "Compra registrada exitosamente",
      data: { idCompra, idProveedor, subtotal, valor_retefuente, total_pagado, productos: productosValidados },
    });
  } catch (error) {
    await connection.rollback();
    console.error("ERROR 500:", error);
    res.status(500).json({ success: false, message: "Error al crear la compra", error: error.message });
  }
};

// ✅ Obtener todas las compras
const getCompras = async (req, res) => {
  try {
    const { page = 1, limit = 10, idProveedor } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = "";
    let queryParams = [];

    if (idProveedor) {
      whereClause = "WHERE c.idProveedor = ?";
      queryParams.push(idProveedor);
    }

    const connection = await getConnection();

    const compras = await connection.query(
      `
      SELECT 
        c.idCompra, c.idProveedor, p.nombre as nombreProveedor, p.nit as nitProveedor,
        c.fecha, c.subtotal, c.valor_retefuente, c.total_pagado
      FROM compra c
      JOIN proveedor p ON c.idProveedor = p.idProveedor
      ${whereClause}
      ORDER BY c.fecha DESC
      LIMIT ? OFFSET ?`,
      [...queryParams, parseInt(limit), offset]
    );

    const countResult = await connection.query(
      `SELECT COUNT(*) as total FROM compra c ${whereClause}`,
      queryParams
    );

    res.json({
      success: true,
      data: compras,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: countResult[0].total,
        totalPages: Math.ceil(countResult[0].total / limit),
      },
    });
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ success: false, message: "Error al obtener las compras", error: error.message });
  }
};

// ✅ Obtener una compra
const getCompraPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const connection = await getConnection();

    const compra = await connection.query(
      `
      SELECT 
        c.idCompra, c.idProveedor, p.nombre as nombreProveedor, p.nit as nitProveedor,
        p.direccion as direccionProveedor, p.telefono as telefonoProveedor,
        p.correo as correoProveedor, c.fecha, c.subtotal, c.valor_retefuente, c.total_pagado
      FROM compra c
      JOIN proveedor p ON c.idProveedor = p.idProveedor
      WHERE c.idCompra = ?`,
      [id]
    );

    if (!compra || compra.length === 0) {
      return res.status(404).json({ success: false, message: "Compra no encontrada" });
    }

    const detalles = await connection.query(
      `
      SELECT 
        dc.idDetalleCompra, dc.idProducto, pr.nombreProducto, pr.imagen,
        dc.cantidad, dc.precio_unitario, dc.subtotal_linea
      FROM detalle_compra dc
      JOIN producto pr ON dc.idProducto = pr.idProducto
      WHERE dc.idCompra = ?
      ORDER BY dc.idDetalleCompra`,
      [id]
    );

    res.json({ success: true, data: { compra: compra[0], detalles } });
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ success: false, message: "Error al obtener la compra", error: error.message });
  }
};

// ✅ Actualizar compra
const putCompra = async (req, res) => {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();

    const { idCompra, idProveedor, productos, aplicarRetefuente = false } = req.body;

    if (!idCompra || !idProveedor || !productos || productos.length === 0) {
      await connection.rollback();
      return res.status(400).json({ success: false, message: "Datos incompletos" });
    }

    const compraExists = await connection.query("SELECT idCompra FROM compra WHERE idCompra = ?", [idCompra]);
    if (!compraExists || compraExists.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Compra no encontrada" });
    }

    const proveedorRows = await connection.query(
      "SELECT idProveedor, porcentaje_retefuente FROM proveedor WHERE idProveedor = ?",
      [idProveedor]
    );
    if (!proveedorRows || proveedorRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Proveedor no encontrado" });
    }
    const porcentajeRetefuente = proveedorRows[0].porcentaje_retefuente || 0;

    // Revertir inventario anterior
    const detallesAnteriores = await connection.query("SELECT idProducto, cantidad FROM detalle_compra WHERE idCompra = ?", [idCompra]);
    for (const d of detallesAnteriores) {
      await connection.query("UPDATE producto SET cantidad = cantidad - ? WHERE idProducto = ?", [d.cantidad, d.idProducto]);
    }
    await connection.query("DELETE FROM detalle_compra WHERE idCompra = ?", [idCompra]);

    // Validar productos nuevos
    let subtotal = 0;
    const productosValidados = [];
    for (const p of productos) {
      const idProducto = parseInt(p.idProducto, 10);
      const cantidad = parseFloat(p.cantidad);
      const precio_unitario = parseFloat(p.precio_unitario);

      if (!idProducto || isNaN(cantidad) || isNaN(precio_unitario) || cantidad <= 0 || precio_unitario <= 0) {
        await connection.rollback();
        return res.status(400).json({ success: false, message: "Datos de producto inválidos" });
      }

      const productoRows = await connection.query("SELECT idProducto, nombreProducto FROM producto WHERE idProducto = ?", [idProducto]);
      if (!productoRows || productoRows.length === 0) {
        await connection.rollback();
        return res.status(404).json({ success: false, message: `Producto con ID ${idProducto} no encontrado` });
      }

      const subtotal_linea = cantidad * precio_unitario;
      subtotal += subtotal_linea;

      productosValidados.push({ idProducto, cantidad, precio_unitario, subtotal_linea, nombreProducto: productoRows[0].nombreProducto });
    }

    const valor_retefuente = aplicarRetefuente ? (subtotal * porcentajeRetefuente) / 100 : 0;
    const total_pagado = subtotal - valor_retefuente;

    await connection.query(
      "UPDATE compra SET idProveedor = ?, subtotal = ?, valor_retefuente = ?, total_pagado = ? WHERE idCompra = ?",
      [idProveedor, subtotal, valor_retefuente, total_pagado, idCompra]
    );

    for (const p of productosValidados) {
      await connection.query(
        `INSERT INTO detalle_compra (idCompra, idProducto, cantidad, precio_unitario, subtotal_linea)
         VALUES (?, ?, ?, ?, ?)`,
        [idCompra, p.idProducto, p.cantidad, p.precio_unitario, p.subtotal_linea]
      );

      await connection.query("UPDATE producto SET cantidad = cantidad + ?, precio_costo = ? WHERE idProducto = ?", [
        p.cantidad,
        p.precio_unitario,
        p.idProducto,
      ]);
    }

    await connection.commit();

    res.json({
      success: true,
      message: "Compra actualizada exitosamente",
      data: { idCompra, idProveedor, subtotal, valor_retefuente, total_pagado, productos: productosValidados },
    });
  } catch (error) {
    await connection.rollback();
    console.error("ERROR 500:", error);
    res.status(500).json({ success: false, message: "Error al actualizar la compra", error: error.message });
  }
};

// ✅ Eliminar compra
const deleteCompra = async (req, res) => {
  const connection = await getConnection();

  try {
    await connection.beginTransaction();
    const { id } = req.params;

    const compraExists = await connection.query("SELECT idCompra FROM compra WHERE idCompra = ?", [id]);
    if (!compraExists || compraExists.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: "Compra no encontrada" });
    }

    const detalles = await connection.query("SELECT idProducto, cantidad FROM detalle_compra WHERE idCompra = ?", [id]);
    for (const d of detalles) {
      await connection.query("UPDATE producto SET cantidad = cantidad - ? WHERE idProducto = ?", [d.cantidad, d.idProducto]);
    }

    await connection.query("DELETE FROM compra WHERE idCompra = ?", [id]);

    await connection.commit();
    res.json({ success: true, message: "Compra eliminada exitosamente y inventario revertido" });
  } catch (error) {
    await connection.rollback();
    console.error("ERROR 500:", error);
    res.status(500).json({ success: false, message: "Error al eliminar la compra", error: error.message });
  }
};

// ✅ Estadísticas
const getEstadisticasCompras = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    let whereClause = "";
    let queryParams = [];

    if (fechaInicio && fechaFin) {
      whereClause = "WHERE DATE(c.fecha) BETWEEN ? AND ?";
      queryParams.push(fechaInicio, fechaFin);
    }

    const connection = await getConnection();

    const estadisticas = await connection.query(
      `SELECT COUNT(*) as totalCompras, SUM(c.subtotal) as totalSubtotal,
              SUM(c.valor_retefuente) as totalRetefuente, SUM(c.total_pagado) as totalPagado,
              AVG(c.total_pagado) as promedioCompra
       FROM compra c ${whereClause}`,
      queryParams
    );

    const comprasPorProveedor = await connection.query(
      `SELECT p.nombre as proveedor, COUNT(c.idCompra) as numeroCompras, SUM(c.total_pagado) as totalPagado
       FROM compra c
       JOIN proveedor p ON c.idProveedor = p.idProveedor
       ${whereClause}
       GROUP BY c.idProveedor, p.nombre
       ORDER BY totalPagado DESC`,
      queryParams
    );

    res.json({ success: true, data: { resumen: estadisticas[0], comprasPorProveedor } });
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ success: false, message: "Error al obtener estadísticas", error: error.message });
  }
};

// ✅ Proveedores para combos
const getProveedoresForCompras = async (req, res) => {
  try {
    const connection = await getConnection();
    const rows = await connection.query("SELECT idProveedor, nombre, nit, porcentaje_retefuente FROM proveedor ORDER BY nombre");
    res.json(rows);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ success: false, message: "Error al obtener proveedores para compras" });
  }
};

// ✅ Productos para combos
const getProductosForCompras = async (req, res) => {
  try {
    const connection = await getConnection();
    const rows = await connection.query(
      "SELECT idProducto, nombreProducto, precio_costo, cantidad FROM producto WHERE activo = '1' ORDER BY nombreProducto"
    );
    res.json(rows);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ success: false, message: "Error al obtener productos para compras" });
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
  getProductosForCompras,
};
