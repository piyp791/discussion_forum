CREATE DATABASE `forum_db` /*!40100 DEFAULT CHARACTER SET latin1 */;

CREATE TABLE `Comments` (
  `Id` int(11) NOT NULL,
  `PostId` int(11) DEFAULT NULL,
  `Score` int(11) DEFAULT NULL,
  `Text` varchar(30000) DEFAULT NULL,
  `CreationDate` varchar(100) DEFAULT NULL,
  `UserId` int(11) DEFAULT NULL,
  `UserDisplayName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Posts` (
  `ID` int(11) NOT NULL,
  `PostTypeId` varchar(20) DEFAULT NULL,
  `ParentID` varchar(20) DEFAULT NULL,
  `AcceptedAnswerId` varchar(20) DEFAULT NULL,
  `CreationDate` varchar(100) DEFAULT NULL,
  `Score` int(11) DEFAULT NULL,
  `ViewCount` int(11) DEFAULT NULL,
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
  `AnswerCount` int(11) DEFAULT NULL,
  `CommentCount` int(11) DEFAULT NULL,
  `FavoriteCount` int(11) DEFAULT NULL,
  `OwnerDisplayName` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `Users` (
  `Id` int(11) NOT NULL,
  `Reputation` int(11) DEFAULT NULL,
  `CreationDate` varchar(100) DEFAULT NULL,
  `DisplayName` varchar(200) DEFAULT NULL,
  `EmailHash` varchar(500) DEFAULT NULL,
  `LastAccessDate` varchar(100) DEFAULT NULL,
  `WebsiteUrl` varchar(2000) DEFAULT NULL,
  `Location` varchar(200) DEFAULT NULL,
  `Age` int(11) DEFAULT NULL,
  `AboutMe` varchar(10000) DEFAULT NULL,
  `Views` int(11) DEFAULT NULL,
  `UpVotes` int(11) DEFAULT NULL,
  `DownVotes` int(11) DEFAULT NULL,
  `AccountId` int(11) DEFAULT NULL,
  `ProfileImageUrl` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;




