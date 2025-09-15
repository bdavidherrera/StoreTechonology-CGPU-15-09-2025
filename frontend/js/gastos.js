// ==================== GASTOS.JS - GESTIÓN DE GASTOS ====================
import {
  obtenerProductosParaGastos,
  obtenerGastos,
  registrarGasto,
  actualizarGasto,
  eliminarGasto,
  obtenerEstadisticasGastos
} from "../Api/consumeApi.js";

// ==================== VARIABLES GLOBALES ====================
let gastosData = [];
let productosData = [];
let gastoEditando = null;

// ==================== FUNCIONES DE INICIALIZACIÓN ====================

// ✅ Inicializar módulo de gastos
$(document).ready(function() {
  console.log("🚀 Inicializando módulo de gastos...");
  inicializarEventosGastos();
});

// ✅ Función principal para cargar gastos
window.cargarGastos = async function() {
  try {
    console.log("📊 Cargando gastos...");
    mostrarCargandoGastos(true);

    // Cargar productos y gastos en paralelo
    const [productos, gastos] = await Promise.all([
      obtenerProductosParaGastos(),
      obtenerGastos()
    ]);

    productosData = productos;
    gastosData = gastos;

    // Cargar datos en la interfaz
    await Promise.all([
      cargarProductosEnSelect(),
      mostrarGastosEnTabla(gastos),
      actualizarEstadisticasGastos()
    ]);

    console.log("✅ Gastos cargados exitosamente");
  } catch (error) {
    console.error("❌ Error al cargar gastos:", error);
    mostrarErrorGastos("Error al cargar los gastos: " + error.message);
  } finally {
    mostrarCargandoGastos(false);
  }
};

// ==================== EVENTOS ====================

function inicializarEventosGastos() {
  // Evento para abrir modal agregar gasto
  $(document).on('click', '#btnAgregarGasto', function() {
    limpiarFormularioGasto();
    cargarProductosEnSelect();
    $('#modalAgregarGasto').modal('show');
  });

  // Evento para enviar formulario agregar gasto
  $(document).on('submit', '#formAgregarGasto', async function(e) {
    e.preventDefault();
    await procesarFormularioGasto('agregar');
  });

  // Evento para enviar formulario actualizar gasto
  $(document).on('submit', '#formActualizarGasto', async function(e) {
    e.preventDefault();
    await procesarFormularioGasto('actualizar');
  });

  // Eventos para botones de acción
  $(document).on('click', '.btn-edit-gasto', function() {
    const idGasto = $(this).data('id');
    editarGasto(idGasto);
  });

  $(document).on('click', '.btn-delete-gasto', function() {
    const idGasto = $(this).data('id');
    const descripcion = $(this).data('descripcion');
    confirmarEliminarGasto(idGasto, descripcion);
  });

  // Búsqueda en tiempo real
  $(document).on('input', '#buscarGasto', function() {
    const termino = $(this).val();
    filtrarGastos(termino);
  });

  // Filtro por categoría
  $(document).on('change', '#filtroCategoria', function() {
    const categoria = $(this).val();
    filtrarPorCategoria(categoria);
  });

  // Validación en tiempo real
  $(document).on('input', '#monto, #montoActualizar', function() {
    validarMonto($(this));
  });

  $(document).on('input', '#descripcion, #descripcionActualizar', function() {
    validarDescripcion($(this));
  });
}

// ==================== FUNCIONES PRINCIPALES ====================

async function procesarFormularioGasto(tipo) {
  try {
    const formId = tipo === 'agregar' ? '#formAgregarGasto' : '#formActualizarGasto';
    const formData = new FormData(document.querySelector(formId));
    
    const gastoData = {
      descripcion: formData.get('descripcion'),
      monto: parseFloat(formData.get('monto')),
      categoria: formData.get('categoria') || null,
      idProducto: formData.get('idProducto') || null
    };

    // Validar datos
    if (!validarDatosGasto(gastoData)) {
      return;
    }

    // Agregar ID para actualización
    if (tipo === 'actualizar' && gastoEditando) {
      gastoData.idGasto = gastoEditando.idGasto;
    }

    console.log(`${tipo === 'agregar' ? '➕' : '📝'} Procesando gasto:`, gastoData);

    // Enviar datos
    const resultado = tipo === 'agregar' 
      ? await registrarGasto(gastoData)
      : await actualizarGasto(gastoData);

    // Mostrar mensaje de éxito
    mostrarMensajeExito(
      tipo === 'agregar' 
        ? '¡Gasto registrado exitosamente!' 
        : '¡Gasto actualizado exitosamente!'
    );

    // Cerrar modal y recargar datos
    $(`#modal${tipo === 'agregar' ? 'Agregar' : 'Actualizar'}Gasto`).modal('hide');
    await cargarGastos();

  } catch (error) {
    console.error(`❌ Error al ${tipo} gasto:`, error);
    mostrarErrorGastos(`Error al ${tipo} gasto: ${error.message}`);
  }
}

async function editarGasto(idGasto) {
  try {
    const gasto = gastosData.find(g => g.idGasto == idGasto);
    if (!gasto) {
      throw new Error('Gasto no encontrado');
    }

    gastoEditando = gasto;

    // Cargar productos en select
    await cargarProductosEnSelect('#idProductoActualizar');

    // Llenar formulario con datos del gasto
    $('#idGastoActualizar').val(gasto.idGasto);
    $('#descripcionActualizar').val(gasto.descripcion);
    $('#montoActualizar').val(gasto.monto);
    $('#categoriaActualizar').val(gasto.categoria || '');
    $('#idProductoActualizar').val(gasto.idProducto || '');

    // Mostrar información del gasto
    $('#infoGastoActualizar').html(`
      <div class="alert alert-info">
        <i class="fas fa-info-circle"></i>
        <strong>Editando:</strong> ${gasto.descripcion} - $${formatearMoneda(gasto.monto)}
      </div>
    `);

    $('#modalActualizarGasto').modal('show');
  } catch (error) {
    console.error('❌ Error al cargar gasto para edición:', error);
    mostrarErrorGastos('Error al cargar gasto: ' + error.message);
  }
}

function confirmarEliminarGasto(idGasto, descripcion) {
  const mensaje = `¿Estás seguro de eliminar el gasto "${descripcion}"?`;
  
  if (confirm(mensaje)) {
    eliminarGastoConfirmado(idGasto);
  }
}

async function eliminarGastoConfirmado(idGasto) {
  try {
    console.log('🗑️ Eliminando gasto ID:', idGasto);
    
    // Mostrar loading
    $(`button[data-id="${idGasto}"]`).prop('disabled', true).html(
      '<i class="fas fa-spinner fa-spin"></i>'
    );

    await eliminarGasto(idGasto);
    
    mostrarMensajeExito('¡Gasto eliminado exitosamente!');
    await cargarGastos();
  } catch (error) {
    console.error('❌ Error al eliminar gasto:', error);
    mostrarErrorGastos('Error al eliminar gasto: ' + error.message);
    
    // Restaurar botón
    $(`button[data-id="${idGasto}"]`).prop('disabled', false).html(
      '<i class="fas fa-trash"></i>'
    );
  }
}

// ==================== FUNCIONES DE INTERFAZ ====================

async function mostrarGastosEnTabla(gastos) {
  const tbody = $('#tablaGastos');
  tbody.empty();

  if (!gastos || gastos.length === 0) {
    tbody.html(`
      <tr>
        <td colspan="7" class="text-center py-5">
          <div class="no-data">
            <i class="fas fa-receipt fa-3x text-muted mb-3"></i>
            <h5>No hay gastos registrados</h5>
            <p class="text-muted">Agrega el primer gasto para empezar</p>
          </div>
        </td>
      </tr>
    `);
    return;
  }

  gastos.forEach(gasto => {
    // Soportar varias formas en que la API pueda venir con la fecha / idProducto
    const fechaRaw = gasto.fecha_creacion ?? gasto.fecha ?? gasto.fechaCreacion ?? null;
    const fechaHtml = fechaRaw ? `<small class="text-muted">${formatearFecha(fechaRaw)}</small>` : '<span class="text-muted">N/A</span>';

    const productoId = (gasto.idProducto ?? gasto.id_producto ?? gasto.idproduct);
    const productoHtml = productoId !== undefined && productoId !== null && productoId !== '' 
      ? productoId 
      : 'N/A';

    const categoriaHtml = gasto.categoria ? 
      `<span class="badge badge-categoria">${gasto.categoria}</span>` : 
      '<span class="text-muted">Sin categoría</span>';

    const fila = `
      <tr class="gasto-row" data-id="${gasto.idGasto}">
        <td class="text-center">${gasto.idGasto}</td>
        <td><strong>${gasto.descripcion ?? ''}</strong></td>
        <td class="text-right"><span class="monto-gasto">$${formatearMoneda(gasto.monto ?? 0)}</span></td>
        <td class="text-center">${categoriaHtml}</td>
        <td class="text-center">${productoHtml}</td>
        <td class="text-center">${fechaHtml}</td>
        <td >
          <div class="action-buttons">
            <button class="btn-action btn-edit btn-edit-gasto" 
                    data-id="${gasto.idGasto}"
                    title="Editar gasto">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-action btn-delete btn-delete-gasto" 
                    data-id="${gasto.idGasto}"
                    data-descripcion="${(gasto.descripcion ?? '').replace(/"/g, '&quot;')}"
                    title="Eliminar gasto">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
    tbody.append(fila);
  });

  // Animación de entrada (requiere jQuery completo, no la versión slim)
  $('.gasto-row').hide().fadeIn(300);
}



async function cargarProductosEnSelect(selectId = '#idProducto') {
  try {
    const select = $(selectId);
    select.empty().append('<option value="">Seleccionar producto </option>');

    if (productosData && productosData.length > 0) {
      productosData.forEach(producto => {
        select.append(`
          <option value="${producto.idProducto}">
            ${producto.nombreProducto}
          </option>
        `);
      });
    }
  } catch (error) {
    console.error('❌ Error al cargar productos en select:', error);
  }
}

async function actualizarEstadisticasGastos() {
  try {
    const estadisticas = await obtenerEstadisticasGastos();
    
    const estadisticasHtml = `
      <div class="row">
        <div class="col-lg-3 col-md-6">
          <div class="stat-card bg-primary text-white">
            <div class="stat-icon">
              <i class="fas fa-receipt"></i>
            </div>
            <div class="stat-info">
              <h4>${estadisticas.totalGastos}</h4>
              <p>Total Gastos</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="stat-card bg-success text-white">
            <div class="stat-icon">
              <i class="fas fa-money-bill-wave"></i>
            </div>
            <div class="stat-info">
              <h4>$${formatearMoneda(estadisticas.montoTotal)}</h4>
              <p>Monto Total</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="stat-card bg-info text-white">
            <div class="stat-icon">
              <i class="fas fa-calculator"></i>
            </div>
            <div class="stat-info">
              <h4>$${formatearMoneda(estadisticas.promedioGasto)}</h4>
              <p>Promedio por Gasto</p>
            </div>
          </div>
        </div>
        <div class="col-lg-3 col-md-6">
          <div class="stat-card bg-warning text-white">
            <div class="stat-icon">
              <i class="fas fa-tags"></i>
            </div>
            <div class="stat-info">
              <h4>${Object.keys(estadisticas.gastosPorCategoria).length}</h4>
              <p>Categorías</p>
            </div>
          </div>
        </div>
      </div>
    `;

    $('#estadisticasGastos').html(estadisticasHtml);
  } catch (error) {
    console.error('❌ Error al actualizar estadísticas:', error);
  }
}

// ==================== FUNCIONES DE FILTRADO ====================

function filtrarGastos(termino) {
  const filas = $('.gasto-row');
  
  if (!termino) {
    filas.show();
    return;
  }

  filas.each(function() {
    const fila = $(this);
    const texto = fila.text().toLowerCase();
    
    if (texto.includes(termino.toLowerCase())) {
      fila.show();
    } else {
      fila.hide();
    }
  });
}

function filtrarPorCategoria(categoria) {
  const filas = $('.gasto-row');
  
  if (!categoria) {
    filas.show();
    return;
  }

  filas.each(function() {
    const fila = $(this);
    const categoriaGasto = fila.find('.badge-categoria').text();
    
    if (categoriaGasto === categoria) {
      fila.show();
    } else {
      fila.hide();
    }
  });
}

// ==================== FUNCIONES DE VALIDACIÓN ====================

function validarDatosGasto(gastoData) {
  let esValido = true;
  const errores = [];

  // Validar descripción
  if (!gastoData.descripcion || gastoData.descripcion.trim().length < 3) {
    errores.push('La descripción debe tener al menos 3 caracteres');
    esValido = false;
  }

  // Validar monto
  if (!gastoData.monto || gastoData.monto <= 0) {
    errores.push('El monto debe ser mayor a cero');
    esValido = false;
  }

  if (!esValido) {
    mostrarErrorGastos('Errores de validación:\n• ' + errores.join('\n• '));
  }

  return esValido;
}

function validarMonto(input) {
  const valor = parseFloat(input.val());
  
  if (isNaN(valor) || valor <= 0) {
    input.addClass('is-invalid').removeClass('is-valid');
  } else {
    input.removeClass('is-invalid').addClass('is-valid');
  }
}

function validarDescripcion(input) {
  const valor = input.val().trim();
  
  if (valor.length < 3) {
    input.addClass('is-invalid').removeClass('is-valid');
  } else {
    input.removeClass('is-invalid').addClass('is-valid');
  }
}

// ==================== FUNCIONES UTILITARIAS ====================

function limpiarFormularioGasto() {
  $('#formAgregarGasto')[0].reset();
  $('.form-control').removeClass('is-valid is-invalid');
  gastoEditando = null;
}

function mostrarCargandoGastos(mostrar) {
  if (mostrar) {
    $('#cargandoGastos').show();
    $('#tablaGastos').hide();
  } else {
    $('#cargandoGastos').hide();
    $('#tablaGastos').show();
  }
}

function mostrarMensajeExito(mensaje) {
  // Usar SweetAlert si está disponible, sino usar alert
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: mensaje,
      timer: 2000,
      showConfirmButton: false
    });
  } else {
    alert(mensaje);
  }
}

function mostrarErrorGastos(mensaje) {
  // Usar SweetAlert si está disponible, sino usar alert
  if (typeof Swal !== 'undefined') {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje
    });
  } else {
    alert(mensaje);
  }
}

function formatearMoneda(monto) {
  return new Intl.NumberFormat('es-CO', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(monto);
}

function formatearFecha(fecha) {
  if (!fecha) return 'N/A';
  
  const date = new Date(fecha);
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}


// Exportaciones globales para uso en HTML
window.cargarGastos = cargarGastos;
window.limpiarFormularioGasto = limpiarFormularioGasto;
