-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 06-06-2024 a las 14:09:16
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bd_foro`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `Borrar_Mensajes` (IN `_id_mensaje` INT, IN `_tem_id` INT)  Delete from mensajes where men_id = _id_mensaje and _tem_id = men_tem_id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `Borrar_Tema` (IN `_id_tema` INT)  delete from temas where tem_id = _id_tema$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `Buscar_Usuario` (IN `_user` VARCHAR(50), IN `_password` VARCHAR(50))  SELECT * FROM usuarios, fotos where _user = usu_user and md5(_password) = usu_password and usu_foto_id = foto_id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `Insertar_Mensajes` (IN `_texto` TEXT, IN `_id_usu` INT, IN `_id_tem` INT)  INSERT INTO mensajes VALUES (null, _texto, CURRENT_TIME(), _id_usu, _id_tem)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `Insertar_Tema` (IN `_nombre` VARCHAR(100))  INSERT INTO temas values (null, _nombre)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `Insertar_Usuario` (IN `_user` VARCHAR(50), IN `_password` VARCHAR(50))  INSERT INTO usuarios VALUES (null, _user, md5(_password), 1, 0)$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `Modificar_Foto` (IN `_id_foto` INT, IN `_user` VARCHAR(50))  Update usuarios set usu_foto_id = _id_foto where usu_user = _user$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `Modificar_Password` (IN `_password` VARCHAR(50), IN `_user` VARCHAR(50))  Update usuarios set usu_password = md5(_password) where usu_user = _user$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `Mostrar_Foto` (IN `_user` VARCHAR(50), IN `_password` VARCHAR(50))  SELECT * FROM usuarios, fotos where usu_user = _user and usu_password = md5(_password) and usu_foto_id = foto_id$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `Mostrar_Temas` ()  SELECT temas.*, COUNT(men_id) AS cuenta
FROM temas
LEFT JOIN mensajes ON tem_id = men_tem_id AND men_tem_id IS NOT NULL
GROUP BY tem_nombre$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fotos`
--

CREATE TABLE `fotos` (
  `foto_id` int(11) NOT NULL,
  `foto_nombre` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `fotos`
--

INSERT INTO `fotos` (`foto_id`, `foto_nombre`) VALUES
(1, 'anonimo.png'),
(2, 'u01.gif'),
(3, 'u02.gif'),
(4, 'u03.gif'),
(5, 'u04.gif'),
(6, 'u05.gif'),
(7, 'u06.gif'),
(8, 'u07.gif'),
(9, 'u08.gif'),
(10, 'u09.gif'),
(11, 'u10.gif'),
(12, 'u11.gif'),
(13, 'u12.gif'),
(14, 'u13.gif'),
(15, 'u14.gif'),
(16, 'u15.gif'),
(17, 'u16.gif');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mensajes`
--

CREATE TABLE `mensajes` (
  `men_id` int(11) NOT NULL,
  `men_texto` mediumtext NOT NULL,
  `men_fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `men_usu_id` int(11) NOT NULL,
  `men_tem_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `mensajes`
--

INSERT INTO `mensajes` (`men_id`, `men_texto`, `men_fecha`, `men_usu_id`, `men_tem_id`) VALUES
(89, 'SQL', '2024-06-06 10:35:28', 2, 3),
(90, 'JavaScript', '2024-06-06 10:35:52', 2, 18),
(91, 'CSS', '2024-06-06 10:35:52', 2, 17),
(92, 'Angular', '2024-06-06 10:36:13', 2, 6),
(93, 'React', '2024-06-06 10:36:13', 2, 5),
(95, 'HTML', '2024-06-06 10:43:01', 2, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `temas`
--

CREATE TABLE `temas` (
  `tem_id` int(11) NOT NULL,
  `tem_nombre` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `temas`
--

INSERT INTO `temas` (`tem_id`, `tem_nombre`) VALUES
(2, 'HTML'),
(3, 'SQL'),
(5, 'React'),
(6, 'Angular'),
(17, 'CSS'),
(18, 'JavaScript');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `usu_id` int(11) NOT NULL,
  `usu_user` varchar(50) NOT NULL,
  `usu_password` varchar(50) NOT NULL,
  `usu_foto_id` int(11) DEFAULT NULL,
  `usu_admin` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`usu_id`, `usu_user`, `usu_password`, `usu_foto_id`, `usu_admin`) VALUES
(2, 'juan19', 'a94652aa97c7211ba8954dd15a3cf838', 7, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `fotos`
--
ALTER TABLE `fotos`
  ADD PRIMARY KEY (`foto_id`);

--
-- Indices de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD PRIMARY KEY (`men_id`),
  ADD KEY `r_usuarios` (`men_usu_id`),
  ADD KEY `r_temas` (`men_tem_id`);

--
-- Indices de la tabla `temas`
--
ALTER TABLE `temas`
  ADD PRIMARY KEY (`tem_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`usu_id`),
  ADD UNIQUE KEY `usu_user` (`usu_user`),
  ADD KEY `r_fotos` (`usu_foto_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `fotos`
--
ALTER TABLE `fotos`
  MODIFY `foto_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `mensajes`
--
ALTER TABLE `mensajes`
  MODIFY `men_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=96;

--
-- AUTO_INCREMENT de la tabla `temas`
--
ALTER TABLE `temas`
  MODIFY `tem_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `usu_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=73;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `mensajes`
--
ALTER TABLE `mensajes`
  ADD CONSTRAINT `r_temas` FOREIGN KEY (`men_tem_id`) REFERENCES `temas` (`tem_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `r_usuarios` FOREIGN KEY (`men_usu_id`) REFERENCES `usuarios` (`usu_id`) ON DELETE NO ACTION ON UPDATE CASCADE;

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `r_fotos` FOREIGN KEY (`usu_foto_id`) REFERENCES `fotos` (`foto_id`) ON DELETE NO ACTION ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
