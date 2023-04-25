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
        //This code is taken from https://stackoverflow.com/questions/3547035/getting-html-form-values/66407161#66407161
        //Link above is found through https://hait.cbss.dk/weeks/uge-40.html
        let formData = new FormData (event.target);
        let formProbs = Object.fromEntries(formData)  
        // --- Until here ^  

        searchParameter = '';
        //Makes sure that the & is only added after the first time
        let iterationCount = 1;
        //makes the new search url
        for(proberty in formProbs){
            //For each proberty/Input where the value is not blank, add it to the newsURL
            if (formProbs[proberty] != ''){
                //Makes sure that the & is only added after the first time
                let addAnd = iterationCount===1?"":"&"
                searchParameter += addAnd+proberty+"="+formProbs[proberty]
                iterationCount += 1;
            }
        }
        
        //searchParameter = `q=${formProbs.search}`
        newsUrl = `https://newsapi.org/v2/everything?${searchParameter}`
        //This clears the article seaction
        document.getElementById('articles').innerHTML = ''

        //Search, retrieve and show the new articles articles
        newsFeed()
    })
})

