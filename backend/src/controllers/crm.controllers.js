import getConnection from "../db/database.js";

//  Obtener todos los casos de soporte
const getCasosSoporte = async (req, res) => {
  try {
    const connection = await getConnection();
    console.log("Conexión obtenida [GET /casos-soporte]");
    const rows = await connection.query(`
      SELECT cs.*, u.nombre as nombre_cliente 
      FROM casos_soporte cs 
      LEFT JOIN usuario u ON cs.id_cliente = u.idUsuario
    `);
    res.json(rows);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al obtener los casos de soporte" });
  }
};

//  Crear un caso de soporte
const postCasoSoporte = async (req, res) => {
  try {
    const { id_cliente, asunto, descripcion, prioridad, estado } = req.body;

    if (!id_cliente || !asunto || !descripcion) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const caso = { id_cliente, asunto, descripcion, prioridad, estado };

    const connection = await getConnection();
    console.log("Conexión obtenida [POST /casos-soporte]");
    const result = await connection.query("INSERT INTO casos_soporte SET ?", caso);
    res.json(result);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al crear el caso de soporte" });
  }
};

//  Actualizar un caso de soporte
const putCasoSoporte = async (req, res) => {
  try {
    const { id_caso, id_cliente, asunto, descripcion, prioridad, estado, fecha_resolucion } = req.body;

    if (!id_caso) {
      return res.status(400).json({ message: "El id_caso es requerido" });
    }

    const caso = { id_cliente, asunto, descripcion, prioridad, estado, fecha_resolucion };

    const connection = await getConnection();
    console.log("Conexión obtenida [PUT /casos-soporte/:id]");
    const result = await connection.query(
      "UPDATE casos_soporte SET ? WHERE id_caso = ?",
      [caso, id_caso]
    );
    res.json(result);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al actualizar el caso de soporte" });
  }
};

// ✅ Eliminar un caso de soporte
const deleteCasoSoporte = async (req, res) => {
  try {
    const { id_caso } = req.params;

    const connection = await getConnection();
    console.log("Conexión obtenida [DELETE /casos-soporte/:id]");
    const result = await connection.query(
      "DELETE FROM casos_soporte WHERE id_caso = ?",
      [id_caso]
    );
    res.json(result);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al eliminar el caso de soporte" });
  }
};

// ✅ Obtener todas las actividades
const getActividades = async (req, res) => {
  try {
    const connection = await getConnection();
    console.log("Conexión obtenida [GET /actividades]");
    const rows = await connection.query(`
      SELECT a.*, u1.nombre as nombre_usuario_asignado, u2.nombre as nombre_cliente
      FROM actividades a 
      LEFT JOIN usuario u1 ON a.id_usuario_asignado = u1.idUsuario
      LEFT JOIN usuario u2 ON a.id_cliente = u2.idUsuario
    `);
    res.json(rows);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al obtener las actividades" });
  }
};

// ✅ Crear una actividad
const postActividad = async (req, res) => {
  try {
    const { tipo_actividad, fecha_programada, estado, notas, id_usuario_asignado, id_cliente } = req.body;

    if (!tipo_actividad || !fecha_programada || !id_usuario_asignado) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const actividad = { tipo_actividad, fecha_programada, estado, notas, id_usuario_asignado, id_cliente };

    const connection = await getConnection();
    console.log("Conexión obtenida [POST /actividades]");
    const result = await connection.query("INSERT INTO actividades SET ?", actividad);
    res.json(result);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al crear la actividad" });
  }
};

// ✅ Actualizar una actividad
const putActividad = async (req, res) => {
  try {
    const { id_actividad, tipo_actividad, fecha_programada, estado, notas, id_usuario_asignado, id_cliente } = req.body;

    if (!id_actividad) {
      return res.status(400).json({ message: "El id_actividad es requerido" });
    }

    const actividad = { tipo_actividad, fecha_programada, estado, notas, id_usuario_asignado, id_cliente };

    const connection = await getConnection();
    console.log("Conexión obtenida [PUT /actividades/:id]");
    const result = await connection.query(
      "UPDATE actividades SET ? WHERE id_actividad = ?",
      [actividad, id_actividad]
    );
    res.json(result);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al actualizar la actividad" });
  }
};

// ✅ Eliminar una actividad
const deleteActividad = async (req, res) => {
  try {
    const { id_actividad } = req.params;

    const connection = await getConnection();
    console.log("Conexión obtenida [DELETE /actividades/:id]");
    const result = await connection.query(
      "DELETE FROM actividades WHERE id_actividad = ?",
      [id_actividad]
    );
    res.json(result);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al eliminar la actividad" });
  }
};

// ✅ Obtener todas las interacciones
const getInteracciones = async (req, res) => {
  try {
    const connection = await getConnection();
    console.log("Conexión obtenida [GET /interacciones]");
    const rows = await connection.query(`
      SELECT i.*, u1.nombre as nombre_cliente, u2.nombre as nombre_usuario
      FROM interacciones i 
      LEFT JOIN usuario u1 ON i.id_cliente = u1.idUsuario
      LEFT JOIN usuario u2 ON i.id_usuario = u2.idUsuario
    `);
    res.json(rows);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al obtener las interacciones" });
  }
};

// ✅ Crear una interacción
const postInteraccion = async (req, res) => {
  try {
    const { id_cliente, tipo_interaccion, fecha_interaccion, descripcion, id_usuario } = req.body;

    // ✅ Solo valida los campos realmente obligatorios
    if (!tipo_interaccion || !fecha_interaccion) {
      return res.status(400).json({ message: "Faltan campos obligatorios: tipo_interaccion y fecha_interaccion" });
    }

    // ✅ Permite que id_cliente y id_usuario sean null
    const interaccion = { 
      id_cliente: id_cliente || null, 
      tipo_interaccion, 
      fecha_interaccion, 
      descripcion: descripcion || null, 
      id_usuario: id_usuario || null 
    };

    const connection = await getConnection();
    console.log("Conexión obtenida [POST /interacciones]");
    const result = await connection.query("INSERT INTO interacciones SET ?", interaccion);
    res.json(result);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al crear la interacción" });
  }
};

// ✅ Actualizar una interacción
const putInteraccion = async (req, res) => {
  try {
    const { id_interaccion, id_cliente, tipo_interaccion, fecha_interaccion, descripcion, id_usuario } = req.body;

    if (!id_interaccion) {
      return res.status(400).json({ message: "El id_interaccion es requerido" });
    }

    const interaccion = { id_cliente, tipo_interaccion, fecha_interaccion, descripcion, id_usuario };

    const connection = await getConnection();
    console.log("Conexión obtenida [PUT /interacciones/:id]");
    const result = await connection.query(
      "UPDATE interacciones SET ? WHERE id_interaccion = ?",
      [interaccion, id_interaccion]
    );
    res.json(result);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al actualizar la interacción" });
  }
};

// ✅ Eliminar una interacción
const deleteInteraccion = async (req, res) => {
  try {
    const { id_interaccion } = req.params;

    const connection = await getConnection();
    console.log("Conexión obtenida [DELETE /interacciones/:id]");
    const result = await connection.query(
      "DELETE FROM interacciones WHERE id_interaccion = ?",
      [id_interaccion]
    );
    res.json(result);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al eliminar la interacción" });
  }
};

// ✅ Obtener todas las oportunidades
const getOportunidades = async (req, res) => {
  try {
    const connection = await getConnection();
    console.log("Conexión obtenida [GET /oportunidades]");
    const rows = await connection.query(`
      SELECT o.*, u.nombre as nombre_cliente 
      FROM oportunidades o 
      LEFT JOIN usuario u ON o.id_cliente = u.idUsuario
    `);
    res.json(rows);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al obtener las oportunidades" });
  }
};

// ✅ Crear una oportunidad
const postOportunidad = async (req, res) => {
  try {
    const { id_cliente, titulo, valor_estimado, etapa, probabilidad } = req.body;

    if (!id_cliente || !titulo) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const oportunidad = { id_cliente, titulo, valor_estimado, etapa, probabilidad };

    const connection = await getConnection();
    console.log("Conexión obtenida [POST /oportunidades]");
    const result = await connection.query("INSERT INTO oportunidades SET ?", oportunidad);
    res.json(result);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al crear la oportunidad" });
  }
};

// ✅ Actualizar una oportunidad
const putOportunidad = async (req, res) => {
  try {
    const { id_oportunidad, id_cliente, titulo, valor_estimado, etapa, probabilidad } = req.body;

    if (!id_oportunidad) {
      return res.status(400).json({ message: "El id_oportunidad es requerido" });
    }

    const oportunidad = { id_cliente, titulo, valor_estimado, etapa, probabilidad };

    const connection = await getConnection();
    console.log("Conexión obtenida [PUT /oportunidades/:id]");
    const result = await connection.query(
      "UPDATE oportunidades SET ? WHERE id_oportunidad = ?",
      [oportunidad, id_oportunidad]
    );
    res.json(result);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al actualizar la oportunidad" });
  }
};

// ✅ Eliminar una oportunidad
const deleteOportunidad = async (req, res) => {
  try {
    const { id_oportunidad } = req.params;

    const connection = await getConnection();
    console.log("Conexión obtenida [DELETE /oportunidades/:id]");
    const result = await connection.query(
      "DELETE FROM oportunidades WHERE id_oportunidad = ?",
      [id_oportunidad]
    );
    res.json(result);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al eliminar la oportunidad" });
  }
};

// 🔍 Búsqueda global en todas las tablas del CRM
const buscarCRM = async (req, res) => {
  try {
    const { termino } = req.query;

    if (!termino) {
      return res.status(400).json({ message: "Término de búsqueda requerido" });
    }

    const connection = await getConnection();
    console.log("Conexión obtenida [GET /crm/buscar]");
    console.log("Término de búsqueda:", termino); // ✅ Agregado para debug

    const searchTerm = `%${termino}%`;

    // Búsqueda en casos de soporte
    const casosSoporte = await connection.query(`
      SELECT cs.*, u.nombre as nombre_cliente 
      FROM casos_soporte cs 
      LEFT JOIN usuario u ON cs.id_cliente = u.idUsuario
      WHERE cs.asunto LIKE ? OR cs.descripcion LIKE ? OR cs.estado LIKE ?
    `, [searchTerm, searchTerm, searchTerm]);

    // Búsqueda en actividades
    const actividades = await connection.query(`
      SELECT a.*, u1.nombre as nombre_usuario_asignado, u2.nombre as nombre_cliente
      FROM actividades a 
      LEFT JOIN usuario u1 ON a.id_usuario_asignado = u1.idUsuario
      LEFT JOIN usuario u2 ON a.id_cliente = u2.idUsuario
      WHERE a.tipo_actividad LIKE ? OR a.estado LIKE ? OR a.notas LIKE ?
    `, [searchTerm, searchTerm, searchTerm]);

    // Búsqueda en interacciones
    const interacciones = await connection.query(`
      SELECT i.*, u1.nombre as nombre_cliente, u2.nombre as nombre_usuario
      FROM interacciones i 
      LEFT JOIN usuario u1 ON i.id_cliente = u1.idUsuario
      LEFT JOIN usuario u2 ON i.id_usuario = u2.idUsuario
      WHERE i.tipo_interaccion LIKE ? OR i.descripcion LIKE ? OR u1.nombre LIKE ? OR u2.nombre LIKE ?
    `, [searchTerm, searchTerm, searchTerm, searchTerm]);

    // Búsqueda en oportunidades
    const oportunidades = await connection.query(`
      SELECT o.*, u.nombre as nombre_cliente 
      FROM oportunidades o 
      LEFT JOIN usuario u ON o.id_cliente = u.idUsuario
      WHERE o.titulo LIKE ? OR o.etapa LIKE ?, u.nombre LIKE ?
    `, [searchTerm, searchTerm, searchTerm]);

    const resultados = {
      casosSoporte,
      actividades,
      interacciones,
      oportunidades
    };

    console.log("Resultados encontrados:", {
      casos: casosSoporte.length,
      actividades: actividades.length,
      interacciones: interacciones.length,
      oportunidades: oportunidades.length
    }); // ✅ Agregado para debug

    res.json(resultados);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error en la búsqueda" });
  }
};

// 📊 MÉTRICAS Y ANALÍTICAS DEL CRM

// ✅ Tasa de conversión (Oportunidades convertidas vs totales)
const getTasaConversion = async (req, res) => {
  try {
    const connection = await getConnection();
    console.log("Conexión obtenida [GET /crm/metricas/tasa-conversion]");

    const totalOportunidades = await connection.query(`
      SELECT COUNT(*) as total FROM oportunidades
    `);

    const oportunidadesConvertidas = await connection.query(`
      SELECT COUNT(*) as convertidas FROM oportunidades WHERE etapa = 'Cierre'
    `);

    const tasaConversion = totalOportunidades[0].total > 0 
      ? (oportunidadesConvertidas[0].convertidas / totalOportunidades[0].total) * 100 
      : 0;

    res.json({
      totalOportunidades: totalOportunidades[0].total,
      oportunidadesConvertidas: oportunidadesConvertidas[0].convertidas,
      tasaConversion: Math.round(tasaConversion * 100) / 100
    });
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al calcular la tasa de conversión" });
  }
};

// ✅ Satisfacción del cliente (basado en casos de soporte resueltos)
const getSatisfaccionCliente = async (req, res) => {
  try {
    const connection = await getConnection();
    console.log("Conexión obtenida [GET /crm/metricas/satisfaccion]");

    const totalCasos = await connection.query(`
      SELECT COUNT(*) as total FROM casos_soporte
    `);

    const casosResueltos = await connection.query(`
      SELECT COUNT(*) as resueltos FROM casos_soporte WHERE estado = 'Resuelto' OR estado = 'Cerrado'
    `);

    const satisfaccion = totalCasos[0].total > 0 
      ? (casosResueltos[0].resueltos / totalCasos[0].total) * 100 
      : 0;

    res.json({
      totalCasos: totalCasos[0].total,
      casosResueltos: casosResueltos[0].resueltos,
      satisfaccion: Math.round(satisfaccion * 100) / 100
    });
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al calcular la satisfacción del cliente" });
  }
};

// ✅ Retención de clientes
const getRetencionClientes = async (req, res) => {
  try {
    const connection = await getConnection();
    console.log("Conexión obtenida [GET /crm/metricas/retencion]");

    // Clientes con múltiples pedidos (considerados retenidos)
    const clientesRetenidos = await connection.query(`
      SELECT COUNT(DISTINCT idUsuario) as retenidos 
      FROM (
        SELECT idUsuario, COUNT(*) as num_pedidos 
        FROM pedidos 
        WHERE idUsuario IS NOT NULL 
        GROUP BY idUsuario 
        HAVING COUNT(*) > 1
      ) as clientes_recurrentes
    `);

    const totalClientesConPedidos = await connection.query(`
      SELECT COUNT(DISTINCT idUsuario) as total 
      FROM pedidos 
      WHERE idUsuario IS NOT NULL
    `);

    const tasaRetencion = totalClientesConPedidos[0].total > 0 
      ? (clientesRetenidos[0].retenidos / totalClientesConPedidos[0].total) * 100 
      : 0;

    res.json({
      clientesRetenidos: clientesRetenidos[0].retenidos,
      totalClientesConPedidos: totalClientesConPedidos[0].total,
      tasaRetencion: Math.round(tasaRetencion * 100) / 100
    });
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al calcular la retención de clientes" });
  }
};

// ✅ Churn Rate (Tasa de abandono)
const getChurnRate = async (req, res) => {
  try {
    const connection = await getConnection();
    console.log("Conexión obtenida [GET /crm/metricas/churn-rate]");

    // Clientes inactivos (sin pedidos en los últimos 30 días)
    const clientesInactivos = await connection.query(`
      SELECT COUNT(DISTINCT idUsuario) as inactivos 
      FROM usuario u 
      WHERE u.rol = 'cliente' 
      AND u.idUsuario NOT IN (
        SELECT DISTINCT idUsuario 
        FROM pedidos 
        WHERE fecha_pedido >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        AND idUsuario IS NOT NULL
      )
    `);

    const totalClientes = await connection.query(`
      SELECT COUNT(*) as total 
      FROM usuario 
      WHERE rol = 'cliente' AND activo = 1
    `);

    const churnRate = totalClientes[0].total > 0 
      ? (clientesInactivos[0].inactivos / totalClientes[0].total) * 100 
      : 0;

    res.json({
      clientesInactivos: clientesInactivos[0].inactivos,
      totalClientes: totalClientes[0].total,
      churnRate: Math.round(churnRate * 100) / 100
    });
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al calcular el churn rate" });
  }
};

// ✅ Dashboard completo con todas las métricas
const getDashboardCRM = async (req, res) => {
  try {
    const connection = await getConnection();
    console.log("Conexión obtenida [GET /crm/dashboard]");

    // Ejecutar consulta
    const results = await connection.query(`
      SELECT 
        (SELECT COUNT(*) FROM casos_soporte) as totalCasos,
        (SELECT COUNT(*) FROM casos_soporte WHERE estado = 'Abierto') as casosPendientes,
        (SELECT COUNT(*) FROM actividades) as totalActividades,
        (SELECT COUNT(*) FROM actividades WHERE estado = 'Pendiente') as actividadesPendientes,
        (SELECT COUNT(*) FROM oportunidades) as totalOportunidades,
        (SELECT COUNT(*) FROM oportunidades WHERE etapa != 'Cierre') as oportunidadesActivas,
        (SELECT COUNT(*) FROM interacciones) as totalInteracciones
    `);

    // CAMBIO CRÍTICO: Verificar si results es un array
    const data = Array.isArray(results) ? results[0] : results;
    
    console.log("Datos del dashboard:", data); // Para debug
    
    res.json({
      resumen: data  // Estructura correcta
    });
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al obtener el dashboard del CRM" });
  }
};



// ✅ Obtener interacciones por cliente (para el chat)
const getInteraccionesPorCliente = async (req, res) => {
  try {
    const { id_cliente } = req.params;

    if (!id_cliente) {
      return res.status(400).json({ message: "El id_cliente es requerido" });
    }

    const connection = await getConnection();
    console.log(`Conexión obtenida [GET /interacciones/cliente/${id_cliente}]`);
    
    const rows = await connection.query(`
      SELECT 
        i.*,
        u1.nombre as nombre_cliente,
        u2.nombre as nombre_usuario,
        u2.rol as rol_usuario
      FROM interacciones i 
      LEFT JOIN usuario u1 ON i.id_cliente = u1.idUsuario
      LEFT JOIN usuario u2 ON i.id_usuario = u2.idUsuario
      WHERE i.id_cliente = ?
      ORDER BY i.fecha_interaccion ASC
    `, [id_cliente]);

    res.json(rows);
  } catch (error) {
    console.error("ERROR 500:", error);
    res.status(500).json({ message: "Error al obtener las interacciones del cliente" });
  }
};

export const methodHTTP = {
  // Casos de soporte
  getCasosSoporte,
  postCasoSoporte,
  putCasoSoporte,
  deleteCasoSoporte,

  // Actividades
  getActividades,
  postActividad,
  putActividad,
  deleteActividad,

  // Interacciones
  getInteracciones,
  postInteraccion,
  putInteraccion,
  deleteInteraccion,
  getInteraccionesPorCliente,

  // Oportunidades
  getOportunidades,
  postOportunidad,
  putOportunidad,
  deleteOportunidad,

  // Búsqueda y métricas
  buscarCRM,
  getTasaConversion,
  getSatisfaccionCliente,
  getRetencionClientes,
  getChurnRate,
  getDashboardCRM
};