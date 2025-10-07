import { 
  obtenerDashboardCompletoCliente,
  obtenerProductosRecientesCliente,
  obtenerProductosMejorPrecioCliente,
  obtenerProductosTopCliente,
  obtenerProductosPopularesCliente,
  obtenerEstadisticasPersonalesCliente,
  obtenerTendenciasCompraCliente
} from '../Api/consumeApi.js';

class AnalyticsCliente {
  constructor() {
    this.idUsuario = sessionStorage.getItem("idUsuario");
    this.dashboardData = null;
    this.init();
  }

  async init() {
    if (!this.idUsuario) {
      console.error("No se encontró ID de usuario en sessionStorage");
      return;
    }

    await this.cargarDashboard();
    this.setupEventListeners();
  }

  async cargarDashboard() {
    try {
      this.mostrarLoading();
      
      const data = await obtenerDashboardCompletoCliente(this.idUsuario);
      this.dashboardData = data;
      
      this.renderizarEstadisticasPersonales(data.estadisticasPersonales);
      this.renderizarProductosRecientes(data.productosRecientes);
      this.renderizarProductosMejorPrecio(data.productosMejorPrecio);
      this.renderizarProductosTopCliente(data.productosTopCliente);
      this.renderizarProductosPopulares(data.productosPopulares);
      this.renderizarTendenciasCompra(data.tendenciasCompra);
      
      this.ocultarLoading();
    } catch (error) {
      console.error("Error al cargar dashboard:", error);
      this.mostrarError("Error al cargar los datos del dashboard");
    }
  }

  renderizarEstadisticasPersonales(estadisticasData) {
    if (!estadisticasData?.success || !estadisticasData.data) return;
    
    const stats = estadisticasData.data.estadisticas;
    const container = document.getElementById('estadisticasPersonales');
    if (!container) return;

    container.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-shopping-bag"></i>
          </div>
          <div class="stat-info">
            <h3>${stats.total_pedidos || 0}</h3>
            <p>Pedidos Totales</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-box"></i>
          </div>
          <div class="stat-info">
            <h3>${stats.total_productos_comprados || 0}</h3>
            <p>Productos Comprados</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-money-bill-wave"></i>
          </div>
          <div class="stat-info">
            <h3>$${(stats.total_gastado || 0).toLocaleString()}</h3>
            <p>Total Gastado</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-receipt"></i>
          </div>
          <div class="stat-info">
            <h3>$${(stats.ticket_promedio || 0).toLocaleString()}</h3>
            <p>Ticket Promedio</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-credit-card"></i>
          </div>
          <div class="stat-info">
            <h3>${stats.metodo_pago_favorito || 'N/A'}</h3>
            <p>Método de Pago Favorito</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-star"></i>
          </div>
          <div class="stat-info">
            <h3>${stats.producto_favorito || 'N/A'}</h3>
            <p>Producto Favorito</p>
          </div>
        </div>
      </div>
      
      ${this.renderizarProductosRecomendados(estadisticasData.data.productos_recomendados)}
    `;
  }

  renderizarProductosRecomendados(productos) {
    if (!productos || productos.length === 0) return '';
    
    return `
      <div class="recomendaciones-section">
        <h4>Productos Recomendados para Ti</h4>
        <div class="recomendaciones-grid">
          ${productos.map(producto => `
            <div class="producto-recomendado">
              <img src="img/${producto.imagen}" alt="${producto.nombreProducto}" 
                   onerror="this.src='img/placeholder.jpg'">
              <div class="producto-info">
                <h5>${producto.nombreProducto}</h5>
                <p class="precio">$${producto.valor.toLocaleString()}</p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderizarProductosRecientes(productosData) {
    if (!productosData?.success) return;
    this.renderizarListaProductos('productosRecientes', productosData.data, 'Productos Recientemente Agregados');
  }

  renderizarProductosMejorPrecio(productosData) {
    if (!productosData?.success) return;
    this.renderizarListaProductos('productosMejorPrecio', productosData.data, 'Ofertas y Mejores Precios');
  }

  renderizarProductosTopCliente(productosData) {
    if (!productosData?.success) return;
    this.renderizarListaProductos('productosTopCliente', productosData.data, 'Tus Productos Más Comprados');
  }

  renderizarProductosPopulares(productosData) {
    if (!productosData?.success) return;
    this.renderizarListaProductos('productosPopulares', productosData.data, 'Productos Populares');
  }

  renderizarListaProductos(containerId, productos, titulo) {
    const container = document.getElementById(containerId);
    if (!container || !productos) return;

    container.innerHTML = `
      <h3>${titulo}</h3>
      <div class="productos-grid-analytics">
        ${productos.map(producto => this.crearCardProducto(producto)).join('')}
      </div>
    `;
  }

  crearCardProducto(producto) {
    // Validar y formatear precios de forma segura
    const precioActual = producto.valor || producto.precio_actual || 0;
    const descuentoPromedio = producto.descuento_promedio || 0;
    const precioConDescuento = producto.precio_con_descuento_promedio || (precioActual - descuentoPromedio);
    
    // Crear badges informativos
    const descuentoInfo = descuentoPromedio > 0 ? 
      `<div class="descuento-badge">-${Math.round((descuentoPromedio / precioActual) * 100)}%</div>` : '';
    
    const vecesComprado = producto.veces_comprado ? 
      `<div class="comprado-badge">Comprado ${producto.veces_comprado} veces</div>` : '';
    
    const popularidad = producto.total_unidades_vendidas ? 
      `<div class="popularidad-badge">${producto.total_unidades_vendidas} vendidos</div>` : '';

    // Validar imagen
    const imagenProducto = producto.imagen || 'placeholder.jpg';
    
    return `
      <div class="producto-card-analytics" data-id="${producto.idProducto}">
        ${descuentoInfo}
        ${vecesComprado}
        ${popularidad}
        <div class="producto-imagen">
          <img src="img/${imagenProducto}" alt="${producto.nombreProducto || 'Producto'}" 
               onerror="this.src='img/placeholder.jpg'">
        </div>
        <div class="producto-info">
          <h4>${producto.nombreProducto || 'Producto sin nombre'}</h4>
          <p class="producto-descripcion">${producto.informacion || 'Sin descripción disponible'}</p>
          <div class="producto-precio">
            ${descuentoPromedio > 0 ? `
              <span class="precio-original">$${precioActual.toLocaleString()}</span>
              <span class="precio-descuento">$${Math.round(precioConDescuento).toLocaleString()}</span>
            ` : `
              <span class="precio-normal">$${precioActual.toLocaleString()}</span>
            `}
          </div>
          <div class="producto-stock">
            <span class="badge ${(producto.cantidad || 0) > 0 ? 'stock-disponible' : 'stock-agotado'}">
              ${(producto.cantidad || 0) > 0 ? 'En stock' : 'Agotado'}
            </span>
          </div>
        </div>
      </div>
    `;
}

  renderizarTendenciasCompra(tendenciasData) {
    if (!tendenciasData?.success || !tendenciasData.data) return;
    
    const container = document.getElementById('tendenciasCompra');
    if (!container) return;

    // Crear gráfico simple con CSS
    const meses = tendenciasData.data.map(t => t.mes);
    const pedidos = tendenciasData.data.map(t => t.total_pedidos);
    const maxPedidos = Math.max(...pedidos, 1);
    
    container.innerHTML = `
      <h3>Tus Tendencias de Compra (Últimos ${tendenciasData.periodo_meses} meses)</h3>
      <div class="grafico-tendencias">
        <div class="grafico-barras">
          ${tendenciasData.data.map((tendencia, index) => `
            <div class="barra-container">
              <div class="barra" style="height: ${(tendencia.total_pedidos / maxPedidos) * 100}%">
                <span class="barra-valor">${tendencia.total_pedidos}</span>
              </div>
              <span class="barra-label">${tendencia.mes}</span>
            </div>
          `).join('')}
        </div>
      </div>
      <div class="estadisticas-tendencias">
        <div class="estadistica-tendencia">
          <span class="label">Pedidos este mes:</span>
          <span class="valor">${pedidos[0] || 0}</span>
        </div>
        <div class="estadistica-tendencia">
          <span class="label">Gasto promedio:</span>
          <span class="valor">$${Math.round(tendenciasData.data[0]?.ticket_promedio || 0).toLocaleString()}</span>
        </div>
      </div>
    `;
  }

  setupEventListeners() {
    // Event listeners para botones de agregar al carrito
    document.addEventListener('click', (e) => {
      if (e.target.closest('.btn-agregar-carrito')) {
        const button = e.target.closest('.btn-agregar-carrito');
        const productId = button.dataset.id;
        this.agregarAlCarrito(productId);
      }
    });

    // Event listeners para filtros y búsquedas
    const filtroPeriodo = document.getElementById('filtroPeriodo');
    if (filtroPeriodo) {
      filtroPeriodo.addEventListener('change', (e) => {
        this.filtrarPorPeriodo(e.target.value);
      });
    }
  }

  async agregarAlCarrito(productId) {
    try {
      // Aquí implementarías la lógica para agregar al carrito
      console.log(`Agregando producto ${productId} al carrito`);
      this.mostrarNotificacion('Producto agregado al carrito', 'success');
    } catch (error) {
      console.error('Error al agregar al carrito:', error);
      this.mostrarNotificacion('Error al agregar al carrito', 'error');
    }
  }

  async filtrarPorPeriodo(periodo) {
    try {
      this.mostrarLoading();
      
      const [productosTop, productosPopulares, tendencias] = await Promise.all([
        obtenerProductosTopCliente(this.idUsuario, 8, periodo),
        obtenerProductosPopularesCliente(this.idUsuario, 8, periodo),
        obtenerTendenciasCompraCliente(this.idUsuario, periodo.includes('MONTH') ? parseInt(periodo) : 6)
      ]);

      this.renderizarProductosTopCliente(productosTop);
      this.renderizarProductosPopulares(productosPopulares);
      this.renderizarTendenciasCompra(tendencias);
      
      this.ocultarLoading();
    } catch (error) {
      console.error('Error al filtrar por periodo:', error);
      this.mostrarError('Error al aplicar filtro');
    }
  }

  mostrarLoading() {
    // Implementar loading spinner
    const loading = document.getElementById('loadingSpinner');
    if (loading) loading.style.display = 'flex';
  }

  ocultarLoading() {
    const loading = document.getElementById('loadingSpinner');
    if (loading) loading.style.display = 'none';
  }

  mostrarError(mensaje) {
    // Implementar notificación de error
    console.error(mensaje);
    this.mostrarNotificacion(mensaje, 'error');
  }

  mostrarNotificacion(mensaje, tipo = 'info') {
    // Crear notificación toast
    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${tipo}`;
    toast.innerHTML = `
      <span class="toast-message">${mensaje}</span>
      <button class="toast-close">&times;</button>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    }, 3000);
    
    // Cerrar al hacer click
    toast.querySelector('.toast-close').addEventListener('click', () => {
      toast.classList.remove('show');
      setTimeout(() => {
        document.body.removeChild(toast);
      }, 300);
    });
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new AnalyticsCliente();
});

// Botón de volver al admin
    const btnVolver = document.getElementById('btnVolverAdmin');
    if (btnVolver) {
        btnVolver.addEventListener('click', () => {
            window.location.href = 'cliente.html';
        });
    }