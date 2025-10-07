import { obtainPedidos } from '../../Api/consumeApi.js';

document.addEventListener("DOMContentLoaded", () => {
    const tablaPedidosT = document.querySelector('#tablaPedidos')

    if (tablaPedidosT) {
        obtenerPedidos();
    }

})

async function obtenerPedidos() {
    try {
        const PedidosObtained = await obtainPedidos();
        const container = document.querySelector('#tablaPedidos');
        container.innerHTML = "";

        const pedidosArray = Array.isArray(PedidosObtained) 
            ? PedidosObtained 
            : PedidosObtained.pedidos || [];

        pedidosArray.forEach((pedido) => {
            const { idPedido, estado, infopersona, correo_electronico, fecha_pedido, fecha_actualizacion, idUsuario, Direccion, nombresProductos, subtotal, descuentos_totales, impuestos_totales, total } = pedido;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${idPedido}</td>
                <td>
                    ${estado}
                </td>
                <td>${infopersona}</td>
                <td>${correo_electronico}</td>
                <td>${Direccion}</td>
                <td>${nombresProductos}</td>
                <td>${new Date(fecha_pedido).toLocaleString()}</td>
                <td>${new Date(fecha_actualizacion).toLocaleString()}</td>
                <td>${subtotal}</td>
                <td>${descuentos_totales}</td>
                <td>${impuestos_totales}</td>
                <td>${total}%</td>
                <td>${idUsuario}</td>
            `;
            container.appendChild(row);
        });

       

    } catch (error) {
        console.error('Error al obtener pedidos:', error);
    }
}

