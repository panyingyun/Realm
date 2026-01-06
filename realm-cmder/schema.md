CREATE DATABASE IF NOT EXISTS realmdb default charset utf8 COLLATE utf8_general_ci;
use realmdb;

// mysql
CREATE TABLE `realm` (
   `id` bigint(20) NOT NULL PRIMARY KEY  AUTO_INCREMENT,
   `domain` varchar(255) NOT NULL,
   `user` varchar(255) NOT NULL,
   `pwdd` varchar(255) NOT NULL,
   `created_at` datetime DEFAULT NULL,
   `updated_at` datetime DEFAULT NULL,
   `deleted_at` datetime DEFAULT NULL
);

// sqlite3
CREATE TABLE `realm` (
   `id` INTEGER  PRIMARY KEY NOT NULL,
   `domain` varchar(255) NOT NULL,
   `user` varchar(255) NOT NULL,
   `pwdd` varchar(255) NOT NULL,
   `created_at` datetime DEFAULT NULL,
   `updated_at` datetime DEFAULT NULL,
   `deleted_at` datetime DEFAULT NULL
);

//close WAL mode, https://rs.ppgg.in/configuration/database/running-without-wal-enabled
PRAGMA journal_mode=delete;