
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

-- categories table


CREATE TABLE categories (
    categoryID INT PRIMARY KEY IDENTITY(1,1),
    category varchar(255)
)

INSERT INTO categories (category) VALUES ('Finans'), ('Politik'), ('Børn'), ('Royale'), ('Livstil'), ('Sport'), ('Mad'), ('Natur'), ('Vejr');

-- favouriteCategories table
CREATE TABLE favouriteCategories (
    userID int,
    categoryID int,
    FOREIGN KEY (userID) REFERENCES users(userID), -- Defines foreign key which refers to the user table.
    FOREIGN KEY (categoryID) REFERENCES categories(categoryID) --Defines foreign key which refers to the news table.
)

ALTER TABLE favouriteCategories
ADD CONSTRAINT unique_pairing_constraint_fav_category UNIQUE (userID, categoryID)

-- likes table


CREATE TABLE likes (
    userID int,
    articleID int,
    FOREIGN KEY (userID) REFERENCES users(userID), --Defines foreign key which refers to the user table.
    FOREIGN KEY (articleID) REFERENCES news(articleID) --Defines foreign key which refers to the news table.

)

-- readArticles table


CREATE TABLE readArticles (
    userID int,
    articleID int,
    FOREIGN KEY (userID) REFERENCES users(userID), --Defines foreign key which refers to the user table.
    FOREIGN KEY (articleID) REFERENCES news(articleID) --Defines foreign key which refers to the news table.
)

ALTER TABLE readArticles
ADD CONSTRAINT unique_pairing_constraint UNIQUE (articleID, userID);

-- favouriteArticles table

CREATE TABLE favouriteArticles (
    userID int,
    articleID int,
    FOREIGN KEY (userID) REFERENCES users(userID), --Defines foreign key which refers to the user table.
    FOREIGN KEY (articleID) REFERENCES news(articleID) --Defines foreign key which refers to the news table.
)

