-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 24/11/2024 às 14:27
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `estoque2`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `pedidos_Realizados`
--

CREATE TABLE `pedidos_Realizados` (
  `numero_pedido` int(11) DEFAULT NULL,
  `funcionario` varchar(40) DEFAULT NULL,
  `forma_pagamento` varchar(40) DEFAULT NULL,
  `status` tinyint(1) DEFAULT NULL,
  `id` int(11) NOT NULL,
  `contato` varchar(60) NOT NULL,
  `valor_compra` decimal(10,2) DEFAULT NULL,
  `data_pedido` varchar(100) DEFAULT NULL,
  `email_User` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `pedidos_Realizados`
--

INSERT INTO `pedidos_Realizados` (`numero_pedido`, `funcionario`, `forma_pagamento`, `status`, `id`, `contato`, `valor_compra`, `data_pedido`, `email_User`) VALUES
(NULL, 'Matheus nascimento', 'Dinheiro', 0, 310, '11951098441', 11.10, '2024-11-23T00:33:59.483Z', 'Matheuskater02@outlook.com'),
(NULL, 'Matheus nascimento', 'Dinheiro', 0, 311, '11951098441', 9.30, '2024-11-23T00:33:59.483Z', 'Matheuskater02@outlook.com'),
(NULL, 'Reginaldo Nascimento', 'Dinheiro', 0, 312, '11986299810', 9.30, '2024-11-23T00:48:05.221Z', 'Matheuskater02@outlook.com.huehue'),
(NULL, 'Reginaldo Nascimento', 'Dinheiro', 0, 313, '11986299810', 10.80, '2024-11-23T00:48:05.221Z', 'Matheuskater02@outlook.com.huehue');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_Entrada`
--

CREATE TABLE `tbl_Entrada` (
  `id_entrada` int(11) NOT NULL,
  `data` timestamp NULL DEFAULT current_timestamp(),
  `id_User` int(11) DEFAULT NULL,
  `qtd_tpitens` int(11) DEFAULT NULL,
  `cod_Prd` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_Entrada2`
--

CREATE TABLE `tbl_Entrada2` (
  `codigo_produto` int(11) DEFAULT NULL,
  `nome_produto` varchar(255) DEFAULT NULL,
  `preco_total` decimal(10,2) DEFAULT NULL,
  `preco_unitario` decimal(10,2) DEFAULT NULL,
  `qtd_comprada` int(11) DEFAULT NULL,
  `data_entrada` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbl_Entrada2`
--

INSERT INTO `tbl_Entrada2` (`codigo_produto`, `nome_produto`, `preco_total`, `preco_unitario`, `qtd_comprada`, `data_entrada`) VALUES
(15, 'Paçoca', 4.50, 1.50, 3, '2024-11-19T03:28:36.314Z'),
(14, 'Coca Cuela', 3.00, 1.50, 2, '2024-11-19T03:28:36.314Z'),
(14, 'Coca Cuela', 4.50, 1.50, 3, '2024-11-19T03:31:23.768Z'),
(15, 'Paçoca', 4.50, 1.50, 3, '2024-11-19T03:31:23.768Z'),
(15, 'Paçoca', 4.50, 1.50, 3, '2024-11-19T03:32:53.945Z'),
(14, 'Coca Cuela', 4.50, 1.50, 3, '2024-11-19T03:32:53.945Z'),
(15, 'Paçoca', 3.00, 1.50, 2, '2024-11-19T03:34:30.459Z'),
(15, 'Paçoca', 4.50, 1.50, 3, '2024-11-22T00:10:03.196Z'),
(14, 'Coca Cuela', 4.20, 1.40, 3, '2024-11-22T00:10:03.196Z'),
(15, 'Paçoca', 3.00, 1.50, 2, '2024-11-22T00:39:10.327Z'),
(15, 'Paçoca', 10.80, 1.80, 6, '2024-11-22T00:39:10.327Z'),
(14, 'Coca Cuela', 6.00, 1.50, 4, '2024-11-22T00:39:10.327Z'),
(15, 'Paçoca', 4.50, 1.50, 3, '2024-11-22T00:40:52.611Z'),
(14, 'Coca Cuela', 7.50, 1.50, 5, '2024-11-22T00:40:52.611Z'),
(15, 'Paçoca', 3.00, 1.50, 2, '2024-11-22T01:19:42.276Z'),
(15, 'Paçoca', 4.50, 1.50, 3, '2024-11-22T01:56:50.582Z'),
(15, 'Paçoca', 3.00, 1.50, 2, '2024-11-22T01:56:50.582Z'),
(15, 'Paçoca', 1.50, 1.50, 1, '2024-11-22T01:56:50.582Z'),
(15, 'Paçoca', 3.00, 1.50, 2, '2024-11-22T02:05:29.253Z'),
(15, 'Paçoca', 3.00, 1.50, 2, '2024-11-22T02:09:21.380Z'),
(15, 'Paçoca', 3.00, 1.50, 2, '2024-11-22T02:12:43.069Z'),
(15, 'Paçoca', 1.50, 1.50, 1, '2024-11-22T02:17:42.715Z'),
(15, 'Paçoca', 1.50, 1.50, 1, '2024-11-22T02:17:42.715Z'),
(15, 'Paçoca', 4.50, 1.50, 3, '2024-11-22T12:34:26.776Z'),
(14, 'Coca Cuela', 4.50, 1.50, 3, '2024-11-22T12:34:26.776Z'),
(15, 'Paçoca', 3.00, 1.50, 2, '2024-11-22T12:55:39.587Z'),
(14, 'Coca Cuela', 3.00, 1.50, 2, '2024-11-22T12:55:39.587Z'),
(15, 'Paçoca', 1.50, 1.50, 1, '2024-11-22T12:55:39.587Z'),
(14, 'Coca Cuela', 1.50, 1.50, 1, '2024-11-22T12:55:39.587Z'),
(15, 'Paçoca', 4.50, 1.50, 3, '2024-11-22T12:55:39.587Z'),
(14, 'Coca Cuela', 4.50, 1.50, 3, '2024-11-22T12:55:39.587Z'),
(15, 'Paçoca', 4.50, 1.50, 3, '2024-11-22T12:58:41.412Z'),
(14, 'Coca Cuela', 3.00, 1.50, 2, '2024-11-22T12:58:41.412Z'),
(15, 'Paçoca', 1.50, 1.50, 1, '2024-11-22T13:02:17.775Z'),
(15, 'Paçoca', 1.50, 1.50, 1, '2024-11-22T13:04:27.941Z'),
(15, 'Paçoca', 1.50, 1.50, 1, '2024-11-22T13:04:27.941Z'),
(15, 'Paçoca', 3.00, 1.50, 2, '2024-11-22T13:07:42.795Z'),
(15, 'Paçoca', 1.50, 1.50, 1, '2024-11-22T13:08:42.465Z'),
(15, 'Paçoca', 1.50, 1.50, 1, '2024-11-22T13:09:17.478Z'),
(15, 'Paçoca', 1.50, 1.50, 1, '2024-11-22T13:14:19.315Z'),
(15, 'Paçoca', 1.50, 1.50, 1, '2024-11-22T13:15:23.838Z'),
(15, 'Paçoca', 1.50, 1.50, 1, '2024-11-22T13:17:11.475Z'),
(14, 'Coca Cuela', 1.50, 1.50, 1, '2024-11-22T13:17:11.475Z'),
(15, 'Paçoca', 3.00, 1.50, 2, '2024-11-23T00:33:59.483Z'),
(14, 'Coca Cuela', 3.00, 1.50, 2, '2024-11-23T00:33:59.483Z'),
(15, 'Paçoca', 9.00, 1.50, 6, '2024-11-23T00:33:59.483Z'),
(14, 'Coca Cuela', 7.50, 1.50, 5, '2024-11-23T00:33:59.483Z'),
(21, 'Bala de carro', 7.50, 1.50, 5, '2024-11-23T00:33:59.483Z'),
(85, 'Macarrão', 7.50, 1.50, 5, '2024-11-23T00:33:59.483Z'),
(15, 'Paçoca', 1.50, 1.50, 1, '2024-11-23T00:48:05.221Z'),
(15, 'Paçoca', 3.00, 1.50, 2, '2024-11-23T00:48:05.221Z'),
(69, 'coco', 3.00, 1.50, 2, '2024-11-23T00:48:05.221Z');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_Itementrada`
--

CREATE TABLE `tbl_Itementrada` (
  `id` int(11) NOT NULL,
  `id_Entrada` int(11) NOT NULL,
  `cod_Prd` int(11) NOT NULL,
  `nome_Prd` varchar(50) NOT NULL,
  `qtd_Item` int(11) DEFAULT NULL,
  `vlr_Unit` decimal(8,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_Itemsaida`
--

CREATE TABLE `tbl_Itemsaida` (
  `id` int(11) NOT NULL,
  `cod_Prd` int(11) NOT NULL,
  `nome` varchar(50) DEFAULT NULL,
  `qtd_Item` int(11) DEFAULT NULL,
  `vlr_UnitSaida` decimal(8,2) DEFAULT NULL,
  `vlr_TotSaida` decimal(8,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_Produto`
--

CREATE TABLE `tbl_Produto` (
  `id` int(11) NOT NULL,
  `cod_Prd` int(11) NOT NULL,
  `nome_Prd` varchar(50) DEFAULT NULL,
  `qtd_TotProduto` int(11) DEFAULT NULL,
  `vlr_Unit` decimal(8,2) DEFAULT NULL,
  `vlr_VendaUnit` decimal(8,2) DEFAULT NULL,
  `tipo_produto` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbl_Produto`
--

INSERT INTO `tbl_Produto` (`id`, `cod_Prd`, `nome_Prd`, `qtd_TotProduto`, `vlr_Unit`, `vlr_VendaUnit`, `tipo_produto`) VALUES
(43, 15, 'Paçoca', 4, 1.80, NULL, 'Doce'),
(44, 14, 'Coca Cuela', 1, 4.50, NULL, 'Bebida'),
(45, 21, 'Bala de carro', 1, 1.50, NULL, 'Doce'),
(46, 85, 'Macarrão', 1, 1.50, NULL, 'Salgado'),
(47, 69, 'coco', 1, 1.50, NULL, 'Doce');

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_Saida`
--

CREATE TABLE `tbl_Saida` (
  `codigo_produto` int(11) DEFAULT NULL,
  `codigo_pedido` int(11) DEFAULT NULL,
  `funcionario` varchar(40) DEFAULT NULL,
  `nome_produto` varchar(40) DEFAULT NULL,
  `forma_pagamento` varchar(40) DEFAULT NULL,
  `qtd_comprada` int(11) NOT NULL,
  `valor_compra` decimal(10,2) DEFAULT NULL,
  `data_saida` varchar(100) DEFAULT NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbl_Saida`
--

INSERT INTO `tbl_Saida` (`codigo_produto`, `codigo_pedido`, `funcionario`, `nome_produto`, `forma_pagamento`, `qtd_comprada`, `valor_compra`, `data_saida`, `status`) VALUES
(14, 309, 'Matheus nascimento', 'Coca Cuela', 'Dinheiro', 2, 9.00, '2024-11-23T00:33:59.480Z', 0),
(15, 309, 'Matheus nascimento', 'Paçoca', 'Dinheiro', 2, 3.60, '2024-11-23T00:33:59.480Z', 0),
(15, 310, 'Matheus nascimento', 'Paçoca', 'Dinheiro', 2, 3.60, '2024-11-23T00:33:59.480Z', 0),
(21, 310, 'Matheus nascimento', 'Bala de carro', 'Dinheiro', 1, 1.50, '2024-11-23T00:33:59.480Z', 0),
(85, 310, 'Matheus nascimento', 'Macarrão', 'Dinheiro', 1, 1.50, '2024-11-23T00:33:59.480Z', 0),
(14, 310, 'Matheus nascimento', 'Coca Cuela', 'Dinheiro', 1, 4.50, '2024-11-23T00:33:59.480Z', 0),
(14, 311, 'Matheus nascimento', 'Coca Cuela', 'Dinheiro', 1, 4.50, '2024-11-23T00:33:59.480Z', 0),
(85, 311, 'Matheus nascimento', 'Macarrão', 'Dinheiro', 1, 1.50, '2024-11-23T00:33:59.480Z', 0),
(21, 311, 'Matheus nascimento', 'Bala de carro', 'Dinheiro', 1, 1.50, '2024-11-23T00:33:59.480Z', 0),
(15, 311, 'Matheus nascimento', 'Paçoca', 'Dinheiro', 1, 1.80, '2024-11-23T00:33:59.480Z', 0),
(21, 312, 'Reginaldo Nascimento', 'Bala de carro', 'Dinheiro', 1, 1.50, '2024-11-23T00:48:05.218Z', 0),
(14, 312, 'Reginaldo Nascimento', 'Coca Cuela', 'Dinheiro', 1, 4.50, '2024-11-23T00:48:05.218Z', 0),
(15, 312, 'Reginaldo Nascimento', 'Paçoca', 'Dinheiro', 1, 1.80, '2024-11-23T00:48:05.218Z', 0),
(85, 312, 'Reginaldo Nascimento', 'Macarrão', 'Dinheiro', 1, 1.50, '2024-11-23T00:48:05.218Z', 0),
(15, 313, 'Reginaldo Nascimento', 'Paçoca', 'Dinheiro', 1, 1.80, '2024-11-23T00:48:05.218Z', 0),
(14, 313, 'Reginaldo Nascimento', 'Coca Cuela', 'Dinheiro', 1, 4.50, '2024-11-23T00:48:05.218Z', 0),
(21, 313, 'Reginaldo Nascimento', 'Bala de carro', 'Dinheiro', 1, 1.50, '2024-11-23T00:48:05.218Z', 0),
(85, 313, 'Reginaldo Nascimento', 'Macarrão', 'Dinheiro', 1, 1.50, '2024-11-23T00:48:05.218Z', 0),
(69, 313, 'Reginaldo Nascimento', 'coco', 'Dinheiro', 1, 1.50, '2024-11-23T00:48:05.218Z', 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_User`
--

CREATE TABLE `tbl_User` (
  `id_User` int(11) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `email_Login` varchar(100) DEFAULT NULL,
  `password_Login` varchar(100) DEFAULT NULL,
  `ativo` tinyint(1) DEFAULT NULL,
  `telefone` varchar(12) DEFAULT NULL,
  `admin` tinyint(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `tbl_User`
--

INSERT INTO `tbl_User` (`id_User`, `nome`, `email_Login`, `password_Login`, `ativo`, `telefone`, `admin`) VALUES
(71, 'Matheus nascimento', 'Matheuskater02@outlook.com', '$2b$08$73t6rIEVvsUemi//5jV5kewmPUj6XoLmcn9UXW3A7MWQvhcXgunPi', 1, '11951098441', 0),
(72, 'Matheus nascimento', 'Matheuskater02@outlook.com.ue', '$2b$08$7UtTPwWFZKxxRbJj5RDX6eiPlxrJtqQ8/hoYPD9yjAOsEOs9QVTR2', 1, '11951098449', 1),
(73, 'Matheus nascimento', 'Matheuskater02@outlook.com.kk', '$2b$08$AhdFUYum4T8.1eUDCTjQAeQ/OMT5RC7AzjnCnRMogEfM6T.bQCDoO', 1, '11951098449', 1),
(74, 'Reginaldo Nascimento', 'Matheuskater016@outlook.com', '$2b$08$eoPMvlsVEh.SIoXUuz/lA.rUz/21XLSGPEoo324VMGFhSP0C.hodS', 1, '11986299810', 0),
(75, 'Reginaldo Nascimento', 'Matheuskater02@outlook.com.hue', '$2b$08$RWoCalUDw3DQq7.wmwgmHu6c74T.yc.JkO0VBpC6RfX1iagibiZcC', 1, '11986299810', 0),
(76, 'Reginaldo Nascimento', 'Matheuskater02@outlook.com.huehue', '$2b$08$XfdoJLgAcR7tkynLBP4m9evuzB6QMEsqbpgjezjX/A5ziIZPG9AfO', 1, '11986299810', 1),
(77, 'amanda Aleixo', 'Amanda123@gmail.com', '$2b$08$i9u.X2p0akF91Paf8lMIje3kzTvE61/9bKTn8OeCeiRPT7o2onH/O', 1, '11951098449', 0);

-- --------------------------------------------------------

--
-- Estrutura para tabela `tbl_Venda`
--

CREATE TABLE `tbl_Venda` (
  `id` int(11) NOT NULL,
  `data` date DEFAULT NULL,
  `id_User` int(11) DEFAULT NULL,
  `qtd_Saida` int(11) DEFAULT NULL,
  `stts_Pgmt` tinyint(1) DEFAULT NULL,
  `cod_Prd` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `pedidos_Realizados`
--
ALTER TABLE `pedidos_Realizados`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `tbl_Entrada`
--
ALTER TABLE `tbl_Entrada`
  ADD PRIMARY KEY (`id_entrada`),
  ADD UNIQUE KEY `cod_Prd` (`cod_Prd`),
  ADD KEY `FK_id` (`id_User`);

--
-- Índices de tabela `tbl_Itementrada`
--
ALTER TABLE `tbl_Itementrada`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cod_Prd` (`cod_Prd`),
  ADD UNIQUE KEY `nome_Prd` (`nome_Prd`),
  ADD KEY `fk_cod_Produto` (`id_Entrada`);

--
-- Índices de tabela `tbl_Itemsaida`
--
ALTER TABLE `tbl_Itemsaida`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_codigoprod` (`cod_Prd`);

--
-- Índices de tabela `tbl_Produto`
--
ALTER TABLE `tbl_Produto`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `cod_Prd` (`cod_Prd`);

--
-- Índices de tabela `tbl_User`
--
ALTER TABLE `tbl_User`
  ADD PRIMARY KEY (`id_User`);

--
-- Índices de tabela `tbl_Venda`
--
ALTER TABLE `tbl_Venda`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_usuarios` (`id_User`),
  ADD KEY `fk_codprod` (`cod_Prd`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `pedidos_Realizados`
--
ALTER TABLE `pedidos_Realizados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=314;

--
-- AUTO_INCREMENT de tabela `tbl_Entrada`
--
ALTER TABLE `tbl_Entrada`
  MODIFY `id_entrada` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tbl_Itementrada`
--
ALTER TABLE `tbl_Itementrada`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tbl_Itemsaida`
--
ALTER TABLE `tbl_Itemsaida`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `tbl_Produto`
--
ALTER TABLE `tbl_Produto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT de tabela `tbl_User`
--
ALTER TABLE `tbl_User`
  MODIFY `id_User` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=78;

--
-- AUTO_INCREMENT de tabela `tbl_Venda`
--
ALTER TABLE `tbl_Venda`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `tbl_Entrada`
--
ALTER TABLE `tbl_Entrada`
  ADD CONSTRAINT `FK_id` FOREIGN KEY (`id_User`) REFERENCES `tbl_User` (`id_User`);

--
-- Restrições para tabelas `tbl_Itementrada`
--
ALTER TABLE `tbl_Itementrada`
  ADD CONSTRAINT `fk_cod_Produto` FOREIGN KEY (`id_Entrada`) REFERENCES `tbl_Entrada` (`id_entrada`);

--
-- Restrições para tabelas `tbl_Itemsaida`
--
ALTER TABLE `tbl_Itemsaida`
  ADD CONSTRAINT `fk_codigoprod` FOREIGN KEY (`cod_Prd`) REFERENCES `tbl_Produto` (`cod_Prd`);

--
-- Restrições para tabelas `tbl_Venda`
--
ALTER TABLE `tbl_Venda`
  ADD CONSTRAINT `fk_codprod` FOREIGN KEY (`cod_Prd`) REFERENCES `tbl_Produto` (`cod_Prd`),
  ADD CONSTRAINT `fk_usuarios` FOREIGN KEY (`id_User`) REFERENCES `tbl_User` (`id_User`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;