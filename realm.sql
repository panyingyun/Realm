CREATE TABLE `realm` (
   `id` INTEGER  PRIMARY KEY NOT NULL,
   `domain` varchar(255) NOT NULL,
   `user` varchar(255) NOT NULL,
   `pwdd` varchar(255) NOT NULL,
   `created_at` datetime DEFAULT NULL,
   `updated_at` datetime DEFAULT NULL,
   `deleted_at` datetime DEFAULT NULL
);