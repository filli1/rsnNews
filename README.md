# rsnNews
The fetcher is a seperate application in another folder. The fetcher is not run constantly unless it is run on a server. The fetcher is run manually to fetch the news articles. The fetcher is run by running the command -> node fetcher.js. Though the functionality is implemented so it can fetch and insert every hour. Because of this there may not be exactly 7 days of weather forecast and not exactly 30 days of weather history.

The Database creation queries are located at the path other/dbCreation.sql

Remember to insert a config.json file