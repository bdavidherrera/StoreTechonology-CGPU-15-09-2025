import getConnection from "../db/database.js";

export const getHistorialCompras = async (req, res) => {
  try {
    const { idUsuario } = req.params;

    const connection = await getConnection();
    const result = await connection.query(
      `SELECT idPedido, estado, nombresProductos, fecha_pedido, 
              subtotal, descuentos_totales, impuestos_totales, total
       FROM pedidos
       WHERE idUsuario = ?
       ORDER BY fecha_pedido DESC`,
      [idUsuario]
    );

    res.json({ success: true, historial: result });
  } catch (error) {
    console.error("Error al obtener historial:", error);
    res.status(500).json({ success: false, message: "Error al obtener historial" });
  }
};


export const methodHTPP = {
    getHistorialCompras
}
