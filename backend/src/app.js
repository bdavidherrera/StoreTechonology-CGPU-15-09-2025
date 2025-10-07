/*importamos al framework express */

import express, { request } from "express";
import cors from "cors";
import usuariosRoutes from "./routers/usuarios.routes.js"
import usuariosLoginRoutes from "./routers/usuariosLogin.routes.js"
import tecnologiaRoutes from "./routers/tecnologia.routes.js"
import pedidosRoutes from "./routers/pedidos.routes.js"
import pagosRoutes from "./routers/pagos.routes.js"
import getHistorialCompra from "./routers/historialCliente.routes.js"
import ventasRoutes from "./routers/ventas.routes.js";
import proveedorRoutes from "./routers/proveedor.routes.js";
import gastosRouter from "./routers/gastos.routes.js";
import comprasRoutes from "./routers/compras.routes.js"
import crmRoutes from "./routers/crm.routes.js"
import analyticsRoutes from './routers/analytics.routes.js'; // 👈 AGREGAR ESTA LÍNEA
import analyticsClienteRoutes from './routers/analyticsCliente.routes.js'; // 👈 AGREGAR ESTA LÍNEA

/*Asignamos a app toda funcionalidad para mi server web */
const app = express();


/*setear un puerto ami web server */
app.set("port",8000);

/* Midelware*/
app.use(express.json());
app.use(express.urlencoded({extended:true}));


/*routers */
app.use(cors()); 
app.use(express.urlencoded({extended:true}));


/*usuarios*/

app.use("/Registrar", usuariosRoutes); //Registrar Usuarios clientes

app.use("/Login", usuariosLoginRoutes); //Verificar datos del login

app.use("/api/usuarios", usuariosRoutes); //Mostrar Usuarios clientes, actualizar y eliminar usuarios (desde admin)

/*Productos*/

app.use("/api/tecnologia", tecnologiaRoutes) //Mostrar, registrar produstos, actualizar y eliminar productos (desde admin)

/*Proveedores*/

app.use("/api/proveedor", proveedorRoutes) //Crear, mostrar, actualizar y eliminar proveedores (desde admin)

/*Gastos*/
app.use("/api/gastos", gastosRouter) //Crear, mostrar, actualizar y eliminar gastos (desde admin)

/*Compras*/
app.use("/api/compras", comprasRoutes) //Crear, mostrar, actualizar y eliminar compras (desde admin)

/*Pedidos*/

app.use("/api/pedidos", pedidosRoutes) //Crear, mostrar, actualizar pedidos

/*Pagos */

app.use("/api/pagos", pagosRoutes) //Crear, mostrar, actualizar pagos

/*Historial Compras Usuario */

app.use("/", getHistorialCompra)

/*Ventas */
app.use("/api/ventas", ventasRoutes);

/*CRM */
app.use("/api/crm", crmRoutes);

/*Analytics */
app.use('/api/analytics', analyticsRoutes); 

/*Analytics Cliente */
app.use('/api/analytics-cliente', analyticsClienteRoutes);

app.get("/",(req,res)=>{
    res.send("Manuel Isaac Gomez Galvis y Herrera Barajas Brayan David B191")
});

export default app;