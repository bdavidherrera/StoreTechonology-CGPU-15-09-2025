import getConnection from "../db/database.js"

const postPago = async (req, res) => {
    try {
        const {
            NombrePersona,
            Direccion,
            idFormaPago,
            Telefono,
            correo_electronico,
            monto_subtotal,
            descuentos,
            impuestos,
            monto_total,
            estado_pago,
            idUsuario,
            idPedido,
            referencia_pago,
            notas_pago
        } = req.body;

        const pago = {
            NombrePersona,
            Direccion,
            idFormaPago: parseInt(idFormaPago),
            Telefono: Telefono || null,
            correo_electronico,
            monto_subtotal: parseFloat(monto_subtotal),
            descuentos: parseFloat(descuentos) || 0,
            impuestos: parseFloat(impuestos),
            monto_total: parseFloat(monto_total),
            estado_pago: estado_pago || 'realizado',
            idUsuario: parseInt(idUsuario),
            idPedido: parseInt(idPedido),
            referencia_pago: referencia_pago || null,
            notas_pago: notas_pago || null
        };

        const connection = await getConnection();
        console.log("Conexión obtenida [POST /Pago]");
        const result = await connection.query("INSERT INTO pagos SET ?", pago);
        
        res.json({
            success: true,
            message: "Pago registrado exitosamente",
            idPago: result.insertId,
            pago: result
        });

    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ 
            success: false,
            message: "Error al registrar el pago", 
            error: error.message 
        });
    }
};

const getPagos = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /pagos]");
        const result = await connection.query(`
            SELECT p.*, 
                   fp.nombre as forma_pago_nombre,
                   u.nombre as nombre_usuario,
                   ped.estado as estado_pedido
            FROM pagos p 
            LEFT JOIN formaspago fp ON p.idFormaPago = fp.idFormaPago
            LEFT JOIN usuario u ON p.idUsuario = u.idUsuario 
            LEFT JOIN pedidos ped ON p.idPedido = ped.idPedido
            ORDER BY p.fecha_pago DESC
        `);
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener los pagos" });
    }
};

const getPagosByUser = async (req, res) => {
    try {
        const { idUsuario } = req.params;
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /pagos/usuario/:id]");
        
        const result = await connection.query(`
            SELECT p.*, 
                   fp.nombre as forma_pago_nombre,
                   ped.estado as estado_pedido,
                   ped.nombresProductos
            FROM pagos p 
            LEFT JOIN formaspago fp ON p.idFormaPago = fp.idFormaPago
            LEFT JOIN pedidos ped ON p.idPedido = ped.idPedido
            WHERE p.idUsuario = ? 
            ORDER BY p.fecha_pago DESC
        `, [idUsuario]);
        
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener los pagos del usuario" });
    }
};

const getFormasPago = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /formas-pago]");
        const result = await connection.query(`
            SELECT * FROM formaspago 
            WHERE activo = 1 
            ORDER BY nombre
        `);
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener las formas de pago" });
    }
};

const putPagoEstado = async (req, res) => {
    try {
        const { idPago } = req.params;
        const { estado_pago, notas_pago } = req.body;

        const connection = await getConnection();
        console.log("Conexión obtenida [PUT /pago/:id/estado]");
        
        const result = await connection.query(
            "UPDATE pagos SET estado_pago = ?, notas_pago = ? WHERE idPago = ?", 
            [estado_pago, notas_pago || null, idPago]
        );
        
        res.json({
            success: true,
            message: "Estado del pago actualizado exitosamente",
            result
        });
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al actualizar el estado del pago" });
    }
};

const getPagosTodo = async (req, res) => {
    try {
        const connection = await getConnection();

       const result= await connection.query("SELECT * FROM pagos  ")
        res.json(result) ;

    } catch (error) {
        console.error("Error al obtener pagos:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener pagos"
        });
    }
};


const countPagos = async (req, res) => {
  try {
    const connection = await getConnection();
    const result = await connection.query(
      "SELECT COUNT(*) AS count FROM pagos WHERE descuentos > 0 AND impuestos > 0"
    );
    res.json({ count: result[0].count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener count de pagos" });
  }
};



export const methodHTPP = {
    postPago,
    getPagos,
    getPagosByUser,
    getFormasPago,
    putPagoEstado,
    getPagosTodo,
    countPagos
}