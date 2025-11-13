-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost:3306
-- Généré le : jeu. 13 nov. 2025 à 16:22
-- Version du serveur : 11.4.9-MariaDB
-- Version de PHP : 8.3.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `saki8367_multimedia_database`
--

-- --------------------------------------------------------

--
-- Structure de la table `account`
--

CREATE TABLE `account` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `token` varchar(258) DEFAULT '',
  `token_deadline` bigint(20) UNSIGNED DEFAULT 0,
  `pseudo` varchar(255) NOT NULL,
  `password` varchar(130) DEFAULT '',
  `admin` tinyint(1) DEFAULT 0,
  `updated` bigint(20) UNSIGNED NOT NULL,
  `created` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `account`
--

INSERT INTO `account` (`id`, `state`, `token`, `token_deadline`, `pseudo`, `password`, `admin`, `updated`, `created`) VALUES
(1, 'active', '0x7c4e162d33de7aa3191c34dfafcc29914541138b5b2a4e4208bfee7db3e3152ff5988511ec15031eae4c392065341c426e5e028716d1fc2339f7360021666b8315a58f5a28e17d2e419ab5b0f2b9bb8b0bce2fd49abbc8248b7d47957e771d1802e2f05a2e02fee47bf536870197f1b8a1dc6ecc9a5ce8046c3fca9d2a0ea1f5', 1763220064862, 'ElayneTrakand', '0xea92c029a3241b6e43362c08eec2f17a70d897c4ec7967ed5c5b33e83e57be4fa77b4d73ee59f1a583483055cd3a810ec1a0bb564b72078228b04739ba5513ca', 1, 1763047264862, 1762709801867),
(2, 'active', '0x7d8f95f388ddbb4fa7d83eee7ab6393576dc1d3f6af55f047d5869df5550b1542ab198c58a39c1afd65645ce96a6ea54432817eed2f88ef67322c6a37b2d7318698dd27c5605451dfda80f02ed8ca8b51f344607e79fc774f426ff3729640ff8d3b0df09279eccda03fcbc1565023e40e4250f285bf8642c8cdaa7757e018c41', 1762884795614, 'MoiraineDamodred', '0xea92c029a3241b6e43362c08eec2f17a70d897c4ec7967ed5c5b33e83e57be4fa77b4d73ee59f1a583483055cd3a810ec1a0bb564b72078228b04739ba5513ca', 0, 1762711995615, 1762709801870),
(3, 'active', '', 0, 'NynaeveAlMeara', '0xea92c029a3241b6e43362c08eec2f17a70d897c4ec7967ed5c5b33e83e57be4fa77b4d73ee59f1a583483055cd3a810ec1a0bb564b72078228b04739ba5513ca', 0, 1762709801873, 1762709801873);

-- --------------------------------------------------------

--
-- Structure de la table `album`
--

CREATE TABLE `album` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `professional_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(512) NOT NULL,
  `year` int(10) UNSIGNED DEFAULT 0,
  `updated` bigint(20) UNSIGNED NOT NULL,
  `created` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `album`
--

INSERT INTO `album` (`id`, `state`, `professional_id`, `title`, `year`, `updated`, `created`) VALUES
(1, 'active', 1, 'Lungs', 2009, 1762804186691, 1762804186691),
(2, 'active', 2, 'Rumours', 1977, 1762871571653, 1762871571653);

-- --------------------------------------------------------

--
-- Structure de la table `book`
--

CREATE TABLE `book` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `category` enum('novel','comic_strip') DEFAULT NULL,
  `language` enum('none','fr','en') NOT NULL DEFAULT 'none',
  `title` varchar(512) NOT NULL,
  `updated` bigint(20) UNSIGNED NOT NULL,
  `created` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `book`
--

INSERT INTO `book` (`id`, `state`, `category`, `language`, `title`, `updated`, `created`) VALUES
(1, 'active', 'novel', 'none', 'Allison Saft - A l\'Ombre des Eaux Troubles', 1762711975546, 1762711975546);

-- --------------------------------------------------------

--
-- Structure de la table `movie`
--

CREATE TABLE `movie` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `language` enum('none','fr','en') NOT NULL DEFAULT 'none',
  `title` varchar(512) NOT NULL,
  `updated` bigint(20) UNSIGNED NOT NULL,
  `created` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `musicalbum`
--

CREATE TABLE `musicalbum` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `professional_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(512) NOT NULL,
  `updated` bigint(20) UNSIGNED NOT NULL,
  `created` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `musicsong`
--

CREATE TABLE `musicsong` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `musicalbum_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(512) NOT NULL,
  `updated` bigint(20) UNSIGNED NOT NULL,
  `created` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `professional`
--

CREATE TABLE `professional` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `name` varchar(512) NOT NULL,
  `surname` varchar(512) DEFAULT '',
  `music` tinyint(1) DEFAULT 0,
  `movie` tinyint(1) DEFAULT 0,
  `updated` bigint(20) UNSIGNED NOT NULL,
  `created` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `professional`
--

INSERT INTO `professional` (`id`, `state`, `name`, `surname`, `music`, `movie`, `updated`, `created`) VALUES
(1, 'active', 'Florence + the Machine', '', 1, 0, 1762804065572, 1762804065572),
(2, 'active', 'Fleetwood Mac', '', 1, 0, 1762871534467, 1762871534467);

-- --------------------------------------------------------

--
-- Structure de la table `song`
--

CREATE TABLE `song` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `album_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(512) NOT NULL,
  `track` tinyint(3) UNSIGNED DEFAULT 0,
  `updated` bigint(20) UNSIGNED NOT NULL,
  `created` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `song`
--

INSERT INTO `song` (`id`, `state`, `album_id`, `title`, `track`, `updated`, `created`) VALUES
(1, 'active', 1, 'Dog Days Are Over', 1, 1762804291217, 1762804291217),
(2, 'active', 1, ' Rabbit Heart (Raise It Up)', 2, 1762804440322, 1762804440322),
(3, 'active', 1, 'I\'m Not Calling You A Liar', 3, 1762804464331, 1762804464331),
(4, 'active', 1, 'Howl', 4, 1762804482441, 1762804482441),
(5, 'active', 1, 'Kiss With A Fist', 5, 1762804507085, 1762804507085),
(6, 'active', 1, 'Girl With One Eye', 6, 1762804553989, 1762804553989),
(7, 'active', 1, 'Drumming Song', 7, 1762804570882, 1762804570882),
(8, 'active', 1, 'Between Two Lungs', 8, 1762804622755, 1762804622755),
(9, 'active', 1, 'Cosmic Love', 9, 1762804844787, 1762804844787),
(10, 'active', 1, 'My Boy Builds Coffins', 10, 1762804927519, 1762804927519),
(11, 'active', 1, 'Hurricane Drunk', 11, 1762804976362, 1762804976362),
(12, 'active', 1, 'Blinding', 12, 1762804996866, 1762804996866),
(13, 'active', 1, ' You\'ve Got The Love', 13, 1762805015353, 1762805015353),
(14, 'active', 2, 'Second Hand News', 1, 1762871590324, 1762871590324),
(15, 'active', 2, 'Dreams', 2, 1762871596782, 1762871596782),
(16, 'active', 2, 'Never Going Back Again', 3, 1762871603642, 1762871603642),
(17, 'active', 2, 'Don\'t Stop', 4, 1762871633220, 1762871614174),
(18, 'active', 2, 'Go Your Own Way', 5, 1762871652700, 1762871652700),
(19, 'active', 2, 'Songbird', 6, 1762871663733, 1762871663733),
(20, 'active', 2, 'The Chain', 7, 1762871673033, 1762871673033),
(21, 'active', 2, 'You Make Loving Fun', 8, 1762871681240, 1762871681240),
(22, 'active', 2, 'I Don\'t Want To Know', 9, 1762871699208, 1762871699208),
(23, 'active', 2, 'Oh Daddy', 10, 1762871705968, 1762871705968),
(24, 'active', 2, 'Gold Dust Woman', 11, 1762871714907, 1762871714907),
(25, 'active', 2, 'Silver Springs (2004 Remaster)', 12, 1762871929228, 1762871929228);

-- --------------------------------------------------------

--
-- Structure de la table `video`
--

CREATE TABLE `video` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `state` enum('active','archived','deleted') NOT NULL DEFAULT 'active',
  `language` enum('none','fr','en') NOT NULL DEFAULT 'none',
  `title` varchar(512) NOT NULL,
  `updated` bigint(20) UNSIGNED NOT NULL,
  `created` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Déchargement des données de la table `video`
--

INSERT INTO `video` (`id`, `state`, `language`, `title`, `updated`, `created`) VALUES
(1, 'active', 'none', 'Eeeaaaooo', 1762805015353, 1762805015353),
(2, 'active', 'en', 'Stoker', 1762972189386, 1762972189386);

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
-- Index pour la table `movie`
--
ALTER TABLE `movie`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UC_id` (`id`),
  ADD KEY `IDX_movie_state` (`state`),
  ADD KEY `IDX_movie_language` (`language`);

--
-- Index pour la table `musicalbum`
--
ALTER TABLE `musicalbum`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UC_id` (`id`),
  ADD KEY `IDX_musicalbum_state` (`state`),
  ADD KEY `IDX_musicalbum_professional_id` (`professional_id`);

--
-- Index pour la table `musicsong`
--
ALTER TABLE `musicsong`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UC_id` (`id`),
  ADD KEY `IDX_musicsong_state` (`state`),
  ADD KEY `IDX_musicsong_musicalbum_id` (`musicalbum_id`);

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
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT pour la table `album`
--
ALTER TABLE `album`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `book`
--
ALTER TABLE `book`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `movie`
--
ALTER TABLE `movie`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `musicalbum`
--
ALTER TABLE `musicalbum`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `musicsong`
--
ALTER TABLE `musicsong`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `professional`
--
ALTER TABLE `professional`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT pour la table `song`
--
ALTER TABLE `song`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT pour la table `video`
--
ALTER TABLE `video`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
