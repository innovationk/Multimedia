-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:8889
-- Généré le : dim. 09 nov. 2025 à 17:37
-- Version du serveur : 8.0.40
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

CREATE TABLE `account` (
  `id` bigint UNSIGNED NOT NULL,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `token` varchar(258) DEFAULT '',
  `token_deadline` bigint UNSIGNED DEFAULT '0',
  `pseudo` varchar(255) NOT NULL,
  `password` varchar(130) DEFAULT '',
  `admin` tinyint(1) DEFAULT '0',
  `updated` bigint UNSIGNED NOT NULL,
  `created` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `account`
--

INSERT INTO `account` (`id`, `state`, `token`, `token_deadline`, `pseudo`, `password`, `admin`, `updated`, `created`) VALUES
(1, 'active', '', 0, 'ElayneTrakand', '0xea92c029a3241b6e43362c08eec2f17a70d897c4ec7967ed5c5b33e83e57be4fa77b4d73ee59f1a583483055cd3a810ec1a0bb564b72078228b04739ba5513ca', 1, 1762709801867, 1762709801867),
(2, 'active', '', 0, 'MoiraineDamodred', '0xea92c029a3241b6e43362c08eec2f17a70d897c4ec7967ed5c5b33e83e57be4fa77b4d73ee59f1a583483055cd3a810ec1a0bb564b72078228b04739ba5513ca', 0, 1762709801870, 1762709801870),
(3, 'active', '', 0, 'NynaeveAlMeara', '0xea92c029a3241b6e43362c08eec2f17a70d897c4ec7967ed5c5b33e83e57be4fa77b4d73ee59f1a583483055cd3a810ec1a0bb564b72078228b04739ba5513ca', 0, 1762709801873, 1762709801873);

-- --------------------------------------------------------

--
-- Structure de la table `album`
--

CREATE TABLE `album` (
  `id` bigint UNSIGNED NOT NULL,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `professional_id` bigint UNSIGNED NOT NULL,
  `title` varchar(512) NOT NULL,
  `year` int UNSIGNED DEFAULT '0',
  `updated` bigint UNSIGNED NOT NULL,
  `created` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `book`
--

CREATE TABLE `book` (
  `id` bigint UNSIGNED NOT NULL,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `category` enum('novel','comic_strip') DEFAULT NULL,
  `language` enum('none','fr','en') NOT NULL DEFAULT 'none',
  `title` varchar(512) NOT NULL,
  `updated` bigint UNSIGNED NOT NULL,
  `created` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `professional`
--

CREATE TABLE `professional` (
  `id` bigint UNSIGNED NOT NULL,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `name` varchar(512) NOT NULL,
  `surname` varchar(512) DEFAULT '',
  `music` tinyint(1) DEFAULT '0',
  `movie` tinyint(1) DEFAULT '0',
  `updated` bigint UNSIGNED NOT NULL,
  `created` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `song`
--

CREATE TABLE `song` (
  `id` bigint UNSIGNED NOT NULL,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `album_id` bigint UNSIGNED NOT NULL,
  `title` varchar(512) NOT NULL,
  `track` tinyint UNSIGNED DEFAULT '0',
  `updated` bigint UNSIGNED NOT NULL,
  `created` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Structure de la table `video`
--

CREATE TABLE `video` (
  `id` bigint UNSIGNED NOT NULL,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `language` enum('none','fr','en') NOT NULL DEFAULT 'none',
  `title` varchar(512) NOT NULL,
  `updated` bigint UNSIGNED NOT NULL,
  `created` bigint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `account`
--
ALTER TABLE `account`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UC_id` (`id`),
  ADD UNIQUE KEY `UC_pseudo` (`pseudo`),
  ADD KEY `IDX_account_state` (`state`);

--
-- Index pour la table `album`
--
ALTER TABLE `album`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UC_id` (`id`),
  ADD KEY `IDX_album_state` (`state`),
  ADD KEY `IDX_album_professional_id` (`professional_id`);

--
-- Index pour la table `book`
--
ALTER TABLE `book`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UC_id` (`id`),
  ADD KEY `IDX_book_state` (`state`),
  ADD KEY `IDX_book_category` (`category`),
  ADD KEY `IDX_book_language` (`language`);

--
-- Index pour la table `professional`
--
ALTER TABLE `professional`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UC_id` (`id`),
  ADD KEY `IDX_professional_state` (`state`);

--
-- Index pour la table `song`
--
ALTER TABLE `song`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UC_id` (`id`),
  ADD KEY `IDX_song_state` (`state`),
  ADD KEY `IDX_song_album_id` (`album_id`);

--
-- Index pour la table `video`
--
ALTER TABLE `video`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UC_id` (`id`),
  ADD KEY `IDX_video_state` (`state`),
  ADD KEY `IDX_video_language` (`language`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `account`
--
ALTER TABLE `account`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `album`
--
ALTER TABLE `album`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `book`
--
ALTER TABLE `book`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `professional`
--
ALTER TABLE `professional`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `song`
--
ALTER TABLE `song`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `video`
--
ALTER TABLE `video`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
