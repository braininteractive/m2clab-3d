-- MySQL dump 10.13  Distrib 5.6.19, for debian-linux-gnu (x86_64)
--
-- Host: 127.0.0.1    Database: m3dlab
-- ------------------------------------------------------
-- Server version	5.6.19-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `attr_groups`
--

DROP TABLE IF EXISTS `attr_groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attr_groups` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` tinytext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attr_groups`
--

LOCK TABLES `attr_groups` WRITE;
/*!40000 ALTER TABLE `attr_groups` DISABLE KEYS */;
INSERT INTO `attr_groups` VALUES (1,'Größe'),(2,'Einprägung'),(3,'Farbe/Material'),(4,'Formen');
/*!40000 ALTER TABLE `attr_groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `attributes`
--

DROP TABLE IF EXISTS `attributes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `attributes` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` text,
  `type` text,
  `group_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attributes`
--

LOCK TABLES `attributes` WRITE;
/*!40000 ALTER TABLE `attributes` DISABLE KEYS */;
INSERT INTO `attributes` VALUES (1,'width','integer',1),(2,'height','integer',1),(3,'depth','integer',1),(4,'color','color',3),(5,'text','text',2),(6,'fontSize','integer',2),(7,'cube','form',4),(8,'circle','form',4),(9,'star','form',4);
/*!40000 ALTER TABLE `attributes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `models`
--

DROP TABLE IF EXISTS `models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `models` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` text,
  `shop_id` int(11) DEFAULT NULL,
  `deleted` tinyint(1) DEFAULT '0',
  `url` text,
  `image` text,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `models`
--

LOCK TABLES `models` WRITE;
/*!40000 ALTER TABLE `models` DISABLE KEYS */;
INSERT INTO `models` VALUES (1,'ktoolcor',1,0,'/models/ktoolcor.stl',NULL,'Beschreibungstest bla bla'),(2,'Brille einfacha',2,0,'/models/glasses.stl',NULL,NULL),(3,'Brille Original',2,1,'/models/Fielmann/50196.stl',NULL,NULL),(4,'Brille Original',2,1,'/models/Fielmann/15711.stl',NULL,NULL),(5,NULL,NULL,0,'/models/Ultimaker/94346.stl',NULL,NULL),(6,'63102',NULL,0,'/models/Ultimaker/43282.stl',NULL,NULL),(7,'9581',1,1,'/models/Ultimaker/37218.stl',NULL,NULL),(8,'32985',1,1,'/models/Ultimaker/58592.stl',NULL,NULL),(9,'51300',1,1,'/models/Ultimaker/2840.stl',NULL,NULL),(10,'63649',1,1,'/models/Ultimaker/68199.stl',NULL,NULL),(11,'Ohrring',1,1,'/models/Ultimaker/6019.stl',NULL,'Das hier ist nen Ohrring'),(12,'Ohrring Herzform',1,1,'/models/Ultimaker/65013.stl',NULL,NULL),(13,'Ohrring',1,0,'/models/Ultimaker/47807.stl',NULL,NULL),(14,'Test',1,0,'/models/Ultimaker/85643.stl',NULL,NULL),(15,'Tinkercad',1,0,'/models/Ultimaker/30609.stl',NULL,NULL),(16,'92477',1,1,'/models/Ultimaker/7305.stl',NULL,NULL),(17,'Bild',1,0,'/models/Ultimaker/51832.stl',NULL,NULL),(18,'51728',1,0,'/models/Ultimaker/9661.stl',NULL,NULL),(19,'28756',1,0,'/models/Ultimaker/28118.stl',NULL,NULL),(20,'74924',1,0,'/models/Ultimaker/92499.stl',NULL,NULL),(21,'15299',1,0,'/models/Ultimaker/7250.stl',NULL,NULL),(22,'31154',1,0,'/models/Ultimaker/55156.stl',NULL,NULL),(23,'24135',1,0,'/models/Ultimaker/65332.stl',NULL,NULL),(24,'35660',1,0,'/models/Ultimaker/93380.stl',NULL,NULL),(25,'72966',1,0,'/models/Ultimaker/35351.stl',NULL,NULL),(26,'66005',1,0,'/models/Ultimaker/75424.stl',NULL,NULL),(27,'19070',1,1,'/models/Ultimaker/58482.stl',NULL,NULL),(28,'74901',1,0,'/models/Ultimaker/8559.stl',NULL,NULL),(29,'76174',1,0,'/models/Ultimaker/22651.stl',NULL,NULL),(30,'63972',1,0,'/models/Ultimaker/39194.stl',NULL,NULL),(31,'Brille Original',2,1,'/models/Fielmann/49835.stl',NULL,NULL),(32,'Brille Original',2,0,'/models/Fielmann/34003.stl',NULL,NULL),(33,'57835',1,0,'/models/Ultimaker/3817.stl',NULL,NULL),(34,'9665',1,0,'/models/Ultimaker/3815.stl',NULL,NULL),(35,'34287',1,0,'/models/Ultimaker/32579.stl','/models/Ultimaker/post-example.png',NULL),(36,'78075',1,0,'/models/Ultimaker/92274.stl','/models/Ultimaker/KB1_7691.jpg',NULL),(37,'24695',1,0,'/models/Ultimaker/43139.stl','/models/Ultimaker/KB1_7691.jpg',NULL),(38,'Dinos M',1,0,'/models/Ultimaker/4651.stl','/models/Ultimaker/KB1_7923.jpg',NULL),(39,'41840',1,0,'/models/Ultimaker/46532.stl','/models/Ultimaker/KB1_7691.jpg',NULL),(40,'88961',1,0,'/models/Ultimaker/89769.stl','/models/Ultimaker/White_M_F.png',NULL),(41,'58282',1,0,'/models/Ultimaker/80911.stl','/models/Ultimaker/White_M_F.png',NULL),(42,'32500',1,0,'/models/Ultimaker/10510.stl','/models/Ultimaker/White_M_F.png',NULL),(43,'7444',1,0,'/models/Ultimaker/4046.stl','/models/Ultimaker/White_M_F.png',NULL);
/*!40000 ALTER TABLE `models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rel_model_attr`
--

DROP TABLE IF EXISTS `rel_model_attr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rel_model_attr` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `model_id` int(11) DEFAULT NULL,
  `attr_id` int(11) DEFAULT NULL,
  `min` float DEFAULT NULL,
  `max` float DEFAULT NULL,
  `initial` text,
  `price` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rel_model_attr`
--

LOCK TABLES `rel_model_attr` WRITE;
/*!40000 ALTER TABLE `rel_model_attr` DISABLE KEYS */;
INSERT INTO `rel_model_attr` VALUES (1,1,1,3,5,'2',1),(2,1,2,3,5,'2',1),(3,1,3,0.1,5,'2',1),(5,1,5,NULL,NULL,'Test',1),(6,2,1,1,50,'24,15',1),(7,2,2,0.1,250,'125,2',1),(8,2,3,0.1,5,'2',1),(10,2,5,NULL,NULL,'Test',1),(11,2,6,1,5,'2',1),(14,2,9,NULL,NULL,NULL,NULL),(15,4,1,0.1,5,'2',1),(16,4,2,0.1,5,'2',1),(17,4,3,0.1,5,'2',1),(18,4,4,NULL,NULL,'2',1),(19,4,5,NULL,NULL,'Testing...',1),(20,NULL,NULL,1,NULL,NULL,NULL),(21,NULL,NULL,NULL,5,NULL,NULL),(22,NULL,NULL,1,NULL,NULL,NULL),(23,NULL,NULL,NULL,5,NULL,NULL),(24,NULL,NULL,1,NULL,NULL,NULL),(25,NULL,NULL,NULL,20,NULL,NULL),(26,NULL,NULL,1,NULL,NULL,NULL),(27,NULL,NULL,NULL,5,NULL,NULL),(28,NULL,NULL,1,NULL,NULL,NULL),(29,NULL,NULL,NULL,5,NULL,NULL),(30,14,1,1,16,NULL,NULL),(31,14,2,16,1,NULL,NULL),(32,14,3,1,6,NULL,NULL),(40,1,7,NULL,NULL,NULL,NULL),(42,3,1,0.1,5,NULL,NULL),(43,3,2,0.1,5,NULL,NULL),(44,3,3,0.1,5,NULL,NULL),(45,3,7,NULL,NULL,NULL,NULL),(46,3,8,NULL,NULL,NULL,NULL),(47,3,9,NULL,NULL,NULL,NULL),(48,2,7,NULL,NULL,NULL,NULL),(50,NULL,8,NULL,NULL,NULL,NULL),(51,NULL,9,NULL,NULL,NULL,NULL),(52,NULL,8,NULL,NULL,NULL,NULL),(53,NULL,9,NULL,NULL,NULL,NULL),(54,38,1,1,200,NULL,NULL),(55,38,2,1,200,NULL,NULL),(56,38,3,1,200,NULL,NULL),(57,38,7,NULL,NULL,NULL,NULL),(58,38,8,NULL,NULL,NULL,NULL),(59,38,9,NULL,NULL,NULL,NULL),(60,1,8,NULL,NULL,NULL,NULL),(61,1,9,NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `rel_model_attr` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shops`
--

DROP TABLE IF EXISTS `shops`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `shops` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` text,
  `description` text,
  `image` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shops`
--

LOCK TABLES `shops` WRITE;
/*!40000 ALTER TABLE `shops` DISABLE KEYS */;
INSERT INTO `shops` VALUES (1,'Ultimaker','Das hier ist Ultimaker.','/images/shop/bmw.jpg'),(2,'Fielmann','Das hier ist Fielmann','/images/shop/volkswagen.jpg'),(3,'Mercedes','Das hier ist Mercedes.','/images/shop/mercedes.jpg'),(4,'Testshop','Das ist ein Testshop',NULL);
/*!40000 ALTER TABLE `shops` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-03-18 10:23:22
