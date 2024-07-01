-- phpMyAdmin SQL Dump
-- version 4.9.10
-- https://www.phpmyadmin.net/
--
-- Host: db5000988999.hosting-data.io
-- Generation Time: Nov 02, 2022 at 06:29 PM
-- Server version: 5.7.38-log
-- PHP Version: 7.0.33-0+deb9u12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `dbs858623`
--

-- --------------------------------------------------------

--
-- Table structure for table `currencies`
--

CREATE TABLE `currencies` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `from` char(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `to` char(3) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `from_to` char(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `from_name` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `to_name` char(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `decimal_digits` tinyint(4) DEFAULT NULL,
  `rate` decimal(15,2) NOT NULL DEFAULT '0.00',
  `amount` decimal(15,2) NOT NULL DEFAULT '0.00',
  `result` decimal(15,2) NOT NULL DEFAULT '0.00',
  `deleted` tinyint(1) DEFAULT NULL,
  `deleted_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `currencies`
--

INSERT INTO `currencies` (`id`, `from`, `to`, `from_to`, `from_name`, `to_name`, `decimal_digits`, `rate`, `amount`, `result`, `deleted`, `deleted_at`, `created_at`, `updated_at`) VALUES
(1, 'XAU', 'CAD', 'XAU_CAD', 'Gold Ounce', 'Canadian Dollar', 2, '2260.50', '15.00', '2260.50', NULL, NULL, '2022-10-24 16:17:43', '2022-11-02 12:04:17'),
(2, 'XAU', 'USD', 'XAU_USD', 'Gold Ounce', 'US Dollar', 2, '1648.18', '10.00', '41204.50', NULL, NULL, '2022-10-24 16:20:28', '2022-11-02 12:03:01'),
(3, 'XAU', 'EUR', 'XAU_EUR', 'Gold Ounce', 'Euro', 2, '1673.47', '300.00', '1673.47', NULL, NULL, '2022-10-24 16:18:56', '2022-11-02 12:03:14'),
(4, 'XAU', 'XOF', 'XAU_XOF', 'Gold Ounce', 'CFA Franc BCEAO', 0, '1091966.22', '200.00', '1091966.22', NULL, NULL, '2022-10-25 15:20:43', '2022-10-26 15:46:45'),
(5, 'XAU', 'IRR', 'XAU_IRR', 'Gold Ounce', 'Iranian Rial', 2, '70662568.53', '1.00', '70662568.53', NULL, NULL, '2022-10-26 19:54:03', '2022-10-26 19:54:04'),
(6, 'XAU', 'RUB', 'XAU_RUB', 'Gold Ounce', 'Russian Ruble', 2, '102151.20', '1.00', '102151.20', NULL, NULL, '2022-10-26 19:49:34', '2022-10-26 19:49:35'),
(7, 'XAU', 'AUD', 'XAU_AUD', 'Gold Ounce', 'Australian Dollar', 2, '2613.13', '15.00', '2613.13', NULL, NULL, '2022-10-25 01:02:22', '2022-11-02 12:04:37'),
(8, 'XAU', 'NZD', 'XAU_NZD', 'Gold Ounce', 'New Zealand Dollar', 2, '2858.88', '10.00', '2858.88', NULL, NULL, '2022-10-26 19:51:34', '2022-11-02 12:05:13'),
(9, 'XAU', 'ZAR', 'XAU_ZAR', 'Gold Ounce', 'South African Rand', 2, '30364.52', '100.00', '30364.52', NULL, NULL, '2022-10-25 05:30:18', '2022-10-26 14:25:53'),
(10, 'XAU', 'UYU', 'XAU_UYU', 'Gold Ounce', 'Uruguayan Peso', 2, '67658.03', '300.00', '67658.03', NULL, NULL, '2022-10-25 01:11:27', '2022-10-26 19:45:28'),
(11, 'XAU', 'ZMK', 'XAU_ZMK', 'Gold Ounce', 'Zambian Kwacha', 2, '15023909.70', '1.00', '15023909.70', NULL, NULL, '2022-10-26 16:04:55', '2022-10-26 16:05:16'),
(12, 'XAU', 'UZS', 'XAU_UZS', 'Gold Ounce', 'Uzbekistan Som', NULL, '18221090.71', '300.00', '18221090.71', NULL, NULL, '2022-10-25 05:32:57', '2022-10-26 19:45:25'),
(13, 'XAU', 'XAF', 'XAU_XAF', 'Gold Ounce', 'CFA Franc BEAC', NULL, '1090293.23', '20.00', '1090293.23', NULL, NULL, '2022-10-25 15:33:18', '2022-11-02 22:11:33'),
(14, 'XAU', 'UGX', 'XAU_UGX', 'Gold Ounce', 'Ugandan Shilling', NULL, '6248669.01', '300.00', '6248669.01', NULL, NULL, '2022-10-25 05:23:16', '2022-10-26 19:45:32'),
(15, 'XAU', 'AFN', 'XAU_AFN', 'Gold Ounce', 'Afghan Afghani', NULL, '145761.18', '1.00', '145761.18', NULL, NULL, '2022-11-02 22:01:46', '2022-11-02 22:01:47'),
(16, 'XAU', 'KES', 'XAU_KES', 'Gold Ounce', 'Kenyan Shilling', 2, '202220.58', '1.00', '202220.58', NULL, NULL, '2022-10-26 19:53:42', '2022-10-26 20:42:46'),
(17, 'XAU', 'LYD', 'XAU_LYD', 'Gold Ounce', 'Libyan Dinar', 3, '8366.56', '0.00', '0.00', NULL, NULL, '2022-10-26 19:52:54', '2022-10-26 20:44:43'),
(18, 'XAU', 'KWD', 'XAU_KWD', 'Gold Ounce', 'Kuwaiti Dinar', 3, '516.61', '0.00', '0.00', NULL, NULL, '2022-10-26 19:53:23', '2022-10-26 20:45:44'),
(19, 'XAU', 'VEF', 'XAU_VEF', 'Gold Ounce', 'Venezuelan Bolívar', 2, '1399258697.56', '300.00', '0.00', NULL, NULL, '2022-10-26 16:07:42', '2022-11-02 03:07:08'),
(20, 'XAU', 'AED', 'XAU_AED', 'Gold Ounce', 'United Arab Emirates Dirham', 2, '6021.32', '1.00', '6021.32', NULL, NULL, '2022-10-25 14:40:28', '2022-10-25 14:40:29'),
(21, 'XAU', 'JOD', 'XAU_JOD', 'Gold Ounce', 'Jordanian Dinar', 3, '1182.23', '1.00', '1156.13', NULL, NULL, '2022-10-26 19:53:51', '2022-10-26 20:56:37'),
(22, 'XAU', 'KMF', 'XAU_KMF', 'Gold Ounce', 'Comorian Franc', NULL, '814245.02', '300.00', '826325.61', NULL, NULL, '2022-10-26 19:53:33', '2022-11-01 21:56:05'),
(23, 'XAU', 'LKR', 'XAU_LKR', 'Gold Ounce', 'Sri Lankan Rupee', 2, '608794.35', '1.00', '608794.35', NULL, NULL, '2022-10-26 19:53:07', '2022-10-26 19:53:08'),
(24, 'XAU', 'MKD', 'XAU_MKD', 'Gold Ounce', 'Macedonian Denar', 2, '102596.33', '1.00', '102596.33', NULL, NULL, '2022-10-26 19:52:34', '2022-10-26 19:52:34'),
(25, 'XAU', 'LBP', 'XAU_LBP', 'Gold Ounce', 'Lebanese Pound', NULL, '2536519.98', '1.00', '2536519.98', NULL, NULL, '2022-10-26 19:53:13', '2022-10-26 19:53:13'),
(26, 'XAU', 'ALL', 'XAU_ALL', 'Gold Ounce', 'Albanian Lek', 2, '197600.91', '1.00', '197600.91', NULL, NULL, '2022-11-02 22:01:51', '2022-11-02 22:01:51'),
(27, 'XAU', 'AMD', 'XAU_AMD', 'Gold Ounce', 'Armenian Dram', 2, '658160.61', '1.00', '658160.61', NULL, NULL, '2022-10-26 06:14:07', '2022-10-26 06:14:07'),
(28, 'XAU', 'YER', 'XAU_YER', 'Gold Ounce', 'Yemeni Rial', NULL, '417610.75', '1.00', '417610.75', NULL, NULL, '2022-10-26 16:07:24', '2022-10-26 16:07:34'),
(29, 'XAU', 'CNY', 'XAU_CNY', 'Gold Ounce', 'Chinese Yuan', 2, '11960.05', '0.00', '0.00', NULL, NULL, '2022-10-26 20:58:41', '2022-10-26 20:58:41'),
(30, 'XAU', 'VND', 'XAU_VND', 'Gold Ounce', 'Vietnamese Dong', NULL, '40947682.00', '1.00', '40947682.00', NULL, NULL, '2022-11-01 21:24:03', '2022-11-01 21:24:04'),
(31, 'XAU', 'ARS', 'XAU_ARS', 'Gold Ounce', 'Argentine Peso', 2, '261618.91', '1.00', '261618.91', NULL, NULL, '2022-11-02 22:03:03', '2022-11-02 22:03:04'),
(32, 'XAU', 'BDT', 'XAU_BDT', 'Gold Ounce', 'Bangladeshi Taka', 2, '169514.91', '1.00', '169514.91', NULL, NULL, '2022-11-02 22:26:34', '2022-11-02 22:26:35'),
(33, 'XAU', 'TRY', 'XAU_TRY', 'Gold Ounce', 'Turkish Lira', 2, '30772.52', '1.00', '30772.52', NULL, NULL, '2022-11-02 11:59:39', '2022-11-02 11:59:39'),
(34, 'XAU', 'TOP', 'XAU_TOP', 'Gold Ounce', 'Tongan Paʻanga', 2, '3986.93', '1.00', '3986.93', NULL, NULL, '2022-11-02 21:51:54', '2022-11-02 21:51:56'),
(35, 'XAU', 'BOB', 'XAU_BOB', 'Gold Ounce', 'Bolivian Boliviano', 2, '11304.36', '15.00', '11304.36', NULL, NULL, '2022-10-06 03:40:32', '2022-11-02 22:23:05'),
(36, 'XAU', 'BGN', 'XAU_BGN', 'Gold Ounce', 'Bulgarian Lev', 2, '168170.32', '1.00', '168170.32', NULL, NULL, '2022-10-06 03:40:32', '2022-11-02 21:54:46'),
(37, 'XAU', 'UAH', 'XAU_UAH', 'Gold Ounce', 'Ukrainian Hryvnia', 2, '63439.05', '300.00', '63439.05', NULL, NULL, '2022-10-06 13:13:09', '2022-10-26 19:45:36'),
(38, 'XAU', 'BYN', 'XAU_BYN', 'Gold Ounce', 'Belarusian Ruble', 2, '4185.83', '10.00', '4185.83', NULL, NULL, '2022-10-06 13:13:09', '2022-11-02 22:22:40'),
(39, 'XAU', 'CLP', 'XAU_CLP', 'Gold Ounce', 'Chilean Peso', NULL, '1602805.06', '1.00', '1602805.06', NULL, NULL, '2022-10-18 21:46:48', '2022-10-22 10:35:12'),
(40, 'XAU', 'COP', 'XAU_COP', 'Gold Ounce', 'Colombian Peso', NULL, '7883577.69', '1.00', '7883577.69', NULL, NULL, '2022-10-18 21:46:51', '2022-10-22 10:36:19'),
(41, 'XAU', 'PYG', 'XAU_PYG', 'Gold Ounce', 'Paraguayan Guarani', NULL, '11830722.84', '1.00', '11830722.84', NULL, NULL, '2022-10-18 21:46:51', '2022-10-22 10:35:14'),
(42, 'XAU', 'HNL', 'XAU_HNL', 'Gold Ounce', 'Honduran Lempira', 2, '40911.11', '1.00', '40911.11', NULL, NULL, '2022-10-18 21:46:55', '2022-10-22 10:36:19'),
(43, 'XAU', 'SYP', 'XAU_SYP', 'Gold Ounce', 'Syrian Pound', 2, '4150724.74', '2.00', '4150724.74', NULL, NULL, '2022-10-18 21:46:55', '2022-10-25 05:30:38'),
(44, 'XAU', 'KHR', 'XAU_KHR', 'Gold Ounce', 'Cambodian Riel', 2, '68458.70', '2.00', '68458.70', NULL, NULL, '2022-10-18 21:47:02', '2022-10-22 10:36:21'),
(45, 'XAU', 'MZN', 'XAU_MZN', 'Gold Ounce', 'Mozambican Metical', 2, '105529.53', '1.00', '105529.53', NULL, NULL, '2022-10-18 21:47:02', '2022-10-26 06:11:52'),
(46, 'XAU', 'MXN', 'XAU_MXN', 'Gold Ounce', 'Mexican Peso', 2, '33085.34', '0.00', '33085.34', NULL, NULL, '2022-10-18 21:47:06', '2022-10-22 10:35:58'),
(47, 'XAU', 'EEK', 'XAU_EEK', 'Gold Ounce', 'Estonian Kroon', 2, '25884.33', '300.00', '0.00', NULL, NULL, '2022-10-18 21:51:00', '2022-10-29 13:06:37'),
(48, 'XAU', 'SEK', 'XAU_SEK', 'Gold Ounce', 'Swedish Krona', 2, '18165.53', '1.00', '18165.53', NULL, NULL, '2022-10-18 21:51:00', '2022-10-26 06:12:40'),
(49, 'XAU', 'EGP', 'XAU_EGP', 'Gold Ounce', 'Egyptian Pound', 2, '32174.10', '1.00', '32174.10', NULL, NULL, '2022-10-18 21:51:28', '2022-10-22 10:36:01'),
(50, 'XAU', 'KRW', 'XAU_KRW', 'Gold Ounce', 'South Korean Won', NULL, '2364822.93', '1.00', '2364822.93', NULL, NULL, '2022-10-18 21:51:28', '2022-10-26 06:15:02'),
(51, 'XAU', 'ZWL', 'XAU_ZWL', 'Gold Ounce', 'Zimbabwean Dollar', NULL, '531886.98', '5.00', '531886.98', NULL, NULL, '2022-10-18 21:52:20', '2022-11-02 22:11:37'),
(52, 'XAU', 'INR', 'XAU_INR', 'Gold Ounce', 'Indian Rupee', 2, '136907.43', '15.00', '136907.43', NULL, NULL, '2022-10-18 21:52:20', '2022-10-26 15:41:16'),
(53, 'XAU', 'DKK', 'XAU_DKK', 'Gold Ounce', 'Danish Krone', 2, '12394.27', '1.00', '12394.27', NULL, NULL, '2022-10-20 03:54:25', '2022-10-22 10:36:03'),
(54, 'XAU', 'ETB', 'XAU_ETB', 'Gold Ounce', 'Ethiopian Birr', 2, '85978.66', '300.00', '85978.66', NULL, NULL, '2022-10-20 04:20:33', '2022-11-01 15:44:03'),
(55, 'XAU', 'MOP', 'XAU_MOP', 'Gold Ounce', 'Macanese Pataca', 2, '13172.40', '1.00', '13172.40', NULL, NULL, '2022-10-20 04:21:48', '2022-10-22 10:33:30'),
(56, 'XAU', 'NAD', 'XAU_NAD', 'Gold Ounce', 'Namibian Dollar', 2, '29751.37', '1.00', '29751.37', NULL, NULL, '2022-10-20 04:24:25', '2022-10-22 10:33:31'),
(57, 'XAU', 'BZD', 'XAU_BZD', 'Gold Ounce', 'Belize Dollar', 2, '3291.31', '300.00', '3291.31', NULL, NULL, '2022-10-20 12:33:23', '2022-11-02 22:22:29'),
(58, 'XAU', 'GTQ', 'XAU_GTQ', 'Gold Ounce', 'Guatemalan Quetzal', 2, '12818.01', '500.00', '12818.01', NULL, NULL, '2022-10-20 12:41:23', '2022-10-25 04:47:59'),
(59, 'XAU', 'IDR', 'XAU_IDR', 'Gold Ounce', 'Indonesian Rupiah', NULL, '25490429.65', '1.00', '25490429.65', NULL, NULL, '2022-10-20 12:42:11', '2022-10-22 10:33:33'),
(60, 'XAU', 'AZN', 'XAU_AZN', 'Gold Ounce', 'Azerbaijani Manat', 2, '2774.79', '1.00', '2774.79', NULL, NULL, '2022-10-20 12:50:05', '2022-10-22 10:35:17'),
(61, 'XAU', 'CVE', 'XAU_CVE', 'Gold Ounce', 'Cape Verdean Escudo', 2, '184345.86', '300.00', '184345.86', NULL, NULL, '2022-10-20 13:12:11', '2022-10-26 20:38:01'),
(62, 'XAU', 'BAM', 'XAU_BAM', 'Gold Ounce', 'Bosnia-Herzegovina Convertible Mark', 2, '3272.14', '1.00', '3272.14', NULL, NULL, '2022-10-20 13:23:56', '2022-10-22 10:33:34'),
(63, 'XAU', 'DOP', 'XAU_DOP', 'Gold Ounce', 'Dominican Peso', 2, '87984.53', '1.00', '87984.53', NULL, NULL, '2022-10-20 13:25:33', '2022-10-22 10:35:18'),
(64, 'XAU', 'DZD', 'XAU_DZD', 'Gold Ounce', 'Algerian Dinar', 2, '229543.61', '1.00', '229543.61', NULL, NULL, '2022-10-20 13:26:02', '2022-10-22 10:36:06'),
(65, 'XAU', 'GHS', 'XAU_GHS', 'Gold Ounce', 'Ghanaian Cedi', 2, '21489.41', '1.00', '21489.41', NULL, NULL, '2022-10-20 15:16:02', '2022-10-22 10:35:46'),
(66, 'XAU', 'GBP', 'XAU_GBP', 'Gold Ounce', 'British Pound Sterling', 2, '1458.28', '1.00', '1458.28', NULL, NULL, '2022-10-20 15:19:08', '2022-10-22 10:35:46'),
(67, 'XAU', 'ISK', 'XAU_ISK', 'Gold Ounce', 'Icelandic Króna', NULL, '235781.85', '0.00', '235781.85', NULL, NULL, '2022-10-20 20:01:41', '2022-10-22 10:35:45'),
(68, 'XAU', 'HRK', 'XAU_HRK', 'Gold Ounce', 'Croatian Kuna', 2, '12473.03', '1.00', '12473.03', NULL, NULL, '2022-10-20 20:05:49', '2022-10-26 19:54:32'),
(69, 'XAU', 'HKD', 'XAU_HKD', 'Gold Ounce', 'Hong Kong Dollar', 2, '13082.25', '1.00', '13082.25', NULL, NULL, '2022-10-20 21:16:25', '2022-10-26 19:54:41'),
(70, 'XAU', 'BRL', 'XAU_BRL', 'Gold Ounce', 'Brazilian Real', 2, '8916.64', '15.00', '0.00', NULL, NULL, '2022-10-20 23:46:54', '2022-11-02 22:22:53'),
(71, 'XAU', 'ILS', 'XAU_ILS', 'Gold Ounce', 'Israeli New Sheqel', 2, '5822.14', '1.00', '5822.14', NULL, NULL, '2022-10-20 23:55:54', '2022-10-26 19:54:18'),
(72, 'XAU', 'ERN', 'XAU_ERN', 'Gold Ounce', 'Eritrean Nakfa', 2, '24744.30', '1.00', '24744.30', NULL, NULL, '2022-10-21 01:34:00', '2022-10-25 01:06:49'),
(73, 'XAU', 'BND', 'XAU_BND', 'Gold Ounce', 'Brunei Dollar', 2, '2314.33', '5.00', '2314.33', NULL, NULL, '2022-10-21 01:49:14', '2022-11-02 22:23:10'),
(74, 'XAU', 'CZK', 'XAU_CZK', 'Gold Ounce', 'Czech Republic Koruna', 2, '40804.35', '96.00', '40804.35', NULL, NULL, '2022-10-21 01:57:29', '2022-10-26 16:03:20'),
(75, 'XAU', 'GEL', 'XAU_GEL', 'Gold Ounce', 'Georgian Lari', 2, '4631.36', '0.00', '0.00', NULL, NULL, '2022-10-21 02:52:08', '2022-10-26 21:02:24'),
(76, 'XAU', 'GNF', 'XAU_GNF', 'Gold Ounce', 'Guinean Franc', NULL, '14590732.69', '1.00', '14590732.69', NULL, NULL, '2022-10-21 02:59:50', '2022-10-26 19:54:51'),
(77, 'XAU', 'IQD', 'XAU_IQD', 'Gold Ounce', 'Iraqi Dinar', NULL, '2433177.60', '1.00', '2433177.60', NULL, NULL, '2022-10-21 03:01:26', '2022-10-26 19:54:08'),
(78, 'XAU', 'NPR', 'XAU_NPR', 'Gold Ounce', 'Nepalese Rupee', 2, '218646.21', '1.00', '218646.21', NULL, NULL, '2022-10-21 03:01:58', '2022-10-26 19:51:39'),
(79, 'XAU', 'KZT', 'XAU_KZT', 'Gold Ounce', 'Kazakhstani Tenge', 2, '770189.48', '1.00', '770189.48', NULL, NULL, '2022-10-21 03:02:49', '2022-10-25 14:36:47'),
(80, 'XAU', 'PHP', 'XAU_PHP', 'Gold Ounce', 'Philippine Peso', 2, '97038.81', '1.00', '97038.81', NULL, NULL, '2022-10-21 03:13:10', '2022-10-26 19:50:17'),
(81, 'XAU', 'HUF', 'XAU_HUF', 'Gold Ounce', 'Hungarian Forint', NULL, '680490.44', '1.00', '680490.44', NULL, NULL, '2022-10-21 04:12:36', '2022-10-22 10:33:41'),
(82, 'XAU', 'SAR', 'XAU_SAR', 'Gold Ounce', 'Saudi Riyal', 2, '6273.70', '1.00', '6273.70', NULL, NULL, '2022-10-21 20:48:06', '2022-10-26 15:52:45'),
(83, 'XAU', 'SOS', 'XAU_SOS', 'Gold Ounce', 'Somali Shilling', NULL, '949688.77', '96.00', '949688.77', NULL, NULL, '2022-10-25 01:12:24', '2022-10-26 16:04:28'),
(84, 'XAU', 'TTD', 'XAU_TTD', 'Gold Ounce', 'Trinidad and Tobago Dollar', 2, '11312.70', '300.00', '11312.70', NULL, NULL, '2022-10-25 01:12:24', '2022-10-26 19:45:47'),
(85, 'XAU', 'TZS', 'XAU_TZS', 'Gold Ounce', 'Tanzanian Shilling', NULL, '3887691.83', '300.00', '3887691.83', NULL, NULL, '2022-10-25 01:12:24', '2022-10-26 19:45:39'),
(86, 'XAU', 'PKR', 'XAU_PKR', 'Gold Ounce', 'Pakistani Rupee', NULL, '365801.22', '10.00', '365801.22', NULL, NULL, '2022-10-25 01:12:24', '2022-11-02 22:11:47'),
(87, 'XAU', 'TWD', 'XAU_TWD', 'Gold Ounce', 'New Taiwan Dollar', 2, '53732.39', '300.00', '53732.39', NULL, NULL, '2022-10-26 16:12:38', '2022-10-26 19:45:43'),
(88, 'XAU', 'TND', 'XAU_TND', 'Gold Ounce', 'Tunisian Dinar', 3, '5402.99', '1.00', '5402.99', NULL, NULL, '2022-10-26 19:45:57', '2022-10-26 19:45:58'),
(89, 'XAU', 'THB', 'XAU_THB', 'Gold Ounce', 'Thai Baht', 2, '62851.99', '20.00', '62851.99', NULL, NULL, '2022-10-26 19:45:57', '2022-11-02 22:11:41'),
(90, 'XAU', 'SGD', 'XAU_SGD', 'Gold Ounce', 'Singapore Dollar', 2, '2343.58', '200.00', '2343.58', NULL, NULL, '2022-10-26 19:49:09', '2022-11-02 22:11:51'),
(91, 'XAU', 'SDG', 'XAU_SDG', 'Gold Ounce', 'Sudanese Pound', 2, '956081.24', '1.00', '956081.24', NULL, NULL, '2022-10-26 19:49:18', '2022-10-26 19:49:19'),
(92, 'XAU', 'RWF', 'XAU_RWF', 'Gold Ounce', 'Rwandan Franc', NULL, '1747949.11', '5.00', '1747949.11', NULL, NULL, '2022-10-26 19:49:27', '2022-11-02 22:11:44'),
(93, 'XAU', 'RSD', 'XAU_RSD', 'Gold Ounce', 'Serbian Dinar', NULL, '194232.69', '1.00', '194232.69', NULL, NULL, '2022-10-26 19:49:40', '2022-10-26 19:49:41'),
(94, 'XAU', 'RON', 'XAU_RON', 'Gold Ounce', 'Romanian Leu', 2, '8072.91', '1.00', '8072.91', NULL, NULL, '2022-10-26 19:49:45', '2022-10-26 19:49:46'),
(95, 'XAU', 'QAR', 'XAU_QAR', 'Gold Ounce', 'Qatari Rial', 2, '6069.48', '1.00', '6069.48', NULL, NULL, '2022-10-26 19:49:52', '2022-10-26 19:49:52'),
(96, 'XAU', 'PLN', 'XAU_PLN', 'Gold Ounce', 'Polish Zloty', 2, '7874.46', '1.00', '7874.46', NULL, NULL, '2022-10-26 19:50:00', '2022-10-26 19:50:01'),
(97, 'XAU', 'PEN', 'XAU_PEN', 'Gold Ounce', 'Peruvian Nuevo Sol', 2, '6647.02', '1.00', '6647.02', NULL, NULL, '2022-10-26 19:51:20', '2022-10-26 19:51:21'),
(98, 'XAU', 'PAB', 'XAU_PAB', 'Gold Ounce', 'Panamanian Balboa', 2, '1666.02', '1.00', '1666.02', NULL, NULL, '2022-10-26 19:51:25', '2022-10-26 19:51:25'),
(99, 'XAU', 'OMR', 'XAU_OMR', 'Gold Ounce', 'Omani Rial', 3, '641.96', '1.00', '641.96', NULL, NULL, '2022-10-26 19:51:29', '2022-10-26 19:51:30'),
(100, 'XAU', 'NOK', 'XAU_NOK', 'Gold Ounce', 'Norwegian Krone', 2, '17097.14', '15.00', '17097.14', NULL, NULL, '2022-10-26 19:51:42', '2022-11-02 22:11:57'),
(101, 'XAU', 'NIO', 'XAU_NIO', 'Gold Ounce', 'Nicaraguan Córdoba', 2, '60504.29', '15.00', '60504.29', NULL, NULL, '2022-10-26 19:51:46', '2022-11-02 22:12:03'),
(102, 'XAU', 'NGN', 'XAU_NGN', 'Gold Ounce', 'Nigerian Naira', 2, '728547.59', '1.00', '728547.59', NULL, NULL, '2022-10-26 19:51:51', '2022-10-26 19:51:52'),
(103, 'XAU', 'MYR', 'XAU_MYR', 'Gold Ounce', 'Malaysian Ringgit', 2, '7889.83', '300.00', '7889.83', NULL, NULL, '2022-10-26 19:52:14', '2022-11-02 22:12:08'),
(104, 'XAU', 'MUR', 'XAU_MUR', 'Gold Ounce', 'Mauritian Rupee', NULL, '72983.36', '1.00', '72983.36', NULL, NULL, '2022-10-26 19:52:22', '2022-10-26 19:52:23'),
(105, 'XAU', 'MMK', 'XAU_MMK', 'Gold Ounce', 'Myanma Kyat', NULL, '3497227.46', '1.00', '3497227.46', NULL, NULL, '2022-10-26 19:52:30', '2022-10-26 19:52:31'),
(106, 'XAU', 'MGA', 'XAU_MGA', 'Gold Ounce', 'Malagasy Ariary', NULL, '7081711.26', '1.00', '7081711.26', NULL, NULL, '2022-10-26 19:52:38', '2022-10-26 19:52:39'),
(107, 'XAU', 'MDL', 'XAU_MDL', 'Gold Ounce', 'Moldovan Leu', 2, '32153.82', '0.00', '0.00', NULL, NULL, '2022-10-26 19:52:47', '2022-10-26 21:03:21'),
(108, 'XAU', 'MAD', 'XAU_MAD', 'Gold Ounce', 'Moroccan Dirham', 2, '18038.74', '0.00', '0.00', NULL, NULL, '2022-10-26 19:52:50', '2022-10-26 21:03:59'),
(109, 'XAU', 'LVL', 'XAU_LVL', 'Gold Ounce', 'Latvian Lats', 2, '1162.18', '0.00', '0.00', NULL, NULL, '2022-10-26 19:52:58', '2022-10-26 21:04:49'),
(110, 'XAU', 'LTL', 'XAU_LTL', 'Gold Ounce', 'Lithuanian Litas', 2, '4920.11', '1.00', '4920.11', NULL, NULL, '2022-10-26 19:53:02', '2022-10-26 19:53:03'),
(111, 'XAU', 'JPY', 'XAU_JPY', 'Gold Ounce', 'Japanese Yen', NULL, '244034.23', '0.00', '0.00', NULL, NULL, '2022-10-26 19:53:47', '2022-10-26 21:05:51'),
(112, 'XAU', 'JMD', 'XAU_JMD', 'Gold Ounce', 'Jamaican Dollar', 2, '823535.35', '1.00', '823535.35', NULL, NULL, '2022-10-26 19:53:55', '2022-10-26 19:53:56'),
(113, 'XAU', 'DJF', 'XAU_DJF', 'Gold Ounce', 'Djiboutian Franc', NULL, '296310.28', '0.00', '0.00', NULL, NULL, '2022-10-26 19:56:24', '2022-10-26 21:06:35'),
(114, 'XAU', 'CRC', 'XAU_CRC', 'Gold Ounce', 'Costa Rican Colón', NULL, '1030608.97', '0.00', '0.00', NULL, NULL, '2022-10-26 19:56:54', '2022-10-26 21:07:23'),
(115, 'XAU', 'CHF', 'XAU_CHF', 'Gold Ounce', 'Swiss Franc', 2, '1653.94', '1.00', '1653.94', NULL, NULL, '2022-11-02 21:54:40', '2022-11-02 22:21:14'),
(116, 'XAU', 'BHD', 'XAU_BHD', 'Gold Ounce', 'Bahraini Dinar', 3, '621.80', '15.00', '621.80', NULL, NULL, '2022-11-02 21:55:03', '2022-11-02 22:23:39'),
(117, 'XAU', 'BWP', 'XAU_BWP', 'Gold Ounce', 'Botswanan Pula', 2, '22043.96', '15.00', '22043.96', NULL, NULL, '2022-11-02 21:55:18', '2022-11-02 22:22:49'),
(118, 'XAU', 'CDF', 'XAU_CDF', 'Gold Ounce', 'Congolese Franc', 2, '3371914.90', '15.00', '3371914.90', NULL, NULL, '2022-11-02 21:55:24', '2022-11-02 22:22:18'),
(119, 'XAU', 'BIF', 'XAU_BIF', 'Gold Ounce', 'Burundian Franc', NULL, '3415268.15', '1.00', '3415268.15', NULL, NULL, '2022-11-02 22:23:18', '2022-11-02 22:23:31'),
(120, NULL, NULL, NULL, NULL, NULL, NULL, '0.00', '0.00', '0.00', 1, '2022-11-02 22:25:30', '2022-11-02 22:23:18', '2022-11-02 22:25:37'),
(121, NULL, NULL, NULL, NULL, NULL, NULL, '0.00', '0.00', '0.00', 1, '2022-11-02 22:25:27', '2022-11-02 22:23:18', '2022-11-02 22:25:40'),
(122, NULL, NULL, NULL, NULL, NULL, NULL, '0.00', '0.00', '0.00', 1, '2022-11-02 22:25:24', '2022-11-02 22:23:18', '2022-11-02 22:25:42'),
(123, NULL, NULL, NULL, NULL, NULL, NULL, '0.00', '0.00', '0.00', 1, '2022-11-02 22:25:21', '2022-11-02 22:23:18', '2022-11-02 22:25:45'),
(124, NULL, NULL, NULL, NULL, NULL, NULL, '0.00', '0.00', '0.00', 1, '2022-11-02 22:25:18', '2022-11-02 22:23:18', '2022-11-02 22:25:48'),
(125, NULL, NULL, NULL, NULL, NULL, NULL, '0.00', '0.00', '0.00', 1, '2022-11-02 22:25:16', '2022-11-02 22:23:18', '2022-11-02 22:25:51');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `currencies`
--
ALTER TABLE `currencies`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `currencies`
--
ALTER TABLE `currencies`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=126;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
