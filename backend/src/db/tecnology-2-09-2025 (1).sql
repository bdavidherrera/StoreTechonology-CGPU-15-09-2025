-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 15-09-2025 a las 03:37:57
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `tecnology-2-09-2025`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

CREATE TABLE `compra` (
  `idCompra` int(11) NOT NULL,
  `idProveedor` int(11) NOT NULL,
  `idProducto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL COMMENT 'Costo unitario del producto',
  `subtotal` decimal(10,2) NOT NULL COMMENT 'cantidad * precio_unitario',
  `valor_retefuente` decimal(10,2) DEFAULT 0.00 COMMENT 'Monto retenido al proveedor',
  `total_pagado` decimal(10,2) NOT NULL COMMENT 'subtotal - valor_retefuente',
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detallepedido`
--

CREATE TABLE `detallepedido` (
  `idDetallePedido` int(11) NOT NULL,
  `idPedido` int(11) NOT NULL,
  `idProducto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `precio_unitario` decimal(10,2) NOT NULL COMMENT 'Precio del producto al momento del pedido',
  `descuento_unitario` decimal(10,2) DEFAULT 0.00 COMMENT 'Descuento aplicado por unidad',
  `impuesto_unitario` decimal(10,2) DEFAULT 0.00 COMMENT 'Impuesto aplicado por unidad',
  `subtotal_linea` decimal(10,2) NOT NULL COMMENT 'Subtotal de la línea (cantidad * precio_unitario)',
  `total_linea` decimal(10,2) NOT NULL COMMENT 'Total final de la línea con descuentos e impuestos'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detallepedido`
--

INSERT INTO `detallepedido` (`idDetallePedido`, `idPedido`, `idProducto`, `cantidad`, `precio_unitario`, `descuento_unitario`, `impuesto_unitario`, `subtotal_linea`, `total_linea`) VALUES
(39, 30, 6, 1, 100000.00, 0.00, 19000.00, 100000.00, 119000.00),
(40, 30, 3, 1, 180000.00, 0.00, 34200.00, 180000.00, 214200.00),
(41, 30, 1, 1, 2500000.00, 0.00, 475000.00, 2500000.00, 2975000.00),
(42, 30, 4, 1, 180000.00, 0.00, 34200.00, 180000.00, 214200.00),
(43, 31, 4, 5, 180000.00, 18000.00, 30780.00, 900000.00, 963900.00),
(44, 32, 4, 4, 180000.00, 18000.00, 30780.00, 720000.00, 771120.00),
(45, 32, 1, 21, 2400040.00, 240004.00, 410406.84, 50400840.00, 53979299.64),
(46, 33, 9, 10, 20000000.00, 2000000.00, 3420000.00, 99999999.99, 99999999.99),
(47, 33, 1, 7, 2400040.00, 240004.00, 410406.84, 16800280.00, 17993099.88),
(48, 34, 9, 5, 20000000.00, 2000000.00, 3420000.00, 99999999.99, 99999999.99),
(49, 35, 9, 3, 20000000.00, 2000000.00, 3420000.00, 60000000.00, 64260000.00),
(50, 35, 1, 5, 2400040.00, 240004.00, 410406.84, 12000200.00, 12852214.20),
(51, 35, 3, 1, 180000.00, 0.00, 34200.00, 180000.00, 214200.00),
(52, 36, 2, 1, 45000.00, 0.00, 8550.00, 45000.00, 53550.00),
(53, 36, 1, 4, 2400040.00, 240004.00, 410406.84, 9600160.00, 10281771.36),
(54, 37, 9, 4, 20000000.00, 2000000.00, 3420000.00, 80000000.00, 85680000.00),
(55, 37, 1, 3, 2400030.00, 240003.00, 410405.13, 7200090.00, 7711296.39),
(56, 38, 1, 7, 2400030.00, 240003.00, 410405.13, 16800210.00, 17993024.91),
(57, 38, 9, 4, 20000000.00, 2000000.00, 3420000.00, 80000000.00, 85680000.00),
(58, 39, 1, 3, 2400030.00, 240003.00, 410405.13, 7200090.00, 7711296.39),
(59, 39, 9, 3, 20000000.00, 2000000.00, 3420000.00, 60000000.00, 64260000.00),
(60, 40, 1, 3, 2400030.00, 240003.00, 410405.13, 7200090.00, 7711296.39),
(61, 40, 9, 4, 20000000.00, 2000000.00, 3420000.00, 80000000.00, 85680000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `formaspago`
--

CREATE TABLE `formaspago` (
  `idFormaPago` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `fecha_creacion` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `formaspago`
--

INSERT INTO `formaspago` (`idFormaPago`, `nombre`, `descripcion`, `activo`, `fecha_creacion`) VALUES
(1, 'Mastercard', 'Tarjeta de crédito Mastercard', 1, '2025-08-14 21:00:00'),
(4, 'PayPal', 'Plataforma de pagos PayPal', 1, '2025-08-14 21:00:00'),
(7, 'Efectivo', 'Pago en efectivo', 1, '2025-08-14 21:00:00'),
(8, 'Transferencia Bancaria', 'Transferencia bancaria directa', 1, '2025-08-14 21:00:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gastos`
--

CREATE TABLE `gastos` (
  `idGasto` int(11) NOT NULL,
  `idProducto` int(11) NOT NULL,
  `descripcion` varchar(200) NOT NULL,
  `monto` decimal(10,2) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `categoria` varchar(100) DEFAULT 'General'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pagos`
--

CREATE TABLE `pagos` (
  `idPago` int(11) NOT NULL,
  `NombrePersona` varchar(100) NOT NULL,
  `Direccion` varchar(255) NOT NULL,
  `idFormaPago` int(11) NOT NULL,
  `Telefono` varchar(20) DEFAULT NULL,
  `correo_electronico` varchar(100) NOT NULL,
  `monto_subtotal` decimal(10,2) NOT NULL COMMENT 'Monto antes de impuestos y descuentos',
  `descuentos` decimal(10,2) DEFAULT 0.00 COMMENT 'Monto total de descuentos aplicados',
  `impuestos` decimal(10,2) DEFAULT 0.00 COMMENT 'Monto total de impuestos (IVA, etc.)',
  `monto_total` decimal(10,2) NOT NULL COMMENT 'Monto final a pagar (subtotal - descuentos + impuestos)',
  `fecha_pago` timestamp NULL DEFAULT current_timestamp(),
  `estado_pago` varchar(50) NOT NULL DEFAULT 'realizado',
  `idUsuario` int(11) DEFAULT NULL,
  `idPedido` int(11) DEFAULT NULL,
  `referencia_pago` varchar(100) DEFAULT NULL COMMENT 'Referencia del pago en la plataforma externa',
  `notas_pago` text DEFAULT NULL COMMENT 'Notas adicionales sobre el pago'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pagos`
--

INSERT INTO `pagos` (`idPago`, `NombrePersona`, `Direccion`, `idFormaPago`, `Telefono`, `correo_electronico`, `monto_subtotal`, `descuentos`, `impuestos`, `monto_total`, `fecha_pago`, `estado_pago`, `idUsuario`, `idPedido`, `referencia_pago`, `notas_pago`) VALUES
(29, 'Laura ', 'Calle 14 No 10-13', 4, '+573175527281', 'lestevez747@gmail.com', 2960000.00, 444000.00, 478040.00, 3009040.00, '2025-08-19 04:09:06', 'realizado', 10, 30, 'PAYPAL-2025-000030-1755576546315', 'Método de pago: paypal'),
(30, 'María García', 'Calle 14 No 10-13', 4, '+573175527281', 'maria.garcia@email.com', 900000.00, 180000.00, 138510.00, 963510.00, '2025-08-19 19:35:40', 'realizado', 2, 31, 'PAYPAL-2025-000031-1755632142671', 'Método de pago: paypal'),
(31, 'María García', 'Calle 14 No 10-13', 1, '+573175527281', 'maria.garcia@email.com', 51120840.00, 12780210.00, 7430414.09, 50898128.09, '2025-08-19 20:49:45', 'realizado', 2, 32, 'CREDITCARD-2025-000032-1755636585507', 'Método de pago: creditCard - Tarjeta terminada en 5544'),
(32, 'María García', 'Calle 14 No 10-13', 4, '+573175527281', 'maria.garcia@email.com', 99999999.99, 54200070.00, 31511920.70, 99999999.99, '2025-08-23 16:56:12', 'realizado', 2, 33, 'PAYPAL-2025-000033-1755968172668', 'Método de pago: paypal'),
(33, 'María García', 'Calle 14 No 10-13', 8, '+573175527281', 'maria.garcia@email.com', 99999999.99, 25000000.00, 14535000.00, 99550000.00, '2025-08-23 17:07:15', 'realizado', 2, 34, 'TRANSFER-2025-000034-1755968835644', 'Método de pago: transfer'),
(34, 'María García', 'Calle 14 No 10-13', 7, '+573175527281', 'maria.garcia@email.com', 72180200.00, 18027050.00, 10494299.07, 71862469.07, '2025-08-23 17:09:50', 'realizado', 2, 35, 'CASH-2025-000035-1755968990558', 'Método de pago: cash - Pago contra entrega'),
(35, 'María García', 'Calle 14 No 10-13', 1, '+573175527281', 'maria.garcia@email.com', 9645160.00, 2406790.00, 1402650.76, 9616036.76, '2025-08-23 17:14:20', 'realizado', 2, 36, 'CREDITCARD-2025-000036-1755969260452', 'Método de pago: creditCard - Tarjeta terminada en 9578'),
(36, 'María García', 'Calle 14 No 10-13', 8, '+573175527281', 'maria.garcia@email.com', 87200090.00, 21800022.50, 12674533.08, 86809609.58, '2025-08-23 17:15:55', 'realizado', 2, 37, 'TRANSFER-2025-000037-1755969355130', 'Método de pago: transfer'),
(37, 'Marta García', 'Calle 14 No 10-13', 8, '+573175527281', 'marta.garcia@email.com', 96800210.00, 24200052.50, 14069910.52, 96365089.02, '2025-08-23 17:18:29', 'realizado', 4, 38, 'TRANSFER-2025-000038-1755969509741', 'Método de pago: transfer'),
(38, 'María García', 'Calle 14 No 10-13', 8, '+573175527281', 'maria.garcia@email.com', 67200090.00, 16800022.50, 9767533.08, 66902609.58, '2025-08-23 17:29:00', 'realizado', 2, 39, 'TRANSFER-2025-000039-1755970140555', 'Método de pago: transfer'),
(39, 'María García', 'Calle 14 No 10-13', 4, '+573175527281', 'maria.garcia@email.com', 87200090.00, 21800022.50, 12674533.08, 86809609.58, '2025-08-23 17:31:55', 'realizado', 2, 40, 'PAYPAL-2025-000040-1755970315827', 'Método de pago: paypal');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `pedidos`
--

CREATE TABLE `pedidos` (
  `idPedido` int(11) NOT NULL,
  `estado` varchar(50) NOT NULL DEFAULT 'pendiente',
  `infopersona` varchar(200) NOT NULL,
  `correo_electronico` varchar(100) NOT NULL,
  `Direccion` varchar(255) NOT NULL,
  `nombresProductos` text NOT NULL,
  `fecha_pedido` timestamp NULL DEFAULT current_timestamp(),
  `fecha_actualizacion` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `subtotal` decimal(10,2) DEFAULT 0.00 COMMENT 'Total antes de impuestos y descuentos',
  `descuentos_totales` decimal(10,2) DEFAULT 0.00 COMMENT 'Descuentos aplicados al pedido',
  `impuestos_totales` decimal(10,2) DEFAULT 0.00 COMMENT 'Impuestos aplicados al pedido',
  `total` decimal(10,2) DEFAULT 0.00 COMMENT 'Total final del pedido',
  `idUsuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `pedidos`
--

INSERT INTO `pedidos` (`idPedido`, `estado`, `infopersona`, `correo_electronico`, `Direccion`, `nombresProductos`, `fecha_pedido`, `fecha_actualizacion`, `subtotal`, `descuentos_totales`, `impuestos_totales`, `total`, `idUsuario`) VALUES
(30, 'enviado', 'Laura  - CC: 1096063688', 'lestevez747@gmail.com', 'Calle 14 No 10-13', 'AirPods Pro (1), iPad Pro (1), iPhone 15 Pro (1), Macbook (1)', '2025-08-19 04:09:04', '2025-08-19 04:09:40', 2960000.00, 444000.00, 478040.00, 3009040.00, 10),
(31, 'enviado', 'María García - CC: 87654321', 'maria.garcia@email.com', 'Calle 14 No 10-13', 'Macbook (5)', '2025-08-19 19:35:40', '2025-08-23 17:31:29', 900000.00, 180000.00, 138510.00, 963510.00, 2),
(32, 'enviado', 'María García - CC: 87654321', 'maria.garcia@email.com', 'Calle 14 No 10-13', 'Macbook (4), iPhone 15 Pro (21)', '2025-08-19 20:49:44', '2025-08-19 20:50:21', 51120840.00, 12780210.00, 7430414.09, 50898128.09, 2),
(33, 'enviado', 'María García - CC: 87654321', 'maria.garcia@email.com', 'Calle 14 No 10-13', 'Samsung Galaxy S25 (10), iPhone 15 Pro (7)', '2025-08-23 16:56:12', '2025-08-23 17:15:09', 99999999.99, 54200070.00, 31511920.70, 99999999.99, 2),
(34, 'enviado', 'María García - CC: 87654321', 'maria.garcia@email.com', 'Calle 14 No 10-13', 'Samsung Galaxy S25 (5)', '2025-08-23 17:07:15', '2025-08-23 17:08:38', 99999999.99, 25000000.00, 14535000.00, 99550000.00, 2),
(35, 'enviado', 'María García - CC: 87654321', 'maria.garcia@email.com', 'Calle 14 No 10-13', 'Samsung Galaxy S25 (3), iPhone 15 Pro (5), iPad Pro (1)', '2025-08-23 17:09:50', '2025-08-23 17:16:28', 72180200.00, 18027050.00, 10494299.07, 71862469.07, 2),
(36, 'enviado', 'María García - CC: 87654321', 'maria.garcia@email.com', 'Calle 14 No 10-13', 'Apple_Watch (1), iPhone 15 Pro (4)', '2025-08-23 17:14:20', '2025-08-23 17:16:30', 9645160.00, 2406790.00, 1402650.76, 9616036.76, 2),
(37, 'enviado', 'María García - CC: 87654321', 'maria.garcia@email.com', 'Calle 14 No 10-13', 'Samsung Galaxy S25 (4), iPhone 16 Pro (3)', '2025-08-23 17:15:55', '2025-08-23 17:16:32', 87200090.00, 21800022.50, 12674533.08, 86809609.58, 2),
(38, 'enviado', 'Marta García - CC: 1096063677', 'marta.garcia@email.com', 'Calle 14 No 10-13', 'iPhone 16 Pro (7), Samsung Galaxy S25 (4)', '2025-08-23 17:18:29', '2025-08-23 17:31:34', 96800210.00, 24200052.50, 14069910.52, 96365089.02, 4),
(39, 'enviado', 'María García - CC: 87654321', 'maria.garcia@email.com', 'Calle 14 No 10-13', 'iPhone 16 Pro (3), Samsung Galaxy S25 (3)', '2025-08-23 17:29:00', '2025-08-23 17:31:35', 67200090.00, 16800022.50, 9767533.08, 66902609.58, 2),
(40, 'enviado', 'María García - CC: 87654321', 'maria.garcia@email.com', 'Calle 14 No 10-13', 'iPhone 16 Pro (3), Samsung Galaxy S25 (4)', '2025-08-23 17:31:55', '2025-08-23 17:32:10', 87200090.00, 21800022.50, 12674533.08, 86809609.58, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `idProducto` int(11) NOT NULL,
  `nombreProducto` varchar(100) NOT NULL,
  `imagen` varchar(100) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 0,
  `informacion` text DEFAULT NULL,
  `fecha_creacion` timestamp NULL DEFAULT current_timestamp(),
  `activo` tinyint(1) DEFAULT 1,
  `porcentaje_impuesto` decimal(5,2) DEFAULT 19.00 COMMENT 'Porcentaje de IVA aplicable al producto',
  `precio_costo` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Costo del producto para la empresa',
  `precio_venta` decimal(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Precio de venta sugerido al cliente',
  `idProveedor` int(11) DEFAULT NULL,
  `porcentaje_retefuente` decimal(5,2) DEFAULT 0.00 COMMENT 'ReteFuente si aplica al producto'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto`
--

INSERT INTO `producto` (`idProducto`, `nombreProducto`, `imagen`, `valor`, `cantidad`, `informacion`, `fecha_creacion`, `activo`, `porcentaje_impuesto`, `precio_costo`, `precio_venta`, `idProveedor`, `porcentaje_retefuente`) VALUES
(1, 'iPhone 16 Pro', 'Samsung_Galaxy_S24.jpg', 2400030.00, 349, 'iPhome de 15 pulgadas, 16GB RAM, 566GB SSD', '2025-08-13 02:30:53', 1, NULL, 0.00, 0.00, NULL, 0.00),
(2, 'Apple_Watch', 'Apple_Watch_Ultra.webp', 45000.00, 0, 'Reloj inteligente resistente para deportes extremos', '2025-08-13 02:30:53', 1, 19.00, 0.00, 0.00, NULL, 0.00),
(3, 'iPad Pro', 'iPad Pro 12.9.webp', 180000.00, 0, 'Tablet profesional con pantalla Liquid Retina XDR', '2025-08-13 02:30:53', 1, 19.00, 0.00, 0.00, NULL, 0.00),
(4, 'Macbook', 'Macbook-air-m2.jpeg', 180000.00, 0, 'Laptop ultradelgada con chip M2 y batería de larga duración\"', '2025-08-17 21:45:13', 1, 19.00, 0.00, 0.00, NULL, 0.00),
(5, 'Samsung Galaxy S25', 'Samsung_Galaxy_S24.jpg', 800000.00, 100, 'Muy buen celular Lo compro Manuel Isaac Gomes Galvis', '2025-08-18 02:28:31', 0, NULL, 0.00, 0.00, NULL, 0.00),
(6, 'AirPods Pro', 'AirPods_Pro.png', 100000.00, 6, 'Muy buenos', '2025-08-18 02:36:31', 0, 19.00, 0.00, 0.00, NULL, 0.00),
(7, 'Samsung Galaxy S28', 'Samsung_Galaxy_S24.jpg', 1000000.00, 20, 'Muy bueno producto recomendado', '2025-08-19 03:08:28', 0, 19.00, 0.00, 0.00, NULL, 0.00),
(8, 'iPhone 15 Pro Max', 'Samsung_Galaxy_S24.jpg', 50000.00, 1000, '300 GB y 500 RAM', '2025-08-19 19:34:59', 0, 19.00, 0.00, 0.00, NULL, 0.00),
(9, 'Samsung Galaxy S25', 'Samsung_Galaxy_S24.jpg', 20000000.00, 9967, 'Muy bueno recomendado', '2025-08-19 20:46:00', 1, 19.00, 0.00, 0.00, NULL, 0.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedor`
--

CREATE TABLE `proveedor` (
  `idProveedor` int(11) NOT NULL,
  `nombre` varchar(150) NOT NULL,
  `nit` varchar(50) NOT NULL,
  `direccion` varchar(200) DEFAULT NULL,
  `telefono` varchar(50) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  `porcentaje_retefuente` decimal(5,2) DEFAULT 0.00 COMMENT 'Porcentaje de retefuente aplicable a este proveedor'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedor`
--

INSERT INTO `proveedor` (`idProveedor`, `nombre`, `nit`, `direccion`, `telefono`, `correo`, `porcentaje_retefuente`) VALUES
(1, 'Brayan Jimenez', '1096063677', 'Calle 14 No 10-13 ', '3022762284', 'bdavid@gmail.com', 2.50);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `idUsuario` int(11) NOT NULL,
  `cedula` varchar(20) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `correo` text NOT NULL,
  `direccion` text NOT NULL,
  `telefono` text NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(50) NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT current_timestamp(),
  `activo` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`idUsuario`, `cedula`, `nombre`, `correo`, `direccion`, `telefono`, `password`, `rol`, `fecha_creacion`, `activo`) VALUES
(1, '12345678', 'Juan Pérez', 'JuanPerez@email.com', 'Calle 14 No 10-13', '+573175527281', 'Juan', 'admin', '2025-08-13 02:30:53', 1),
(2, '87654321', 'María García', 'maria.garcia@email.com', 'Calle 14 No 10-13', '+573175527281', 'María', 'cliente', '2025-08-13 02:30:53', 1),
(4, '1096063677', 'Marta García', 'marta.garcia@email.com', 'Calle 14 No 10-13', '+573175527281', 'Marta', 'cliente', '2025-08-14 18:01:30', 1),
(5, '1096063633', 'Brayan David Herrera Barajas', 'bherrerabarajs@gmail.com', 'Calle 14 No 10-13', '+573175527281', 'Laurayluis87', 'admin', '2025-08-16 16:40:50', 1),
(10, '1096063688', 'Laura ', 'lestevez747@gmail.com', 'Calle 14 No 10-13', '+573175527281', '123456789', 'cliente', '2025-08-19 00:23:36', 1),
(12, '1096063366', 'Juan Camilo', 'Juan@gmail.com', 'Calle 14 No 10-13', '3022762284', '123456789', 'cliente', '2025-08-19 20:41:58', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `idVenta` int(11) NOT NULL,
  `idPedido` int(11) NOT NULL,
  `idUsuario` int(11) DEFAULT NULL,
  `monto_subtotal` decimal(10,2) NOT NULL COMMENT 'Monto antes de descuentos e impuestos',
  `descuentos` decimal(10,2) DEFAULT 0.00 COMMENT 'Monto total de descuentos',
  `impuestos` decimal(10,2) DEFAULT 0.00 COMMENT 'Monto total de impuestos',
  `monto_total` decimal(10,2) NOT NULL COMMENT 'Monto final de la venta',
  `fecha_venta` timestamp NULL DEFAULT current_timestamp(),
  `estado_venta` varchar(50) DEFAULT 'confirmada' COMMENT 'confirmada, anulada, pendiente',
  `costo_total` decimal(10,2) DEFAULT 0.00 COMMENT 'Suma de costos de los productos vendidos',
  `utilidad` decimal(10,2) DEFAULT 0.00 COMMENT 'Ganancia neta de la venta',
  `retencion_fuente` decimal(10,2) DEFAULT 0.00 COMMENT 'Retención en la fuente aplicada',
  `aplica_retefuente` tinyint(1) DEFAULT 0 COMMENT '1 = sí, el comprador aplicó retefuente'
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`idVenta`, `idPedido`, `idUsuario`, `monto_subtotal`, `descuentos`, `impuestos`, `monto_total`, `fecha_venta`, `estado_venta`, `costo_total`, `utilidad`, `retencion_fuente`, `aplica_retefuente`) VALUES
(1, 33, 2, 99999999.99, 54200070.00, 31511920.70, 99999999.99, '2025-08-23 16:56:12', 'confirmada', 0.00, 0.00, 0.00, 0),
(2, 34, 2, 99999999.99, 25000000.00, 14535000.00, 99550000.00, '2025-08-23 17:07:15', 'confirmada', 0.00, 0.00, 0.00, 0),
(3, 35, 2, 72180200.00, 18027050.00, 10494299.07, 71862469.07, '2025-08-23 17:09:50', 'confirmada', 0.00, 0.00, 0.00, 0),
(4, 36, 2, 9645160.00, 2406790.00, 1402650.76, 9616036.76, '2025-08-23 17:14:20', 'confirmada', 0.00, 0.00, 0.00, 0),
(5, 37, 2, 87200090.00, 21800022.50, 12674533.08, 86809609.58, '2025-08-23 17:15:55', 'confirmada', 0.00, 0.00, 0.00, 0),
(6, 38, 4, 96800210.00, 24200052.50, 14069910.52, 96365089.02, '2025-08-23 17:18:29', 'confirmada', 0.00, 0.00, 0.00, 0),
(7, 39, 2, 67200090.00, 16800022.50, 9767533.08, 66902609.58, '2025-08-23 17:29:00', 'confirmada', 0.00, 0.00, 0.00, 0),
(8, 31, 2, 900000.00, 180000.00, 138510.00, 963510.00, '2025-08-23 17:31:29', 'confirmada', 0.00, 0.00, 0.00, 0),
(9, 40, 2, 87200090.00, 21800022.50, 12674533.08, 86809609.58, '2025-08-23 17:31:55', 'confirmada', 0.00, 0.00, 0.00, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`idCompra`),
  ADD KEY `idProveedor` (`idProveedor`),
  ADD KEY `idProducto` (`idProducto`);

--
-- Indices de la tabla `detallepedido`
--
ALTER TABLE `detallepedido`
  ADD PRIMARY KEY (`idDetallePedido`),
  ADD KEY `idPedido` (`idPedido`),
  ADD KEY `idProducto` (`idProducto`);

--
-- Indices de la tabla `formaspago`
--
ALTER TABLE `formaspago`
  ADD PRIMARY KEY (`idFormaPago`),
  ADD UNIQUE KEY `nombre` (`nombre`),
  ADD KEY `idx_formas_pago_activo` (`activo`);

--
-- Indices de la tabla `gastos`
--
ALTER TABLE `gastos`
  ADD PRIMARY KEY (`idGasto`),
  ADD KEY `idProducto` (`idProducto`);

--
-- Indices de la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD PRIMARY KEY (`idPago`),
  ADD KEY `idUsuario` (`idUsuario`),
  ADD KEY `idPedido` (`idPedido`),
  ADD KEY `idFormaPago` (`idFormaPago`),
  ADD KEY `idx_pagos_estado` (`estado_pago`),
  ADD KEY `idx_pagos_fecha` (`fecha_pago`),
  ADD KEY `idx_pagos_referencia` (`referencia_pago`);

--
-- Indices de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD PRIMARY KEY (`idPedido`),
  ADD KEY `idUsuario` (`idUsuario`),
  ADD KEY `idx_pedidos_estado` (`estado`),
  ADD KEY `idx_pedidos_fecha` (`fecha_pedido`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`idProducto`),
  ADD KEY `idx_producto_nombre` (`nombreProducto`),
  ADD KEY `idx_producto_activo` (`activo`),
  ADD KEY `fk_producto_proveedor` (`idProveedor`);

--
-- Indices de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  ADD PRIMARY KEY (`idProveedor`),
  ADD UNIQUE KEY `nit` (`nit`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`idUsuario`),
  ADD UNIQUE KEY `cedula` (`cedula`),
  ADD KEY `idx_usuario_cedula` (`cedula`),
  ADD KEY `idx_usuario_rol` (`rol`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`idVenta`),
  ADD KEY `idx_ventas_fecha` (`fecha_venta`),
  ADD KEY `idx_ventas_usuario` (`idUsuario`),
  ADD KEY `Ventas_ibfk_1` (`idPedido`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `compra`
--
ALTER TABLE `compra`
  MODIFY `idCompra` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `detallepedido`
--
ALTER TABLE `detallepedido`
  MODIFY `idDetallePedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=62;

--
-- AUTO_INCREMENT de la tabla `formaspago`
--
ALTER TABLE `formaspago`
  MODIFY `idFormaPago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `gastos`
--
ALTER TABLE `gastos`
  MODIFY `idGasto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `pagos`
--
ALTER TABLE `pagos`
  MODIFY `idPago` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT de la tabla `pedidos`
--
ALTER TABLE `pedidos`
  MODIFY `idPedido` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `idProducto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `proveedor`
--
ALTER TABLE `proveedor`
  MODIFY `idProveedor` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `idUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `idVenta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`idProveedor`) REFERENCES `proveedor` (`idProveedor`) ON DELETE CASCADE,
  ADD CONSTRAINT `compra_ibfk_2` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`idProducto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `detallepedido`
--
ALTER TABLE `detallepedido`
  ADD CONSTRAINT `DetallePedido_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `pedidos` (`idPedido`) ON DELETE CASCADE,
  ADD CONSTRAINT `DetallePedido_ibfk_2` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`idProducto`);

--
-- Filtros para la tabla `gastos`
--
ALTER TABLE `gastos`
  ADD CONSTRAINT `gastos_ibfk_1` FOREIGN KEY (`idProducto`) REFERENCES `producto` (`idProducto`) ON DELETE CASCADE;

--
-- Filtros para la tabla `pagos`
--
ALTER TABLE `pagos`
  ADD CONSTRAINT `Pagos_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE SET NULL,
  ADD CONSTRAINT `Pagos_ibfk_2` FOREIGN KEY (`idPedido`) REFERENCES `pedidos` (`idPedido`) ON DELETE CASCADE,
  ADD CONSTRAINT `Pagos_ibfk_3` FOREIGN KEY (`idFormaPago`) REFERENCES `formaspago` (`idFormaPago`);

--
-- Filtros para la tabla `pedidos`
--
ALTER TABLE `pedidos`
  ADD CONSTRAINT `Pedidos_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE SET NULL;

--
-- Filtros para la tabla `producto`
--
ALTER TABLE `producto`
  ADD CONSTRAINT `fk_producto_proveedor` FOREIGN KEY (`idProveedor`) REFERENCES `proveedor` (`idProveedor`) ON DELETE SET NULL;

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `Ventas_ibfk_1` FOREIGN KEY (`idPedido`) REFERENCES `pedidos` (`idPedido`) ON DELETE CASCADE,
  ADD CONSTRAINT `Ventas_ibfk_2` FOREIGN KEY (`idUsuario`) REFERENCES `usuario` (`idUsuario`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
