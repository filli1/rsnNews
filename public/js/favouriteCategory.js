//Makes sure that the elements are only added once to the popup
let favouritesClicked = false;

const getFavouriteCategories = () => {
    return fetch(`/categories/user/${getCookies().userID}`, {
      method: 'GET'
    }).then(response => response.json());
  };
  

const deleteFavouriteCategory = async (categoryID) => {
    let response = await fetch('/categories/remove',
        {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: getCookies().userID,
                categoryID: categoryID
            })
        })
    return response;
}

const addFavouriteCategory = async (categoryID) => {
    let response = await fetch('/categories/add',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: getCookies().userID,
                categoryID: categoryID
            })
        })
    return response;
}

async function favouritePopup(){
    //Categories that the user can set as favourite
    const getCategories = async () => {
        let response = await fetch('/categories',
            {
                method: 'GET'
            }
        );
        return response.json();
    }
    getCategories().then(async categories => {
        //Gets the popup element
        const popup = document.getElementById('popupContent')

        //Creates a title for the popup
        let popupTitle = document.createElement('h4')
        let popUpTitleText = document.createTextNode('Favorit nyhedskategorier')
        popupTitle.appendChild(popUpTitleText)

        //Adds the title to the popup
        popup.appendChild(popupTitle)

        //Creates a container for the category buttons
        let categoryBtnContainer = document.createElement("div")
        categoryBtnContainer.setAttribute('id', 'categoryBtnContainer')

         //Retrieves the user
        let user = getUser(getCookies().email)

        //gets the user's favourite categories
        let favouriteCategories = await getFavouriteCategories()

        //For each category in the array, a new button and an eventlistener is added
    for(let i=0; i<categories.length; i++){
        //Creates the button element
        let categoryBtn = document.createElement('button')
        //Sets the buttons text to be this loop iteration's text
        let categoryBtnText = document.createTextNode(categories[i].category)
        categoryBtn.appendChild(categoryBtnText)
        //Set the buttons attributes including CSS class
        categoryBtn.setAttribute('id', categories[i].categoryID)
        categoryBtn.setAttribute('class', 'categoryBtn')
        //Appends the button to the popup
        categoryBtnContainer.appendChild(categoryBtn)

        //THIS SHOULD CHECK ALREADY FAVOURITE CATEGORIES
        //If any favourite categories is set for the user, the class 'favouriteCategory' also has to be added.
        if(favouriteCategories.includes(categories[i].categoryID)){
            categoryBtn.setAttribute('class', 'categoryBtn favouriteCategory')
        }

        //A click eventListener is added to the current loop iteration's button
        categoryBtn.addEventListener('click', () => {
            //Checks if any favourite categories is defiend for the user
            if(favouriteCategories.includes(categories[i].categoryID)){
                //Should remove the category from the user's favourite categories
                deleteFavouriteCategory(categories[i].categoryID)
                //Removes the category from the array of favourite categories
                favouriteCategories.splice(favouriteCategories.indexOf(categories[i].categoryID), 1)
                categoryBtn.setAttribute('class', 'categoryBtn')
            } else {
                //Should add the category to the user's favourite categories
                addFavouriteCategory(categories[i].categoryID)
                //Adds the category to the array of favourite categories
                favouriteCategories.push(categories[i].categoryID)
                categoryBtn.setAttribute('class', 'categoryBtn favouriteCategory')
            }
        })

        //Adds the container to the popup
        popup.appendChild(categoryBtnContainer)
    }
        
    })
}


/*
* After the page content is loaded, an event listener is added to the heart button in the left side of the page
* At a click it will run the function favouritePopup() which adds buttons and event listeners to the popup
* At last the popup is displayed to the user
*/
window.addEventListener("DOMContentLoaded", () => {
    const favouriteMenu = document.getElementById("favouriteMenuBtn")
    favouriteMenu.addEventListener("click", () => {
        //Ensures that the elements is only added once (in cooperation with line 2 of this file)
        if(favouritesClicked === false){
            favouritePopup()
            displayPopup()
            favouritesClicked=true
        }
    })
})