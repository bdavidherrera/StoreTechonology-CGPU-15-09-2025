// crm.js - Funcionalidad completa para el módulo CRM - CORREGIDO
import { 
    // Funciones CRM
    obtenerCasosSoporte, crearCasoSoporte, actualizarCasoSoporte, eliminarCasoSoporte,
    obtenerActividades, crearActividad, actualizarActividad, eliminarActividad,
    obtenerOportunidades, crearOportunidad, actualizarOportunidad, eliminarOportunidad,
    obtenerInteracciones, crearInteraccion, actualizarInteraccion, eliminarInteraccion,
    buscarCRM, obtenerDashboardCRM, obtenerTasaConversion, obtenerSatisfaccionCliente,
    obtenerRetencionClientes, obtenerChurnRate, obtenerTodasLasMetricasCRM,
    obtenerClientesParaCRM, obtenerUsuariosParaAsignacion,
    
    // Funciones Usuarios
    obtainUsuarios, registrarUsuario, actualizarUsuarios, eliminarUsuarios
} from '../../Api/consumeApi.js';

// Variables globales
let clientes = [];
let usuariosAsignacion = [];
let modoEdicion = false;
let elementoEditando = null;


// =============================================
// INICIALIZACIÓN
// =============================================

document.addEventListener('DOMContentLoaded', function() {
    inicializarCRM();
});

async function inicializarCRM() {
    try {
        // Cargar datos necesarios para dropdowns
        await cargarDatosDropdowns();
        
        // Configurar eventos
        configurarEventos();
        
        console.log('CRM inicializado correctamente');
    } catch (error) {
        console.error('Error al inicializar CRM:', error);
        mostrarAlerta('Error al inicializar el sistema CRM', 'danger');
    }
}

async function cargarDatosDropdowns() {
    try {
        // Cargar clientes para dropdowns
        clientes = await obtenerClientesParaCRM();
        
        // Cargar usuarios para asignación
        usuariosAsignacion = await obtenerUsuariosParaAsignacion();
        
        // Llenar dropdowns en los modales
        llenarDropdownClientes();
        llenarDropdownUsuarios();
        
    } catch (error) {
        console.error('Error al cargar datos para dropdowns:', error);
    }
}

function llenarDropdownClientes() {
    const dropdowns = [
        'id_cliente',
        'id_clienteActividad',
        'id_clienteOportunidad',
        'id_clienteInteraccion'
    ];
    
    dropdowns.forEach(id => {
        const dropdown = document.getElementById(id);
        if (dropdown) {
            dropdown.innerHTML = '<option value="">Seleccionar cliente...</option>';
            clientes.forEach(cliente => {
                const option = document.createElement('option');
                option.value = cliente.idUsuario;
                option.textContent = `${cliente.nombre} (${cliente.correo})`;
                dropdown.appendChild(option);
            });
        }
    });
}

function llenarDropdownUsuarios() {
    const dropdowns = [
        'id_usuario_asignado',
        'id_usuarioInteraccion'
    ];
    
    dropdowns.forEach(id => {
        const dropdown = document.getElementById(id);
        if (dropdown) {
            dropdown.innerHTML = '<option value="">Seleccionar usuario...</option>';
            usuariosAsignacion.forEach(usuario => {
                const option = document.createElement('option');
                option.value = usuario.idUsuario;
                option.textContent = `${usuario.nombre} (${usuario.rol})`;
                dropdown.appendChild(option);
            });
        }
    });
}

function configurarEventos() {
    // Eventos para botones de agregar
    document.getElementById('btnAgregarUsuario')?.addEventListener('click', () => abrirModalUsuario());
    document.getElementById('btnAgregarCasoSoporte')?.addEventListener('click', () => abrirModalCasoSoporte());
    document.getElementById('btnAgregarActividad')?.addEventListener('click', () => abrirModalActividad());
    document.getElementById('btnAgregarOportunidad')?.addEventListener('click', () => abrirModalOportunidad());
    document.getElementById('btnAgregarInteraccion')?.addEventListener('click', () => abrirModalInteraccion());
    
    // Eventos para guardar
    document.getElementById('btnGuardarUsuario')?.addEventListener('click', () => guardarUsuario());
    document.getElementById('btnGuardarCasoSoporte')?.addEventListener('click', () => guardarCasoSoporte());
    document.getElementById('btnGuardarActividad')?.addEventListener('click', () => guardarActividad());
    document.getElementById('btnGuardarOportunidad')?.addEventListener('click', () => guardarOportunidad());
    document.getElementById('btnGuardarInteraccion')?.addEventListener('click', () => guardarInteraccion());
    
    // Eventos para métricas
    document.getElementById('btnActualizarMetricas')?.addEventListener('click', () => cargarMetricasCRM());
    document.getElementById('btnBuscarCRM')?.addEventListener('click', () => buscarEnCRM());
    
    // Evento para enter en búsqueda
    document.getElementById('terminoBusquedaCRM')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            buscarEnCRM();
        }
    });
}

// =============================================
// FUNCIONES PARA USUARIOS
// =============================================

async function cargarUsuarios() {
    try {
        mostrarCargando('tablaUsuarios');
        const usuarios = await obtainUsuarios();
        mostrarUsuarios(usuarios);
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        mostrarError('tablaUsuarios', 'Error al cargar los usuarios');
    }
}

function mostrarUsuarios(usuarios) {
    const tbody = document.getElementById('tablaUsuarios');
    
    if (!usuarios || usuarios.length === 0) {
        tbody.innerHTML = '<tr><td colspan="10" class="text-center">No hay usuarios registrados.</td></tr>';
        return;
    }
    
    tbody.innerHTML = usuarios.map(usuario => `
        <tr>
            <td>${usuario.idUsuario}</td>
            <td>${usuario.cedula || 'N/A'}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.telefono || 'N/A'}</td>
            <td><span class="badge badge-info">${usuario.rol}</span></td>
            <td>${usuario.empresa_trabaja || 'N/A'}</td>
            <td>${formatearFecha(usuario.fecha_creacion)}</td>
            <td>${usuario.activo ? '<span class="badge badge-success">Activo</span>' : '<span class="badge badge-danger">Inactivo</span>'}</td>
        </tr>
    `).join('');
}

function abrirModalUsuario(usuario = null) {
    const modal = $('#modalUsuario');
    const titulo = $('#modalUsuarioLabel');
    const form = $('#formUsuario');
    
    modoEdicion = usuario !== null;
    elementoEditando = usuario;
    
    if (modoEdicion) {
        titulo.html('<i class="fas fa-edit"></i> Editar Usuario');
        $('#idUsuario').val(usuario.idUsuario);
        $('#cedula').val(usuario.cedula || '');
        $('#nombre').val(usuario.nombre);
        $('#correo').val(usuario.correo);
        $('#telefono').val(usuario.telefono || '');
        $('#password').val('');
        $('#password').prop('required', false);
        $('#rol').val(usuario.rol);
        $('#direccion').val(usuario.direccion || '');
        $('#empresa_trabaja').val(usuario.empresa_trabaja || '');
        
        // Mostrar/ocultar campo empresa según el rol
        if (usuario.rol === 'empresa' || usuario.rol === 'empleado') {
            $('#grupoEmpresa').show();
            $('#empresa_trabaja').prop('required', true);
        } else {
            $('#grupoEmpresa').hide();
            $('#empresa_trabaja').prop('required', false);
        }
    } else {
        titulo.html('<i class="fas fa-user-plus"></i> Agregar Usuario');
        form[0].reset();
        $('#password').prop('required', true);
        $('#grupoEmpresa').hide();
        $('#empresa_trabaja').prop('required', false);
    }
    
    modal.modal('show');
}

async function guardarUsuario() {
    try {
        const formData = new FormData(document.getElementById('formUsuario'));
        const usuarioData = Object.fromEntries(formData);
        
        // Validaciones básicas
        if (!usuarioData.nombre || !usuarioData.correo || (!modoEdicion && !usuarioData.password)) {
            mostrarAlerta('Por favor complete todos los campos obligatorios', 'warning');
            return;
        }
        
        if (modoEdicion) {
            await actualizarUsuarios(usuarioData);
            mostrarAlerta('Usuario actualizado correctamente', 'success');
        } else {
            await registrarUsuario(usuarioData);
            mostrarAlerta('Usuario creado correctamente', 'success');
        }
        
        $('#modalUsuario').modal('hide');
        await cargarUsuarios();
        await cargarDatosDropdowns(); // Recargar dropdowns
        
    } catch (error) {
        console.error('Error al guardar usuario:', error);
        mostrarAlerta('Error al guardar el usuario: ' + error.message, 'danger');
    }
}

async function editarUsuario(idUsuario) {
    try {
        const usuarios = await obtainUsuarios();
        const usuario = usuarios.find(u => u.idUsuario == idUsuario);
        
        if (usuario) {
            abrirModalUsuario(usuario);
        }
    } catch (error) {
        console.error('Error al cargar usuario para editar:', error);
        mostrarAlerta('Error al cargar datos del usuario', 'danger');
    }
}

async function eliminarUsuarioConfirm(idUsuario) {
    if (confirm('¿Está seguro de que desea eliminar este usuario?')) {
        try {
            await eliminarUsuarios(idUsuario);
            mostrarAlerta('Usuario eliminado correctamente', 'success');
            await cargarUsuarios();
            await cargarDatosDropdowns(); // Recargar dropdowns
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            mostrarAlerta('Error al eliminar el usuario', 'danger');
        }
    }
}

// =============================================
// FUNCIONES PARA CASOS DE SOPORTE
// =============================================

async function cargarCasosSoporte() {
    try {
        mostrarCargando('tablaCasosSoporte');
        const casos = await obtenerCasosSoporte();
        mostrarCasosSoporte(casos);
    } catch (error) {
        console.error('Error al cargar casos de soporte:', error);
        mostrarError('tablaCasosSoporte', 'Error al cargar los casos de soporte');
    }
}

function mostrarCasosSoporte(casos) {
    const tbody = document.getElementById('tablaCasosSoporte');
    
    if (!casos || casos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="9" class="text-center">No hay casos de soporte registrados.</td></tr>';
        return;
    }
    
    tbody.innerHTML = casos.map(caso => `
        <tr>
            <td>${caso.id_caso}</td>
            <td>${caso.nombre_cliente || 'N/A'}</td>
            <td>${caso.asunto}</td>
            <td>${acortarTexto(caso.descripcion, 50)}</td>
            <td><span class="badge badge-${obtenerClasePrioridad(caso.prioridad)}">${caso.prioridad || 'No especificada'}</span></td>
            <td><span class="badge badge-${obtenerClaseEstado(caso.estado)}">${caso.estado || 'Abierto'}</span></td>
            <td>${formatearFecha(caso.fecha_creacion)}</td>
            <td>${caso.fecha_resolucion ? formatearFecha(caso.fecha_resolucion) : 'Pendiente'}</td>
            <td>
                <button class="btn btn-sm btn-warning mr-1" onclick="window.editarCasoSoporte(${caso.id_caso})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="window.eliminarCasoSoporteConfirm(${caso.id_caso})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function abrirModalCasoSoporte(caso = null) {
    const modal = $('#modalCasoSoporte');
    const titulo = $('#modalCasoSoporteLabel');
    const form = $('#formCasoSoporte');
    
    modoEdicion = caso !== null;
    elementoEditando = caso;
    
    if (modoEdicion) {
        titulo.html('<i class="fas fa-edit"></i> Editar Caso de Soporte');
        $('#id_caso').val(caso.id_caso);
        $('#id_cliente').val(caso.id_cliente);
        $('#asunto').val(caso.asunto);
        $('#descripcion').val(caso.descripcion);
        $('#prioridad').val(caso.prioridad || 'Media');
        $('#estado').val(caso.estado || 'Abierto');
        $('#fecha_resolucion').val(caso.fecha_resolucion ? formatearFechaParaInput(caso.fecha_resolucion) : '');
    } else {
        titulo.html('<i class="fas fa-headset"></i> Agregar Caso de Soporte');
        form[0].reset();
        $('#prioridad').val('Media');
        $('#estado').val('Abierto');
    }
    
    modal.modal('show');
}

async function guardarCasoSoporte() {
    try {
        const formData = new FormData(document.getElementById('formCasoSoporte'));
        const casoData = Object.fromEntries(formData);
        
        // Validaciones
        if (!casoData.id_cliente || !casoData.asunto || !casoData.descripcion) {
            mostrarAlerta('Por favor complete todos los campos obligatorios', 'warning');
            return;
        }
        
        // Convertir valores
        casoData.id_cliente = parseInt(casoData.id_cliente);
        if (casoData.fecha_resolucion) {
            casoData.fecha_resolucion = new Date(casoData.fecha_resolucion).toISOString().slice(0, 19).replace('T', ' ');
        }
        
        if (modoEdicion) {
            casoData.id_caso = parseInt(casoData.id_caso);
            await actualizarCasoSoporte(casoData);
            mostrarAlerta('Caso de soporte actualizado correctamente', 'success');
        } else {
            await crearCasoSoporte(casoData);
            mostrarAlerta('Caso de soporte creado correctamente', 'success');
        }
        
        $('#modalCasoSoporte').modal('hide');
        await cargarCasosSoporte();
        
    } catch (error) {
        console.error('Error al guardar caso de soporte:', error);
        mostrarAlerta('Error al guardar el caso de soporte: ' + error.message, 'danger');
    }
}

async function editarCasoSoporte(idCaso) {
    try {
        const casos = await obtenerCasosSoporte();
        const caso = casos.find(c => c.id_caso == idCaso);
        
        if (caso) {
            abrirModalCasoSoporte(caso);
        }
    } catch (error) {
        console.error('Error al cargar caso para editar:', error);
        mostrarAlerta('Error al cargar datos del caso', 'danger');
    }
}

async function eliminarCasoSoporteConfirm(idCaso) {
    if (confirm('¿Está seguro de que desea eliminar este caso de soporte?')) {
        try {
            await eliminarCasoSoporte(idCaso);
            mostrarAlerta('Caso de soporte eliminado correctamente', 'success');
            await cargarCasosSoporte();
        } catch (error) {
            console.error('Error al eliminar caso de soporte:', error);
            mostrarAlerta('Error al eliminar el caso de soporte', 'danger');
        }
    }
}

// =============================================
// FUNCIONES PARA ACTIVIDADES
// =============================================

async function cargarActividades() {
    try {
        mostrarCargando('tablaActividades');
        const actividades = await obtenerActividades();
        mostrarActividades(actividades);
    } catch (error) {
        console.error('Error al cargar actividades:', error);
        mostrarError('tablaActividades', 'Error al cargar las actividades');
    }
}

function mostrarActividades(actividades) {
    const tbody = document.getElementById('tablaActividades');
    
    if (!actividades || actividades.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay actividades registradas.</td></tr>';
        return;
    }
    
    tbody.innerHTML = actividades.map(actividad => `
        <tr>
            <td>${actividad.id_actividad}</td>
            <td><span class="badge badge-info">${actividad.tipo_actividad}</span></td>
            <td>${formatearFecha(actividad.fecha_programada)}</td>
            <td><span class="badge badge-${obtenerClaseEstadoActividad(actividad.estado)}">${actividad.estado || 'Pendiente'}</span></td>
            <td>${actividad.nombre_usuario_asignado || 'N/A'}</td>
            <td>${actividad.nombre_cliente || 'N/A'}</td>
            <td>${acortarTexto(actividad.notas, 30)}</td>
            <td>
                <button class="btn btn-sm btn-warning mr-1" onclick="window.editarActividad(${actividad.id_actividad})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="window.eliminarActividadConfirm(${actividad.id_actividad})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function abrirModalActividad(actividad = null) {
    const modal = $('#modalActividad');
    const titulo = $('#modalActividadLabel');
    const form = $('#formActividad');
    
    modoEdicion = actividad !== null;
    elementoEditando = actividad;
    
    if (modoEdicion) {
        titulo.html('<i class="fas fa-edit"></i> Editar Actividad');
        $('#id_actividad').val(actividad.id_actividad);
        $('#tipo_actividad').val(actividad.tipo_actividad);
        $('#fecha_programada').val(formatearFechaParaInput(actividad.fecha_programada));
        $('#estadoActividad').val(actividad.estado || 'Pendiente');
        $('#id_usuario_asignado').val(actividad.id_usuario_asignado);
        $('#id_clienteActividad').val(actividad.id_cliente || '');
        $('#notas').val(actividad.notas || '');
    } else {
        titulo.html('<i class="fas fa-tasks"></i> Agregar Actividad');
        form[0].reset();
        $('#estadoActividad').val('Pendiente');
        $('#tipo_actividad').val('Llamada');
    }
    
    modal.modal('show');
}

async function guardarActividad() {
    try {
        const formData = new FormData(document.getElementById('formActividad'));
        const actividadData = Object.fromEntries(formData);
        
        // Validaciones
        if (!actividadData.tipo_actividad || !actividadData.fecha_programada || !actividadData.id_usuario_asignado) {
            mostrarAlerta('Por favor complete todos los campos obligatorios', 'warning');
            return;
        }
        
        // Convertir valores
        actividadData.id_usuario_asignado = parseInt(actividadData.id_usuario_asignado);
        if (actividadData.id_cliente) {
            actividadData.id_cliente = parseInt(actividadData.id_cliente);
        }
        actividadData.fecha_programada = new Date(actividadData.fecha_programada).toLocaleString();
        
        if (modoEdicion) {
            actividadData.id_actividad = parseInt(actividadData.id_actividad);
            await actualizarActividad(actividadData);
            mostrarAlerta('Actividad actualizada correctamente', 'success');
        } else {
            await crearActividad(actividadData);
            mostrarAlerta('Actividad creada correctamente', 'success');
        }
        
        $('#modalActividad').modal('hide');
        await cargarActividades();
        
    } catch (error) {
        console.error('Error al guardar actividad:', error);
        mostrarAlerta('Error al guardar la actividad: ' + error.message, 'danger');
    }
}

async function editarActividad(idActividad) {
    try {
        const actividades = await obtenerActividades();
        const actividad = actividades.find(a => a.id_actividad == idActividad);
        
        if (actividad) {
            abrirModalActividad(actividad);
        }
    } catch (error) {
        console.error('Error al cargar actividad para editar:', error);
        mostrarAlerta('Error al cargar datos de la actividad', 'danger');
    }
}

async function eliminarActividadConfirm(idActividad) {
    if (confirm('¿Está seguro de que desea eliminar esta actividad?')) {
        try {
            await eliminarActividad(idActividad);
            mostrarAlerta('Actividad eliminada correctamente', 'success');
            await cargarActividades();
        } catch (error) {
            console.error('Error al eliminar actividad:', error);
            mostrarAlerta('Error al eliminar la actividad', 'danger');
        }
    }
}

// =============================================
// FUNCIONES PARA OPORTUNIDADES
// =============================================

async function cargarOportunidades() {
    try {
        mostrarCargando('tablaOportunidades');
        const oportunidades = await obtenerOportunidades();
        mostrarOportunidades(oportunidades);
    } catch (error) {
        console.error('Error al cargar oportunidades:', error);
        mostrarError('tablaOportunidades', 'Error al cargar las oportunidades');
    }
}

function mostrarOportunidades(oportunidades) {
    const tbody = document.getElementById('tablaOportunidades');
    
    if (!oportunidades || oportunidades.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay oportunidades registradas.</td></tr>';
        return;
    }
    
    tbody.innerHTML = oportunidades.map(oportunidad => `
        <tr>
            <td>${oportunidad.id_oportunidad}</td>
            <td>${oportunidad.nombre_cliente || 'N/A'}</td>
            <td>${oportunidad.titulo}</td>
            <td>${oportunidad.valor_estimado ? `$${parseFloat(oportunidad.valor_estimado).toLocaleString()}` : 'No especificado'}</td>
            <td><span class="badge badge-${obtenerClaseEtapa(oportunidad.etapa)}">${oportunidad.etapa || 'Prospección'}</span></td>
            <td>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar bg-success" role="progressbar" 
                         style="width: ${oportunidad.probabilidad || 0}%" 
                         aria-valuenow="${oportunidad.probabilidad || 0}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                        ${oportunidad.probabilidad || 0}%
                    </div>
                </div>
            </td>
            <td>${formatearFecha(oportunidad.fecha_creacion)}</td>
            <td>
                <button class="btn btn-sm btn-warning mr-1" onclick="window.editarOportunidad(${oportunidad.id_oportunidad})">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="window.eliminarOportunidadConfirm(${oportunidad.id_oportunidad})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function abrirModalOportunidad(oportunidad = null) {
    const modal = $('#modalOportunidad');
    const titulo = $('#modalOportunidadLabel');
    const form = $('#formOportunidad');
    
    modoEdicion = oportunidad !== null;
    elementoEditando = oportunidad;
    
    if (modoEdicion) {
        titulo.html('<i class="fas fa-edit"></i> Editar Oportunidad');
        $('#id_oportunidad').val(oportunidad.id_oportunidad);
        $('#id_clienteOportunidad').val(oportunidad.id_cliente);
        $('#titulo').val(oportunidad.titulo);
        $('#valor_estimado').val(oportunidad.valor_estimado || '');
        $('#etapa').val(oportunidad.etapa || 'Prospección');
        $('#probabilidad').val(oportunidad.probabilidad || '');
    } else {
        titulo.html('<i class="fas fa-bullseye"></i> Agregar Oportunidad');
        form[0].reset();
        $('#etapa').val('Prospección');
    }
    
    modal.modal('show');
}

async function guardarOportunidad() {
    try {
        const formData = new FormData(document.getElementById('formOportunidad'));
        const oportunidadData = Object.fromEntries(formData);
        
        // Validaciones
        if (!oportunidadData.id_cliente || !oportunidadData.titulo) {
            mostrarAlerta('Por favor complete todos los campos obligatorios', 'warning');
            return;
        }
        
        // Convertir valores
        oportunidadData.id_cliente = parseInt(oportunidadData.id_cliente);
        if (oportunidadData.valor_estimado) {
            oportunidadData.valor_estimado = parseFloat(oportunidadData.valor_estimado);
        }
        if (oportunidadData.probabilidad) {
            oportunidadData.probabilidad = parseInt(oportunidadData.probabilidad);
        }
        
        if (modoEdicion) {
            oportunidadData.id_oportunidad = parseInt(oportunidadData.id_oportunidad);
            await actualizarOportunidad(oportunidadData);
            mostrarAlerta('Oportunidad actualizada correctamente', 'success');
        } else {
            await crearOportunidad(oportunidadData);
            mostrarAlerta('Oportunidad creada correctamente', 'success');
        }
        
        $('#modalOportunidad').modal('hide');
        await cargarOportunidades();
        
    } catch (error) {
        console.error('Error al guardar oportunidad:', error);
        mostrarAlerta('Error al guardar la oportunidad: ' + error.message, 'danger');
    }
}

async function editarOportunidad(idOportunidad) {
    try {
        const oportunidades = await obtenerOportunidades();
        const oportunidad = oportunidades.find(o => o.id_oportunidad == idOportunidad);
        
        if (oportunidad) {
            abrirModalOportunidad(oportunidad);
        }
    } catch (error) {
        console.error('Error al cargar oportunidad para editar:', error);
        mostrarAlerta('Error al cargar datos de la oportunidad', 'danger');
    }
}

async function eliminarOportunidadConfirm(idOportunidad) {
    if (confirm('¿Está seguro de que desea eliminar esta oportunidad?')) {
        try {
            await eliminarOportunidad(idOportunidad);
            mostrarAlerta('Oportunidad eliminada correctamente', 'success');
            await cargarOportunidades();
        } catch (error) {
            console.error('Error al eliminar oportunidad:', error);
            mostrarAlerta('Error al eliminar la oportunidad', 'danger');
        }
    }
}

// =============================================
// FUNCIONES PARA INTERACCIONES
// =============================================

async function cargarInteracciones() {
    try {
        mostrarCargando('tablaInteracciones');
        const interacciones = await obtenerInteracciones();
        mostrarInteracciones(interacciones);
    } catch (error) {
        console.error('Error al cargar interacciones:', error);
        mostrarError('tablaInteracciones', 'Error al cargar las interacciones');
    }
}

function mostrarInteracciones(interacciones) {
    const contenedor = document.getElementById('contenedorInteracciones');
    const sinInteracciones = document.getElementById('sinInteracciones');
    
    if (!interacciones || interacciones.length === 0) {
        contenedor.innerHTML = '';
        sinInteracciones.style.display = 'block';
        return;
    }
    
    sinInteracciones.style.display = 'none';
    
    // Cambiar la clase del contenedor para usar el grid de cards
    contenedor.className = 'cards-grid-interacciones';
    
    // En la función mostrarInteracciones, modifica esta parte:
contenedor.innerHTML = interacciones.map(interaccion => {
    const tipoClase = `badge-${interaccion.tipo_interaccion?.toLowerCase() || 'otro'}`;
    const descripcion = interaccion.descripcion || 'Sin descripción';
    const esDescripcionLarga = descripcion.length > 100;
    const descripcionCorta = esDescripcionLarga ? descripcion.substring(0, 100) + '...' : descripcion;
    
    return `
        <div class="card-interaccion">
            <div class="card-interaccion-header">
                <span class="card-interaccion-id">#${interaccion.id_interaccion}</span>
                <span class="badge-interaccion ${tipoClase}">${interaccion.tipo_interaccion}</span>
            </div>
            
            <div class="card-interaccion-body">
                <div class="card-interaccion-cliente">
                    <i class="fas fa-user"></i>
                    ${interaccion.nombre_cliente || 'Cliente no especificado'}
                </div>
                
                <div class="card-interaccion-fecha">
                    <i class="fas fa-calendar-alt"></i>
                    ${formatearFecha(interaccion.fecha_interaccion)}
                </div>
                
                <div class="card-interaccion-descripcion" id="desc-${interaccion.id_interaccion}" data-descripcion-completa="${descripcion.replace(/"/g, '&quot;')}">
                    ${descripcionCorta}
                    ${esDescripcionLarga ? `
                        <div class="card-interaccion-expandir" onclick="toggleDescripcion(${interaccion.id_interaccion})">
                            Ver más
                        </div>
                    ` : ''}
                </div>
            </div>
            
            <div class="card-interaccion-footer">
                <div class="card-interaccion-usuario">
                    <i class="fas fa-user-tie"></i>
                    ${interaccion.nombre_usuario || 'Sistema'}
                </div>
                
                <div class="card-interaccion-acciones">
                    <button class="btn-card-action btn-card-edit" onclick="window.editarInteraccion(${interaccion.id_interaccion})" title="Editar interacción">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-card-action btn-card-delete" onclick="window.eliminarInteraccionConfirm(${interaccion.id_interaccion})" title="Eliminar interacción">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}).join('');
}

// Función para expandir/contraer descripciones largas
function toggleDescripcion(idInteraccion) {
    const elemento = document.getElementById(`desc-${idInteraccion}`);
    const descripcionCompleta = elemento.getAttribute('data-descripcion-completa');
    
    if (elemento.classList.contains('expandido')) {
        // Contraer
        const descripcionCorta = descripcionCompleta.substring(0, 100) + '...';
        elemento.innerHTML = descripcionCorta + 
            `<div class="card-interaccion-expandir" onclick="toggleDescripcion(${idInteraccion})">
                Ver más
            </div>`;
        elemento.classList.remove('expandido');
    } else {
        // Expandir
        elemento.innerHTML = descripcionCompleta + 
            `<div class="card-interaccion-expandir" onclick="toggleDescripcion(${idInteraccion})">
                Ver menos
            </div>`;
        elemento.classList.add('expandido');
    }
}


function abrirModalInteraccion(interaccion = null) {
    const modal = $('#modalInteraccion');
    const titulo = $('#modalInteraccionLabel');
    const form = $('#formInteraccion');

    llenarDropdownClientes();
    llenarDropdownUsuarios();
    
    modoEdicion = interaccion !== null;
    elementoEditando = interaccion;
    
    if (modoEdicion) {
        titulo.html('<i class="fas fa-edit"></i> Editar Interacción');
        $('#id_interaccion').val(interaccion.id_interaccion);
        $('#id_clienteInteraccion').val(interaccion.id_cliente || '');
        $('#tipo_interaccion').val(interaccion.tipo_interaccion);
        $('#fecha_interaccion').val(formatearFechaParaInput(interaccion.fecha_interaccion));
        $('#id_usuarioInteraccion').val(interaccion.id_usuario || '');
        $('#descripcionInteraccion').val(interaccion.descripcion || '');
    } else {
        titulo.html('<i class="fas fa-comments"></i> Agregar Interacción');
        form[0].reset();
        $('#tipo_interaccion').val('Llamada');
        $('#fecha_interaccion').val(new Date().toISOString().slice(0, 16));
    }
    
    modal.modal('show');
}

async function guardarInteraccion() {
    try {
        const formData = new FormData(document.getElementById('formInteraccion'));
        const interaccionData = Object.fromEntries(formData);
        
        // ✅ Solo valida tipo_interaccion y fecha_interaccion
        if (!interaccionData.tipo_interaccion || !interaccionData.fecha_interaccion) {
            mostrarAlerta('Por favor complete el tipo de interacción y la fecha', 'warning');
            return;
        }
        
        // ✅ Permite que id_cliente y id_usuario sean vacíos (null)
        if (interaccionData.id_cliente && interaccionData.id_cliente !== '') {
            interaccionData.id_cliente = parseInt(interaccionData.id_cliente);
        } else {
            interaccionData.id_cliente = null;
        }
        
        if (interaccionData.id_usuario && interaccionData.id_usuario !== '') {
            interaccionData.id_usuario = parseInt(interaccionData.id_usuario);
        } else {
            interaccionData.id_usuario = null;
        }
        
        interaccionData.fecha_interaccion = new Date(interaccionData.fecha_interaccion).toISOString().slice(0, 19).replace('T', ' ');
        
        if (modoEdicion) {
            interaccionData.id_interaccion = parseInt(interaccionData.id_interaccion);
            await actualizarInteraccion(interaccionData);
            mostrarAlerta('Interacción actualizada correctamente', 'success');
        } else {
            await crearInteraccion(interaccionData);
            mostrarAlerta('Interacción creada correctamente', 'success');
        }
        
        $('#modalInteraccion').modal('hide');
        await cargarInteracciones();
        
    } catch (error) {
        console.error('Error al guardar interacción:', error);
        mostrarAlerta('Error al guardar la interacción: ' + error.message, 'danger');
    }
}

async function editarInteraccion(idInteraccion) {
    try {
        const interacciones = await obtenerInteracciones();
        const interaccion = interacciones.find(i => i.id_interaccion == idInteraccion);
        
        if (interaccion) {
            abrirModalInteraccion(interaccion);
        }
    } catch (error) {
        console.error('Error al cargar interacción para editar:', error);
        mostrarAlerta('Error al cargar datos de la interacción', 'danger');
    }
}

async function eliminarInteraccionConfirm(idInteraccion) {
    if (confirm('¿Está seguro de que desea eliminar esta interacción?')) {
        try {
            await eliminarInteraccion(idInteraccion);
            mostrarAlerta('Interacción eliminada correctamente', 'success');
            await cargarInteracciones();
        } catch (error) {
            console.error('Error al eliminar interacción:', error);
            mostrarAlerta('Error al eliminar la interacción', 'danger');
        }
    }
}

// =============================================
// FUNCIONES PARA MÉTRICAS CRM
// =============================================

async function cargarMetricasCRM() {
    try {
        mostrarCargandoMetricas();
        
        // Obtener todas las métricas en paralelo
        const [dashboard, tasaConversion, satisfaccion, retencion, churnRate] = await Promise.all([
            obtenerDashboardCRM(),
            obtenerTasaConversion(),
            obtenerSatisfaccionCliente(),
            obtenerRetencionClientes(),
            obtenerChurnRate()
        ]);
        
        mostrarDashboardCRM(dashboard);
        mostrarTasaConversion(tasaConversion);
        mostrarSatisfaccionCliente(satisfaccion);
        mostrarRetencionClientes(retencion);
        mostrarChurnRate(churnRate);
        
    } catch (error) {
        console.error('Error al cargar métricas CRM:', error);
        mostrarErrorMetricas('Error al cargar las métricas del CRM');
    }
}

function mostrarDashboardCRM(dashboard) {
    const container = document.getElementById('dashboardCRM');
    
    // CORRECCIÓN: Verificar que dashboard y resumen existan
    if (!dashboard || !dashboard.resumen) {
        console.error('Dashboard sin datos válidos:', dashboard);
        container.innerHTML = '<div class="col-12 text-center text-danger">No hay datos disponibles para el dashboard</div>';
        return;
    }
    
    const resumen = dashboard.resumen;
    
    container.innerHTML = `
        <div class="col-md-3 mb-3">
            <div class="card text-white bg-primary">
                <div class="card-body">
                    <h5 class="card-title">Casos de Soporte</h5>
                    <h3 class="card-text">${resumen.totalCasos || 0}</h3>
                    <small>${resumen.casosPendientes || 0} pendientes</small>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card text-white bg-success">
                <div class="card-body">
                    <h5 class="card-title">Actividades</h5>
                    <h3 class="card-text">${resumen.totalActividades || 0}</h3>
                    <small>${resumen.actividadesPendientes || 0} pendientes</small>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card text-white bg-info">
                <div class="card-body">
                    <h5 class="card-title">Oportunidades</h5>
                    <h3 class="card-text">${resumen.totalOportunidades || 0}</h3>
                    <small>${resumen.oportunidadesActivas || 0} activas</small>
                </div>
            </div>
        </div>
        <div class="col-md-3 mb-3">
            <div class="card text-white bg-warning">
                <div class="card-body">
                    <h5 class="card-title">Interacciones</h5>
                    <h3 class="card-text">${resumen.totalInteracciones || 0}</h3>
                    <small>Total registradas</small>
                </div>
            </div>
        </div>
    `;
}

function mostrarTasaConversion(metricas) {
    const container = document.getElementById('tasaConversion');
    const tasa = metricas.tasaConversion || 0;
    
    container.innerHTML = `
        <h3 class="${tasa >= 10 ? 'text-success' : tasa >= 5 ? 'text-warning' : 'text-danger'}">${tasa}%</h3>
        <p>${metricas.oportunidadesConvertidas || 0} de ${metricas.totalOportunidades || 0} oportunidades convertidas</p>
        <div class="progress" style="height: 10px;">
            <div class="progress-bar ${tasa >= 10 ? 'bg-success' : tasa >= 5 ? 'bg-warning' : 'bg-danger'}" 
                 style="width: ${tasa}%"></div>
        </div>
    `;
}

function mostrarSatisfaccionCliente(metricas) {
    const container = document.getElementById('satisfaccionCliente');
    const satisfaccion = metricas.satisfaccion || 0;
    
    container.innerHTML = `
        <h3 class="${satisfaccion >= 80 ? 'text-success' : satisfaccion >= 60 ? 'text-warning' : 'text-danger'}">${satisfaccion}%</h3>
        <p>${metricas.casosResueltos || 0} de ${metricas.totalCasos || 0} casos resueltos</p>
        <div class="progress" style="height: 10px;">
            <div class="progress-bar ${satisfaccion >= 80 ? 'bg-success' : satisfaccion >= 60 ? 'bg-warning' : 'bg-danger'}" 
                 style="width: ${satisfaccion}%"></div>
        </div>
    `;
}

function mostrarRetencionClientes(metricas) {
    const container = document.getElementById('retencionClientes');
    const retencion = metricas.tasaRetencion || 0;
    
    container.innerHTML = `
        <h3 class="${retencion >= 80 ? 'text-success' : retencion >= 60 ? 'text-warning' : 'text-danger'}">${retencion}%</h3>
        <p>${metricas.clientesRetenidos || 0} de ${metricas.totalClientesConPedidos || 0} clientes retenidos</p>
        <div class="progress" style="height: 10px;">
            <div class="progress-bar ${retencion >= 80 ? 'bg-success' : retencion >= 60 ? 'bg-warning' : 'bg-danger'}" 
                 style="width: ${retencion}%"></div>
        </div>
    `;
}

function mostrarChurnRate(metricas) {
    const container = document.getElementById('churnRate');
    const churnRate = metricas.churnRate || 0;
    
    container.innerHTML = `
        <h3 class="${churnRate <= 5 ? 'text-success' : churnRate <= 10 ? 'text-warning' : 'text-danger'}">${churnRate}%</h3>
        <p>${metricas.clientesInactivos || 0} de ${metricas.totalClientes || 0} clientes inactivos</p>
        <div class="progress" style="height: 10px;">
            <div class="progress-bar ${churnRate <= 5 ? 'bg-success' : churnRate <= 10 ? 'bg-warning' : 'bg-danger'}" 
                 style="width: ${churnRate}%"></div>
        </div>
    `;
}

// =============================================
// BÚSQUEDA GLOBAL CRM
// =============================================

async function buscarEnCRM() {
    const termino = document.getElementById('terminoBusquedaCRM').value.trim();
    
    if (!termino) {
        mostrarAlerta('Por favor ingrese un término de búsqueda', 'warning');
        return;
    }
    
    try {
        mostrarCargandoBusqueda();
        const resultados = await buscarCRM(termino);
        mostrarResultadosBusqueda(resultados, termino);
    } catch (error) {
        console.error('Error en búsqueda CRM:', error);
        mostrarErrorBusqueda('Error al realizar la búsqueda');
    }
}

function mostrarResultadosBusqueda(resultados, termino) {
    const container = document.getElementById('resultadosBusquedaCRM');
    
    let html = `<h6>Resultados para: "${termino}"</h6>`;
    
    // Casos de soporte
    if (resultados.casosSoporte && resultados.casosSoporte.length > 0) {
        html += `
            <div class="mt-3">
                <h6><i class="fas fa-headset"></i> Casos de Soporte (${resultados.casosSoporte.length})</h6>
                ${resultados.casosSoporte.map(caso => `
                    <div class="card mb-2">
                        <div class="card-body py-2">
                            <h6 class="card-title mb-1">${caso.asunto}</h6>
                            <p class="card-text mb-1 small">${acortarTexto(caso.descripcion, 100)}</p>
                            <div class="d-flex justify-content-between">
                                <small class="text-muted">Cliente: ${caso.nombre_cliente || 'N/A'}</small>
                                <small class="text-muted">Estado: ${caso.estado}</small>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Actividades
    if (resultados.actividades && resultados.actividades.length > 0) {
        html += `
            <div class="mt-3">
                <h6><i class="fas fa-tasks"></i> Actividades (${resultados.actividades.length})</h6>
                ${resultados.actividades.map(actividad => `
                    <div class="card mb-2">
                        <div class="card-body py-2">
                            <h6 class="card-title mb-1">${actividad.tipo_actividad}</h6>
                            <p class="card-text mb-1 small">${acortarTexto(actividad.notas, 100)}</p>
                            <div class="d-flex justify-content-between">
                                <small class="text-muted">Programada: ${formatearFecha(actividad.fecha_programada)}</small>
                                <small class="text-muted">Estado: ${actividad.estado}</small>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Oportunidades
    if (resultados.oportunidades && resultados.oportunidades.length > 0) {
        html += `
            <div class="mt-3">
                <h6><i class="fas fa-bullseye"></i> Oportunidades (${resultados.oportunidades.length})</h6>
                ${resultados.oportunidades.map(oportunidad => `
                    <div class="card mb-2">
                        <div class="card-body py-2">
                            <h6 class="card-title mb-1">${oportunidad.titulo}</h6>
                            <p class="card-text mb-1 small">Valor: ${oportunidad.valor_estimado ? `${parseFloat(oportunidad.valor_estimado).toLocaleString()}` : 'No especificado'}</p>
                            <div class="d-flex justify-content-between">
                                <small class="text-muted">Cliente: ${oportunidad.nombre_cliente || 'N/A'}</small>
                                <small class="text-muted">Etapa: ${oportunidad.etapa}</small>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Interacciones
    if (resultados.interacciones && resultados.interacciones.length > 0) {
        html += `
            <div class="mt-3">
                <h6><i class="fas fa-comments"></i> Interacciones (${resultados.interacciones.length})</h6>
                ${resultados.interacciones.map(interaccion => `
                    <div class="card mb-2">
                        <div class="card-body py-2">
                            <h6 class="card-title mb-1">${interaccion.tipo_interaccion}</h6>
                            <p class="card-text mb-1 small">${acortarTexto(interaccion.descripcion, 100)}</p>
                            <div class="d-flex justify-content-between">
                                <small class="text-muted">Cliente: ${interaccion.nombre_cliente || 'N/A'}</small>
                                <small class="text-muted">Fecha: ${formatearFecha(interaccion.fecha_interaccion)}</small>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Si no hay resultados
    if (!resultados.casosSoporte?.length && !resultados.actividades?.length && 
        !resultados.oportunidades?.length && !resultados.interacciones?.length) {
        html += '<div class="alert alert-info mt-3">No se encontraron resultados para la búsqueda.</div>';
    }
    
    container.innerHTML = html;
}

// =============================================
// FUNCIONES UTILITARIAS
// =============================================

function mostrarCargando(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = '<tr><td colspan="20" class="text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Cargando...</span></div><p class="mt-2">Cargando datos...</p></td></tr>';
    }
}

function mostrarError(elementId, mensaje) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<tr><td colspan="20" class="text-center text-danger"><i class="fas fa-exclamation-triangle"></i> ${mensaje}</td></tr>`;
    }
}

function mostrarCargandoMetricas() {
    document.getElementById('dashboardCRM').innerHTML = '<div class="col-12 text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Cargando...</span></div><p class="mt-2">Cargando métricas...</p></div>';
    document.getElementById('tasaConversion').innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Cargando...</span></div> Cargando...';
    document.getElementById('satisfaccionCliente').innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Cargando...</span></div> Cargando...';
    document.getElementById('retencionClientes').innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Cargando...</span></div> Cargando...';
    document.getElementById('churnRate').innerHTML = '<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Cargando...</span></div> Cargando...';
}

function mostrarErrorMetricas(mensaje) {
    document.getElementById('dashboardCRM').innerHTML = `<div class="col-12 text-center text-danger"><i class="fas fa-exclamation-triangle"></i> ${mensaje}</div>`;
    document.getElementById('tasaConversion').innerHTML = `<p class="text-danger">${mensaje}</p>`;
    document.getElementById('satisfaccionCliente').innerHTML = `<p class="text-danger">${mensaje}</p>`;
    document.getElementById('retencionClientes').innerHTML = `<p class="text-danger">${mensaje}</p>`;
    document.getElementById('churnRate').innerHTML = `<p class="text-danger">${mensaje}</p>`;
}

function mostrarCargandoBusqueda() {
    document.getElementById('resultadosBusquedaCRM').innerHTML = '<div class="text-center"><div class="spinner-border text-primary" role="status"><span class="sr-only">Buscando...</span></div><p class="mt-2">Buscando...</p></div>';
}

function mostrarErrorBusqueda(mensaje) {
    document.getElementById('resultadosBusquedaCRM').innerHTML = `<div class="alert alert-danger">${mensaje}</div>`;
}

function mostrarAlerta(mensaje, tipo = 'info') {
    const alerta = document.createElement('div');
    alerta.className = `alert alert-${tipo} alert-dismissible fade show`;
    alerta.innerHTML = `
        ${mensaje}
        <button type="button" class="close" data-dismiss="alert">
            <span>&times;</span>
        </button>
    `;
    
    const mainContent = document.querySelector('.main-content');
    mainContent.insertBefore(alerta, mainContent.firstChild);
    
    setTimeout(() => {
        if (alerta.parentNode) {
            alerta.remove();
        }
    }, 5000);
}

function formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatearFechaParaInput(fecha) {
    if (!fecha) return '';
    const date = new Date(fecha);
    return date.toISOString().slice(0, 16);
}

function acortarTexto(texto, longitud) {
    if (!texto) return 'N/A';
    return texto.length > longitud ? texto.substring(0, longitud) + '...' : texto;
}

function obtenerClasePrioridad(prioridad) {
    const clases = {
        'Baja': 'secondary',
        'Media': 'info',
        'Alta': 'warning',
        'Crítica': 'danger'
    };
    return clases[prioridad] || 'secondary';
}

function obtenerClaseEstado(estado) {
    const clases = {
        'Abierto': 'warning',
        'En Progreso': 'info',
        'Resuelto': 'success',
        'Cerrado': 'secondary'
    };
    return clases[estado] || 'secondary';
}

function obtenerClaseEstadoActividad(estado) {
    const clases = {
        'Pendiente': 'warning',
        'En Progreso': 'info',
        'Completada': 'success',
        'Cancelada': 'danger'
    };
    return clases[estado] || 'secondary';
}

function obtenerClaseEtapa(etapa) {
    const clases = {
        'Prospección': 'secondary',
        'Calificación': 'info',
        'Propuesta': 'primary',
        'Negociación': 'warning',
        'Cierre': 'success'
    };
    return clases[etapa] || 'secondary';
}

// =============================================
// EXPORTAR FUNCIONES PARA USO GLOBAL
// =============================================

window.cargarUsuarios = cargarUsuarios;
window.cargarCasosSoporte = cargarCasosSoporte;
window.cargarActividades = cargarActividades;
window.cargarOportunidades = cargarOportunidades;
window.cargarInteracciones = cargarInteracciones;
window.cargarMetricasCRM = cargarMetricasCRM;

window.editarUsuario = editarUsuario;
window.eliminarUsuarioConfirm = eliminarUsuarioConfirm;
window.editarCasoSoporte = editarCasoSoporte;
window.eliminarCasoSoporteConfirm = eliminarCasoSoporteConfirm;
window.editarActividad = editarActividad;
window.eliminarActividadConfirm = eliminarActividadConfirm;
window.editarOportunidad = editarOportunidad;
window.eliminarOportunidadConfirm = eliminarOportunidadConfirm;
window.editarInteraccion = editarInteraccion;
window.eliminarInteraccionConfirm = eliminarInteraccionConfirm;

window.buscarEnCRM = buscarEnCRM;
window.toggleDescripcion = toggleDescripcion;
