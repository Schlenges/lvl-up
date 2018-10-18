-- Create Database
CREATE DATABASE lvl_up

-- Create Users Table
CREATE TABLE users (
    ID int(11) NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    PRIMARY KEY (ID),
    UNIQUE KEY username (name),
    UNIQUE KEY email (email)
)

-- Create Skills Table
CREATE TABLE skills (
    ID int(11) NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    curr_lvl int(3) NOT NULL DEFAULT 0,
    max_lvl int(3) NOT NULL,
    curr_xp int(3) NOT NULL DEFAULT 0,
    user_ID int(11) NOT NULL,
    PRIMARY KEY (ID),
    KEY user_id (user_ID),
    FOREIGN KEY (user_id) REFERENCES users (ID) ON DELETE CASCADE
)

-- Create Battles Table
CREATE TABLE battles (
     ID int(11) NOT NULL AUTO_INCREMENT,
     description varchar(255) NOT NULL,
     xp int(3) NOT NULL,
     skill_ID int(11) NOT NULL,
     PRIMARY KEY (ID),
     KEY skill_id (skill_ID),
     FOREIGN KEY (skill_id) REFERENCES skills (ID) ON DELETE CASCADE
)