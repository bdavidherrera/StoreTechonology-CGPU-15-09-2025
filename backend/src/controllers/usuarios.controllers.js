import getConnection from "../db/database.js"

const postUsuarios = async (req, res) => {
    try {
        const { cedula, nombre, correo, direccion, telefono , password, rol } = req.body;

        const usuario = {
            cedula, 
            nombre, 
            correo,
            direccion,
            telefono,
            password, 
            rol
        };
        const connection =  await getConnection();
        console.log("Conexión obtenida [POST /Usuario]");
        const result = await connection.query("INSERT INTO usuario SET ?", usuario);
        res.json(result);

    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al crear el usuario" });
    }
};


const getLoginUser= async (req, res)=>{
    try {
        console.log(req.body);
        const {correo, password} =req.body
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /LoginUser]");
        const result= await connection.query("SELECT idUsuario, cedula, correo, direccion, telefono, nombre, password, rol, fecha_creacion, activo  FROM usuario WHERE correo = ? AND password = ? AND activo=1 ", [correo, password])
        res.json(result) 
        
    } catch (error) {
        console.error("ERROR 500");
    }
    
}

const getUsuriosAdmin= async (req, res)=>{
    
    try {
        const connection = await getConnection();
        console.log("Conexión obtenida [GET /UsuariosAdmin]");
        const result= await connection.query("SELECT * FROM usuario WHERE rol= 'cliente' AND activo = 1")
        res.json(result) 
        
    } catch (error) {
        console.error("ERROR 500");
        console.error(error);
    }
    
}

const putUsuarios = async (req, res) => {
    try {
        const { idUsuario, cedula, correo, nombre, password, rol, fecha_creacion, activo } = req.body;

        const usuario = {
            idUsuario, 
            cedula, 
            correo, 
            nombre, 
            password, 
            rol, 
            fecha_creacion, 
            activo
        };
        const connection =  await getConnection();
        console.log("Conexión obtenida [PUT /Usuarios]");
        const result = await connection.query("UPDATE usuario SET ? WHERE idUsuario = ?", [usuario, idUsuario]);
        res.json(result);

    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al actualizar el usuario" });
    }
};

const deleteUsuarios = async (req, res) => {
    try {
        const { idUsuario } = req.params;

        const connection = await getConnection();
        console.log("Conexión obtenida [DELETE-UPDATE /Usuarios/:id]");
        const result = await connection.query("UPDATE usuario SET activo = 0 WHERE  idUsuario = ?", [idUsuario]);
        res.json(result);
    } catch (error) {
        console.error("ERROR 500:", error);
        res.status(500).json({ message: "Error al eliminar el usuario" });
    }
};

export const methodHTPP = {
    postUsuarios, 
    getLoginUser,
    getUsuriosAdmin,
    putUsuarios,
    deleteUsuarios
}