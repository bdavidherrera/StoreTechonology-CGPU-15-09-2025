// js/compras.js
import {
  getCompras,
  getCompraPorId,
  postCompra,
  putCompra,
  deleteCompra,
  getEstadisticasCompras,
  getProveedoresForCompras,
  getProductosForCompras
} from '../Api/consumeApi.js';

// Variables globales
let proveedoresGlobal = [];
let productosGlobal = [];
let comprasGlobal = [];
let paginaActual = 1;
const itemsPorPagina = 10;

// ===== INICIALIZACIÓN =====
$(document).ready(function() {
  // Event listeners
  $('#btnAgregarCompra').click(mostrarModalAgregarCompra);
  $('#formAgregarCompra').submit(manejarAgregarCompra);
  $('#formActualizarCompra').submit(manejarActualizarCompra);
  $('#btnBuscarFechasCompras').click(buscarComprasPorFechas);
  $('#btnLimpiarFiltrosCompras').click(limpiarFiltrosCompras);
  $('#btnExportarCompras').click(exportarComprasCSV);
  $('#filtroProveedorCompras').change(filtrarComprasPorProveedor);

  // Event listeners para productos dinámicos
  $(document).on('click', '.btn-agregar-producto', agregarLineaProducto);
  $(document).on('click', '.btn-eliminar-producto', eliminarLineaProducto);
  $(document).on('change', '.producto-select', actualizarInfoProducto);
  $(document).on('input', '.cantidad-input, .precio-input', calcularSubtotal);
  $(document).on('change', '#aplicarRetefuente, #aplicarRetefuenteActualizar', function() {
    // enviar selector correcto: si estamos en modal actualizar, recalcular ahí
    const $form = $(this).closest('form');
    calcularTotales($form);
  });

  // Cargar datos iniciales
  cargarDatosIniciales();
});

// ===== FUNCIONES DE CARGA INICIAL =====
async function cargarDatosIniciales() {
  try {
    mostrarCargando('#cargandoCompras', true);

    // Cargar datos en paralelo
    await Promise.all([
      cargarProveedoresCombo(),
      cargarProductosCombo(),
      cargarCompras(),
      cargarEstadisticasCompras()
    ]);

  } catch (error) {
    console.error('Error al cargar datos iniciales:', error);
    mostrarError('Error al cargar datos iniciales');
  } finally {
    mostrarCargando('#cargandoCompras', false);
  }
}

// ===== FUNCIONES DE CARGA DE DATOS =====
async function cargarProveedoresCombo() {
  try {
    const response = await getProveedoresForCompras();
    proveedoresGlobal = response;

    // Llenar combo boxes
    const proveedorSelect = `
      <option value="">Seleccionar proveedor...</option>
      ${response.map(proveedor =>
        `<option value="${proveedor.idProveedor}" data-retefuente="${proveedor.porcentaje_retefuente || 0}">
          ${proveedor.nombre} (${proveedor.nit})
        </option>`
      ).join('')}
    `;

    $('#idProveedor, #idProveedorActualizar, #filtroProveedorCompras').html(proveedorSelect);

  } catch (error) {
    console.error('Error al cargar proveedores:', error);
    mostrarError('Error al cargar proveedores');
  }
}

async function cargarProductosCombo() {
  try {
    const response = await getProductosForCompras();
    productosGlobal = response;

    // No sobreescribimos selects existentes (para no romper selected),
    // las nuevas líneas usan productosGlobal para crear sus opciones.
    // Pero si quieres forzar refresco en selects actuales sin selected:
    $('.producto-select').each(function() {
      const currentVal = $(this).val();
      // Reconstruir opciones conservando currentVal
      const opciones = productosGlobal.map(prod =>
        `<option value="${prod.idProducto}">${prod.nombreProducto} (Stock: ${prod.cantidad})</option>`
      ).join('');
      $(this).html(`<option value="">Seleccionar producto...</option>${opciones}`);
      if (currentVal) $(this).val(currentVal);
    });

  } catch (error) {
    console.error('Error al cargar productos:', error);
    mostrarError('Error al cargar productos');
  }
}

async function cargarCompras(page = 1, idProveedor = null) {
  try {
    mostrarCargando('#cargandoCompras', true);

    const response = await getCompras(page, itemsPorPagina, idProveedor);
    comprasGlobal = response.data;

    mostrarComprasEnTabla(response.data);
    actualizarPaginacion(response.pagination);

  } catch (error) {
    console.error('Error al cargar compras:', error);
    mostrarError('Error al cargar compras');
  } finally {
    mostrarCargando('#cargandoCompras', false);
  }
}

async function cargarEstadisticasCompras(fechaInicio = null, fechaFin = null) {
  try {
    const response = await getEstadisticasCompras(fechaInicio, fechaFin);
    mostrarEstadisticasCompras(response.data);

  } catch (error) {
    console.error('Error al cargar estadísticas:', error);
    mostrarError('Error al cargar estadísticas de compras');
  }
}

// ===== FUNCIONES DE VISUALIZACIÓN =====
function mostrarComprasEnTabla(compras) {
  const tbody = $('#tablaCompras');

  if (compras.length === 0) {
    tbody.html(`
      <tr>
        <td colspan="7" class="text-center no-data">
          <div class="py-4">
            <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">No hay compras registradas</h5>
            <p class="text-muted">Haz clic en "Agregar Compra" para comenzar</p>
          </div>
        </td>
      </tr>
    `);
    return;
  }

  const html = compras.map(compra => `
    <tr class="compra-row">
      <td><strong>#${compra.idCompra}</strong></td>
      <td>
        <div class="proveedor-info">
          <strong>${compra.nombreProveedor}</strong><br>
          <small class="text-muted">NIT: ${compra.nitProveedor}</small>
        </div>
      </td>
      <td>
        <small class="text-muted">${formatearFecha(compra.fecha)}</small>
      </td>
      <td class="monto-subtotal">
        <strong>$${formatearNumero(compra.subtotal)}</strong>
      </td>
      <td class="text-warning">
        <strong>$${formatearNumero(compra.valor_retefuente)}</strong>
      </td>
      <td class="monto-total">
        <strong>$${formatearNumero(compra.total_pagado)}</strong>
      </td>
      <td>
        <div class="action-buttons">
          <button class="btn btn-sm btn-info" onclick="verDetalleCompra(${compra.idCompra})" title="Ver detalle">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn btn-sm btn-warning" onclick="editarCompra(${compra.idCompra})" title="Editar">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="eliminarCompra(${compra.idCompra})" title="Eliminar">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');

  tbody.html(html);
}

function mostrarEstadisticasCompras(estadisticas) {
  const { resumen, comprasPorProveedor } = estadisticas;

  const estadisticasHtml = `
    <div class="row">
      <div class="col-md-3">
        <div class="stat-card bg-primary text-white">
          <div class="stat-icon"><i class="fas fa-shopping-cart"></i></div>
          <div class="stat-info">
            <h4>${resumen.totalCompras || 0}</h4>
            <p>Total Compras</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card bg-success text-white">
          <div class="stat-icon"><i class="fas fa-dollar-sign"></i></div>
          <div class="stat-info">
            <h4>$${formatearNumero(resumen.totalPagado || 0)}</h4>
            <p>Total Pagado</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card bg-warning text-white">
          <div class="stat-icon"><i class="fas fa-receipt"></i></div>
          <div class="stat-info">
            <h4>$${formatearNumero(resumen.totalRetefuente || 0)}</h4>
            <p>Total Retención</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="stat-card bg-info text-white">
          <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
          <div class="stat-info">
            <h4>$${formatearNumero(resumen.promedioCompra || 0)}</h4>
            <p>Promedio Compra</p>
          </div>
        </div>
      </div>
    </div>
    ${comprasPorProveedor && comprasPorProveedor.length > 0 ? `
      <div class="mt-4">
        <h5 class="text-white mb-3"><i class="fas fa-building"></i> Compras por Proveedor</h5>
        <div class="row">
          ${comprasPorProveedor.slice(0, 4).map(proveedor => `
            <div class="col-md-6 mb-3">
              <div class="stat-card-small">
                <strong>${proveedor.proveedor}</strong><br>
                <small>${proveedor.numeroCompras} compras - $${formatearNumero(proveedor.totalPagado)}</small>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
  `;

  $('#estadisticasCompras').html(estadisticasHtml);
}

// ===== FUNCIONES DE MODAL =====
async function mostrarModalAgregarCompra() {
  limpiarFormularioAgregarCompra();
  $('#modalAgregarCompra').modal('show');

  // Agregar primera línea de producto
  agregarLineaProducto();
}

async function editarCompra(idCompra) {
  try {
    mostrarCargando('#modalActualizarCompra .modal-body', true);

    // Si productosGlobal está vacío, forzamos su carga (evita race)
    if (!productosGlobal || productosGlobal.length === 0) {
      await cargarProductosCombo();
    }

    const response = await getCompraPorId(idCompra);
    const { compra, detalles } = response.data;

    // Llenar datos de la compra
    $('#idCompraActualizar').val(compra.idCompra);
    // Si el select de proveedor tiene name diferente, ponemos también el value
    $('#idProveedorActualizar').val(compra.idProveedor);
    $('#idProveedor').val(compra.idProveedor);

    // Verificar si tiene retención
    const tieneRetefuente = parseFloat(compra.valor_retefuente) > 0;
    $('#aplicarRetefuenteActualizar').prop('checked', tieneRetefuente);

    // Limpiar líneas anteriores
    $('#productosContainerActualizar').empty();

    // Debug logs
    console.log('editarCompra: compra ->', compra);
    console.log('editarCompra: detalles ->', detalles);
    console.log('editarCompra: productosGlobal ->', productosGlobal);

    // Agregar líneas de productos (si no hay detalles, agregamos 1 vacía)
    if (detalles && detalles.length > 0) {
      detalles.forEach(detalle => {
        const data = {
          idProducto: detalle.idProducto,
          cantidad: detalle.cantidad,
          precio_unitario: detalle.precio_unitario
        };
        agregarLineaProducto('#productosContainerActualizar', data);
      });
    } else {
      agregarLineaProducto('#productosContainerActualizar', null);
    }

    calcularTotales('#formActualizarCompra');
    $('#modalActualizarCompra').modal('show');

  } catch (error) {
    console.error('Error al cargar compra:', error);
    mostrarError('Error al cargar los datos de la compra');
  } finally {
    mostrarCargando('#modalActualizarCompra .modal-body', false);
  }
}

async function verDetalleCompra(idCompra) {
  try {
    const response = await getCompraPorId(idCompra);
    const { compra, detalles } = response.data;

    const contenido = `
      <div class="row">
        <div class="col-md-6">
          <h6 class="text-primary"><i class="fas fa-receipt"></i> Información de la Compra</h6>
          <table class="table table-sm">
            <tr><td><strong>ID Compra:</strong></td><td>#${compra.idCompra}</td></tr>
            <tr><td><strong>Fecha:</strong></td><td>${formatearFecha(compra.fecha)}</td></tr>
            <tr><td><strong>Subtotal:</strong></td><td class="text-info">$${formatearNumero(compra.subtotal)}</td></tr>
            <tr><td><strong>Retención:</strong></td><td class="text-warning">$${formatearNumero(compra.valor_retefuente)}</td></tr>
            <tr><td><strong>Total Pagado:</strong></td><td class="text-success"><strong>$${formatearNumero(compra.total_pagado)}</strong></td></tr>
          </table>
        </div>
        <div class="col-md-6">
          <h6 class="text-primary"><i class="fas fa-building"></i> Información del Proveedor</h6>
          <table class="table table-sm">
            <tr><td><strong>Nombre:</strong></td><td>${compra.nombreProveedor}</td></tr>
            <tr><td><strong>NIT:</strong></td><td>${compra.nitProveedor}</td></tr>
            <tr><td><strong>Teléfono:</strong></td><td>${compra.telefonoProveedor || 'N/A'}</td></tr>
            <tr><td><strong>Email:</strong></td><td>${compra.correoProveedor || 'N/A'}</td></tr>
            <tr><td><strong>Dirección:</strong></td><td>${compra.direccionProveedor || 'N/A'}</td></tr>
          </table>
        </div>
      </div>

      <hr>

      <h6 class="text-primary"><i class="fas fa-box"></i> Detalle de Productos</h6>
      <div class="table-responsive">
        <table class="table table-striped">
          <thead class="thead-dark">
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>Precio Unit.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${detalles.map(detalle => `
              <tr>
                <td><div class="d-flex align-items-center"><span>${detalle.nombreProducto}</span></div></td>
                <td><span class="badge badge-primary">${detalle.cantidad}</span></td>
                <td>$${formatearNumero(detalle.precio_unitario)}</td>
                <td class="text-success"><strong>$${formatearNumero(detalle.subtotal_linea)}</strong></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;

    $('#contenidoDetalleCompra').html(contenido);
    $('#modalDetalleCompra').modal('show');

  } catch (error) {
    console.error('Error al cargar detalle:', error);
    mostrarError('Error al cargar el detalle de la compra');
  }
}

// ===== FUNCIONES DE PRODUCTOS DINÁMICOS =====
// Nota: esta función acepta 3 usos:
//  - llamada por click handler (recibe event) -> agrega una línea al contenedor principal '#productosContainer'
//  - llamada con container string '#productosContainerActualizar' y optional data -> añade línea en ese contenedor
//  - llamada con jQuery element como primer arg
function agregarLineaProducto(arg = '#productosContainer', data = null) {
  // Detectar si el primer argumento es un event (click handler)
  if (arg && typeof arg === 'object' && (arg.originalEvent || arg.preventDefault)) {
    // fue llamada como event handler -> usamos el contenedor default
    arg = '#productosContainer';
  }

  // Normalizar $container
  let $container;
  if (typeof arg === 'string') {
    $container = $(arg);
  } else if (arg instanceof jQuery) {
    $container = arg;
  } else if (arg instanceof HTMLElement) {
    $container = $(arg);
  } else {
    $container = $('#productosContainer');
  }

  const index = $container.find('.producto-linea').length;

  // Construir opciones a partir de productosGlobal
  const opcionesProductos = productosGlobal.map(producto =>
    `<option value="${producto.idProducto}">${producto.nombreProducto} (Stock: ${producto.cantidad})</option>`
  ).join('');

  const lineaHtml = `
    <div class="producto-linea border rounded p-3 mb-3" data-index="${index}">
      <div class="row" id="colorInformacionP">
        <div class="col-md-4">
          <label><i class="fas fa-box"></i> Producto *</label>
          <select class="form-control producto-select" name="productos[${index}][idProducto]" required>
            <option value="">Seleccionar producto...</option>
            ${opcionesProductos}
          </select>
          <small class="producto-info text-muted"></small>
        </div>
        <div class="col-md-2">
          <label><i class="fas fa-hashtag"></i> Cantidad *</label>
          <input type="number" class="form-control cantidad-input" name="productos[${index}][cantidad]"
                 value="${data ? data.cantidad : ''}" min="1" required>
        </div>
        <div class="col-md-3">
          <label><i class="fas fa-dollar-sign"></i> Precio Unitario *</label>
          <input type="number" class="form-control precio-input" name="productos[${index}][precio_unitario]"
                 value="${data ? data.precio_unitario : ''}" min="0" step="0.01" required>
        </div>
        <div class="col-md-2">
          <label>Subtotal</label>
          <div class="form-control subtotal-display bg-light" readonly>$0.00</div>
        </div>
        <div class="col-md-1">
          <label>&nbsp;</label>
          <button type="button" class="btn btn-danger btn-sm btn-block btn-eliminar-producto" title="Eliminar producto">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `;

  $container.append(lineaHtml);
  const $linea = $container.find('.producto-linea').last();
  const $select = $linea.find('.producto-select');
  const $cantidad = $linea.find('.cantidad-input');
  const $precio = $linea.find('.precio-input');

  // Si hay data para prellenar, forzamos selección y cálculo (robusto)
  if (data && data.idProducto !== undefined && data.idProducto !== null) {
    console.log('agregarLineaProducto: data recibido ->', data);
    console.log('agregarLineaProducto: productosGlobal ->', productosGlobal);

    const valStr = String(data.idProducto);
    $select.val(valStr);

    // Forzar selected en el option (compatibilidad)
    $select.find('option').prop('selected', false);
    const $opt = $select.find(`option[value="${valStr}"]`);
    if ($opt.length > 0) {
      $opt.prop('selected', true);
    } else {
      console.warn(`agregarLineaProducto: option con value="${valStr}" NO encontrado en select.`, $select.html());
    }

    // Disparar change para que se rellene info/price
    $select.trigger('change');

    // Asegurar valores en inputs
    if (data.cantidad !== undefined) $cantidad.val(data.cantidad);
    if (data.precio_unitario !== undefined) $precio.val(data.precio_unitario);

    // Calcular subtotal con los valores prellenados
    calcularSubtotal.call($cantidad[0]);
  } else {
    // Si no hay data, dejamos todo en blanco y subtotal en $0.00
    $select.val('');
    $linea.find('.subtotal-display').text(`$0.00`);
  }
}

function eliminarLineaProducto() {
  const $linea = $(this).closest('.producto-linea');
  const $container = $linea.parent();

  $linea.remove();

  // Reindexar las líneas restantes
  $container.find('.producto-linea').each(function(index) {
    $(this).attr('data-index', index);
    $(this).find('select, input').each(function() {
      const name = $(this).attr('name');
      if (name) {
        const newName = name.replace(/\[\d+\]/, `[${index}]`);
        $(this).attr('name', newName);
      }
    });
  });

  // Recalcular totales del formulario al que pertenece la línea
  const $form = $container.closest('form');
  calcularTotales($form);
}

function actualizarInfoProducto() {
  const $select = $(this);
  const idProducto = $select.val();
  const $linea = $select.closest('.producto-linea');
  const $info = $linea.find('.producto-info');
  const $precioInput = $linea.find('.precio-input');

  if (idProducto) {
    const producto = productosGlobal.find(p => String(p.idProducto) === String(idProducto));
    if (producto) {
      $info.html(`Stock disponible: ${producto.cantidad} | Precio costo: $${formatearNumero(producto.precio_costo)}`);

      // Sugerir precio de costo si no hay precio ingresado
      if (!$precioInput.val()) {
        $precioInput.val(producto.precio_costo);
        calcularSubtotal.call($precioInput[0]);
      }
    } else {
      // No lo encontró en productosGlobal
      $info.html('Producto no encontrado en catálogo');
    }
  } else {
    $info.html('');
  }
}

function calcularSubtotal() {
  const $input = $(this);
  const $linea = $input.closest('.producto-linea');
  const cantidad = parseFloat($linea.find('.cantidad-input').val()) || 0;
  const precio = parseFloat($linea.find('.precio-input').val()) || 0;
  const subtotal = cantidad * precio;

  $linea.find('.subtotal-display').text(`$${formatearNumero(subtotal.toFixed(2))}`);

  // Recalcular totales en el formulario al que pertenece
  const $form = $linea.closest('form');
  calcularTotales($form);
}

function calcularTotales(formSelector = '#formAgregarCompra') {
  let $form;

  // Si viene un objeto jQuery o un form DOM
  if (formSelector instanceof jQuery) {
    $form = formSelector;
  } else if (formSelector instanceof HTMLElement) {
    $form = $(formSelector);
  } else {
    // Si viene string (ej: "#formAgregarCompra")
    $form = $(formSelector);
  }

  if ($form.length === 0) {
    // fallback - intentar seleccionar por id del modal
    $form = $('#formAgregarCompra');
  }

  let subtotal = 0;

  $form.find('.producto-linea').each(function() {
    const cantidad = parseFloat($(this).find('.cantidad-input').val()) || 0;
    const precio = parseFloat($(this).find('.precio-input').val()) || 0;
    subtotal += cantidad * precio;
  });

  // Calcular retención
  const aplicarRetefuente = $form.find("input[name='aplicarRetefuente']").is(':checked') ||
                            $form.find("#aplicarRetefuente").is(':checked') ||
                            $form.find("#aplicarRetefuenteActualizar").is(':checked');
  let retefuente = 0;

  if (aplicarRetefuente) {
    // buscar idProveedor dentro del formulario (considera distintos name/id)
    const idProveedor = $form.find("select[name='idProveedor']").val() ||
                        $form.find("#idProveedorActualizar").val() ||
                        $form.find("#idProveedor").val();
    const proveedor = proveedoresGlobal.find(p => String(p.idProveedor) === String(idProveedor));
    if (proveedor && proveedor.porcentaje_retefuente) {
      retefuente = subtotal * (proveedor.porcentaje_retefuente / 100);
    }
  }

  const total = subtotal - retefuente;

  // Actualizar displays (buscando dentro del formulario)
  $form.find('.subtotal-total').text(`$${formatearNumero(subtotal.toFixed(2))}`);
  $form.find('.retefuente-total').text(`$${formatearNumero(retefuente.toFixed(2))}`);
  $form.find('.total-final').text(`$${formatearNumero(total.toFixed(2))}`);
}

// ===== FUNCIONES DE FORMULARIOS =====
async function manejarAgregarCompra(e) {
  e.preventDefault();

  try {
    const formData = new FormData(e.target);
    const datosCompra = procesarDatosFormulario(formData);

    if (!validarDatosCompra(datosCompra)) {
      return;
    }

    mostrarCargando('#formAgregarCompra', true);

    const response = await postCompra(datosCompra);

    if (response.success) {
      mostrarExito('Compra registrada exitosamente');
      $('#modalAgregarCompra').modal('hide');

      // Guardar en localStorage que queremos volver a Compras
      localStorage.setItem('ultimaSeccion', '#compras');

      // 🔄 Recargar página
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      mostrarError(response.message || 'Error al registrar la compra');
    }

  } catch (error) {
    console.error('Error al agregar compra:', error);
    mostrarError('Error al procesar la compra');
  } finally {
    mostrarCargando('#formAgregarCompra', false);
  }
}


async function manejarActualizarCompra(e) {
  e.preventDefault();

  try {
    const formData = new FormData(e.target);
    const datosCompra = procesarDatosFormulario(formData);

    if (!validarDatosCompra(datosCompra)) {
      return;
    }

    mostrarCargando('#formActualizarCompra', true);

    const response = await putCompra(datosCompra);

    if (response.success) {
      mostrarExito('Compra actualizada exitosamente');
      $('#modalActualizarCompra').modal('hide');

      // Guardar en localStorage que queremos volver a Compras
      localStorage.setItem('ultimaSeccion', '#compras');

      // 🔄 Recargar página
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      mostrarError(response.message || 'Error al actualizar la compra');
    }

  } catch (error) {
    console.error('Error al actualizar compra:', error);
    mostrarError('Error al procesar la actualización');
  } finally {
    mostrarCargando('#formActualizarCompra', false);
  }
}


// Procesa FormData y reconstruye el objeto que envía al backend.
// Ahora soporta idCompra (busca en formData y también hace fallback al DOM)
function procesarDatosFormulario(formData) {
  // Obtener idCompra (si viene)
  const idFromForm = formData.get('idCompra') || formData.get('idCompraActualizar') || formData.get('id_compra') || null;
  // Fallback: buscar elementos en el DOM si FormData no tiene idCompra
  const idFallback = (!idFromForm)
    ? (document.getElementById('idCompraActualizar') ? document.getElementById('idCompraActualizar').value
       : (document.getElementById('idCompra') ? document.getElementById('idCompra').value : null))
    : null;

  const idCompraFinal = idFromForm || idFallback || null;

  const idProveedor = formData.get('idProveedor') || formData.get('idProveedorActualizar') || document.getElementById('idProveedor')?.value || document.getElementById('idProveedorActualizar')?.value || null;

  const datos = {
    idCompra: idCompraFinal ? (isNaN(Number(idCompraFinal)) ? idCompraFinal : Number(idCompraFinal)) : undefined,
    idProveedor: idProveedor,
    aplicarRetefuente: formData.get('aplicarRetefuente') ? true : false,
    productos: []
  };

  // Iteramos todas las claves del FormData
  for (let [key, value] of formData.entries()) {
    const match = key.match(/productos\[(\d+)\]\[(\w+)\]/);
    if (match) {
      const index = parseInt(match[1], 10);
      const field = match[2];

      if (!datos.productos[index]) {
        datos.productos[index] = {};
      }

      datos.productos[index][field] =
        (field === 'cantidad' || field === 'precio_unitario')
          ? (value === '' ? 0 : parseFloat(value))
          : value;
    }
  }

  // Filtrado para remover índices vacíos (si hubo saltos)
  datos.productos = datos.productos.filter(p => p && (p.idProducto || p.cantidad || p.precio_unitario));

  return datos;
}

function validarDatosCompra(datos) {
  // Si es actualización, exigir idCompra
  if (datos.idCompra !== undefined && (!datos.idCompra || isNaN(datos.idCompra))) {
    mostrarError('ID de compra inválido para actualización');
    return false;
  }

  if (!datos.idProveedor) {
    mostrarError('Debe seleccionar un proveedor');
    return false;
  }

  if (!datos.productos || datos.productos.length === 0) {
    mostrarError('Debe agregar al menos un producto');
    return false;
  }

  for (let i = 0; i < datos.productos.length; i++) {
    const producto = datos.productos[i];

    if (!producto.idProducto || !producto.cantidad || !producto.precio_unitario) {
      mostrarError(`Complete todos los campos del producto ${i + 1}`);
      return false;
    }

    if (parseFloat(producto.cantidad) <= 0) {
      mostrarError(`La cantidad del producto ${i + 1} debe ser mayor a 0`);
      return false;
    }

    if (parseFloat(producto.precio_unitario) <= 0) {
      mostrarError(`El precio del producto ${i + 1} debe ser mayor a 0`);
      return false;
    }
  }

  return true;
}

function limpiarFormularioAgregarCompra() {
  $('#formAgregarCompra')[0].reset();
  $('#productosContainer').empty();
  $('#idProveedor').val('');
  $('#aplicarRetefuente').prop('checked', false);
  calcularTotales('#formAgregarCompra');
}

function limpiarFormularioActualizarCompra() {
  $('#formActualizarCompra')[0].reset();
  $('#productosContainerActualizar').empty();
  $('#idProveedorActualizar').val('');
  $('#aplicarRetefuenteActualizar').prop('checked', false);
  calcularTotales('#formActualizarCompra');
}

// ===== FUNCIONES DE FILTROS =====
async function filtrarComprasPorProveedor() {
  const idProveedor = $(this).val();
  paginaActual = 1;
  await cargarCompras(paginaActual, idProveedor || null);
}

async function buscarComprasPorFechas() {
  const fechaInicio = $('#fechaInicioCompras').val();
  const fechaFin = $('#fechaFinCompras').val();

  if (fechaInicio && fechaFin && fechaInicio > fechaFin) {
    mostrarError('La fecha de inicio no puede ser mayor a la fecha fin');
    return;
  }

  try {
    // Cargar estadísticas del período
    await cargarEstadisticasCompras(fechaInicio, fechaFin);

    // Mostrar sección de estadísticas del período
    if (fechaInicio || fechaFin) {
      const estadisticasPeriodo = `
        <div class="alert alert-info">
          <h6><i class="fas fa-calendar-check"></i> Estadísticas del Período</h6>
          <p>Filtro aplicado: ${fechaInicio ? formatearFecha(fechaInicio) : 'Sin fecha inicio'} - ${fechaFin ? formatearFecha(fechaFin) : 'Sin fecha fin'}</p>
        </div>
      `;
      $('#estadisticasPeriodoCompras').html(estadisticasPeriodo).show();
    }

    mostrarExito('Estadísticas actualizadas para el período seleccionado');

  } catch (error) {
    console.error('Error al buscar por fechas:', error);
    mostrarError('Error al filtrar por fechas');
  }
}

function limpiarFiltrosCompras() {
  $('#fechaInicioCompras').val('');
  $('#fechaFinCompras').val('');
  $('#filtroProveedorCompras').val('');
  $('#estadisticasPeriodoCompras').hide();

  // Recargar datos sin filtros
  paginaActual = 1;
  cargarCompras();
  cargarEstadisticasCompras();

  mostrarExito('Filtros limpiados');
}

// ===== FUNCIÓN DE ELIMINACIÓN =====
async function eliminarCompra(idCompra) {
  if (!confirm('¿Está seguro de que desea eliminar esta compra? Esta acción revertirá el inventario y no se puede deshacer.')) {
    return;
  }

  try {
    const response = await deleteCompra(idCompra);

    if (response.success) {
      mostrarExito('Compra eliminada exitosamente');
      cargarCompras();
      cargarEstadisticasCompras();
    } else {
      mostrarError(response.message || 'Error al eliminar la compra');
    }

  } catch (error) {
    console.error('Error al eliminar compra:', error);
    mostrarError('Error al procesar la eliminación');
  }
}



// ===== FUNCIÓN DE PAGINACIÓN =====
function actualizarPaginacion(pagination) {
    const { page, totalPages, total } = pagination;
    
    if (totalPages <= 1) {
        $('#paginacionCompras').html('');
        return;
    }
    
    let paginacionHtml = `
        <nav aria-label="Paginación de compras">
            <ul class="pagination justify-content-center">
    `;
    
    // Botón anterior
    paginacionHtml += `
        <li class="page-item ${page <= 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="cambiarPagina(${page - 1})" aria-label="Anterior">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    `;
    
    // Números de página
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);
    
    for (let i = startPage; i <= endPage; i++) {
        paginacionHtml += `
            <li class="page-item ${i === page ? 'active' : ''}">
                <a class="page-link" href="#" onclick="cambiarPagina(${i})">${i}</a>
            </li>
        `;
    }
    
    // Botón siguiente
    paginacionHtml += `
        <li class="page-item ${page >= totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="cambiarPagina(${page + 1})" aria-label="Siguiente">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `;
    
    paginacionHtml += `
            </ul>
        </nav>
        <div class="text-center text-muted mt-2">
            <small>Mostrando página ${page} de ${totalPages} (${total} compras en total)</small>
        </div>
    `;
    
    $('#paginacionCompras').html(paginacionHtml);
}

async function cambiarPagina(nuevaPagina) {
    if (nuevaPagina < 1) return;
    
    paginaActual = nuevaPagina;
    const idProveedor = $('#filtroProveedorCompras').val() || null;
    await cargarCompras(paginaActual, idProveedor);
}

// ===== FUNCIÓN DE EXPORTACIÓN =====
async function exportarComprasCSV() {
    try {
        mostrarCargando('#btnExportarCompras', true);
        
        // Obtener todas las compras sin paginación
        const response = await getCompras(1, 9999); // Obtener muchas compras
        const compras = response.data;
        
        if (compras.length === 0) {
            mostrarError('No hay compras para exportar');
            return;
        }
        
        // Crear CSV
        const headers = ['ID', 'Proveedor', 'NIT', 'Fecha', 'Subtotal', 'Retención', 'Total Pagado'];
        const csvContent = [
            headers.join(','),
            ...compras.map(compra => [
                compra.idCompra,
                `"${compra.nombreProveedor}"`,
                compra.nitProveedor,
                formatearFecha(compra.fecha),
                compra.subtotal,
                compra.valor_retefuente,
                compra.total_pagado
            ].join(','))
        ].join('\n');
        
        // Descargar archivo
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `compras_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        
        mostrarExito('Archivo CSV descargado exitosamente');
        
    } catch (error) {
        console.error('Error al exportar CSV:', error);
        mostrarError('Error al generar el archivo CSV');
    } finally {
        mostrarCargando('#btnExportarCompras', false);
    }
}

// ===== FUNCIONES DE UTILIDAD =====
function formatearNumero(numero) {
    if (!numero) return '0.00';
    return parseFloat(numero).toLocaleString('es-CO', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

function mostrarCargando(selector, mostrar) {
    const $elemento = $(selector);
    
    if (mostrar) {
        if (selector.includes('modal')) {
            $elemento.append(`
                <div class="loading-overlay">
                    <div class="spinner-border text-primary" role="status">
                        <span class="sr-only">Cargando...</span>
                    </div>
                </div>
            `);
        } else {
            $elemento.show();
        }
    } else {
        if (selector.includes('modal')) {
            $elemento.find('.loading-overlay').remove();
        } else {
            $elemento.hide();
        }
    }
}

function mostrarExito(mensaje) {
    // Implementar sistema de notificaciones
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'success',
            title: 'Éxito',
            text: mensaje,
            timer: 3000,
            showConfirmButton: false
        });
    } else {
        alert(`✅ ${mensaje}`);
    }
}

function mostrarError(mensaje) {
    // Implementar sistema de notificaciones
    if (typeof Swal !== 'undefined') {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: mensaje
        });
    } else {
        alert(`❌ ${mensaje}`);
    }
}

// ===== FUNCIONES GLOBALES =====
window.verDetalleCompra = verDetalleCompra;
window.editarCompra = editarCompra;
window.eliminarCompra = eliminarCompra;
window.cambiarPagina = cambiarPagina;
window.limpiarFormularioAgregarCompra = limpiarFormularioAgregarCompra;
window.limpiarFormularioActualizarCompra = limpiarFormularioActualizarCompra;
window.agregarLineaProducto = agregarLineaProducto;