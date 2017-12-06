-- MySQL dump 10.13  Distrib 5.7.20, for Linux (x86_64)
--
-- Host: 127.0.0.1    Database: forum_db
-- ------------------------------------------------------
-- Server version	5.7.20-0ubuntu0.17.10.1

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
-- Table structure for table `Highlights_Comments`
--

DROP TABLE IF EXISTS `Highlights_Comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Highlights_Comments` (
  `Title` varchar(1000) DEFAULT NULL,
  `Text` varchar(1000) DEFAULT NULL,
  `Comment` varchar(5000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Highlights_Comments`
--

LOCK TABLES `Highlights_Comments` WRITE;
/*!40000 ALTER TABLE `Highlights_Comments` DISABLE KEYS */;
INSERT INTO `Highlights_Comments` VALUES ('How to program a continuous servo motor? (Arduino)','rduino Uno. The servo does spin continu','sample comment.'),('How to program a continuous servo motor? (Arduino)','rduino Uno. The servo does spin continu','another comment.'),('How to program a continuous servo motor? (Arduino)','WM value will not results in a continous motion,','third comment on this page.'),('How to program a continuous servo motor? (Arduino)','rduino Uno. The servo does spin continu','here we go with yet another comment.'),('How to program a continuous servo motor? (Arduino)','here we go with yet another comment.','how about this for a cmment'),('How to program a continuous servo motor? (Arduino)','WM value will not results in a continous motion,','how about this for a cmment'),('How to program a continuous servo motor? (Arduino)','f your motor has been modified and the pwm duty cycle is not proportional to the position of the motor, but to its velocity, then a constant PWM duty cylce should rotate the motor with a constant velocity.','and here is yet another comment.'),('How to program a continuous servo motor? (Arduino)','and here is yet another comment.','comment on the last highlight.'),('How to program a continuous servo motor? (Arduino)',' have a gut-feeling that the question cannot be answered without the details of the motors','comment on the last highlight.'),('How to program a continuous servo motor? (Arduino)',' have a gut-feeling that the question cannot be answered without the details of the motors','comment on the last highlight.'),('How to program a continuous servo motor? (Arduino)',' have a gut-feeling that the question cannot be answered without the details of the motors','comment on the last highlight.'),('How to program a continuous servo motor? (Arduino)','How to program a continuous servo motor? (Arduino)','how to program a server ???');
/*!40000 ALTER TABLE `Highlights_Comments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-12-05 17:32:00
