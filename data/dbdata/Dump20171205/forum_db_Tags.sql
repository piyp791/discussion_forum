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
-- Table structure for table `Tags`
--

DROP TABLE IF EXISTS `Tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Tags` (
  `Id` int(11) NOT NULL,
  `TagName` varchar(200) DEFAULT NULL,
  `Count` int(11) DEFAULT NULL,
  `ExcerptPostId` int(11) DEFAULT NULL,
  `WikiPostId` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Tags`
--

LOCK TABLES `Tags` WRITE;
/*!40000 ALTER TABLE `Tags` DISABLE KEYS */;
INSERT INTO `Tags` VALUES (1,'soccer',7,12371,'12370'),(2,'servos',58,186,'185'),(3,'control',348,192,'191'),(5,'gait',2,12362,'12361'),(6,'walk',7,NULL,NULL),(8,'arduino',352,202,'201'),(9,'raspberry-pi',118,307,'306'),(10,'motion-planning',97,11370,'11369'),(12,'software',56,581,'580'),(13,'platform',5,NULL,NULL),(15,'circuit',16,NULL,NULL),(16,'odometry',45,435,'434'),(17,'localization',159,70,'69'),(20,'kalman-filter',122,425,'424'),(24,'wheeled-robot',124,9867,'9866'),(30,'mobile-robot',364,194,'193'),(31,'kinect',59,234,'233'),(32,'input',3,NULL,NULL),(33,'wheel',19,188,'187'),(36,'gyroscope',71,198,'197'),(37,'balance',19,9095,'9094'),(38,'two-wheeled',22,11566,'11565'),(39,'underwater',14,11434,'11433'),(42,'design',102,11420,'11419'),(44,'electronics',60,1612,'1611'),(47,'microcontroller',136,196,'195'),(48,'gps',49,87,'86'),(50,'mapping',50,11368,'11367'),(56,'heat-management',2,NULL,NULL),(57,'cooling',2,NULL,NULL),(58,'sensors',247,1566,'1565'),(59,'failure',2,NULL,NULL),(60,'motor',296,190,'189'),(61,'stability',37,11556,'11555'),(62,'movement',27,11564,'11563'),(63,'slam',154,84,'83'),(64,'mechanism',81,11493,'11492'),(65,'logic-control',5,NULL,NULL),(67,'stepper-motor',68,4320,'4319'),(68,'stepper-driver',16,NULL,NULL),(72,'actuator',56,402,'401'),(74,'noise',22,NULL,NULL),(77,'avr',13,9815,'9814'),(78,'interrupts',7,9912,'9911'),(80,'wiring',8,NULL,NULL),(83,'errors',15,NULL,NULL),(84,'planning',12,NULL,NULL),(87,'mindstorms',12,243,'242'),(88,'nxt',19,245,'244'),(90,'real-time',22,1880,'1879'),(91,'i2c',12,430,'429'),(92,'research',25,NULL,NULL),(93,'books',7,NULL,NULL),(94,'industrial-robot',55,11499,'11498'),(96,'force',13,NULL,NULL),(97,'reprap',4,12364,'12363'),(103,'protection',6,NULL,NULL),(105,'c',28,934,'933'),(106,'imu',105,595,'594'),(107,'ros',151,159,'158'),(108,'pid',192,200,'199'),(113,'air-muscle',2,12360,'12359'),(117,'automatic',18,NULL,NULL),(118,'tuning',12,NULL,NULL),(121,'computer-vision',129,11031,'11030'),(123,'python',43,1505,'1504'),(124,'wifi',17,9762,'9761'),(125,'serial',40,9767,'9766'),(126,'rs232',5,772,'771'),(127,'force-sensor',8,NULL,NULL),(128,'brushless-motor',74,1964,'1963'),(129,'kit',4,NULL,NULL),(134,'pwm',26,774,'773'),(136,'uav',42,400,'399'),(138,'inverse-kinematics',123,2255,'2254'),(140,'kinematics',122,2247,'2246'),(141,'joint',28,11562,'11561'),(142,'arm',27,372,'371'),(144,'reliability',3,NULL,NULL),(146,'robotc',23,1478,'1477'),(147,'reinforcement-learning',10,375,'374'),(149,'machine-learning',33,1700,'1699'),(150,'artificial-intelligence',37,1509,'1508'),(151,'sensor-fusion',47,10043,'10042'),(152,'hri',4,597,'596'),(154,'programming-languages',29,11817,'11816'),(155,'deduced-reckoning',5,408,'407'),(156,'navigation',68,11364,'11363'),(157,'accelerometer',76,410,'409'),(158,'rrt',7,427,'426'),(159,'auv',5,450,'449'),(162,'ugv',6,452,'451'),(163,'driver',14,NULL,NULL),(164,'usb',24,9809,'9808'),(167,'particle-filter',29,11459,'11458'),(170,'3d-printing',14,1507,'1506'),(171,'manufacturing',14,NULL,NULL),(174,'quadcopter',363,2172,'2171'),(176,'power',71,11495,'11494'),(178,'multi-agent',12,11432,'11431'),(179,'dynamics',71,11497,'11496'),(180,'acoustic-rangefinder',3,NULL,NULL),(181,'linear-bearing',7,NULL,NULL),(182,'tracks',11,593,'592'),(185,'troubleshooting',4,NULL,NULL),(186,'radio-control',32,11560,'11559'),(188,'current',16,9817,'9816'),(189,'algorithm',69,1803,'1802'),(190,'coverage',7,NULL,NULL),(191,'theory',20,NULL,NULL),(192,'calibration',47,9886,'9885'),(194,'not-exactly-c',4,674,'673'),(195,'operating-systems',3,NULL,NULL),(197,'routing',3,NULL,NULL),(198,'motion',43,11554,'11553'),(203,'simulator',39,10922,'10921'),(204,'children',2,NULL,NULL),(205,'c++',44,1511,'1510'),(207,'ransac',2,720,'719'),(210,'compass',9,1513,'1512'),(211,'ekf',54,7751,'7750'),(212,'bec',4,755,'754'),(213,'uncanny-valley',1,761,'760'),(220,'communication',36,11558,'11557'),(221,'manipulator',42,11457,'11456'),(222,'robotic-arm',288,11418,'11417'),(223,'cnc',18,11469,'11468'),(225,'esc',44,7753,'7752'),(229,'stereo-vision',60,11438,'11437'),(230,'cameras',89,11473,'11472'),(239,'forward-kinematics',42,11424,'11423'),(244,'visualization',9,NULL,NULL),(245,'encoding',8,NULL,NULL),(247,'torque',51,11422,'11421'),(248,'dynamic-programming',5,1151,'1150'),(249,'beginner',20,NULL,NULL),(250,'battery',76,9908,'9907'),(256,'distributed-systems',3,1702,'1701'),(257,'embedded-systems',19,11465,'11464'),(260,'hexapod',8,NULL,NULL),(263,'rcservo',49,1309,'1308'),(265,'servomotor',73,1313,'1312'),(266,'multi-rotor',30,11362,'11361'),(268,'legged',13,NULL,NULL),(269,'magnetometer',19,11467,'11466'),(272,'openni',7,NULL,NULL),(273,'lidar',30,9744,'9743'),(274,'ardupilot',28,11461,'11460'),(276,'h-bridge',9,9862,'9861'),(279,'sonar',12,9888,'9887'),(280,'sensor-error',7,NULL,NULL),(290,'activerobot',2,NULL,NULL),(291,'differential-drive',25,9791,'9790'),(292,'line-following',36,1769,'1768'),(293,'wireless',26,9793,'9792'),(294,'swarm',8,12373,'12372'),(296,'visual-servoing',11,12375,'12374'),(298,'can',4,NULL,NULL),(300,'pose',19,11471,'11470'),(303,'hall-sensor',4,NULL,NULL),(305,'gazebo',33,11426,'11425'),(306,'micromouse',4,NULL,NULL),(309,'valve',5,NULL,NULL),(310,'beagle-bone',25,9795,'9794'),(311,'untagged',8,NULL,NULL),(316,'ultrasonic-sensors',28,11463,'11462'),(317,'humanoid',22,9873,'9872'),(318,'rock',7,2884,'2883'),(319,'irobot-create',114,5122,'5121'),(321,'roomba',38,6364,'6363'),(322,'speech-processing',6,3001,'3000'),(323,'rangefinder',14,3003,'3002'),(324,'digital-audio',5,3025,'3024'),(325,'linux',14,3023,'3022'),(326,'syskit',3,NULL,NULL),(328,'chassis',5,NULL,NULL),(331,'laser',25,9811,'9810'),(337,'occupancygrid',6,NULL,NULL),(340,'simulation',50,6347,'6346'),(342,'jacobian',37,NULL,NULL),(343,'reference-request',8,NULL,NULL),(347,'probability',12,NULL,NULL),(350,'data-association',4,NULL,NULL),(351,'quadrature-encoder',12,NULL,NULL),(353,'frame',12,NULL,NULL),(354,'gearing',17,NULL,NULL),(356,'vex',8,NULL,NULL),(357,'product-of-exponentials',5,NULL,NULL),(358,'dh-parameters',37,NULL,NULL),(362,'matlab',89,9764,'9763'),(363,'mavlink',6,11815,'11814'),(365,'battle-bot',3,NULL,NULL),(367,'dynamixel',5,NULL,NULL),(368,'rocket',2,NULL,NULL),(369,'lithium-polymer',9,NULL,NULL),(372,'3d-reconstruction',15,NULL,NULL),(373,'3d-model',7,NULL,NULL),(375,'first-robotics',16,9004,'9003'),(377,'filter',12,9865,'9864'),(384,'automation',14,12369,'12368'),(386,'orientation',12,NULL,NULL),(387,'opencv',31,9860,'9859'),(388,'statistics',3,NULL,NULL),(392,'geometry',18,NULL,NULL),(395,'walking-robot',13,NULL,NULL),(397,'precise-positioning',9,NULL,NULL),(400,'alljoyn',1,9060,'9059'),(403,'exploration',2,NULL,NULL),(405,'labview',2,9910,'9909'),(406,'kuka',7,NULL,NULL),(408,'steering',6,11430,'11429'),(410,'rotation',16,NULL,NULL),(412,'engine',2,NULL,NULL),(413,'electric',4,NULL,NULL),(416,'vfh',2,NULL,NULL),(417,'integration',2,NULL,NULL),(418,'dead-reckoning',3,NULL,NULL),(421,'gnss',3,NULL,NULL),(422,'hardware',3,NULL,NULL),(424,'connector',5,NULL,NULL),(425,'mrds',1,9901,'9900'),(426,'path-planning',18,11366,'11365'),(430,'visual-odometry',10,11428,'11427'),(431,'monocular',6,NULL,NULL),(432,'plc',5,12358,'12357'),(433,'autonomous-car',4,NULL,NULL),(434,'self-driving',5,NULL,NULL),(435,'scale-model',2,NULL,NULL),(436,'point-cloud',4,NULL,NULL),(444,'singularity',3,NULL,NULL),(445,'redundant-robots',1,12367,'12366'),(446,'robotics-library',6,11984,'11983'),(447,'pseudo-ranges',2,NULL,NULL),(448,'ephemeris',2,NULL,NULL),(449,'policy',1,NULL,NULL),(450,'pitot-tube',1,NULL,NULL),(452,'identification',8,NULL,NULL),(453,'structure-from-motion',1,NULL,NULL);
/*!40000 ALTER TABLE `Tags` ENABLE KEYS */;
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
