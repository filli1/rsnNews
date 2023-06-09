//API KEY: a3a9b3bf13f043f890b1335b08ec09b1
//NY API: 4d438c96e5c54b938fe57e7e8626fe0b
//Initial search

let newsUrl = `/news/frontpage`

//Fetches the news from the news api
const news = async () => {
    let response = await fetch(newsUrl,
        {
            method: 'GET'
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
    if (Object.keys(newsArray).length === 0){
        alert("Der er ingen artikler der matcher din søgning, du bliver ført tilbage til forsiden")
        newsUrl = `/news/frontpage`
        newsArray = (await news());
    }
    
    //Loop through up to 7 items of the news array - depending on if there are less than 7
    for(let x=1; x<(newsArray.totalResults < 8? newsArray.totalResults : 8);x++){
        //gets the current iterations article
        let article = newsArray[x]
        if (article.imageUrl === null){
            article.imageUrl = 'static/img/noImg.GIF'
        }
        //if this is the first iteration, then set the spotligt article to the first article in the array
        if(x===1){
            spotSource.innerHTML = (article.source? '- '+article.source : "");
            spotTitle.innerHTML = article.title;
            spotlight.style.backgroundImage = `url('${article.imageUrl}')`;
            spotBtn.setAttribute('href', article.url)
        } else {
            //creates the news article elements and childs
            const articleElement = document.createElement("div");
            articleElement.setAttribute('class','article borderStyle flexCol flexGrow')
            articleContainer.appendChild(articleElement);
            articleElement.setAttribute('id', article.url)
            const img = document.createElement("img")
            if(article.imageUrl){
                img.setAttribute('src', article.imageUrl)
            }
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
            addReadArticle(x+1)
            event.preventDefault()
            displayPopup()
            articlePopup(newsArray[x+1])
        })
    }
    
    // Calls the function once to add 'Already read' and favourites when the page is loaded.
    addAlreadyReadElement();
    addFavouriteElement();  
    addLikeElement()
    
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
    let articleContentText = document.createTextNode(newsArticle.description)
    articleContentElement.appendChild(articleContentText)

    //Creates a link to go to the source
    let readArticleLink = document.createElement("a")
    let readArticleLinkText = document.createTextNode("Read the whole article here.")
    readArticleLink.appendChild(readArticleLinkText)
    readArticleLink.setAttribute('href', newsArticle.url)
    readArticleLink.setAttribute('target', '_blank')

    //Creates the image
    let articleImg = document.createElement('img')
    articleImg.setAttribute('src', newsArticle.imageUrl)
    articleImg.setAttribute('width', '100%')
    
    //Adds all the elements to the popup
    popup.appendChild(popupTitle)
    popup.appendChild(popupTitle)
    popup.appendChild(articleContentElement)
    popup.appendChild(readArticleLink)
    popup.appendChild(articleImg)

    // //add the article to read articles
    // addReadArticle(getCookies().username,newsArticle.url,newsArticle.title)
}
