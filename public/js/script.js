//Path to this file will be 'static/js/script.js' When the server is launched
//This file will make the necessary function calls when the DOM is loaded.
window.addEventListener("DOMContentLoaded", () => {
    
    //This function will retrieve articles and create elements for them in the DOM
    newsFeed()

    //This function inserts the current weather and forecast on the page
    insertWeather()

    //this function sets the innerHTML in the top right corner to either the user name or the text "LOGIN"
    setUserName()

    //This function is for when people click on either the login button or their username
    userClick()

    //This function calls the time time function, in an animation frame.
    window.requestAnimationFrame(updateTime)
    //This is an eventlistener for the search field
    const searchForm = document.getElementById("searchForm");
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        //This code is taken from https://stackoverflow.com/questions/3547035/getting-html-form-values/66407161#66407161const userID = user[1].userID;
        //Link above is found through https://hait.cbss.dk/weeks/uge-40.html
        let formData = new FormData (event.target);
        let formProbs = Object.fromEntries(formData)  
        // --- Until here ^  
 
        searchParameter = '';
        //Makes sure that the & is only added after the first time
        let iterationCount = 1;
        //makes the new search url
        //First it checks if all the proberties is filled
        let searchText = formProbs["q"] == "" ? undefined : formProbs["q"];
        let from = formProbs["from"] == "" ? undefined : formProbs["from"];
        let to = formProbs["to"] == "" ? undefined : formProbs["to"];
        searchParameter = searchText
        //This adds the & to the searchParameter if it is not undefined
        from ? searchParameter += `/${from}` : null;
        to ? searchParameter += `/${to}` : null;
        //This adds the searchParameter to the url
        newsUrl = `http://127.0.0.1:3001/news/search/${searchParameter}`
        //This clears the article seaction
        document.getElementById('articles').innerHTML = ''
        document.getElementById("spotSource").innerHTML = ''
        document.getElementById("spotTitle").innerHTML = 'Ingen artikler fundet'
        document.getElementById("spotlight").style.backgroundImage = ''
        document.getElementById("spotCategory").innerHTML = ''

        //Search, retrieve and show the new articles articles
        newsFeed()
    })
})

