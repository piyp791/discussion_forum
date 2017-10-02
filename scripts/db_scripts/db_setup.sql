CREATE DATABASE `forum_db` /*!40100 DEFAULT CHARACTER SET latin1 */;
use forum_db;
CREATE TABLE `Posts` (
  `ID` int(11) NOT NULL,
  `PostTypeId` varchar(20) DEFAULT NULL,
  `ParentID` varchar(20) DEFAULT NULL,
  `AcceptedAnswerId` varchar(20) DEFAULT NULL,
  `CreationDate` varchar(100) DEFAULT NULL,
  `Score` varchar(20) DEFAULT NULL,
  `ViewCount` varchar(20) DEFAULT NULL,
  `Body` varchar(35535) DEFAULT NULL,
  `OwnerUserId` varchar(20) DEFAULT NULL,
  `LastEditorUserId` varchar(20) DEFAULT NULL,
  `LastEditorDisplayName` varchar(200) DEFAULT NULL,
  `LastEditDate` varchar(100) DEFAULT NULL,
  `LastActivityDate` varchar(100) DEFAULT NULL,
  `CommunityOwnedDate` varchar(100) DEFAULT NULL,
  `ClosedDate` varchar(100) DEFAULT NULL,
  `Title` varchar(1000) DEFAULT NULL,
  `Tags` varchar(5000) DEFAULT NULL,
  `AnswerCount` varchar(20) DEFAULT NULL,
  `CommentCount` int(11) DEFAULT NULL,
  `FavoriteCount` varchar(45) DEFAULT NULL,
  `OwnerDisplayName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;