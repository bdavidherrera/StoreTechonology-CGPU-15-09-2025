import getConnection from "../db/database.js";

// ✅ Obtener todos los gastos
const getGastos = async (req, res) => {
  try {
    const connection = await getConnection();
    console.log("Conexión obtenida [GET /gastos]");
    const rows = await connection.query("SELECT * FROM gastos");
    res.json(rows);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al obtener los gastos" });
  }
};

// ✅ Crear un gasto
const postGasto = async (req, res) => {
  try {
    const {idProducto ,descripcion, monto, categoria } = req.body;

    if (!descripcion || !monto) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const gasto = { idProducto ,descripcion, monto, categoria };

    const connection = await getConnection();
    console.log("Conexión obtenida [POST /gastos]");
    const result = await connection.query("INSERT INTO gastos SET ?", gasto);
    res.json(result);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al crear el gasto" });
  }
};

// ✅ Actualizar un gasto
const putGasto = async (req, res) => {
  try {
    const { idGasto, idProducto, descripcion, monto, categoria } = req.body;

    if (!idGasto) {
      return res.status(400).json({ message: "El idGasto es requerido" });
    }

    const gasto = { idProducto, descripcion, monto, categoria };

    const connection = await getConnection();
    console.log("Conexión obtenida [PUT /gastos/:id]");
    const result = await connection.query(
      "UPDATE gastos SET ? WHERE idGasto = ?",
      [gasto, idGasto]
    );
    res.json(result);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al actualizar el gasto" });
  }
};

// ✅ Eliminar un gasto
const deleteGasto = async (req, res) => {
  try {
    const { idGasto } = req.params;

    const connection = await getConnection();
    console.log("Conexión obtenida [DELETE /gastos/:id]");
    const result = await connection.query(
      "DELETE FROM gastos WHERE idGasto = ?",
      [idGasto]
    );
    res.json(result);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al eliminar el gasto" });
  }
};

const getProductosForGastos = async (req, res) => {
  try {
    const connection = await getConnection();
    console.log("Conexión obtenida [GET /gastos/productos]");
    const rows = await connection.query(
      "SELECT idProducto, nombreProducto FROM producto WHERE activo = '1'"
    );
    res.json(rows);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al obtener productos para gastos" });
  }
};

export const methodHTTP = {
  getGastos,
  postGasto,
  putGasto,
  deleteGasto,
  getProductosForGastos
};
