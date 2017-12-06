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
-- Table structure for table `Highlights`
--

DROP TABLE IF EXISTS `Highlights`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Highlights` (
  `Title` varchar(1000) DEFAULT NULL,
  `Text` varchar(1000) DEFAULT NULL,
  `NumOfHighlights` int(11) DEFAULT '0',
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `unique_idx` (`Title`,`Text`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Highlights`
--

LOCK TABLES `Highlights` WRITE;
/*!40000 ALTER TABLE `Highlights` DISABLE KEYS */;
INSERT INTO `Highlights` VALUES ('How to program a continuous servo motor? (Arduino)','f your motor has been modified and the pwm duty cycle is not proportional to the position of the motor, but to its velocity, then a constant PWM duty cylce should rotate the motor with a constant velocity.',2,1),('How to program a continuous servo motor? (Arduino)',' have a gut-feeling that the question cannot be answered without the details of the motors',4,3),('How to program a continuous servo motor? (Arduino)','WM value will not results in a continous motion,',1,7),('How to program a continuous servo motor? (Arduino)','rduino Uno. The servo does spin continu',4,8),('How to program a continuous servo motor? (Arduino)','How to program a continuous servo motor? (Arduino)',1,12),('How to program a continuous servo motor? (Arduino)','seconds in both cases to make sure that the motor has enough time to exe',1,13),('How to program a continuous servo motor? (Arduino)','ng for how they work, but I just cannot figure it out. I g',1,14),('How to create push and pull mechanism using Servo','ross/handle/other connecting element of serv',1,15),('How to program a continuous servo motor? (Arduino)','allows it to spin 360+ d',1,16),('How to program a continuous servo motor? (Arduino)','ught servos that have already ',1,17),('How to program a continuous servo motor? (Arduino)','ble way. I\'ve also taken out t',1,18),('How to program a continuous servo motor? (Arduino)','m currently using PWM ',1,19),('How to program a continuous servo motor? (Arduino)','ue. This should do a complete rotatio',1,20),('How to program a continuous servo motor? (Arduino)','ould appreciate any',1,21),('How to program a continuous servo motor? (Arduino)','n the different vales are not correlated with the time required for the servo to arrive to the given position.',1,22),('How to program a continuous servo motor? (Arduino)','I suggest you only give 2 commands, t',1,23),('How to program a continuous servo motor? (Arduino)','PWM value and the maximu',1,24);
/*!40000 ALTER TABLE `Highlights` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-12-05 17:31:59
