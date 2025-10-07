//Usuarios API
const urlRegistarUsu = "http://localhost:8000/Registrar";
const urlLoginUsu = "http://localhost:8000/Login";
const urlUsuarios = "http://localhost:8000/api/usuarios/admin"
const urlActualizarUsuarios = "http://localhost:8000/api/usuarios/Actualizar";
const  urlEliminarUsuarios = "http://localhost:8000/api/usuarios/EliminarUsuario/:idusuarios";

//Productos API
const urlProductos = "http://localhost:8000/api/tecnologia"
const urlRegistrarProductos = "http://localhost:8000/api/tecnologia/RegistrarProducto"
const urlActualizarProductos = "http://localhost:8000/api/tecnologia/ActualizarProducto"
const urlEliminarProductos = "http://localhost:8000/api/tecnologia/EliminarProducto/:idProducto"

//Pedidos API

const urlPedidos = "http://localhost:8000/api/pedidos";
const urlPedidosUsuario = "http://localhost:8000/api/pedidos/usuario/:idUsuario";
const urlPedidoDetalle = "http://localhost:8000/api/pedidos/:idPedido/detalle";
const urlPedidoEstado = "http://localhost:8000/api/pedidos/:idPedido/estado";
const urlPedidosTodo = "http://localhost:8000/api/pedidos/mostrarPedidos";


//Pagos API
const urlPagos = "http://localhost:8000/api/pagos";
const urlPagosUsuario = "http://localhost:8000/api/pagos/usuario/:idUsuario";
const urlFormasPago = "http://localhost:8000/api/pagos/formas-pago";
const urlPagoEstado = "http://localhost:8000/api/pagos/:idPago/estado";
const urlPagosTodo = "http://localhost:8000/api/pagos/MostrarP";
const urlPagosCount = "http://localhost:8000/api/pagos/count";


//Ventas API 
const urlVentas = "http://localhost:8000/api/ventas";
const urlVentasRangoFechas = "http://localhost:8000/api/ventas/rango-fechas";
const urlVentasStats = "http://localhost:8000/api/ventas/estadisticas";
const urlVentasUsuario = "http://localhost:8000/api/ventas/usuario/:idUsuario";
const urlVentaEstado = "http://localhost:8000/api/ventas/:idVenta/estado";

//proveedor API
const urlProveedor = "http://localhost:8000/api/proveedor";
const urlActualizarProveedor = "http://localhost:8000/api/proveedor/ActualizarProveedor";

//Productos para gastos
const urlProductosGastos = "http://localhost:8000/api/gastos/productos"
const urlObtenerGastos = "http://localhost:8000/api/gastos"
const urlRegistrarGasto = "http://localhost:8000/api/gastos"
const urlActualizarGasto = "http://localhost:8000/api/gastos/ActualizarGastos"
const urlEliminarGasto = "http://localhost:8000/api/gastos"

//Compras API
const urlCompras = "http://localhost:8000/api/compras";
const urlRegistrarCompra = "http://localhost:8000/api/compras"
const urlActualizarCompra = "http://localhost:8000/api/compras"
const urlEliminarCompra = "http://localhost:8000/api/compras/EliminarCompra"
const urlEstadisticasCompras = "http://localhost:8000/api/compras/estadisticas"
const urlEstadisticasProveedores = "http://localhost:8000/api/compras/proveedores"
const urlEstadisticasProductos = "http://localhost:8000/api/compras/productos"


//CRM API
// CRM API URLs
const urlCRMBase = "http://localhost:8000/api/crm";

// Casos de Soporte
const urlCasosSoporte = `${urlCRMBase}/casos-soporte`;

// Actividades
const urlActividades = `${urlCRMBase}/actividades`;

// Interacciones
const urlInteracciones = `${urlCRMBase}/interacciones`;

// Oportunidades
const urlOportunidades = `${urlCRMBase}/oportunidades`;

// Búsqueda y Métricas
const urlBuscarCRM = `${urlCRMBase}/buscar`;
const urlDashboardCRM = `${urlCRMBase}/dashboard`;
const urlTasaConversion = `${urlCRMBase}/metricas/tasa-conversion`;
const urlSatisfaccionCliente = `${urlCRMBase}/metricas/satisfaccion`;
const urlRetencionClientes = `${urlCRMBase}/metricas/retencion`;
const urlChurnRate = `${urlCRMBase}/metricas/churn-rate`;



// =============================================
// 📊 ANALYTICS API - CORREGIDO
// =============================================

// URLs de Analytics
const urlAnalyticsBase = "http://localhost:8000/api/analytics";
const urlResumenGeneral = `${urlAnalyticsBase}/resumen-general`;
const urlVentasPorMes = `${urlAnalyticsBase}/ventas-por-mes`;
const urlProductosMasVendidos = `${urlAnalyticsBase}/productos-mas-vendidos`;
const urlAnalisisRentabilidad = `${urlAnalyticsBase}/analisis-rentabilidad`;
const urlClientesTop = `${urlAnalyticsBase}/clientes-top`;
const urlVentasPorCategoria = `${urlAnalyticsBase}/ventas-por-categoria`;
const urlTendenciasInventario = `${urlAnalyticsBase}/tendencias-inventario`;
const urlMetodosPago = `${urlAnalyticsBase}/metodos-pago`;
const urlGastosPorCategoria = `${urlAnalyticsBase}/gastos-por-categoria`;
const urlComparacionPeriodica = `${urlAnalyticsBase}/comparacion-periodica`;
const urlKPIs = `${urlAnalyticsBase}/kpis`;
const urlDashboardCompleto = `${urlAnalyticsBase}/dashboard-completo`;


// =============================================
// 📊 ANALYTICS CLIENTE API
// =============================================

const urlAnalyticsClienteBase = "http://localhost:8000/api/analytics-cliente";

// ✅ Obtener productos recientemente agregados
export const obtenerProductosRecientesCliente = async (idUsuario, limite = 10) => {
  try {
    const response = await fetch(`${urlAnalyticsClienteBase}/productos-recientes/${idUsuario}?limite=${limite}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Productos recientes obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener productos recientes:", error);
    throw new Error(`Error al obtener productos recientes: ${error.message}`);
  }
};

// ✅ Obtener productos con mejor precio/descuento
export const obtenerProductosMejorPrecioCliente = async (idUsuario, limite = 10) => {
  try {
    const response = await fetch(`${urlAnalyticsClienteBase}/productos-mejor-precio/${idUsuario}?limite=${limite}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Productos con mejor precio obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener productos con mejor precio:", error);
    throw new Error(`Error al obtener productos con mejor precio: ${error.message}`);
  }
};

// ✅ Obtener productos más comprados por el cliente
export const obtenerProductosTopCliente = async (idUsuario, limite = 10, periodo = '6 MONTH') => {
  try {
    const response = await fetch(`${urlAnalyticsClienteBase}/productos-top-cliente/${idUsuario}?limite=${limite}&periodo=${periodo}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Productos top del cliente obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener productos top del cliente:", error);
    throw new Error(`Error al obtener productos top del cliente: ${error.message}`);
  }
};

// ✅ Obtener productos populares en general
export const obtenerProductosPopularesCliente = async (idUsuario, limite = 10, periodo = '3 MONTH') => {
  try {
    const response = await fetch(`${urlAnalyticsClienteBase}/productos-populares/${idUsuario}?limite=${limite}&periodo=${periodo}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Productos populares obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener productos populares:", error);
    throw new Error(`Error al obtener productos populares: ${error.message}`);
  }
};

// ✅ Obtener estadísticas personales del cliente
export const obtenerEstadisticasPersonalesCliente = async (idUsuario) => {
  try {
    const response = await fetch(`${urlAnalyticsClienteBase}/estadisticas-personales/${idUsuario}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Estadísticas personales obtenidas:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener estadísticas personales:", error);
    throw new Error(`Error al obtener estadísticas personales: ${error.message}`);
  }
};

// ✅ Obtener tendencias de compra del cliente
export const obtenerTendenciasCompraCliente = async (idUsuario, meses = 6) => {
  try {
    const response = await fetch(`${urlAnalyticsClienteBase}/tendencias-compra/${idUsuario}?meses=${meses}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Tendencias de compra obtenidas:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener tendencias de compra:", error);
    throw new Error(`Error al obtener tendencias de compra: ${error.message}`);
  }
};

// ✅ Obtener dashboard completo del cliente
export const obtenerDashboardCompletoCliente = async (idUsuario) => {
  try {
    const [
      productosRecientes,
      productosMejorPrecio,
      productosTopCliente,
      productosPopulares,
      estadisticasPersonales,
      tendenciasCompra
    ] = await Promise.all([
      obtenerProductosRecientesCliente(idUsuario, 8),
      obtenerProductosMejorPrecioCliente(idUsuario, 8),
      obtenerProductosTopCliente(idUsuario, 8),
      obtenerProductosPopularesCliente(idUsuario, 8),
      obtenerEstadisticasPersonalesCliente(idUsuario),
      obtenerTendenciasCompraCliente(idUsuario, 6)
    ]);

    const dashboardCompleto = {
      productosRecientes,
      productosMejorPrecio,
      productosTopCliente,
      productosPopulares,
      estadisticasPersonales,
      tendenciasCompra
    };

    console.log("Dashboard completo del cliente obtenido:", dashboardCompleto);
    return dashboardCompleto;
  } catch (error) {
    console.error("Error al obtener dashboard completo del cliente:", error);
    throw new Error(`Error al obtener dashboard completo del cliente: ${error.message}`);
  }
};













// ✅ Obtener resumen general - CORREGIDO
export const obtenerResumenGeneralAnalytics = async () => {
    try {
        const response = await fetch(urlResumenGeneral, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Resumen general obtenido:", data);
        
        // Adaptar la respuesta al formato esperado por el frontend
        return {
            success: true,
            data: {
                ventas: {
                    total_ventas: data[0]?.total_ventas || 0,
                    ingresos_totales: data[0]?.ingresos_totales || 0,
                    ticket_promedio: data[0]?.ticket_promedio || 0,
                    utilidad_total: data[0]?.utilidad_total || 0
                },
                clientes: {
                    total_clientes: data[0]?.total_clientes || 0
                },
                productos: {
                    total_productos: data[0]?.total_productos || 0,
                    stock_total: data[0]?.stock_total || 0,
                    valor_inventario: data[0]?.valor_inventario || 0
                },
                pedidos: {
                    total_pedidos: data[0]?.total_pedidos || 0,
                    pendientes: data[0]?.pendientes || 0,
                    entregados: data[0]?.entregados || 0
                },
                compras: {
                    total_compras: data[0]?.total_compras || 0,
                    gastos_compras: data[0]?.gastos_compras || 0
                },
                gastos: {
                    total_gastos: data[0]?.total_gastos || 0,
                    total_gastos_operativos: data[0]?.total_gastos_operativos || 0
                }
            }
        };
    } catch (error) {
        console.error("Error al obtener resumen general:", error);
        return {
            success: false,
            error: error.message
        };
    }
};

// ✅ Obtener ventas por mes - CORREGIDO
export const obtenerVentasPorMesAnalytics = async () => {
    try {
        const response = await fetch(urlVentasPorMes, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Ventas por mes obtenidas:", data);
        
        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error("Error al obtener ventas por mes:", error);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
};

// ✅ Obtener productos más vendidos - CORREGIDO
export const obtenerProductosMasVendidosAnalytics = async () => {
    try {
        const response = await fetch(urlProductosMasVendidos, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Productos más vendidos obtenidos:", data);
        
        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error("Error al obtener productos más vendidos:", error);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
};

// ✅ Obtener análisis de rentabilidad - CORREGIDO
export const obtenerAnalisisRentabilidadAnalytics = async () => {
    try {
        const response = await fetch(urlAnalisisRentabilidad, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Análisis de rentabilidad obtenido:", data);
        
        // En la función obtenerAnalisisRentabilidadAnalytics, corregir el cálculo del margen bruto:
const ingresos_totales = data[0]?.ingresos_totales || 0;
const compras = data[0]?.compras || 0;
const gastos_operativos = data[0]?.gastos_operativos || 0;
const costos_totales = compras + gastos_operativos;
const utilidad_neta = ingresos_totales - costos_totales;

// CÁLCULO CORREGIDO DEL MARGEN BRUTO:
// Margen bruto = (Utilidad Bruta / Ingresos) * 100
// Utilidad Bruta = Ingresos - Costo de Ventas (compras)
const utilidad_bruta = ingresos_totales - compras;
const margen_bruto = ingresos_totales > 0 ? (utilidad_bruta / ingresos_totales) * 100 : 0;

return {
    success: true,
    data: {
        ingresos: {
            ingresos_totales: ingresos_totales,
            subtotal: data[0]?.subtotal || 0,
            descuentos_totales: data[0]?.descuentos_totales || 0,
            impuestos_totales: data[0]?.impuestos_totales || 0
        },
        costos: {
            total: costos_totales,
            compras: compras,
            gastos_operativos: gastos_operativos
        },
        utilidad_neta: utilidad_neta,
        utilidad_bruta: utilidad_bruta,
        margen_bruto: parseFloat(margen_bruto.toFixed(2))
    }
};
    } catch (error) {
        console.error("Error al obtener análisis de rentabilidad:", error);
        return {
            success: false,
            error: error.message
        };
    }
};

// ✅ Obtener clientes top - CORREGIDO
export const obtenerClientesTopAnalytics = async () => {
    try {
        const response = await fetch(urlClientesTop, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Clientes top obtenidos:", data);
        
        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error("Error al obtener clientes top:", error);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
};

// ✅ Obtener métodos de pago más usados - CORREGIDO
export const obtenerMetodosPagoAnalytics = async () => {
    try {
        const response = await fetch(urlMetodosPago, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Métodos de pago obtenidos:", data);
        
        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error("Error al obtener métodos de pago:", error);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
};

// ✅ Obtener gastos por categoría - CORREGIDO
export const obtenerGastosPorCategoriaAnalytics = async () => {
    try {
        const response = await fetch(urlGastosPorCategoria, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Gastos por categoría obtenidos:", data);
        
        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error("Error al obtener gastos por categoría:", error);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
};

// ✅ Obtener comparación periódica - CORREGIDO
export const obtenerComparacionPeriodicaAnalytics = async () => {
    try {
        const response = await fetch(urlComparacionPeriodica, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Comparación periódica obtenida:", data);
        
        // Procesar datos para el frontend
        const mesActual = data.find(item => item.periodo === 'actual') || { ventas: 0, ingresos: 0, ticket_promedio: 0 };
        const mesAnterior = data.find(item => item.periodo === 'anterior') || { ventas: 0, ingresos: 0, ticket_promedio: 0 };
        
        const cambioVentas = mesAnterior.ventas > 0 ? 
            ((mesActual.ventas - mesAnterior.ventas) / mesAnterior.ventas) * 100 : 0;
        const cambioIngresos = mesAnterior.ingresos > 0 ? 
            ((mesActual.ingresos - mesAnterior.ingresos) / mesAnterior.ingresos) * 100 : 0;
        const cambioTicket = mesAnterior.ticket_promedio > 0 ? 
            ((mesActual.ticket_promedio - mesAnterior.ticket_promedio) / mesAnterior.ticket_promedio) * 100 : 0;
        
        return {
            success: true,
            data: {
                mes_actual: mesActual,
                mes_anterior: mesAnterior,
                cambios: {
                    ventas: parseFloat(cambioVentas.toFixed(1)),
                    ingresos: parseFloat(cambioIngresos.toFixed(1)),
                    ticket_promedio: parseFloat(cambioTicket.toFixed(1))
                }
            }
        };
    } catch (error) {
        console.error("Error al obtener comparación periódica:", error);
        return {
            success: false,
            error: error.message
        };
    }
};

// ✅ Obtener KPIs - CORREGIDO
export const obtenerKPIsAnalytics = async () => {
    try {
        const response = await fetch(urlKPIs, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("KPIs obtenidos:", data);
        
        // Calcular KPIs adicionales basados en los datos
        const total_pedidos = data[0]?.total_pedidos || 0;
        const entregados = data[0]?.entregados || 0;
        const stock_total = data[0]?.stock_total || 0;
        const unidades_vendidas = data[0]?.unidades_vendidas || 0;
        
        const tasa_conversion = total_pedidos > 0 ? (entregados / total_pedidos) * 100 : 0;
        const rotacion_inventario = stock_total > 0 ? (unidades_vendidas / stock_total) * 100 : 0;
        
        return {
            success: true,
            data: {
                tasa_conversion: parseFloat(tasa_conversion.toFixed(1)),
                valor_promedio_orden: data[0]?.valor_promedio_orden || 0,
                rotacion_inventario: parseFloat(rotacion_inventario.toFixed(1)),
                total_pedidos: total_pedidos,
                entregados: entregados,
                stock_total: stock_total,
                unidades_vendidas: unidades_vendidas
            }
        };
    } catch (error) {
        console.error("Error al obtener KPIs:", error);
        return {
            success: false,
            error: error.message
        };
    }
};

// ✅ Obtener tendencias de inventario - CORREGIDO
export const obtenerTendenciasInventarioAnalytics = async () => {
    try {
        const response = await fetch(urlTendenciasInventario, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Tendencias de inventario obtenidas:", data);
        
        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error("Error al obtener tendencias de inventario:", error);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
};

// ✅ Obtener ventas por categoría - CORREGIDO
export const obtenerVentasPorCategoriaAnalytics = async () => {
    try {
        const response = await fetch(urlVentasPorCategoria, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Ventas por categoría obtenidas:", data);
        
        return {
            success: true,
            data: data
        };
    } catch (error) {
        console.error("Error al obtener ventas por categoría:", error);
        return {
            success: false,
            error: error.message,
            data: []
        };
    }
};









// ✅ Obtener dashboard completo
export const obtenerDashboardCompletoAnalytics = async () => {
    try {
        const response = await fetch(urlDashboardCompleto, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Dashboard completo obtenido:", data);
        return data;
    } catch (error) {
        console.error("Error al obtener dashboard completo:", error);
        throw new Error(`Error al obtener dashboard completo: ${error.message}`);
    }
};






















// =============================================
// 💬 FUNCIONES PARA EL CHAT CRM
// =============================================

const urlInteraccionesCliente = "http://localhost:8000/api/crm/interacciones/cliente";

// ✅ Obtener interacciones de un cliente específico (para el chat)
export const obtenerInteraccionesPorCliente = async (id_cliente) => {
  try {
    if (!id_cliente) {
      throw new Error("El ID del cliente es requerido");
    }

    const response = await fetch(`${urlInteraccionesCliente}/${id_cliente}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Interacciones del cliente obtenidas:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener interacciones del cliente:", error);
    throw new Error(`Error al obtener interacciones del cliente: ${error.message}`);
  }
};

// ✅ Crear interacción de chat (enviar mensaje)
export const crearInteraccionChat = async (id_cliente, mensaje) => {
  try {
    if (!id_cliente || !mensaje) {
      throw new Error("El ID del cliente y el mensaje son requeridos");
    }

    const interaccionData = {
      id_cliente: id_cliente,
      tipo_interaccion: "Chat",
      fecha_interaccion: new Date().toISOString().slice(0, 19).replace('T', ' '),
      descripcion: mensaje,
      id_usuario: null // El cliente envía el mensaje
    };

    console.log("Enviando mensaje de chat:", interaccionData);

    const response = await fetch(urlInteracciones, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(interaccionData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Mensaje de chat enviado exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error al enviar mensaje de chat:", error);
    throw new Error(`Error al enviar mensaje de chat: ${error.message}`);
  }
};

// ✅ Verificar si hay mensajes nuevos (polling) - VERSIÓN CORREGIDA
export const verificarMensajesNuevos = async (id_cliente, ultimaFecha) => {
  try {
    if (!ultimaFecha) {
      return []; // No hay fecha anterior, no retornar nada nuevo
    }

    const interacciones = await obtenerInteraccionesPorCliente(id_cliente);
    
    if (!interacciones || interacciones.length === 0) {
      return [];
    }

    // Filtrar solo los mensajes más recientes Y que sean del admin/CRM (id_usuario NO nulo)
    const mensajesNuevos = interacciones.filter(interaccion => {
      try {
        const fechaInteraccion = new Date(interaccion.fecha_interaccion);
        const fechaUltima = new Date(ultimaFecha);
        
        // ✅ SOLO mensajes del admin/CRM (id_usuario no nulo) Y más recientes
        return fechaInteraccion > fechaUltima && interaccion.id_usuario !== null;
      } catch (error) {
        console.error('Error al comparar fechas:', error);
        return false;
      }
    });

    console.log('Mensajes nuevos del servidor (solo admin/CRM):', mensajesNuevos.length);
    return mensajesNuevos;
    
  } catch (error) {
    console.error("Error al verificar mensajes nuevos:", error);
    return [];
  }
};






// =============================================
// 📋 CASOS DE SOPORTE
// =============================================

// ✅ Obtener todos los casos de soporte
export const obtenerCasosSoporte = async () => {
  try {
    const response = await fetch(urlCasosSoporte, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Casos de soporte obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener casos de soporte:", error);
    throw new Error(`Error al obtener casos de soporte: ${error.message}`);
  }
};

// ✅ Crear nuevo caso de soporte
export const crearCasoSoporte = async (casoData) => {
  try {
    console.log("Enviando datos del caso de soporte:", casoData);

    const response = await fetch(urlCasosSoporte, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(casoData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Caso de soporte creado exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error al crear caso de soporte:", error);
    throw new Error(`Error al crear caso de soporte: ${error.message}`);
  }
};

// ✅ Actualizar caso de soporte
export const actualizarCasoSoporte = async (casoData) => {
  try {
    console.log("Enviando datos para actualizar caso de soporte:", casoData);

    if (!casoData.id_caso) {
      throw new Error("El ID del caso es requerido para actualizar");
    }

    const response = await fetch(urlCasosSoporte, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(casoData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Caso de soporte actualizado exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error al actualizar caso de soporte:", error);
    throw new Error(`Error al actualizar caso de soporte: ${error.message}`);
  }
};

// ✅ Eliminar caso de soporte
export const eliminarCasoSoporte = async (id_caso) => {
    try {
        const response = await fetch(`${urlCasosSoporte}/${id_caso}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al eliminar caso de soporte:', error);
        throw error;
    }
};

// =============================================
// 📅 ACTIVIDADES
// =============================================

// ✅ Obtener todas las actividades
export const obtenerActividades = async () => {
  try {
    const response = await fetch(urlActividades, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Actividades obtenidas:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener actividades:", error);
    throw new Error(`Error al obtener actividades: ${error.message}`);
  }
};

// ✅ Crear nueva actividad
export const crearActividad = async (actividadData) => {
  try {
    console.log("Enviando datos de la actividad:", actividadData);

    const response = await fetch(urlActividades, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(actividadData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Actividad creada exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error al crear actividad:", error);
    throw new Error(`Error al crear actividad: ${error.message}`);
  }
};

// ✅ Actualizar actividad
export const actualizarActividad = async (actividadData) => {
  try {
    console.log("Enviando datos para actualizar actividad:", actividadData);

    if (!actividadData.id_actividad) {
      throw new Error("El ID de la actividad es requerido para actualizar");
    }

    const response = await fetch(urlActividades, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(actividadData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Actividad actualizada exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error al actualizar actividad:", error);
    throw new Error(`Error al actualizar actividad: ${error.message}`);
  }
};

// ✅ Eliminar actividad
export const eliminarActividad = async (id_actividad) => {
    try {
        const response = await fetch(`${urlActividades}/${id_actividad}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al eliminar actividad:', error);
        throw error;
    }
};

// =============================================
// 💬 INTERACCIONES
// =============================================

// ✅ Obtener todas las interacciones
export const obtenerInteracciones = async () => {
  try {
    const response = await fetch(urlInteracciones, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Interacciones obtenidas:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener interacciones:", error);
    throw new Error(`Error al obtener interacciones: ${error.message}`);
  }
};

// ✅ Crear nueva interacción
// ✅ Crear una interacción
export const crearInteraccion = async (interaccionData) => {
  try {
    console.log("Enviando datos de la interacción:", interaccionData);

    const response = await fetch(urlInteracciones, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(interaccionData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Interacción creada exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error al crear interacción:", error);
    throw new Error(`Error al crear interacción: ${error.message}`);
  }
};

// ✅ Actualizar interacción
export const actualizarInteraccion = async (interaccionData) => {
  try {
    console.log("Enviando datos para actualizar interacción:", interaccionData);

    if (!interaccionData.id_interaccion) {
      throw new Error("El ID de la interacción es requerido para actualizar");
    }

    const response = await fetch(urlInteracciones, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(interaccionData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Interacción actualizada exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error al actualizar interacción:", error);
    throw new Error(`Error al actualizar interacción: ${error.message}`);
  }
};

// ✅ Eliminar interacción
export const eliminarInteraccion = async (id_interaccion) => {
    try {
        const response = await fetch(`${urlInteracciones}/${id_interaccion}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al eliminar interacción:', error);
        throw error;
    }
};

// =============================================
// 💼 OPORTUNIDADES
// =============================================

// ✅ Obtener todas las oportunidades
export const obtenerOportunidades = async () => {
  try {
    const response = await fetch(urlOportunidades, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Oportunidades obtenidas:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener oportunidades:", error);
    throw new Error(`Error al obtener oportunidades: ${error.message}`);
  }
};

// ✅ Crear nueva oportunidad
export const crearOportunidad = async (oportunidadData) => {
  try {
    console.log("Enviando datos de la oportunidad:", oportunidadData);

    const response = await fetch(urlOportunidades, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(oportunidadData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Oportunidad creada exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error al crear oportunidad:", error);
    throw new Error(`Error al crear oportunidad: ${error.message}`);
  }
};

// ✅ Actualizar oportunidad
export const actualizarOportunidad = async (oportunidadData) => {
  try {
    console.log("Enviando datos para actualizar oportunidad:", oportunidadData);

    if (!oportunidadData.id_oportunidad) {
      throw new Error("El ID de la oportunidad es requerido para actualizar");
    }

    const response = await fetch(urlOportunidades, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(oportunidadData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Oportunidad actualizada exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error al actualizar oportunidad:", error);
    throw new Error(`Error al actualizar oportunidad: ${error.message}`);
  }
};

// ✅ Eliminar oportunidad
export const eliminarOportunidad = async (id_oportunidad) => {
    try {
        const response = await fetch(`${urlOportunidades}/${id_oportunidad}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al eliminar oportunidad:', error);
        throw error;
    }
};

// =============================================
// 🔍 BÚSQUEDA Y MÉTRICAS
// =============================================

// ✅ Búsqueda global en CRM
export const buscarCRM = async (termino) => {
  try {
    console.log("Buscando en CRM:", termino);

    if (!termino || termino.trim() === '') {
      throw new Error("El término de búsqueda es requerido");
    }

    const response = await fetch(`${urlBuscarCRM}?termino=${encodeURIComponent(termino)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Resultados de búsqueda:", data);
    return data;
  } catch (error) {
    console.error("Error en búsqueda CRM:", error);
    throw new Error(`Error en búsqueda CRM: ${error.message}`);
  }
};

// ✅ Obtener dashboard del CRM
export const obtenerDashboardCRM = async () => {
  try {
    const response = await fetch(urlDashboardCRM, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Dashboard CRM obtenido:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener dashboard CRM:", error);
    throw new Error(`Error al obtener dashboard CRM: ${error.message}`);
  }
};

// ✅ Obtener tasa de conversión
export const obtenerTasaConversion = async () => {
  try {
    const response = await fetch(urlTasaConversion, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Tasa de conversión obtenida:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener tasa de conversión:", error);
    throw new Error(`Error al obtener tasa de conversión: ${error.message}`);
  }
};

// ✅ Obtener satisfacción del cliente
export const obtenerSatisfaccionCliente = async () => {
  try {
    const response = await fetch(urlSatisfaccionCliente, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Satisfacción del cliente obtenida:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener satisfacción del cliente:", error);
    throw new Error(`Error al obtener satisfacción del cliente: ${error.message}`);
  }
};

// ✅ Obtener retención de clientes
export const obtenerRetencionClientes = async () => {
  try {
    const response = await fetch(urlRetencionClientes, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Retención de clientes obtenida:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener retención de clientes:", error);
    throw new Error(`Error al obtener retención de clientes: ${error.message}`);
  }
};

// ✅ Obtener churn rate
export const obtenerChurnRate = async () => {
  try {
    const response = await fetch(urlChurnRate, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Churn rate obtenido:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener churn rate:", error);
    throw new Error(`Error al obtener churn rate: ${error.message}`);
  }
};

// ✅ Obtener todas las métricas del CRM
export const obtenerTodasLasMetricasCRM = async () => {
  try {
    const [dashboard, tasaConversion, satisfaccion, retencion, churnRate] = await Promise.all([
      obtenerDashboardCRM(),
      obtenerTasaConversion(),
      obtenerSatisfaccionCliente(),
      obtenerRetencionClientes(),
      obtenerChurnRate()
    ]);

    const metricasCompletas = {
      dashboard: dashboard.resumen,
      tasaConversion,
      satisfaccion,
      retencion,
      churnRate
    };

    console.log("Todas las métricas CRM obtenidas:", metricasCompletas);
    return metricasCompletas;
  } catch (error) {
    console.error("Error al obtener todas las métricas CRM:", error);
    throw new Error(`Error al obtener todas las métricas CRM: ${error.message}`);
  }
};

// =============================================
// 🎯 FUNCIONES AUXILIARES
// =============================================

// ✅ Obtener clientes para dropdowns
export const obtenerClientesParaCRM = async () => {
  try {
    // Reutilizar la función existente de usuarios
    const usuarios = await obtainUsuarios();
    return usuarios.filter(usuario => usuario.rol === 'cliente' && usuario.activo === 1);
  } catch (error) {
    console.error("Error al obtener clientes para CRM:", error);
    throw new Error(`Error al obtener clientes para CRM: ${error.message}`);
  }
};

// ✅ Obtener usuarios para asignación (empleados/admin)
export const obtenerUsuariosParaAsignacion = async () => {
  try {
    const usuarios = await obtainUsuarios();
    return usuarios.filter(usuario => 
      ( usuario.rol==='crm') && usuario.activo === 1
    );
  } catch (error) {
    console.error("Error al obtener usuarios para asignación:", error);
    throw new Error(`Error al obtener usuarios para asignación: ${error.message}`);
  }
};

// ✅ Formatear fecha para el backend
export const formatearFechaParaBackend = (fecha) => {
  if (!fecha) return null;
  
  // Si es un objeto Date, formatear a YYYY-MM-DD HH:mm:ss
  if (fecha instanceof Date) {
    return fecha.toISOString().slice(0, 19).replace('T', ' ');
  }
  
  // Si ya es string, retornar tal cual
  return fecha;
};

//Usuarios CRUD

export const registrarUsuario = async (datosUsuario) => {
    try {
        const response = await fetch(`${urlRegistarUsu}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosUsuario)
        });
        
        const resultado = await response.json();
        return resultado;
        
    } catch (error) {
        console.error("Error al registrar usuario:", error);
    }
}

export const loginUsuario = async (datosLogin) => {
    try {
        const response = await fetch(`${urlLoginUsu}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosLogin)
        });
        
        const resultado = await response.json();
        return resultado;
        
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
    }
}

export const obtainUsuarios = async ()=>{
    try {
        const resultadousuarios = await fetch(urlUsuarios);
        const usuarios = await resultadousuarios.json();
        return usuarios;
    } catch (error) {
        console.error("error al obtener los usuarios");
    }
}

export const actualizarUsuarios = async (datosUsuarios) => {
    try {
        const response = await fetch(`${urlActualizarUsuarios}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosUsuarios)
        });
        const resultado = await response.json();
        return resultado;                                   
    } catch (error) {
        console.error("Error al actualizar usuarios:", error);
    }
} 

export const eliminarUsuarios = async (idusuarios) => {
    try {
        const response = await fetch(`${urlEliminarUsuarios.replace(':idusuarios', idusuarios)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }   
        });
        const resultado = await response.json();
        return resultado;
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
    }
}
//Compras CRUD y mas

// Obtener todas las compras con paginación y filtros
export const getCompras = async (page = 1, limit = 10, idProveedor = null) => {
    try {
        let url = `${urlCompras}?page=${page}&limit=${limit}`;
        if (idProveedor) {
            url += `&idProveedor=${idProveedor}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al obtener compras:', error);
        throw error;
    }
};

// Obtener una compra específica por ID
export const getCompraPorId = async (idCompra) => {
    try {
        const response = await fetch(`${urlCompras}/${idCompra}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al obtener compra por ID:', error);
        throw error;
    }
};

// Registrar una nueva compra
export const postCompra = async (compraData) => {
    try {
        const response = await fetch(urlRegistrarCompra, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(compraData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al registrar compra:', error);
        throw error;
    }
};

// Actualizar una compra existente
export const putCompra = async (compraData) => {
    try {
        const response = await fetch(urlActualizarCompra, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(compraData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al actualizar compra:', error);
        throw error;
    }
};

// Eliminar una compra
export const deleteCompra = async (idCompra) => {
    try {
        const response = await fetch(`${urlCompras}/${idCompra}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al eliminar compra:', error);
        throw error;
    }
};

// Obtener estadísticas de compras
export const getEstadisticasCompras = async (fechaInicio = null, fechaFin = null) => {
    try {
        let url = urlEstadisticasCompras;
        const params = new URLSearchParams();

        if (fechaInicio) params.append('fechaInicio', fechaInicio);
        if (fechaFin) params.append('fechaFin', fechaFin);

        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al obtener estadísticas de compras:', error);
        throw error;
    }
};

// Obtener proveedores para el combo box
export const getProveedoresForCompras = async () => {
    try {
        const response = await fetch(urlEstadisticasProveedores, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al obtener proveedores para compras:', error);
        throw error;
    }
};

// Obtener productos para el combo box
export const getProductosForCompras = async () => {
    try {
        const response = await fetch(urlEstadisticasProductos, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Error al obtener productos para compras:', error);
        throw error;
    }
};
//Gastos CRUD
// ✅ Obtener productos para gastos (dropdown)
export const obtenerProductosParaGastos = async () => {
  try {
    const response = await fetch(urlProductosGastos, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Productos para gastos obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener productos para gastos:", error);
    throw new Error(`Error al obtener productos para gastos: ${error.message}`);
  }
};

// ✅ Obtener todos los gastos
export const obtenerGastos = async () => {
  try {
    const response = await fetch(urlObtenerGastos, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Gastos obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener gastos:", error);
    throw new Error(`Error al obtener gastos: ${error.message}`);
  }
};

// ✅ Registrar nuevo gasto
export const registrarGasto = async (gastoData) => {
  try {
    console.log("Enviando datos del gasto:", gastoData);

    const response = await fetch(urlRegistrarGasto, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gastoData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Gasto registrado exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error al registrar gasto:", error);
    throw new Error(`Error al registrar gasto: ${error.message}`);
  }
};

// ✅ Actualizar gasto existente
export const actualizarGasto = async (gastoData) => {
  try {
    console.log("Enviando datos para actualizar gasto:", gastoData);

    if (!gastoData.idGasto) {
      throw new Error("El ID del gasto es requerido para actualizar");
    }

    const response = await fetch(urlActualizarGasto, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(gastoData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Gasto actualizado exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error al actualizar gasto:", error);
    throw new Error(`Error al actualizar gasto: ${error.message}`);
  }
};

// ✅ Eliminar gasto
export const eliminarGasto = async (idGasto) => {
  try {
    console.log("Eliminando gasto con ID:", idGasto);

    if (!idGasto) {
      throw new Error("El ID del gasto es requerido para eliminar");
    }

    const response = await fetch(`${urlEliminarGasto}/${idGasto}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Gasto eliminado exitosamente:", data);
    return data;
  } catch (error) {
    console.error("Error al eliminar gasto:", error);
    throw new Error(`Error al eliminar gasto: ${error.message}`);
  }
};

// ✅ Obtener gastos por rango de fechas (funcionalidad adicional)
export const obtenerGastosPorFecha = async (fechaInicio, fechaFin) => {
  try {
    const params = new URLSearchParams();
    if (fechaInicio) params.append('fechaInicio', fechaInicio);
    if (fechaFin) params.append('fechaFin', fechaFin);

    const response = await fetch(`${urlObtenerGastos}?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Gastos por fecha obtenidos:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener gastos por fecha:", error);
    throw new Error(`Error al obtener gastos por fecha: ${error.message}`);
  }
};

// ✅ Obtener estadísticas de gastos (funcionalidad adicional)
export const obtenerEstadisticasGastos = async () => {
  try {
    const gastos = await obtenerGastos();
    
    if (!Array.isArray(gastos)) {
      return {
        totalGastos: 0,
        montoTotal: 0,
        promedioGasto: 0,
        gastosPorCategoria: {}
      };
    }

    const totalGastos = gastos.length;
    const montoTotal = gastos.reduce((sum, gasto) => sum + parseFloat(gasto.monto || 0), 0);
    const promedioGasto = totalGastos > 0 ? montoTotal / totalGastos : 0;
    
    // Agrupar por categoría
    const gastosPorCategoria = gastos.reduce((acc, gasto) => {
      const categoria = gasto.categoria || 'Sin categoría';
      if (!acc[categoria]) {
        acc[categoria] = { count: 0, monto: 0 };
      }
      acc[categoria].count++;
      acc[categoria].monto += parseFloat(gasto.monto || 0);
      return acc;
    }, {});

    const estadisticas = {
      totalGastos,
      montoTotal: parseFloat(montoTotal.toFixed(2)),
      promedioGasto: parseFloat(promedioGasto.toFixed(2)),
      gastosPorCategoria
    };

    console.log("Estadísticas de gastos:", estadisticas);
    return estadisticas;
  } catch (error) {
    console.error("Error al obtener estadísticas de gastos:", error);
    throw new Error(`Error al obtener estadísticas de gastos: ${error.message}`);
  }
};

//Proveedores CRUD

export const obtainProveedores = async () => {
    try {
        const resultado = await fetch(urlProveedor);
        const proveedores = await resultado.json();
        return proveedores;
    } catch (error) {
        console.error("Error al obtener los proveedores:", error);
        throw error;
    }
}

export const registrarProveedor = async (datosProveedor) => {
    try {
        const response = await fetch(`${urlProveedor}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosProveedor)
        });
        
        const resultado = await response.json();
        return resultado;
        
    } catch (error) {
        console.error("Error al registrar proveedor:", error);
        throw error;
    }
}

export const actualizarProveedor = async (datosProveedor) => {
    try {
        const response = await fetch(`${urlActualizarProveedor}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosProveedor)
        });

        const resultado = await response.json();

        if (response.ok) {
            // Refrescar la página después de 1 segundo
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            console.error("❌ Error en la actualización:", resultado);
        }

        return resultado;

    } catch (error) {
        console.error("Error al actualizar el proveedor:", error);
        throw error;
    }
}

export const eliminarProveedor = async (idProveedor) => {
    try {
        const response = await fetch(`${urlProveedor}/${idProveedor}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }   
        });
        const resultado = await response.json();
        
        if (response.ok) {
            // Refrescar la página después de mostrar el mensaje
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
        
        return resultado;
    } catch (error) {
        console.error("Error al eliminar el proveedor:", error);
        throw error;
    }
}

//Productos Tecnologicos CRUD

export const obtainProductos = async ()=>{
    try {
        const resultado = await fetch(urlProductos);
        const productos = await resultado.json();
        return productos;
    } catch (error) {
        console.error("error al obtener los productos");
    }
}

export const RegistrarProductos = async (datosProductos) => {
    try {
        const response = await fetch(`${urlRegistrarProductos}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosProductos)
            
        });
        
        
        const resultado = await response.json();
        return resultado;
        
    } catch (error) {
        console.error("Error al registrar los productos:", error);
    }
}

export const actualizarProductos = async (datosProductos) => {
    try {
        const response = await fetch(`${urlActualizarProductos}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosProductos)
        });

        const resultado = await response.json();

        if (response.ok) {
            // Refrescar la página después de 1 segundo
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            console.error("❌ Error en la actualización:", resultado);
        }

        return resultado;

    } catch (error) {
        console.error("Error al actualizar los productos:", error);
    }
}


export const eliminarProductos = async (idproductos) => {
    try {
        const response = await fetch(`${urlEliminarProductos.replace(':idProducto', idproductos)}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            }   
        });
        const resultado = await response.json();
        return resultado;
    } catch (error) {
        console.error("Error al eliminar el Producto:", error);
    }
}



//Pedidos CRUD

export const crearPedido = async (datosPedido) => {
    try {
        const response = await fetch(`${urlPedidos}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosPedido)
        });
        
        const resultado = await response.json();
        return resultado;
        
    } catch (error) {
        console.error("Error al crear el pedido:", error);
        throw error;
    }
}

export const obtenerPedidos = async () => {
    try {
        const resultado = await fetch(urlPedidos);
        const pedidos = await resultado.json();
        return pedidos;
    } catch (error) {
        console.error("Error al obtener los pedidos:", error);
    }
}

export const obtenerPedidosPorUsuario = async (idUsuario) => {
    try {
        const url = urlPedidosUsuario.replace(':idUsuario', idUsuario);
        const resultado = await fetch(url);
        const pedidos = await resultado.json();
        return pedidos;
    } catch (error) {
        console.error("Error al obtener los pedidos del usuario:", error);
    }
}

export const obtenerDetallePedido = async (idPedido) => {
    try {
        const url = urlPedidoDetalle.replace(':idPedido', idPedido);
        const resultado = await fetch(url);
        const detalle = await resultado.json();
        return detalle;
    } catch (error) {
        console.error("Error al obtener el detalle del pedido:", error);
    }
}

export const actualizarEstadoPedido = async (idPedido, estado) => {
    try {
        const url = urlPedidoEstado.replace(':idPedido', idPedido);
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado })
        });
        
        const resultado = await response.json();
        return resultado;
        
    } catch (error) {
        console.error("Error al actualizar el estado del pedido:", error);
    }
}

export const obtainPedidos = async ()=>{
    try {
        const resultadopedidos = await fetch(urlPedidosTodo);
        const pedidos = await resultadopedidos.json();
        return pedidos;
    } catch (error) {
        console.error("error al obtener los pedidos");
    }
}

//Pagos CRUD

export const crearPago = async (datosPago) => {
    try {
        const response = await fetch(`${urlPagos}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosPago)
        });
        
        const resultado = await response.json();
        return resultado;
        
    } catch (error) {
        console.error("Error al crear el pago:", error);
        throw error;
    }
}

export const obtenerPagos = async () => {
    try {
        const resultado = await fetch(urlPagos);
        const pagos = await resultado.json();
        return pagos;
    } catch (error) {
        console.error("Error al obtener los pagos:", error);
    }
}

export const obtenerPagosPorUsuario = async (idUsuario) => {
    try {
        const url = urlPagosUsuario.replace(':idUsuario', idUsuario);
        const resultado = await fetch(url);
        const pagos = await resultado.json();
        return pagos;
    } catch (error) {
        console.error("Error al obtener los pagos del usuario:", error);
    }
}

export const obtenerFormasPago = async () => {
    try {
        const resultado = await fetch(urlFormasPago);
        const formasPago = await resultado.json();
        return formasPago;
    } catch (error) {
        console.error("Error al obtener las formas de pago:", error);
    }
}

export const actualizarEstadoPago = async (idPago, estado_pago, notas_pago = null) => {
    try {
        const url = urlPagoEstado.replace(':idPago', idPago);
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado_pago, notas_pago })
        });
        
        const resultado = await response.json();
        return resultado;
        
    } catch (error) {
        console.error("Error al actualizar el estado del pago:", error);
    }
}

export const obtainPagos = async ()=>{
    try {
        const resultadoPagos = await fetch(urlPagosTodo);
        const pagos = await resultadoPagos.json();
        return pagos;
    } catch (error) {
        console.error("error al obtener los pagos");
    }
}

export const obtainPagosCount = async ()=>{
    try {
        const resultadoPagos = await fetch(urlPagosCount);
        const pagos = await resultadoPagos.json();
        return pagos;
    } catch (error) {
        console.error("error al obtener los pagos");
    }
}


//Historial compras

export async function getHistorialCompras() {
    try {
        const idUsuario = sessionStorage.getItem("idUsuario");
        const rol = sessionStorage.getItem("rol");

        if (!idUsuario || rol === "admin") {
            return { success: false, message: "No autorizado: debes ser cliente" };
        }

        const response = await fetch(`http://localhost:8000/historial/${idUsuario}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error al obtener historial de compras:", error);
        return { success: false, message: "No se pudo obtener el historial" };
    }
}

// Crear nueva venta
export const crearVenta = async (datosVenta) => {
    try {
        const response = await fetch(`${urlVentas}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datosVenta)
        });
        
        const resultado = await response.json();
        return resultado;
        
    } catch (error) {
        console.error("Error al crear la venta:", error);
        throw error;
    }
}

// Obtener todas las ventas
export const obtainVentas = async () => {
    try {
        const resultado = await fetch(urlVentas);
        if (!resultado.ok) {
            throw new Error(`Error HTTP: ${resultado.status}`);
        }
        const ventas = await resultado.json();
        return ventas;
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        throw error;
    }
}

// Obtener ventas por rango de fechas
export const obtainVentasPorFecha = async (fechaInicio, fechaFin) => {
    try {
        const url = `${urlVentasRangoFechas}?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const resultado = await response.json();
        return resultado;
    } catch (error) {
        console.error("Error al obtener ventas por fecha:", error);
        throw error;
    }
}

// Obtener estadísticas de ventas
export const obtainVentasStats = async () => {
    try {
        const response = await fetch(urlVentasStats);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const stats = await response.json();
        return stats;
    } catch (error) {
        console.error("Error al obtener estadísticas de ventas:", error);
        throw error;
    }
}

// Obtener ventas por usuario
export const obtenerVentasPorUsuario = async (idUsuario) => {
    try {
        const url = urlVentasUsuario.replace(':idUsuario', idUsuario);
        const resultado = await fetch(url);
        
        if (!resultado.ok) {
            throw new Error(`Error HTTP: ${resultado.status}`);
        }
        
        const ventas = await resultado.json();
        return ventas;
    } catch (error) {
        console.error("Error al obtener las ventas del usuario:", error);
        throw error;
    }
}

// Actualizar estado de una venta
export const actualizarEstadoVenta = async (idVenta, estado_venta) => {
    try {
        const url = urlVentaEstado.replace(':idVenta', idVenta);
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado_venta })
        });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
         if (response.ok) {
            // Refrescar la página después de 1 segundo
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            console.error("❌ Error en la actualización:", resultado);
        }
        
        const resultado = await response.json();
        return resultado;
        
    } catch (error) {
        console.error("Error al actualizar el estado de la venta:", error);
        throw error;
    }
}