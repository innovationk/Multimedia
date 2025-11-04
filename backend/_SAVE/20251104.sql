-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3307
-- Généré le : mar. 04 nov. 2025 à 11:22
-- Version du serveur : 11.5.2-MariaDB
-- Version de PHP : 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `multimedia_database`
--

-- --------------------------------------------------------

--
-- Structure de la table `account`
--

DROP TABLE IF EXISTS `account`;
CREATE TABLE IF NOT EXISTS `account` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `token` varchar(258) DEFAULT '',
  `token_deadline` bigint(20) UNSIGNED DEFAULT 0,
  `pseudo` varchar(255) NOT NULL,
  `password` varchar(130) DEFAULT '',
  `admin` tinyint(1) DEFAULT 0,
  `updated` bigint(20) UNSIGNED NOT NULL,
  `created` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UC_id` (`id`),
  UNIQUE KEY `UC_pseudo` (`pseudo`) USING HASH,
  KEY `IDX_account_state` (`state`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `account`
--

INSERT INTO `account` (`id`, `state`, `token`, `token_deadline`, `pseudo`, `password`, `admin`, `updated`, `created`) VALUES
(1, 'active', '', 0, 'ElayneTrakand', '0xea92c029a3241b6e43362c08eec2f17a70d897c4ec7967ed5c5b33e83e57be4fa77b4d73ee59f1a583483055cd3a810ec1a0bb564b72078228b04739ba5513ca', 1, 1762255282750, 1762255282750),
(2, 'active', '', 0, 'MoiraineDamodred', '0xea92c029a3241b6e43362c08eec2f17a70d897c4ec7967ed5c5b33e83e57be4fa77b4d73ee59f1a583483055cd3a810ec1a0bb564b72078228b04739ba5513ca', 0, 1762255282753, 1762255282753),
(3, 'active', '', 0, 'NynaeveAlMeara', '0xea92c029a3241b6e43362c08eec2f17a70d897c4ec7967ed5c5b33e83e57be4fa77b4d73ee59f1a583483055cd3a810ec1a0bb564b72078228b04739ba5513ca', 0, 1762255282754, 1762255282754);

-- --------------------------------------------------------

--
-- Structure de la table `movie`
--

DROP TABLE IF EXISTS `movie`;
CREATE TABLE IF NOT EXISTS `movie` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `language` enum('fr','en') NOT NULL DEFAULT 'en',
  `title` varchar(512) NOT NULL,
  `updated` bigint(20) UNSIGNED NOT NULL,
  `created` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UC_id` (`id`),
  KEY `IDX_movie_state` (`state`),
  KEY `IDX_movie_language` (`language`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `movie`
--

INSERT INTO `movie` (`id`, `state`, `language`, `title`, `updated`, `created`) VALUES
(1, 'active', 'en', 'Jennifer\'s body', 1762255282750, 1762255282750);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
