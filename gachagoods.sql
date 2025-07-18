-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 18, 2025 at 03:31 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gachagoods`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Hololive', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(2, 'Nijisanji', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(3, 'VShojo', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(4, 'Genshin Impact', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(5, 'Honkai: Star Rail', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(6, 'Fate/Grand Order', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(7, 'Azur Lane', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(8, 'BanG Dream!', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(9, 'Love Live!', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(10, 'Ensemble Stars!', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(11, 'Project SEKAI', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(12, 'Uma Musume', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(13, 'Re:Zero', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(14, 'Sword Art Online', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(15, 'Demon Slayer', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(16, 'Attack on Titan', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(17, 'My Hero Academia', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(18, 'One Piece', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(19, 'Naruto', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(20, 'Pokémon', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(21, 'Dragon Ball', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(22, 'Jujutsu Kaisen', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(23, 'Spy x Family', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(24, 'Chainsaw Man', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(25, 'Tokyo Revengers', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(26, 'Kantai Collection', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(27, 'Touhou Project', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(28, 'Vocaloid', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(29, 'Blue Archive', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(30, 'Idolmaster', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(31, 'Precure', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(32, 'D4DJ', NULL, NULL),
(34, 'Zenless Zone Zero', NULL, NULL),
(35, 'Punishing Gray Raven', NULL, NULL),
(36, 'Honkai Impact 3rd', NULL, NULL),
(37, 'Tears of Themis', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `type_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`id`, `name`, `description`, `price`, `category_id`, `type_id`, `created_at`, `updated_at`) VALUES
(1, 'Yuuki Sakuna Acrylic Stand', 'JbA2JDbv8u9pL3TBCNxzhxGqg4iVhmTBtnCxPO1T', 77.78, 15, 14, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(2, 'Kizuna AI Plushie', 'jIan8VbYk56FyGRGTD79x9TKID8nAByvqZmao5uE', 62.35, 17, 2, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(3, 'Rem Figure', '9dtIxCdBdtT295TF70dcD0rOY2DQTbmQZ27nxtCN', 44.31, 11, 17, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(4, 'Emilia Keychain', '5Q2HPUloL6Su4HkfTEtQwSIRHQuowjnWDyenGczN', 52.94, 13, 1, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(5, 'Megumin Badge', 'NVA7NyIPhKaXPNpsUQ50zlBSzvRhrhVuZswYCDhN', 42.29, 16, 13, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(6, 'Shiro T-shirt', '2CipxvdYeyCa9ksO54Ezen0Edlaf6Xr7xtbyALrN', 56.86, 6, 13, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(7, 'Kirito Hoodie', 'zhBgJPpxCdnm8prDLiHFvBycSnWq2VCN3RPBXP5s', 78.56, 10, 3, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(8, 'Asuna Poster', 'dzb5qsovVFAWcAE39ZA04xh6E0nRURPi6XGncEcj', 70.40, 12, 22, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(9, 'Zero Two Tapestry', 'cVpcEsNxOWdGA5z3zT3W5gbRAkXDOOcL87Av1tl7', 60.16, 17, 12, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(10, 'Nezuko Sticker', 'QiAU9jN9vfut6Wj6txtSnVck5aGiznsuRGFg6dT4', 98.49, 3, 7, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(11, 'Tanjiro Mug', 'QeVhHgseVj9HOjHR3R2e8XidlZpl1mIDpVw8uMLp', 93.04, 7, 4, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(12, 'Sakura Clear File', 'VRXwrSB5gbjq6He8g87Xhk2xmt3WUKDCnK3cY4qF', 55.33, 1, 16, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(13, 'Naruto Phone Case', 'BfW9bKFY8rPYLF4FpDvIbAZY64O9Jf2UgZHJvKqJ', 79.34, 4, 11, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(14, 'Gura Mousepad', 'cC5YOVzoiXQ2g3W1Z6uhRNn3QcvoJunokGCCxpI9', 69.74, 23, 24, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(15, 'Miko Art Book', 'ILetzOwJirrBEKRaAUWofwOhWhFEdijNbY4lCpFY', 31.65, 2, 5, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(16, 'Suisei CD', '2uRAtwxiPw5n8V90ywDXVRmsSAMRJPeQwN0N48sC', 83.65, 7, 22, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(17, 'Marine Blu-ray', 'JmoEdaJamax1jcUxLd2wq8mUZZNjR1LXjdGq3NG8', 60.82, 19, 13, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(18, 'Noel Cosplay Costume', 'rkHse3bwo34D66TEM2dPmQQgE8ZsozMW3UWUKjxe', 30.13, 15, 8, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(19, 'Kanata Pin', '2kaCeC8ir8y6rkwaGBkpNIP4TRQ2zK1cdm2IEXVV', 52.55, 11, 4, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(20, 'Okayu Wallet', 'tWXhLfOMAIJlGzITzyBLhAxt1CjtC77wQUQ882Vm', 44.69, 20, 3, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(21, 'Korone Bag', 'fhIqNsR0ajFFLx682DPvpWKbucHwyXcktYYITgGS', 62.69, 16, 3, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(22, 'Pekora Notebook', 'VpclND2Pl9VOcKFvNzCzk1KpR8xdOqVn6lj8K2m2', 79.84, 10, 16, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(23, 'Rushia Calendar', 'KkFSpN6202wVTRGvqMtrkdZ7SiVgAfNl1qFL1DpO', 90.90, 3, 18, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(24, 'Botan Gacha Capsule', 'tJNfHXgdp3IgWscRxQhb3YqYxIYYDThwHGVsQbc6', 43.41, 20, 18, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(25, 'Lamy Trading Card', 'Uk4RyIOyNAAUzbz9y0uz8Dju0yUGtreC6CEE4bqa', 85.15, 11, 6, '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(27, 'Minecraft', 'Steve', 77.77, 2, 1, NULL, NULL),
(28, 'Toto Natividad', 'director ng mga movie ni cesar montano. eyyyy', 69.69, 17, 1, NULL, NULL),
(29, 'NERO KEYCHAIN', 'HASHIRE SORI YO', 66.99, 6, 2, NULL, NULL),
(32, 'Nico Yazawa Plush.', 'nico nico niii', 99.99, 9, 3, NULL, NULL),
(33, 'Rinku Aimoto Plush', 'fumo plushie cute', 99.99, 8, 3, NULL, NULL),
(38, 'Uraraka', 'Ochaco', 99.99, 17, 1, NULL, NULL),
(39, 'EMU OTORi PLUSH DOLL', 'Wonderhoyism', 99.99, 11, 3, NULL, NULL),
(40, 'Cart Titan Cosplay Costume', 'ZAZAGEYOHHH!!!!!! AAAAHHHHHH!!!!', 69.69, 16, 18, NULL, NULL),
(41, 'Emu Otori Jacket w/ Hoodie', 'Feat. Ichika Hoshino. Wonderhoy!!!!', 99.99, 11, 7, NULL, NULL),
(42, 'Gerald', 'mabaho', 69.99, 16, 30, NULL, NULL),
(43, 'Sakura Miko 400x400 mousepad', 'For TenZ the aimgod', 99.99, 1, 14, NULL, NULL),
(44, 'Hu Tao Hoodie', 'hu tao', 99.99, 4, 7, NULL, NULL),
(45, 'GOJO SATORU', 'DOMAIN XPANSION', 99.99, 22, 4, NULL, NULL),
(46, 'YUKiNA MiNATO', 'bandori', 99.99, 8, 31, NULL, NULL),
(47, 'KASUMi TOYAMA', 'toyama grupo', 99.99, 8, 12, NULL, NULL),
(48, 'ee', 'ee', 99.99, 16, 1, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `item_images`
--

CREATE TABLE `item_images` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `image_path` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `item_images`
--

INSERT INTO `item_images` (`id`, `item_id`, `image_path`) VALUES
(1, 41, '/uploads/1752141279900.jpg'),
(2, 42, '/uploads/1752142776990.jpg'),
(3, 42, '/uploads/1752142777003.jpg'),
(4, 42, '/uploads/1752142777013.jpg'),
(5, 43, '/uploads/1752152711680.jpg'),
(6, 43, '/uploads/1752152711682.png'),
(7, 43, '/uploads/1752152711685.png'),
(8, 43, '/uploads/1752152711686.jpg'),
(9, 43, '/uploads/1752152711688.png'),
(10, 43, '/uploads/1752152711688.jpg'),
(11, 43, '/uploads/1752152711688.jpg'),
(12, 44, '/uploads/1752545250748.jpeg'),
(13, 44, '/uploads/1752545250752.jpeg'),
(14, 46, '/uploads/1752557417776.jpg'),
(15, 47, '/uploads/1752557476319.jpg'),
(16, 47, '/uploads/1752557476324.jpg'),
(17, 47, '/uploads/1752557476326.png');

-- --------------------------------------------------------

--
-- Table structure for table `item_status`
--

CREATE TABLE `item_status` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `item_status`
--

INSERT INTO `item_status` (`id`, `name`) VALUES
(4, 'Cancelled'),
(3, 'Delivered'),
(1, 'Pending'),
(2, 'Processing'),
(5, 'Returned');

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '2012_06_08_000002_create_statuses_table', 1),
(2, '2013_06_08_000003_create_roles_table', 1),
(3, '2014_10_12_000000_create_users_table', 1),
(4, '2014_10_12_100000_create_password_reset_tokens_table', 1),
(5, '2019_08_19_000000_create_failed_jobs_table', 1),
(6, '2019_12_14_000001_create_personal_access_tokens_table', 1),
(7, '2024_06_08_000001_create_categories_table', 1),
(8, '2024_06_08_000005_create_types_table', 1),
(9, '2024_06_08_000007_create_items_table', 1),
(10, '2024_06_08_000009_create_orders_table', 1),
(11, '2024_06_08_000010_create_reviews_table', 1),
(12, '2025_06_08_000004_create_item_images_table copy', 1),
(13, '2025_06_09_000004_create_item_status_table', 1);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `purchased`
--

CREATE TABLE `purchased` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchased`
--

INSERT INTO `purchased` (`id`, `user_id`, `product_id`, `quantity`, `price`, `total_price`, `status_id`) VALUES
(1, 2, 1, 5, 77.78, 388.90, 1),
(2, 21, 32, 10, 99.99, 999.90, 2);

-- --------------------------------------------------------

--
-- Table structure for table `reviews`
--

CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `item_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `rating` tinyint(3) UNSIGNED NOT NULL,
  `comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`) VALUES
(1, 'admin'),
(2, 'customer');

-- --------------------------------------------------------

--
-- Table structure for table `statuses`
--

CREATE TABLE `statuses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `statuses`
--

INSERT INTO `statuses` (`id`, `name`) VALUES
(1, 'Active'),
(2, 'Inactive');

-- --------------------------------------------------------

--
-- Table structure for table `types`
--

CREATE TABLE `types` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `types`
--

INSERT INTO `types` (`id`, `name`, `created_at`, `updated_at`) VALUES
(1, 'Acrylic Stand', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(2, 'Keychain', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(3, 'Plushie', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(4, 'Figure', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(5, 'Badge', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(6, 'T-shirt', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(7, 'Hoodie', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(8, 'Poster', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(9, 'Tapestry', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(10, 'Sticker', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(11, 'Mug', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(12, 'Clear File', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(13, 'Phone Case', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(14, 'Mousepad', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(15, 'Art Book', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(16, 'CD', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(17, 'Blu-ray', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(18, 'Cosplay Costume', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(19, 'Pin', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(20, 'Wallet', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(21, 'Bag', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(22, 'Notebook', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(23, 'Calendar', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(24, 'Gacha Capsule', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(25, 'Trading Card', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(26, 'Wristband', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(27, 'Charm', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(28, 'Desk Mat', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(29, 'Bottle', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(30, 'Lanyard', '2025-07-04 02:04:33', '2025-07-04 02:04:33'),
(31, 'Mask', '2025-07-04 02:04:33', '2025-07-04 02:04:33');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `status_id` bigint(20) UNSIGNED DEFAULT NULL,
  `role_id` bigint(20) UNSIGNED DEFAULT NULL,
  `auth_token` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `status_id`, `role_id`, `auth_token`) VALUES
(1, 'Admin Gacha', 'admin@gachagoods.com', '2025-07-04 02:04:32', '$2b$10$JNr13sp2zGQ.3dyWJQA44ehs53my0OVgPpfHsz7XihbCp/AcCJh5y', 1, 1, NULL),
(2, 'Aqua Minato', 'aqua@gachagoods.com', '2025-07-04 02:04:32', '$2b$10$JNr13sp2zGQ.3dyWJQA44ehs53my0OVgPpfHsz7XihbCp/AcCJh5y', 1, 2, NULL),
(3, 'Kizuna AI', 'kizuna@gachagoods.com', '2025-07-04 02:04:32', '$2b$10$JNr13sp2zGQ.3dyWJQA44ehs53my0OVgPpfHsz7XihbCp/AcCJh5y', 1, 2, NULL),
(4, 'Rem', 'rem@gachagoods.com', '2025-07-04 02:04:32', '$2b$10$JNr13sp2zGQ.3dyWJQA44ehs53my0OVgPpfHsz7XihbCp/AcCJh5y', 1, 2, NULL),
(5, 'Emilia', 'emilia@gachagoods.com', '2025-07-04 02:04:32', '$2b$10$JNr13sp2zGQ.3dyWJQA44ehs53my0OVgPpfHsz7XihbCp/AcCJh5y', 1, 2, NULL),
(6, 'Megumin', 'megumin@gachagoods.com', '2025-07-04 02:04:32', '$2b$10$JNr13sp2zGQ.3dyWJQA44ehs53my0OVgPpfHsz7XihbCp/AcCJh5y', 1, 2, NULL),
(7, 'Shiro', 'shiro@gachagoods.com', '2025-07-04 02:04:32', '$2b$10$JNr13sp2zGQ.3dyWJQA44ehs53my0OVgPpfHsz7XihbCp/AcCJh5y', 1, 2, NULL),
(8, 'Kirito', 'kirito@gachagoods.com', '2025-07-04 02:04:32', '$2b$10$JNr13sp2zGQ.3dyWJQA44ehs53my0OVgPpfHsz7XihbCp/AcCJh5y', 1, 2, NULL),
(9, 'Asuna', 'asuna@gachagoods.com', '2025-07-04 02:04:32', '$2b$10$JNr13sp2zGQ.3dyWJQA44ehs53my0OVgPpfHsz7XihbCp/AcCJh5y', 1, 2, NULL),
(10, 'Zero Two', 'zerotwo@gachagoods.com', '2025-07-04 02:04:32', '$2b$10$JNr13sp2zGQ.3dyWJQA44ehs53my0OVgPpfHsz7XihbCp/AcCJh5y', 1, 2, NULL),
(11, 'Nezuko', 'nezuko@gachagoods.com', '2025-07-04 02:04:32', '$2b$10$JNr13sp2zGQ.3dyWJQA44ehs53my0OVgPpfHsz7XihbCp/AcCJh5y', 1, 2, NULL),
(12, 'Tanjiro', 'tanjiro@gachagoods.com', '2025-07-04 02:04:32', '$2b$10$JNr13sp2zGQ.3dyWJQA44ehs53my0OVgPpfHsz7XihbCp/AcCJh5y', 1, 2, NULL),
(13, 'Sakura', 'sakura@gachagoods.com', '2025-07-04 02:04:32', '$2b$10$JNr13sp2zGQ.3dyWJQA44ehs53my0OVgPpfHsz7XihbCp/AcCJh5y', 1, 2, NULL),
(14, 'Naruto', 'naruto@gachagoods.com', '2025-07-04 02:04:33', '$2b$10$JNr13sp2zGQ.3dyWJQA44ehs53my0OVgPpfHsz7XihbCp/AcCJh5y', 1, 2, NULL),
(15, 'Inactive Otaku', 'inactive@gachagoods.com', '2025-07-04 02:04:33', '$2b$10$JNr13sp2zGQ.3dyWJQA44ehs53my0OVgPpfHsz7XihbCp/AcCJh5y', 2, 2, NULL),
(16, 'Piad', 'evanpiad05@gmail.com', NULL, '$2b$10$gbcca1Ae0TcJtJIQmmXGBejJBah9rX73UdE7iNeP01fm1pXStVlDS', 1, 2, NULL),
(17, 'Jemuel malaga', 'joshbernabe0829@gmail.com', NULL, '$2b$10$k1yTKP1/GJ/uabvDX.mVs.ty8y7KAg98JZdtF7Ff2YpmBs8KRE3Xa', 1, 2, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsIm5hbWUiOiJKZW11ZWwgbWFsYWdhIiwiZW1haWwiOiJqb3NoYmVybmFiZTA4MjlAZ21haWwuY29tIiwicm9sZV9pZCI6Miwic3RhdHVzX2lkIjoxLCJpYXQiOjE3NTI3NjU0MDEsImV4cCI6MTc1Mjc2OTAwMX0.FZu67GMpnmbXY_uZzsxNSZcMuVkS2pcZyyBiMhCfTog'),
(18, 'Alvin Yago Comp Org', 'loisegarcia07@gmail.com', NULL, '$2b$10$4vYEJ5Oy3cU1t6SDNGkfx.ZsaBfoMDvY9IQBJq9sbFpe1p9ziEsYi', 1, 2, NULL),
(19, 'ADEALIX JAIRON MARANAN', 'johndoughpractice@gmail.com', NULL, '$2b$10$kyZaf1MjsRB0vxx0rv4Wcuy31iJ.IzEz92TpunWwG3u1.c9ItsB62', 1, 2, NULL),
(20, 'JastineTomonComprog3Kahit2ndYear', 'roshielbernabe@yahoo.com.ph', NULL, '$2b$10$rTcwg/DaEOw3yaTg6ynPseRwEwVodHqfoXrZN0KpkSE8.iGTVjDk2', 1, 2, NULL),
(21, 'Rovic Abonita', 'axistheminecraftexpert@gmail.com', NULL, '$2b$10$d0cjFIYi4V2fhS4BLNQxmOFYLpCSUzkZJ6YpXFjsxGLNnP90B7aB6', 1, 2, NULL),
(22, 'Chelvin Campos', 'sakitenma176@gmail.com', NULL, '$2b$10$dkI6kDNcCH2YIRcgNPW2euMQj.zVpa78LO38qQcypOXdEhqyr9eh6', 1, 1, NULL),
(23, 'NISTOR VALDES', 'mosyhub@gmail.com', NULL, '$2b$10$sN6ef8fCUh4DvR2lLlieL.ESEILmPXPGgP7nok8QhewZb0f9QxvJa', 2, 2, NULL),
(24, 'KiM MARiELLE PLANiLLO', 'mthreeelefex@gmail.com', NULL, '$2b$10$GtYuCo9rM79AnVmgBprE9.UO1WFRDYvI7pAtyQaTFBFK2tt/qefjO', 1, 2, NULL),
(25, 'Lappay Grande', 'juskolord2ndyearkanawalakapangsirdalisay@gmail.com', NULL, '$2b$10$DhyhnlvhRHsxp./9ykkuD.YaRbi9YqrpquZxWP0.UPPb.8LXJoJIC', 1, 2, NULL),
(26, 'Jexel Manalo', '2ndyearvisualbasic@gmail.com', NULL, '$2b$10$dT1P3u9gTXFeuEg8.Bw1HeqHGV6tA.6wyl8EtGvOgE3HrF.Rhmiqm', 1, 2, NULL),
(27, 'Jett axel talaba', 'oystersss@gmail.com', NULL, '$2b$10$vAMPCdlCiqBpVkXu7Ffl5.ROTEzvMZ05NVuzAB09FUsDA9LoYwH9S', 1, 2, NULL),
(28, 'FLINT CELETARIA THE GREAT', 'flintaxl05@gmail.com', NULL, '$2b$10$6cdIg09XfVvhrEtiL5vVm.zptKwYW5TjaApxYWdnDUUHJ8pNs6osG', 1, 2, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_name_unique` (`name`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `items_category_id_foreign` (`category_id`),
  ADD KEY `items_type_id_foreign` (`type_id`);

--
-- Indexes for table `item_images`
--
ALTER TABLE `item_images`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_images_item_id_foreign` (`item_id`);

--
-- Indexes for table `item_status`
--
ALTER TABLE `item_status`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `item_status_name_unique` (`name`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`);

--
-- Indexes for table `purchased`
--
ALTER TABLE `purchased`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `status_id` (`status_id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reviews_item_id_foreign` (`item_id`),
  ADD KEY `reviews_user_id_foreign` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_name_unique` (`name`);

--
-- Indexes for table `statuses`
--
ALTER TABLE `statuses`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `statuses_name_unique` (`name`);

--
-- Indexes for table `types`
--
ALTER TABLE `types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `types_name_unique` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD KEY `users_status_id_foreign` (`status_id`),
  ADD KEY `users_role_id_foreign` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=39;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- AUTO_INCREMENT for table `item_images`
--
ALTER TABLE `item_images`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `item_status`
--
ALTER TABLE `item_status`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `purchased`
--
ALTER TABLE `purchased`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `statuses`
--
ALTER TABLE `statuses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `types`
--
ALTER TABLE `types`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cart`
--
ALTER TABLE `cart`
  ADD CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `items`
--
ALTER TABLE `items`
  ADD CONSTRAINT `items_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `items_type_id_foreign` FOREIGN KEY (`type_id`) REFERENCES `types` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `item_images`
--
ALTER TABLE `item_images`
  ADD CONSTRAINT `item_images_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `purchased`
--
ALTER TABLE `purchased`
  ADD CONSTRAINT `purchased_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchased_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `purchased_ibfk_3` FOREIGN KEY (`status_id`) REFERENCES `item_status` (`id`);

--
-- Constraints for table `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_item_id_foreign` FOREIGN KEY (`item_id`) REFERENCES `items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reviews_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `users_status_id_foreign` FOREIGN KEY (`status_id`) REFERENCES `statuses` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
