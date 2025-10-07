// =============================================
// 📊 VISUAL ANALYTICS - FRONTEND LOGIC CORREGIDO
// =============================================

import {
    obtenerResumenGeneralAnalytics,
    obtenerVentasPorMesAnalytics,
    obtenerProductosMasVendidosAnalytics,
    obtenerAnalisisRentabilidadAnalytics,
    obtenerClientesTopAnalytics,
    obtenerTendenciasInventarioAnalytics,
    obtenerMetodosPagoAnalytics,
    obtenerGastosPorCategoriaAnalytics,
    obtenerComparacionPeriodicaAnalytics,
    obtenerKPIsAnalytics
} from '../Api/consumeApi.js';

// Variables globales para los gráficos
let chartVentasMensuales = null;
let chartProductosTop = null;
let chartRentabilidad = null;
let chartMetodosPago = null;
let chartGastos = null;
let chartInventario = null;

// =============================================
// 🎯 INICIALIZACIÓN
// =============================================
document.addEventListener('DOMContentLoaded', async () => {
    // Verificar sesión de administrador
    const role = sessionStorage.getItem("rol");
    if (!role || role !== "admin") {
        alert("Debes iniciar sesión como administrador para acceder a esta página.");
        window.location.href = "login.html";
        return;
    }

    // Mostrar loader
    mostrarLoader(true);

    try {
        // Cargar todos los datos
        await cargarResumenGeneral();
        await cargarKPIs();
        await cargarComparacionPeriodica();
        await cargarVentasMensuales();
        await cargarProductosTop();
        await cargarAnalisisRentabilidad();
        await cargarClientesTop();
        await cargarMetodosPago();
        await cargarGastosPorCategoria();
        await cargarInventario();

        console.log('✅ Dashboard de Analytics cargado exitosamente');
    } catch (error) {
        console.error('❌ Error al cargar el dashboard:', error);
        mostrarError('Error al cargar los datos del dashboard');
    } finally {
        mostrarLoader(false);
    }

    // Configurar botones
    configurarEventos();
});

// =============================================
// 📊 RESUMEN GENERAL - CORREGIDO
// =============================================
const cargarResumenGeneral = async () => {
    try {
        console.log('📊 Cargando resumen general...');
        const response = await obtenerResumenGeneralAnalytics();
        
        if (response.success) {
            const data = response.data;
            console.log('Datos resumen general:', data);
            
            // Actualizar tarjetas de resumen con verificación de elementos
            actualizarElementoSiExiste('totalVentas', data.ventas?.total_ventas || 0);
            actualizarElementoSiExiste('ingresosTotales', formatearMoneda(data.ventas?.ingresos_totales || 0));
            actualizarElementoSiExiste('ticketPromedio', formatearMoneda(data.ventas?.ticket_promedio || 0));
            actualizarElementoSiExiste('utilidadTotal', formatearMoneda(data.ventas?.utilidad_total || 0));
            
            actualizarElementoSiExiste('totalClientes', data.clientes?.total_clientes || 0);
            actualizarElementoSiExiste('totalProductos', data.productos?.total_productos || 0);
            actualizarElementoSiExiste('stockTotal', data.productos?.stock_total || 0);
            actualizarElementoSiExiste('valorInventario', formatearMoneda(data.productos?.valor_inventario || 0));
            
            actualizarElementoSiExiste('totalPedidos', data.pedidos?.total_pedidos || 0);
            actualizarElementoSiExiste('pedidosEntregados', data.pedidos?.entregados || 0);
        } else {
            console.error('Error en respuesta del resumen general:', response.error);
        }
    } catch (error) {
        console.error('Error al cargar resumen general:', error);
    }
};

// =============================================
// 🎯 KPIs PRINCIPALES - CORREGIDO
// =============================================
// =============================================
// 🎯 KPIs PRINCIPALES - Ajuste valores
// =============================================
const cargarKPIs = async () => {
    try {
        console.log('🎯 Cargando KPIs...');
        const response = await obtenerKPIsAnalytics();
        
        if (response.success) {
            const data = response.data;

            // Tasa de conversión: entre 0% y 100%
            let tasaConversion = Number(data.tasa_conversion || 0);
            tasaConversion = Math.max(0, Math.min(100, tasaConversion));
            if (tasaConversion > 0 && tasaConversion < 0.1) tasaConversion = 0.1;

            

            actualizarElementoSiExiste('tasaConversion', `${tasaConversion.toFixed(1)}%`);
            actualizarElementoSiExiste('valorPromedioOrden', formatearMoneda(data.valor_promedio_orden || 0));

           
        }
    } catch (error) {
        console.error('Error al cargar KPIs:', error);
    }
};


// =============================================
// 📈 COMPARACIÓN PERIÓDICA - CORREGIDO
// =============================================
const cargarComparacionPeriodica = async () => {
    try {
        console.log('📈 Cargando comparación periódica...');
        const response = await obtenerComparacionPeriodicaAnalytics();
        
        if (response.success) {
            const data = response.data;
            console.log('Datos comparación:', data);
            
            // Actualizar valores con verificación
            actualizarElementoSiExiste('ventasMesActual', data.mes_actual?.ventas || 0);
            actualizarElementoSiExiste('ingresosMesActual', formatearMoneda(data.mes_actual?.ingresos || 0));
            
            // Mostrar cambios porcentuales con límites razonables
            const cambioVentas = Math.max(-100, Math.min(100, data.cambios?.ventas || 0));
            const cambioIngresos = Math.max(-100, Math.min(100, data.cambios?.ingresos || 0));
            
            mostrarCambio('cambioVentas', cambioVentas);
            mostrarCambio('cambioIngresos', cambioIngresos);
        }
    } catch (error) {
        console.error('Error al cargar comparación periódica:', error);
    }
};

// =============================================
// 📊 VENTAS MENSUALES (GRÁFICO DE LÍNEA) - CORREGIDO
// =============================================
const cargarVentasMensuales = async () => {
    try {
        console.log('📊 Cargando ventas mensuales...');
        const response = await obtenerVentasPorMesAnalytics();
        
        if (response.success && response.data && response.data.length > 0) {
            const datos = response.data;
            console.log('Datos ventas mensuales:', datos);
            
            const labels = datos.map(item => formatearMes(item.mes));
            const ventas = datos.map(item => Math.max(0, item.total_ventas || 0));
            const utilidad = datos.map(item => item.utilidad || 0);
            
            const ctx = document.getElementById('chartVentasMensuales');
            if (!ctx) {
                console.error('Canvas chartVentasMensuales no encontrado');
                return;
            }
            
            if (chartVentasMensuales) {
                chartVentasMensuales.destroy();
            }
            
            chartVentasMensuales = new Chart(ctx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Ventas',
                        data: ventas,
                        borderColor: 'rgb(102, 126, 234)',
                        backgroundColor: 'rgba(102, 126, 234, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }, {
                        label: 'Utilidad',
                        data: utilidad,
                        borderColor: 'rgb(28, 200, 138)',
                        backgroundColor: 'rgba(28, 200, 138, 0.1)',
                        borderWidth: 3,
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        },
                        tooltip: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                label: function(context) {
                                    return `${context.dataset.label}: ${formatearMoneda(context.parsed.y)}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return formatearMonedaCorta(value);
                                }
                            }
                        }
                    }
                }
            });
        } else {
            console.log('No hay datos de ventas mensuales disponibles');
        }
    } catch (error) {
        console.error('Error al cargar ventas mensuales:', error);
    }
};

// =============================================
// 📦 PRODUCTOS MÁS VENDIDOS - CORREGIDO
// =============================================
const cargarProductosTop = async () => {
    try {
        console.log('📦 Cargando productos más vendidos...');
        const response = await obtenerProductosMasVendidosAnalytics();
        
        if (response.success && response.data && response.data.length > 0) {
            const productos = response.data.slice(0, 10);
            console.log('Productos top:', productos);
            
            // Tabla de productos
            const tbody = document.getElementById('tablaProductosTop');
            if (tbody) {
                tbody.innerHTML = productos.map((producto, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td>
                            <div class="d-flex align-items-center">
                                ${producto.imagen ? 
                                    `<img src="img/${producto.imagen}" alt="${producto.nombreProducto}" 
                                     style="width: 40px; height: 40px; object-fit: cover; border-radius: 5px; margin-right: 10px;">` 
                                    : '<i class="fas fa-box" style="font-size: 1.5rem; margin-right: 10px;"></i>'
                                }
                                <strong>${producto.nombreProducto || 'Producto sin nombre'}</strong>
                            </div>
                        </td>
                        <td><span class="badge bg-primary">${producto.cantidad_vendida || 0}</span></td>
                        <td>${formatearMoneda(producto.ingresos_generados || 0)}</td>
                        <td>${producto.num_pedidos || 0}</td>
                    </tr>
                `).join('');
            }
            
            // Gráfico de barras (solo top 5)
            const ctx = document.getElementById('chartProductosTop');
            if (ctx) {
                if (chartProductosTop) {
                    chartProductosTop.destroy();
                }
                
                const top5 = productos.slice(0, 5);
                
                chartProductosTop = new Chart(ctx.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: top5.map(p => p.nombreProducto || 'Producto'),
                        datasets: [{
                            label: 'Unidades Vendidas',
                            data: top5.map(p => p.cantidad_vendida || 0),
                            backgroundColor: 'rgba(102, 126, 234, 0.8)',
                            borderColor: 'rgb(102, 126, 234)',
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        } else {
            console.log('No hay datos de productos más vendidos');
            const tbody = document.getElementById('tablaProductosTop');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">No hay datos disponibles</td></tr>';
            }
        }
    } catch (error) {
        console.error('Error al cargar productos top:', error);
    }
};

// =============================================
// 💰 ANÁLISIS DE RENTABILIDAD - CORREGIDO
// =============================================
const cargarAnalisisRentabilidad = async () => {
    try {
        console.log('💰 Cargando análisis de rentabilidad...');
        const response = await obtenerAnalisisRentabilidadAnalytics();
        
        if (response.success) {
            const data = response.data;
            console.log('Datos rentabilidad:', data);
            
            // Asegurar que la utilidad neta no sea extremadamente negativa
            const utilidadNeta = data.utilidad_neta || 0;
            actualizarElementoSiExiste('utilidadNeta', formatearMoneda(utilidadNeta));
            
            // Aplicar color según la utilidad
            const utilidadElement = document.getElementById('utilidadNeta');
            if (utilidadElement) {
                utilidadElement.className = `text-${utilidadNeta >= 0 ? 'success' : 'danger'}`;
            }
            
            // Gráfico de dona
            const ctx = document.getElementById('chartRentabilidad');
            if (ctx) {
                if (chartRentabilidad) {
                    chartRentabilidad.destroy();
                }
                
                // Asegurar valores positivos para el gráfico
                const ingresos = Math.max(0, data.ingresos?.ingresos_totales || 0);
                const compras = Math.max(0, data.costos?.compras || 0);
                const gastos = Math.max(0, data.costos?.gastos_operativos || 0);
                
                chartRentabilidad = new Chart(ctx.getContext('2d'), {
                    type: 'doughnut',
                    data: {
                        labels: ['Ingresos', 'Compras', 'Gastos Operativos'],
                        datasets: [{
                            data: [ingresos, compras, gastos],
                            backgroundColor: [
                                'rgba(28, 200, 138, 0.8)',
                                'rgba(231, 74, 59, 0.8)',
                                'rgba(246, 194, 62, 0.8)'
                            ],
                            borderColor: [
                                'rgb(28, 200, 138)',
                                'rgb(231, 74, 59)',
                                'rgb(246, 194, 62)'
                            ],
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'bottom'
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return `${context.label}: ${formatearMoneda(context.parsed)}`;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error al cargar análisis de rentabilidad:', error);
    }
};

// =============================================
// 👥 CLIENTES TOP - CORREGIDO
// =============================================
const cargarClientesTop = async () => {
    try {
        console.log('👥 Cargando clientes top...');
        const response = await obtenerClientesTopAnalytics();
        
        if (response.success && response.data && response.data.length > 0) {
            const tbody = document.getElementById('tablaClientesTop');
            if (tbody) {
                tbody.innerHTML = response.data.map((cliente, index) => `
                    <tr>
                        <td>${index + 1}</td>
                        <td><strong>${cliente.nombre || 'Cliente'}</strong></td>
                        <td><small>${cliente.correo || 'Sin correo'}</small></td>
                        <td><span class="badge bg-info">${cliente.num_compras || 0}</span></td>
                        <td>${formatearMoneda(cliente.total_gastado || 0)}</td>
                        <td>${formatearMoneda(cliente.ticket_promedio || 0)}</td>
                        <td><small>${formatearFecha(cliente.ultima_compra)}</small></td>
                    </tr>
                `).join('');
            }
        } else {
            console.log('No hay datos de clientes top');
            const tbody = document.getElementById('tablaClientesTop');
            if (tbody) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay datos disponibles</td></tr>';
            }
        }
    } catch (error) {
        console.error('Error al cargar clientes top:', error);
    }
};

// =============================================
// 💳 MÉTODOS DE PAGO - CORREGIDO
// =============================================
const cargarMetodosPago = async () => {
    try {
        console.log('💳 Cargando métodos de pago...');
        const response = await obtenerMetodosPagoAnalytics();
        
        if (response.success && response.data && response.data.length > 0) {
            const ctx = document.getElementById('chartMetodosPago');
            if (ctx) {
                if (chartMetodosPago) {
                    chartMetodosPago.destroy();
                }
                
                chartMetodosPago = new Chart(ctx.getContext('2d'), {
                    type: 'pie',
                    data: {
                        labels: response.data.map(m => m.metodo_pago || 'Método'),
                        datasets: [{
                            data: response.data.map(m => m.num_transacciones || 0),
                            backgroundColor: [
                                'rgba(102, 126, 234, 0.8)',
                                'rgba(28, 200, 138, 0.8)',
                                'rgba(246, 194, 62, 0.8)',
                                'rgba(231, 74, 59, 0.8)',
                                'rgba(54, 185, 204, 0.8)'
                            ],
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'right'
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                        const percentage = total > 0 ? ((context.parsed / total) * 100).toFixed(1) : 0;
                                        return `${context.label}: ${context.parsed} (${percentage}%)`;
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error al cargar métodos de pago:', error);
    }
};

// =============================================
// 💸 GASTOS POR CATEGORÍA - CORREGIDO
// =============================================
const cargarGastosPorCategoria = async () => {
    try {
        console.log('💸 Cargando gastos por categoría...');
        const response = await obtenerGastosPorCategoriaAnalytics();
        
        if (response.success && response.data && response.data.length > 0) {
            const ctx = document.getElementById('chartGastos');
            if (ctx) {
                if (chartGastos) {
                    chartGastos.destroy();
                }
                
                chartGastos = new Chart(ctx.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: response.data.map(g => g.categoria || 'Sin categoría'),
                        datasets: [{
                            label: 'Total Gastado',
                            data: response.data.map(g => Math.max(0, g.total_gastado || 0)),
                            backgroundColor: 'rgba(246, 194, 62, 0.8)',
                            borderColor: 'rgb(246, 194, 62)',
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            },
                            tooltip: {
                                callbacks: {
                                    label: function(context) {
                                        return `Total: ${formatearMoneda(context.parsed.y)}`;
                                    }
                                }
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return formatearMonedaCorta(value);
                                    }
                                }
                            }
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error al cargar gastos por categoría:', error);
    }
};

// =============================================
// 📊 INVENTARIO - CORREGIDO
// =============================================
const cargarInventario = async () => {
    try {
        console.log('📊 Cargando inventario...');
        const response = await obtenerTendenciasInventarioAnalytics();
        
        if (response.success && response.data && response.data.length > 0) {
            const top10 = response.data.slice(0, 10);
            
            const ctx = document.getElementById('chartInventario');
            if (ctx) {
                if (chartInventario) {
                    chartInventario.destroy();
                }
                
                chartInventario = new Chart(ctx.getContext('2d'), {
                    type: 'bar',
                    data: {
                        labels: top10.map(p => p.nombreProducto || 'Producto'),
                        datasets: [{
                            label: 'Stock Actual',
                            data: top10.map(p => Math.max(0, p.stock_actual || 0)),
                            backgroundColor: 'rgba(54, 185, 204, 0.8)',
                            borderColor: 'rgb(54, 185, 204)',
                            borderWidth: 2
                        }, {
                            label: 'Total Vendido',
                            data: top10.map(p => Math.max(0, p.total_vendido || 0)),
                            backgroundColor: 'rgba(102, 126, 234, 0.8)',
                            borderColor: 'rgb(102, 126, 234)',
                            borderWidth: 2
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: 'top'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            }
        }
    } catch (error) {
        console.error('Error al cargar inventario:', error);
    }
};

// =============================================
// 🔧 FUNCIONES AUXILIARES MEJORADAS
// =============================================

// Función segura para actualizar elementos
const actualizarElementoSiExiste = (elementId, valor) => {
    const elemento = document.getElementById(elementId);
    if (elemento) {
        elemento.textContent = valor;
    } else {
        console.warn(`Elemento con ID '${elementId}' no encontrado`);
    }
};

const limitarPorcentaje = (valor) => {
    let porcentaje = Number(valor) || 0;
    porcentaje = Math.max(0, Math.min(100, porcentaje)); // forzar rango 0-100
    return porcentaje.toFixed(1); // 1 decimal
};

const formatearMoneda = (valor) => {
    const numero = Number(valor) || 0;
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numero);
};

const formatearMonedaCorta = (valor) => {
    const numero = Number(valor) || 0;
    if (numero >= 1000000) {
        return `$${(numero / 1000000).toFixed(1)}M`;
    } else if (numero >= 1000) {
        return `$${(numero / 1000).toFixed(1)}K`;
    }
    return `$${Math.round(numero)}`;
};

const formatearMes = (mesString) => {
    if (!mesString) return 'Mes';
    try {
        const [year, month] = mesString.split('-');
        const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const mesIndex = parseInt(month) - 1;
        return `${meses[mesIndex] || month} ${year}`;
    } catch (error) {
        return mesString;
    }
};

const formatearFecha = (fechaString) => {
    if (!fechaString) return 'N/A';
    try {
        const fecha = new Date(fechaString);
        return fecha.toLocaleDateString('es-CO');
    } catch (error) {
        return fechaString;
    }
};

const mostrarCambio = (elementId, cambio) => {
    const elemento = document.getElementById(elementId);
    if (!elemento) {
        console.warn(`Elemento de cambio '${elementId}' no encontrado`);
        return;
    }
    
    const cambioNum = Number(cambio) || 0;
    const signo = cambioNum > 0 ? '+' : '';
    elemento.textContent = `${signo}${cambioNum.toFixed(1)}%`;
    
    // Aplicar clases de Bootstrap 5
    elemento.className = 'badge';
    if (cambioNum > 0) {
        elemento.classList.add('bg-success');
    } else if (cambioNum < 0) {
        elemento.classList.add('bg-danger');
    } else {
        elemento.classList.add('bg-secondary');
    }
};

const mostrarLoader = (mostrar) => {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = mostrar ? 'flex' : 'none';
    }
};

const mostrarError = (mensaje) => {
    console.error('Error en dashboard:', mensaje);
    // Podrías implementar notificaciones toast aquí
};

const configurarEventos = () => {
    // Botón de actualizar
    const btnActualizar = document.getElementById('btnActualizar');
    if (btnActualizar) {
        btnActualizar.addEventListener('click', async () => {
            mostrarLoader(true);
            try {
                await cargarResumenGeneral();
                await cargarVentasMensuales();
                await cargarProductosTop();
                await cargarAnalisisRentabilidad();
                console.log('✅ Datos actualizados');
            } catch (error) {
                console.error('❌ Error al actualizar:', error);
            } finally {
                mostrarLoader(false);
            }
        });
    }
    
    // Botón de exportar
    const btnExportar = document.getElementById('btnExportar');
    if (btnExportar) {
        btnExportar.addEventListener('click', () => {
            alert('Funcionalidad de exportación en desarrollo...');
        });
    }
};


 // Botón de volver al admin
    const btnVolver = document.getElementById('btnVolverAdmin');
    if (btnVolver) {
        btnVolver.addEventListener('click', () => {
            window.location.href = 'admin.html';
        });
    }