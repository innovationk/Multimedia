-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3307
-- Généré le : mer. 05 nov. 2025 à 18:29
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
) ENGINE=MyISAM AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `account`
--

INSERT INTO `account` (`id`, `state`, `token`, `token_deadline`, `pseudo`, `password`, `admin`, `updated`, `created`) VALUES
(1, 'active', '0x5d78a97c00c95bf7a2ea28072f7e1c7979b38835e10c9469c6da357938fb9c76a50b2c066cd64fb01d481e301bfb1d696266fc147e19643a164ec5bb80ff1f217810fb03c37721307cad1c15d63ad751921797edfd426b6793cde20fb3f5ecb4e19da71a929fba4f7cd48d08c4952ecb20bde4a4cebfd0309415bcfe66444f41', 1762532445240, 'ElayneTrakand', '0xea92c029a3241b6e43362c08eec2f17a70d897c4ec7967ed5c5b33e83e57be4fa77b4d73ee59f1a583483055cd3a810ec1a0bb564b72078228b04739ba5513ca', 1, 1762359645240, 1762255282750),
(2, 'active', '', 0, 'MoiraineDamodred', '0xea92c029a3241b6e43362c08eec2f17a70d897c4ec7967ed5c5b33e83e57be4fa77b4d73ee59f1a583483055cd3a810ec1a0bb564b72078228b04739ba5513ca', 0, 1762255282753, 1762255282753),
(3, 'active', '', 0, 'NynaeveAlMeara', '0xea92c029a3241b6e43362c08eec2f17a70d897c4ec7967ed5c5b33e83e57be4fa77b4d73ee59f1a583483055cd3a810ec1a0bb564b72078228b04739ba5513ca', 0, 1762255282754, 1762255282754),
(4, 'active', '', 0, 'MsWayne', '0xea92c029a3241b6e43362c08eec2f17a70d897c4ec7967ed5c5b33e83e57be4fa77b4d73ee59f1a583483055cd3a810ec1a0bb564b72078228b04739ba5513ca', 0, 1762341394749, 1762341394749),
(5, 'active', '', 0, 'FloFlo', '0xea92c029a3241b6e43362c08eec2f17a70d897c4ec7967ed5c5b33e83e57be4fa77b4d73ee59f1a583483055cd3a810ec1a0bb564b72078228b04739ba5513ca', 0, 1762341394749, 1762341394749);

-- --------------------------------------------------------

--
-- Structure de la table `movie`
--

DROP TABLE IF EXISTS `movie`;
CREATE TABLE IF NOT EXISTS `movie` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `language` enum('none','fr','en') NOT NULL DEFAULT 'en',
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
(1, 'active', 'none', 'EEEAAAOOO', 1762255282750, 1762255282750);

-- --------------------------------------------------------

--
-- Structure de la table `musicalbum`
--

DROP TABLE IF EXISTS `musicalbum`;
CREATE TABLE IF NOT EXISTS `musicalbum` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `professional_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(512) NOT NULL,
  `updated` bigint(20) UNSIGNED NOT NULL,
  `created` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UC_id` (`id`),
  KEY `IDX_musicalbum_state` (`state`),
  KEY `IDX_musicalbum_professional_id` (`professional_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `musicsong`
--

DROP TABLE IF EXISTS `musicsong`;
CREATE TABLE IF NOT EXISTS `musicsong` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `musicalbum_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(512) NOT NULL,
  `updated` bigint(20) UNSIGNED NOT NULL,
  `created` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UC_id` (`id`),
  KEY `IDX_musicsong_state` (`state`),
  KEY `IDX_musicsong_musicalbum_id` (`musicalbum_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `professional`
--

DROP TABLE IF EXISTS `professional`;
CREATE TABLE IF NOT EXISTS `professional` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `name` varchar(512) NOT NULL,
  `surname` varchar(512) DEFAULT '',
  `music` tinyint(1) DEFAULT 0,
  `movie` tinyint(1) DEFAULT 0,
  `updated` bigint(20) UNSIGNED NOT NULL,
  `created` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UC_id` (`id`),
  KEY `IDX_professional_state` (`state`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;

--
-- Déchargement des données de la table `professional`
--

INSERT INTO `professional` (`id`, `state`, `name`, `surname`, `music`, `movie`, `updated`, `created`) VALUES
(1, 'active', 'Florence + the Machine', '', 1, 0, 1762351677660, 1762351677660);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
