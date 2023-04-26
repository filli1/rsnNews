
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
    userID int,
    nationality varchar(255),
    firstName varchar(255),
    lastName varchar(255),
    email varchar(255),
    password varchar(255)
)

ALTER TABLE users
ALTER COLUMN userID int NOT NULL -- userID cannot be null. Needs to have a value.

ALTER TABLE users
ADD PRIMARY KEY (userID)  -- Defines the primary key in the user table as the userID.

-- news table


CREATE TABLE news (
    articleID int,
    title varchar(255),
    imageUrl varchar(255),
    source varchar(255),
    publishedAt datetime,
    author varchar(255),
    description varchar(255)
)

ALTER TABLE news
ALTER COLUMN articleID int NOT NULL  -- articleID cannot be null. Needs to have a value.
ALTER TABLE news
ADD PRIMARY KEY (articleID) -- Defines primary key in the news table as the articleID.

-- likes table


CREATE TABLE likes (
    userID int,
    articleID int
)

ALTER TABLE likes
ADD FOREIGN KEY (userID) REFERENCES users(userID); --Defines foreign key which refers to the user table.

ALTER TABLE likes
ADD FOREIGN KEY (articleID) REFERENCES news(articleID);  --Defines foreign key which refers to the news table.

-- readArticles table


CREATE TABLE readArticles (
    userID int,
    articleID int
)

ALTER TABLE readArticles
ADD FOREIGN KEY (userID) REFERENCES users(userID); --Defines foreign key with reference to userID in the user-table. 

ALTER TABLE readArticles
ADD FOREIGN KEY (articleID) REFERENCES news(articleID); --Defines foreign key with reference to articleID in the news-table.
-- favouriteArticles table

CREATE TABLE favouriteArticles (
    userID int,
    articleID int
)

ALTER TABLE favouriteArticles
ADD FOREIGN KEY (userID) REFERENCES users(userID); --Defines foreign key with reference to userID in the user-table.

ALTER TABLE favouriteArticles
ADD FOREIGN KEY (articleID) REFERENCES news(articleID); --Defines foreign key with reference to articleID in the news-table.