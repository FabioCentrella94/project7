-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema Connect_E
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema Connect_E
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `Connect_E` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `Connect_E` ;

-- -----------------------------------------------------
-- Table `Connect_E`.`Users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Connect_E`.`Users` (
  `UserID` VARCHAR(64) NOT NULL DEFAULT(uuid()),
  `Username` VARCHAR(15) NOT NULL,
  `Email` VARCHAR(320) CHARACTER SET 'utf8' NOT NULL,
  `Password` CHAR(60) NOT NULL,
  PRIMARY KEY (`UserID`),
  UNIQUE INDEX `Username` (`Username` ASC) VISIBLE,
  UNIQUE INDEX `Email` (`Email` ASC) VISIBLE,
  UNIQUE INDEX `UserID_UNIQUE` (`UserID` ASC) VISIBLE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `Connect_E`.`Posts`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Connect_E`.`Posts` (
  `PostID` VARCHAR(64) NOT NULL DEFAULT(uuid()),
  `UserID` VARCHAR(64) NOT NULL,
  `Title` TEXT NOT NULL,
  `ImageURL` TEXT NOT NULL,
  `DateTime` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`PostID`),
  UNIQUE INDEX `PostID_UNIQUE` (`PostID` ASC) VISIBLE,
  INDEX `posts_ibfk_1` (`UserID` ASC) VISIBLE,
  CONSTRAINT `posts_ibfk_1`
    FOREIGN KEY (`UserID`)
    REFERENCES `Connect_E`.`Users` (`UserID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `Connect_E`.`Comments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Connect_E`.`Comments` (
  `CommentID` INT NOT NULL AUTO_INCREMENT,
  `ParentID` INT NOT NULL DEFAULT '0',
  `ReplyTo` VARCHAR(15) NULL,
  `Comment` TEXT NOT NULL,
  `UserID` VARCHAR(64) NOT NULL,
  `PostID` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`CommentID`),
  UNIQUE INDEX `CommentID_UNIQUE` (`CommentID` ASC) VISIBLE,
  INDEX `comments_ibfk_1` (`UserID` ASC) VISIBLE,
  INDEX `comments_ibfk_2` (`PostID` ASC) VISIBLE,
  INDEX `comments_ibfk_3` (`ParentID` ASC) VISIBLE,
  CONSTRAINT `comments_ibfk_1`
    FOREIGN KEY (`UserID`)
    REFERENCES `Connect_E`.`Users` (`UserID`)
    ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2`
    FOREIGN KEY (`PostID`)
    REFERENCES `Connect_E`.`Posts` (`PostID`)
    ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_3`
    FOREIGN KEY (`ParentID`)
    REFERENCES `Connect_E`.`Comments` (`CommentID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 135
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `Connect_E`.`CommentDislikes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Connect_E`.`CommentDislikes` (
  `DislikeID` INT(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `CommentID` INT NOT NULL,
  `UserID` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`DislikeID`),
  UNIQUE INDEX `DislikeID_UNIQUE` (`DislikeID` ASC) VISIBLE,
  INDEX `commentdislikes_ibfk_1` (`CommentID` ASC) VISIBLE,
  INDEX `commentdislikes_ibfk_2` (`UserID` ASC) VISIBLE,
  CONSTRAINT `commentdislikes_ibfk_1`
    FOREIGN KEY (`CommentID`)
    REFERENCES `Connect_E`.`Comments` (`CommentID`)
    ON DELETE CASCADE,
  CONSTRAINT `commentdislikes_ibfk_2`
    FOREIGN KEY (`UserID`)
    REFERENCES `Connect_E`.`Users` (`UserID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `Connect_E`.`CommentLikes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Connect_E`.`CommentLikes` (
  `LikeID` INT(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `CommentID` INT NOT NULL,
  `UserID` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`LikeID`),
  UNIQUE INDEX `LikeID_UNIQUE` (`LikeID` ASC) VISIBLE,
  INDEX `commentlikes_ibfk_1` (`CommentID` ASC) VISIBLE,
  INDEX `commentlikes_ibfk_2` (`UserID` ASC) VISIBLE,
  CONSTRAINT `commentlikes_ibfk_1`
    FOREIGN KEY (`CommentID`)
    REFERENCES `Connect_E`.`Comments` (`CommentID`)
    ON DELETE CASCADE,
  CONSTRAINT `commentlikes_ibfk_2`
    FOREIGN KEY (`UserID`)
    REFERENCES `Connect_E`.`Users` (`UserID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 25
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `Connect_E`.`PostDislikes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Connect_E`.`PostDislikes` (
  `DislikeID` INT(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `PostID` VARCHAR(64) NOT NULL,
  `UserID` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`DislikeID`),
  UNIQUE INDEX `LikeID_UNIQUE` (`DislikeID` ASC) VISIBLE,
  INDEX `postdislikes_ibfk_1` (`PostID` ASC) VISIBLE,
  INDEX `postdislikes_ibfk_2` (`UserID` ASC) VISIBLE,
  CONSTRAINT `postdislikes_ibfk_1`
    FOREIGN KEY (`PostID`)
    REFERENCES `Connect_E`.`Posts` (`PostID`)
    ON DELETE CASCADE,
  CONSTRAINT `postdislikes_ibfk_2`
    FOREIGN KEY (`UserID`)
    REFERENCES `Connect_E`.`Users` (`UserID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 78
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `Connect_E`.`PostLikes`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Connect_E`.`PostLikes` (
  `LikeID` INT(10) UNSIGNED ZEROFILL NOT NULL AUTO_INCREMENT,
  `PostID` VARCHAR(64) NOT NULL,
  `UserID` VARCHAR(64) NOT NULL,
  PRIMARY KEY (`LikeID`),
  UNIQUE INDEX `LikeID_UNIQUE` (`LikeID` ASC) VISIBLE,
  INDEX `postlikes_ibfk_1` (`PostID` ASC) VISIBLE,
  INDEX `postlikes_ibfk_2` (`UserID` ASC) VISIBLE,
  CONSTRAINT `postlikes_ibfk_1`
    FOREIGN KEY (`PostID`)
    REFERENCES `Connect_E`.`Posts` (`PostID`)
    ON DELETE CASCADE,
  CONSTRAINT `postlikes_ibfk_2`
    FOREIGN KEY (`UserID`)
    REFERENCES `Connect_E`.`Users` (`UserID`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 212
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
