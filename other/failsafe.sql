create table dbo.news
(
    title       varchar(255),
    imageUrl    varchar(255),
    source      varchar(255),
    publishedAt datetime,
    author      varchar(255),
    description varchar(255),
    articleID   int identity
        constraint PK_news_articleID
            primary key
)
go

create table dbo.users
(
    userID      int not null
        primary key,
    nationality varchar,
    firstName   varchar,
    lastName    varchar,
    email       varchar,
    password    varchar
)
go

create table dbo.favouriteArticles
(
    userID    int
        references dbo.users,
    articleID int
        references dbo.news
)
go

create table dbo.likes
(
    userID    int
        references dbo.users,
    articleID int
        references dbo.news
)
go

create table dbo.readArticles
(
    userID    int
        references dbo.users,
    articleID int
        references dbo.news
)
go

create table dbo.weather
(
    dateKey     date,
    temperature float,
    sunrise     time,
    sunset      time,
    weatherCode int
)
go

