//API KEY: a3a9b3bf13f043f890b1335b08ec09b1
//NY API: 4d438c96e5c54b938fe57e7e8626fe0b
//Initial search
let searchParameter = 'country=de'
let newsUrl = `https://newsapi.org/v2/top-headlines?${searchParameter}`

//Optimally would be located in a non-public document
let apiKey = '4d438c96e5c54b938fe57e7e8626fe0b'

let headers = {
    'Authorization': `${apiKey}`
}

//Fetches the news from the news api
const news = async () => {
    let response = await fetch(newsUrl,
        {
            method: 'GET',
            headers: headers
        }
    );
    return response.json();
}

//creates an empty variable to store the news in
let newsArray;

//this function will create the newsfeed in the DOM
const newsFeed = async () => {
    //Get the elements for the spotlight article
    const spotlight = document.getElementById("spotlight");
    const spotTitle = document.getElementById("spotTitle");
    const spotSource = document.getElementById("spotSource");
    const spotBtn = document.getElementById("spotReadMoreBtn");
    const articleContainer = document.getElementById("articles");

    //stores the news in the newsArray
    newsArray = (await news());
    //puts the newsarray inside the session storage for access elsewhere
    sessionStorage.setItem("newsArray", JSON.stringify(newsArray));
    
    //Loop through up to 7 items of the news array - depending on if there are less than 7
    for(let x=0; x<(newsArray.totalResults < 7? newsArray.totalResults : 7);x++){
        //gets the current iterations article
        let article = newsArray.articles[x]
        //if this is the first iteration, then set the spotligt article to the first article in the array
        if(x===0){
            spotSource.innerHTML = '- '+article.source.name;
            spotTitle.innerHTML = article.title;
            spotlight.style.backgroundImage = `url('${article.urlToImage}')`;
            spotBtn.setAttribute('href', article.url)
        } else {
            //creates the news article elements and childs
            const articleElement = document.createElement("div");
            articleElement.setAttribute('class','article borderStyle flexCol flexGrow')
            articleContainer.appendChild(articleElement);
            articleElement.setAttribute('id', article.url)
            console.log(article)
            const img = document.createElement("img")
            img.setAttribute('src', article.urlToImage)
            articleElement.appendChild(img);

            //This decides if the title is too long to fit inside the container. Max 10 words.
            let articleTitle = article.title;
            let articleTitleSplit = articleTitle.split(" ");
            if(articleTitleSplit.length > 10) {
                articleTitle = articleTitleSplit[0];
                for(let x = 1; x<10; x++){
                    articleTitle += " "+articleTitleSplit[x]
                }
                articleTitle += " (...)"
            }
            //Creates the rest of the elements
            const titleElement = document.createElement("h4");
            const title = document.createTextNode(articleTitle)
            titleElement.appendChild(title)
            titleElement.setAttribute('title', article.title)
            articleElement.appendChild(titleElement)

            const miscElement = document.createElement("div")
            miscElement.setAttribute('class', 'flexRow')
            articleElement.appendChild(miscElement);

            const sourceElement = document.createElement("a")
            sourceElement.setAttribute('class', 'source')
            const source = document.createTextNode(article.source.name)
            sourceElement.appendChild(source)
            miscElement.appendChild(sourceElement)

            const readMoreBtnElement = document.createElement("a")
            const readMoreBtnText = document.createTextNode("Read more")
            readMoreBtnElement.setAttribute('href', article.url)
            readMoreBtnElement.setAttribute('class', 'readMoreBtn')
            readMoreBtnElement.appendChild(readMoreBtnText)
            miscElement.appendChild(readMoreBtnElement)

        }
    }
    //Selects all the read more buttons
    let readMoreBtns = document.querySelectorAll('a.readMoreBtn')
    //add an event listener to each one of them
    for(let x=0;x<readMoreBtns.length;x++){
        readMoreBtns[x].addEventListener('click', (event) => {
            event.preventDefault()
            displayPopup()
            articlePopup(newsArray.articles[x])
        })
    }
    //now decide if there are any of the article that should be favourited and/or is already read.
    addAlreadyReadElement()
    addFavouriteElement()
}

//this function adds an article to a users read lsit
function addReadArticle(user,url,title){
    
    user = getUser(user)
    
    //if there are no read articles then it should create this array at the specific user
    if(user[1].readArticles === undefined){
        let newsArticles = {
            url:[url],
            title:[title]
        }
        //saves the object in the localstorage
        updateUser(user[1].name,'readArticles',JSON.stringify(newsArticles))
        //this creates the already element so it appears at the time they press the read more btn
        addAlreadyReadElement()
    } else {
        //Here the difference is that it takes what is already saved in the localstorage and appends to the arrays
        let readArticles = JSON.parse(user[1].readArticles)
        readArticles.url.push(url)
        readArticles.title.push(title)
        updateUser(user[1].name,'readArticles',JSON.stringify(readArticles))
        addAlreadyReadElement()
    }
}

//this method is the same as the already read, just a different list for a diffenrent purpose
function addFavouriteArticle(user,url,title){
    user = getUser(user);

    //if there are no read articles then it should create this array at the specific user
    if(user[1].favouriteArticles === undefined){
        let favouriteArticles = {
            url:[url],
            title: [title]
        }
        //saves the object in the localstorage
        updateUser(user[1].name,'favouriteArticles',JSON.stringify(favouriteArticles))
    } else {
        //Here the difference is that it takes what is already saved in the localstorage and appends to the arrays
        let favouriteArticles = JSON.parse(user[1].favouriteArticles)
        favouriteArticles.url.push(url)
        favouriteArticles.title.push(title)
        updateUser(user[1].name,'favouriteArticles',JSON.stringify(favouriteArticles))
    }
}

//This function removes a favourite article from the user
function deleteFavouriteArticle(user,url){
    //First the user is retrieved
    user = getUser(user);

    //Checks if there are any favourite articles on the user
    if(user[1].favouriteArticles === undefined){
        console.error('No favourite articles')
    } else {
        //The favourite articles is retrieved as a JSON object
        let favouriteArticles = JSON.parse(user[1].favouriteArticles)
        //Finds the article to delete from favourites in the array
        let favouriteArticleToDelete = favouriteArticles.url.indexOf(url)
        //Deletes the article from both the url and title array
        favouriteArticles.url.splice(favouriteArticleToDelete,1)
        favouriteArticles.title.splice(favouriteArticleToDelete,1)
        //Updates the user with the new favourite article array
        updateUser(user[1].name,'favouriteArticles',JSON.stringify(favouriteArticles))
    }
}

//This is a popup containing the article which is referred to in the parameter
function articlePopup(newsArticle){
    //Gets the popup element
    let popup = document.getElementById("popupContent")
    
    //Creates the popup title and sets it to be the title of the article
    let popupTitle = document.createElement("h4")
    let popUpTitleText = document.createTextNode(newsArticle.title)
    popupTitle.appendChild(popUpTitleText)

    //Creates the author of the article
    let writtenBy = document.createElement("span")
    let writtenByText = document.createTextNode(newsArticle.author)
    writtenBy.appendChild(writtenByText)

    //Creates the content of the article
    let articleContentElement = document.createElement("p")
    let articleContentText = document.createTextNode(newsArticle.content)
    articleContentElement.appendChild(articleContentText)

    //Creates a link to go to the source
    let readArticleLink = document.createElement("a")
    let readArticleLinkText = document.createTextNode("Read the whole article here.")
    readArticleLink.appendChild(readArticleLinkText)
    readArticleLink.setAttribute('href', newsArticle.url)
    readArticleLink.setAttribute('target', '_blank')

    //Creates the image
    let articleImg = document.createElement('img')
    articleImg.setAttribute('src', newsArticle.urlToImage)
    articleImg.setAttribute('width', '100%')
    
    //Adds all the elements to the popup
    popup.appendChild(popupTitle)
    popup.appendChild(popupTitle)
    popup.appendChild(articleContentElement)
    popup.appendChild(readArticleLink)
    popup.appendChild(articleImg)

    //add the article to read articles
    addReadArticle(getCookies().username,newsArticle.url,newsArticle.title)
}
