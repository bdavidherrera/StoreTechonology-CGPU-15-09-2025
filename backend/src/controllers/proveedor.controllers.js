import getConnection from "../db/database.js";

// Obtener todos los proveedores
const getProveedor = async (req, res) => {
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /proveedor]");
        const result = await connection.query("SELECT * FROM proveedor");
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al obtener los proveedores" });
    }
};

// Crear proveedor
const postProveedor = async (req, res) => {
    try {
        const { nombre, nit, direccion, telefono, correo, porcentaje_retefuente } = req.body;

        const proveedor = {
            nombre,
            nit,
            direccion,
            telefono,
            correo,
            porcentaje_retefuente: porcentaje_retefuente || 0.00
        };

        const connection = await getConnection();
        console.log("Conexión obtenida [POST /proveedor]");
        const result = await connection.query("INSERT INTO proveedor SET ?", proveedor);
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al crear el proveedor" });
    }
};

// Actualizar proveedor
const putProveedor = async (req, res) => {
    try {
        const { idProveedor, nombre, nit, direccion, telefono, correo, porcentaje_retefuente } = req.body;

        console.log("Body recibido:", req.body);

        const proveedor = {
            nombre,
            nit,
            direccion,
            telefono,
            correo,
            porcentaje_retefuente
        };

        const connection = await getConnection();
        console.log("Conexión obtenida [PUT /proveedor/:id]");
        const result = await connection.query(
            "UPDATE proveedor SET ? WHERE idProveedor = ?",
            [proveedor, idProveedor]
        );
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al actualizar el proveedor", error: error.message });
    }
};

// Eliminar proveedor
const deleteProveedor = async (req, res) => {
    try {
        const { idProveedor } = req.params;

        const connection = await getConnection();
        console.log("Conexión obtenida [DELETE /proveedor/:id]");
        const result = await connection.query("DELETE FROM proveedor WHERE idProveedor = ?", [idProveedor]);
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al eliminar el proveedor", error: error.message });
    }
};

export const methodHTPP = {
    getProveedor,
    postProveedor,
    putProveedor,
    deleteProveedor
};
