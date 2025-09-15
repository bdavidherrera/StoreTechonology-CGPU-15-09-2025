import { 
    obtainProveedores, 
    registrarProveedor, 
    actualizarProveedor, 
    eliminarProveedor 
} from "../Api/consumeApi.js";

// Variables globales
let proveedoresData = [];
let proveedorEditando = null;

// Inicializar cuando el DOM esté cargado
document.addEventListener("DOMContentLoaded", function() {
    cargarProveedores();
    
    // Event listeners
    const btnAgregarProveedor = document.getElementById("btnAgregarProveedor");
    const formAgregarProveedor = document.getElementById("formAgregarProveedor");
    const formActualizarProveedor = document.getElementById("formActualizarProveedor");
    
    if (btnAgregarProveedor) {
        btnAgregarProveedor.addEventListener("click", () => {
            limpiarFormularioAgregarProveedor();
            $("#modalAgregarProveedor").modal("show");
        });
    }
    
    if (formAgregarProveedor) {
        formAgregarProveedor.addEventListener("submit", manejarRegistroProveedor);
    }
    
    if (formActualizarProveedor) {
        formActualizarProveedor.addEventListener("submit", manejarActualizacionProveedor);
    }
});

// Cargar proveedores desde la API
async function cargarProveedores() {
    try {
        console.log("🔄 Cargando proveedores...");
        const proveedores = await obtainProveedores();
        proveedoresData = Array.isArray(proveedores) ? proveedores : [];
        mostrarProveedores(proveedoresData);
        console.log("✅ Proveedores cargados:", proveedoresData.length);
    } catch (error) {
        console.error("❌ Error al cargar proveedores:", error);
        mostrarMensajeError("Error al cargar los proveedores");
    }
}

// Mostrar proveedores en la tabla
function mostrarProveedores(proveedores) {
    const tabla = document.getElementById("tablaProveedores");
    
    if (!tabla) {
        console.error("❌ No se encontró la tabla de proveedores");
        return;
    }

    if (!Array.isArray(proveedores) || proveedores.length === 0) {
        tabla.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5">
                    <i class="fas fa-building fa-3x text-muted mb-3"></i>
                    <p class="text-muted mb-0">No hay proveedores registrados</p>
                    <small class="text-muted">Haz clic en "Agregar Proveedor" para comenzar</small>
                </td>
            </tr>
        `;
        return;
    }

    tabla.innerHTML = proveedores.map(proveedor => `
        <tr class="proveedor-row">
            <td class="text-center font-weight-bold">${proveedor.idProveedor}</td>
            <td class="font-weight-bold text-primary">${proveedor.nombre}</td>
            <td class="text-muted">${proveedor.nit}</td>
            <td>
                <div class="d-flex align-items-center">
                    <i class="fas fa-map-marker-alt text-danger mr-2"></i>
                    <span title="${proveedor.direccion}">${truncarTexto(proveedor.direccion, 30)}</span>
                </div>
            </td>
            <td>
                <div class="contact-info">
                    <div class="mb-1">
                        <i class="fas fa-phone text-success mr-2"></i>
                        <span class="font-weight-bold">${proveedor.telefono}</span>
                    </div>
                    <div>
                        <i class="fas fa-envelope text-info mr-2"></i>
                        <small class="text-muted">${proveedor.correo}</small>
                    </div>
                </div>
            </td>
            <td class="text-center">
                <span class="badge badge-info px-3 py-2">
                    ${parseFloat(proveedor.porcentaje_retefuente || 0).toFixed(2)}%
                </span>
            </td>
            <td>
                    <button 
                        class="btn btn-sm btn-edit btn-action" 
                        onclick="editarProveedor(${proveedor.idProveedor})"
                        title="Editar proveedor"
                    >
                        <i class="fas fa-edit"></i>
                    </button>
                    <button 
                        class="btn btn-sm btn-delete btn-action" 
                        onclick="confirmarEliminarProveedor(${proveedor.idProveedor}, '${proveedor.nombre}')"
                        title="Eliminar proveedor"
                    >
                        <i class="fas fa-trash"></i>
                    </button>
            </td>
        </tr>
    `).join("");
}

// Manejar registro de nuevo proveedor
async function manejarRegistroProveedor(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const datosProveedor = {
        nombre: formData.get("nombre").trim(),
        nit: formData.get("nit").trim(),
        direccion: formData.get("direccion").trim(),
        telefono: formData.get("telefono").trim(),
        correo: formData.get("correo").trim(),
        porcentaje_retefuente: parseFloat(formData.get("porcentaje_retefuente") || 0)
    };

    // Validaciones
    if (!validarDatosProveedor(datosProveedor)) {
        return;
    }

    try {
        console.log("📝 Registrando proveedor:", datosProveedor);
        const resultado = await registrarProveedor(datosProveedor);
        
        if (resultado.affectedRows > 0) {
            mostrarMensajeExito("¡Proveedor registrado exitosamente!");
            $("#modalAgregarProveedor").modal("hide");
            await cargarProveedores(); // Recargar la lista
        } else {
            mostrarMensajeError("No se pudo registrar el proveedor");
        }
    } catch (error) {
        console.error("❌ Error al registrar proveedor:", error);
        mostrarMensajeError("Error al registrar el proveedor");
    }
}

// Editar proveedor
window.editarProveedor = async function(idProveedor) {
    try {
        const proveedor = proveedoresData.find(p => p.idProveedor == idProveedor);
        if (!proveedor) {
            mostrarMensajeError("Proveedor no encontrado");
            return;
        }

        proveedorEditando = proveedor;
        llenarFormularioEdicion(proveedor);
        $("#modalActualizarProveedor").modal("show");
        
    } catch (error) {
        console.error("❌ Error al editar proveedor:", error);
        mostrarMensajeError("Error al cargar los datos del proveedor");
    }
}

// Llenar formulario de edición
function llenarFormularioEdicion(proveedor) {
    document.getElementById("idProveedorActualizar").value = proveedor.idProveedor;
    document.getElementById("nombreProveedorActualizar").value = proveedor.nombre;
    document.getElementById("nitActualizar").value = proveedor.nit;
    document.getElementById("direccionActualizar").value = proveedor.direccion;
    document.getElementById("telefonoActualizar").value = proveedor.telefono;
    document.getElementById("correoActualizar").value = proveedor.correo;
    document.getElementById("porcentajeRetefuenteActualizar").value = proveedor.porcentaje_retefuente || 0;
}

// Manejar actualización de proveedor
async function manejarActualizacionProveedor(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const datosProveedor = {
        idProveedor: parseInt(formData.get("idProveedor")),
        nombre: formData.get("nombre").trim(),
        nit: formData.get("nit").trim(),
        direccion: formData.get("direccion").trim(),
        telefono: formData.get("telefono").trim(),
        correo: formData.get("correo").trim(),
        porcentaje_retefuente: parseFloat(formData.get("porcentaje_retefuente") || 0)
    };

    // Validaciones
    if (!validarDatosProveedor(datosProveedor)) {
        return;
    }

    try {
        console.log("📝 Actualizando proveedor:", datosProveedor);
        const resultado = await actualizarProveedor(datosProveedor);
        
        if (resultado.affectedRows > 0) {
            mostrarMensajeExito("¡Proveedor actualizado exitosamente!");
            $("#modalActualizarProveedor").modal("hide");
            // El reload se maneja en la función actualizarProveedor
        } else {
            mostrarMensajeError("No se pudo actualizar el proveedor");
        }
    } catch (error) {
        console.error("❌ Error al actualizar proveedor:", error);
        mostrarMensajeError("Error al actualizar el proveedor");
    }
}

// Confirmar eliminación
window.confirmarEliminarProveedor = function(idProveedor, nombre) {
    if (confirm(`¿Estás seguro de que quieres eliminar el proveedor "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
        eliminarProveedorPorId(idProveedor);
    }
}

// Eliminar proveedor
async function eliminarProveedorPorId(idProveedor) {
    try {
        console.log("🗑️ Eliminando proveedor:", idProveedor);
        const resultado = await eliminarProveedor(idProveedor);
        
        if (resultado.affectedRows > 0) {
            mostrarMensajeExito("¡Proveedor eliminado exitosamente!");
            // El reload se maneja en la función eliminarProveedor
        } else {
            mostrarMensajeError("No se pudo eliminar el proveedor");
        }
    } catch (error) {
        console.error("❌ Error al eliminar proveedor:", error);
        mostrarMensajeError("Error al eliminar el proveedor");
    }
}

// Validar datos del proveedor
function validarDatosProveedor(datos) {
    if (!datos.nombre) {
        mostrarMensajeError("El nombre es obligatorio");
        return false;
    }
    
    if (!datos.nit) {
        mostrarMensajeError("El NIT es obligatorio");
        return false;
    }
    
    if (!datos.direccion) {
        mostrarMensajeError("La dirección es obligatoria");
        return false;
    }
    
    if (!datos.telefono) {
        mostrarMensajeError("El teléfono es obligatorio");
        return false;
    }
    
    if (!datos.correo) {
        mostrarMensajeError("El correo es obligatorio");
        return false;
    }
    
    // Validar formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(datos.correo)) {
        mostrarMensajeError("El formato del correo no es válido");
        return false;
    }
    
    // Validar porcentaje de retención en la fuente
    if (datos.porcentaje_retefuente < 0 || datos.porcentaje_retefuente > 100) {
        mostrarMensajeError("El porcentaje de retención debe estar entre 0 y 100");
        return false;
    }
    
    return true;
}

// Limpiar formulario de agregar
function limpiarFormularioAgregarProveedor() {
    const form = document.getElementById("formAgregarProveedor");
    if (form) {
        form.reset();
        // Remover clases de validación
        form.querySelectorAll(".form-control").forEach(input => {
            input.classList.remove("is-valid", "is-invalid");
        });
    }
}

// Limpiar formulario de actualizar
window.limpiarFormularioActualizarProveedor = function() {
    if (proveedorEditando) {
        llenarFormularioEdicion(proveedorEditando);
    }
}

// Utilidades
function truncarTexto(texto, limite) {
    if (texto.length <= limite) return texto;
    return texto.substring(0, limite) + "...";
}

function mostrarMensajeExito(mensaje) {
    // Puedes usar SweetAlert2 o cualquier librería de notificaciones
    alert(`✅ ${mensaje}`);
}

function mostrarMensajeError(mensaje) {
    alert(`❌ ${mensaje}`);
}

// Exportar funciones principales para uso global
window.cargarProveedores = cargarProveedores;
window.limpiarFormularioAgregarProveedor = limpiarFormularioAgregarProveedor;