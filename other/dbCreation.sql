
-- weather table

CREATE TABLE weather (
    dateKey date,
    temperature float,
    sunrise time,
    sunset time,
    weatherCode int
)

-- users table

CREATE TABLE users (
    userID INT PRIMARY KEY IDENTITY(1,1),
    nationality varchar(255),
    firstName varchar(255),
    lastName varchar(255),
    email varchar(255),
    password varchar(255)
)


-- news table


CREATE TABLE news (
    articleID INT PRIMARY KEY IDENTITY(1,1),
    title varchar(255),
    imageUrl varchar(512),
    source varchar(255),
    publishedAt datetime,
    author varchar(255),
    url varchar(512),
    description varchar(255)
)


-- likes table


CREATE TABLE likes (
    userID int,
    articleID int,
    FOREIGN KEY (userID) REFERENCES users(userID), --Defines foreign key which refers to the user table.
    FOREIGN KEY (articleID) REFERENCES news(articleID) --Defines foreign key which refers to the news table.

)

ALTER TABLE likes (
    ADD CONSTRAINT unique_like_pair UNIQUE (userID, articleID); --Adds 
)


-- readArticles table


CREATE TABLE readArticles (
    userID int,
    articleID int,
    FOREIGN KEY (userID) REFERENCES users(userID), --Defines foreign key which refers to the user table.
    FOREIGN KEY (articleID) REFERENCES news(articleID) --Defines foreign key which refers to the news table.
)

-- favouriteArticles table

CREATE TABLE favouriteArticles (
    userID int,
    articleID int,
    FOREIGN KEY (userID) REFERENCES users(userID), --Defines foreign key which refers to the user table.
    FOREIGN KEY (articleID) REFERENCES news(articleID) --Defines foreign key which refers to the news table.
)
