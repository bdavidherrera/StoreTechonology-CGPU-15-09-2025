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