
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
    nationality varchar,
    firstName varchar,
    lastName varchar,
    email varchar,
    password varchar
)

ALTER TABLE users
ALTER COLUMN userID int NOT NULL -- userID kan ikke vaere null. Det skal have en vaerdi

ALTER TABLE users
ADD PRIMARY KEY (userID)  -- Definerer primary key i user-tabellen som userID

-- news table


CREATE TABLE news (
    articleID int,
    title varchar,
    imageUrl varchar,
    source varchar,
    publishedAt datetime,
    author varchar,
    description varchar
)

ALTER TABLE news
ALTER COLUMN articleID int NOT NULL  -- articleID kan ikke vaere null. Det skal have en vaerdi

ALTER TABLE news
ADD PRIMARY KEY (articleID) -- Definerer primary key i news-tabellen som articleID

-- likes table


CREATE TABLE likes (
    userID int,
    articleID int
)

ALTER TABLE likes
ADD FOREIGN KEY (userID) REFERENCES users(userID); --Definerer foreign key med reference til userID i user-tabellen

ALTER TABLE likes
ADD FOREIGN KEY (articleID) REFERENCES news(articleID);  --Definerer foreign key med reference til articleID i news-tabellen

-- readArticles table


CREATE TABLE readArticles (
    userID int,
    articleID int
)

ALTER TABLE readArticles
ADD FOREIGN KEY (userID) REFERENCES users(userID); --Definerer foreign key med reference til userID i user-tabellen

ALTER TABLE readArticles
ADD FOREIGN KEY (articleID) REFERENCES news(articleID); --Definerer foreign key med reference til articleID i news-tabellen

-- favouriteArticles table

CREATE TABLE favouriteArticles (
    userID int,
    articleID int
)

ALTER TABLE favouriteArticles
ADD FOREIGN KEY (userID) REFERENCES users(userID); --Definerer foreign key med reference til userID i user-tabellen

ALTER TABLE favouriteArticles
ADD FOREIGN KEY (articleID) REFERENCES news(articleID); --Definerer foreign key med reference til articleID i news-tabellen