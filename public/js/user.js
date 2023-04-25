//This function is for when the user clicks on either the LOGIN text or username
function userClick() {
    let userElement = document.getElementById("user")

    //event listener for click
    userElement.addEventListener("click", () => {
        if(loggedIn()===true){
            //if logged in, find the username in the cookie
            let user = getCookies().username
            user = getUser(user)
            //Display a popup with userdetails
            userDetailsPopup(user[1])
            displayPopup()
        } else {
            //Display the loginform if not logged in    
            addLoginForm()
            displayPopup()
        }
    })
}

//This is a helper function to easily add an input element to a form
function addInputField(name,parentElement,label=false,value='',placeholder='',type='text',disabled,id=name){
    if(!label===false){
        //Creates a label if any is given
        let labelElement = document.createElement("label")
        labelElement.setAttribute('for', name)
        let labelElementText = document.createTextNode(label)
        labelElement.appendChild(labelElementText)
        parentElement.appendChild(labelElement)
        //Creates a new line
        parentElement.appendChild(document.createElement("br"))
    }
    

    //Create an input element with the specified parameters
    let inputElement = document.createElement("input")
    inputElement.setAttribute('name', name)
    inputElement.setAttribute('id', id)
    inputElement.setAttribute('type', type)
    inputElement.setAttribute('value', value)
    inputElement.setAttribute('placeholder', placeholder)

    //Sets the field to be disabled id the parameter says so
    if(disabled){
        inputElement.setAttribute('disabled','true')
    }

    //Appends the input element to the parent element
    parentElement.appendChild(inputElement)
    parentElement.appendChild(document.createElement("br"))
}

let userDetailsFormAdded = false;

//This function creates the user details popup
function userDetailsPopup(user){
    let popup = document.getElementById("popupContent");

    //only display if the form is not already added
    if(userDetailsFormAdded === false){
        let userDetailsForm = document.createElement("form")
        userDetailsForm.setAttribute("id","userDetailsForm")
        popup.appendChild(userDetailsForm)

        //adds inputfields with a helper function
        addInputField('username',userDetailsForm,'Username',user.name,'Username','text',true)
        addInputField('password',userDetailsForm,'Password',user.password,'Password')
        addInputField('email',userDetailsForm,'Email',user.email,'Email adress')
        addInputField('submitField',userDetailsForm,false,'Update user','','submit')

        //creates a logoutBtn
        let logoutBtn = document.createElement("button")
        let logoutBtnText = document.createTextNode("Log ud")
        logoutBtn.appendChild(logoutBtnText)
        logoutBtn.setAttribute("id", "logoutBtn")
        popup.appendChild(logoutBtn)

        logoutBtn = document.getElementById("logoutBtn")
        
        
        //actions to take when logoutBtn is clicked
        logoutBtn.addEventListener("click", () => {
            logout(user.name);
            closePopup();
            clearPopup();
            setUserName();
        })

        //Creates delete user btn
        let deleteBtn = document.createElement("button")
        let deleteBtnText = document.createTextNode("Slet bruger")
        deleteBtn.appendChild(deleteBtnText)
        popup.appendChild(deleteBtn)

        deleteBtn.addEventListener("click", () => {
            logout(user.name)
            deleteUser(user.name)
            closePopup()
            clearPopup()
        })
        //This function adds an eventlistener to the form
        updateUserDetails(user)
        userDetailsFormAdded=true
    }
}

//this function updates the user details when the form is submitted
function updateUserDetails(user){
    let userDetailsForm = document.getElementById("userDetailsForm")
    userDetailsForm.addEventListener("submit", (event) => {
        event.preventDefault();
        //This code is taken from https://stackoverflow.com/questions/3547035/getting-html-form-values/66407161#66407161 
        let formData = new FormData (event.target);
        let formProbs = Object.fromEntries(formData)   
        // --- Until here ^ 
        
        //for each probery sent in the form, update the user with the updateUser function in login.js
        for(const proberty in formProbs){
            if (proberty != 'username'){
                updateUser(user.name,proberty,formProbs[proberty])
            }
        }
        
    })
}

//This function adds the "Already Read" box in the DOM
function addAlreadyReadElement(){
    //First checks if logged in
    if(loggedIn()){
        //Find the articles that are read
        let readArticles = getUser(getCookies().username)[1].readArticles
        //Takes into consideration that there are none
        readArticles = readArticles === undefined ? JSON.stringify({url: [], title: []}) : readArticles;
        readArticles = JSON.parse(readArticles)
        //gets the articles that are displayed on the site
        let newsArray = JSON.parse(sessionStorage.getItem("newsArray")).articles
        //For each article on the site find out if it is in the already read array
        for(let x=1; x<7; x++){
            //Get the URL of current iterations newsarticle
            let url = newsArray[x].url

            //if the current iterations article is also in found in the readArticles array
            if(readArticles.url.includes(url)){
                let articleElement = document.getElementById(`${url}`)
                
                //adds the box
                let alreadyReadElement = document.createElement("span")
                let alreadyReadElementText = document.createTextNode("Already read")
                alreadyReadElement.appendChild(alreadyReadElementText)
                alreadyReadElement.setAttribute('class', 'alreadyRead')
                articleElement.appendChild(alreadyReadElement)
            }
        }
    }
}

//this function adds the heart that can be used to favourite articles
function addFavouriteElement() {
    //Checks if logged in
    if(loggedIn()){
        //gets favourite articles
        let favouriteArticles = getUser(getCookies().username)[1].favouriteArticles
        //if none is set make an empty object
        favouriteArticles = favouriteArticles === undefined ? JSON.stringify({url: [], title: []}) : favouriteArticles;
        favouriteArticles = JSON.parse(favouriteArticles);
        //gets articles displayed on the site
        let newsArray = JSON.parse(sessionStorage.getItem("newsArray")).articles
        //goes through each article one at a time
        for(let x = 1; x<7; x++){
            let url = newsArray[x].url
            //each article has an ID equal to their URL
            let article = document.getElementById(url)

            //Creates the heart for each article
            let favouriteElement = document.createElement("span")
            
            //if the article is already favourited it will be assigned a class indicating that
            if(favouriteArticles.url.includes(url)){
                favouriteElement.setAttribute('class','favourite favouriteSelected')
            } else {
                favouriteElement.setAttribute('class','favourite favouriteNotSelected')
            }
            //Adds the heart to the DOM
            article.appendChild(favouriteElement)

            //if the heart is clicked do this
            favouriteElement.addEventListener('click', (e) => {
                //if the articles is favourited it should be not selected and deleted from the users favourite articles
                if (e.srcElement.className.includes('favouriteSelected')){
                    favouriteElement.setAttribute('class','favourite favouriteNotSelected')
                    deleteFavouriteArticle(getCookies().username,url)
                } else {
                    //if the articles is not favourited it should be selected and added from the users favourite articles
                    favouriteElement.setAttribute('class','favourite favouriteSelected')
                    addFavouriteArticle(getCookies().username,url,newsArray[x].title)
                }
            })
        }

    }
}

//this function removes all the hearts and already read boxes. This is of use if the user for example logs out
function deleteFavouriteElements(){
    let elementsToDelete = document.querySelectorAll("span.favourite, span.alreadyRead")
    elementsToDelete.forEach(e => {
        e.remove()
    })
}