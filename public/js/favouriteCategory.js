//Makes sure that the elements are only added once to the popup
let favouritesClicked = false;

function favouritePopup(){
    //Categories that the user can set as favourite
    let categories = ['Finans', 'Politik', 'Børn', 'Royale', 'Livstil', 'Sport', 'Mad', 'Natur', 'Vejr'];

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
    let user = getUser(getCookies().username)[1]

    //For each category in the array, a new button and an eventlistener is added
    for(let i=0; i<categories.length; i++){
        //Creates the button element
        let categoryBtn = document.createElement('button')
        //Sets the buttons text to be this loop iteration's text
        let categoryBtnText = document.createTextNode(categories[i])
        categoryBtn.appendChild(categoryBtnText)
        //Set the buttons attributes including CSS class
        categoryBtn.setAttribute('id', categories[i])
        categoryBtn.setAttribute('class', 'categoryBtn')
        //Appends the button to the popup
        categoryBtnContainer.appendChild(categoryBtn)

        //If any favourite categories is set for the user, the class 'favouriteCategory' also has to be added.
        if(user.favouriteCategories != undefined){
            if(user.favouriteCategories.includes(categories[i])){
                categoryBtn.setAttribute('class', 'categoryBtn favouriteCategory')
            }
        }

        //A click eventListener is added to the current loop iteration's button
        categoryBtn.addEventListener('click', () => {
            //Checks if any favourite categories is defiend for the user
            if(user.favouriteCategories != undefined){
                
                if(user.favouriteCategories.includes(categories[i])){
                    //If the category clicked on is a favourite one, it is removed
                    //Gets favourite categories
                    let favouriteCategories = JSON.parse(user.favouriteCategories)
                    //Finds the categories index in the user's array of favourite categories
                    let favouriteCategoryToDelete = favouriteCategories.indexOf(categories[i])
                    //Deletes the category from the user's favourite categories
                    favouriteCategories.splice(favouriteCategoryToDelete,1)
                    //Updates the user's favourite categories to the new array
                    updateUser(user.name,'favouriteCategories',JSON.stringify(favouriteCategories))
                    //Gets the users - this is of use the next time the user clicks on a category
                    user = getUser(getCookies().username)[1]
                    //removes the class that indicates it is a favourite category
                    categoryBtn.setAttribute('class', 'categoryBtn')
                } else {
                    //If the category clicked on not already is marked as favourite at the user, it is added
                    //Gets favourite categories
                    let favouriteCategories = JSON.parse(user.favouriteCategories)
                    //Adds the new category to the user's favourite categories
                    favouriteCategories.push(categories[i])
                    //Update the user's favourite categories to the new array
                    updateUser(user.name,'favouriteCategories',JSON.stringify(favouriteCategories))
                    //Gets the users - this is of use the next time the user clicks on a category
                    user = getUser(getCookies().username)[1]
                    //Adds the class that indicates it is a favourite category
                    categoryBtn.setAttribute('class', 'categoryBtn favouriteCategory')
                }
            } else {
                //If the user does not have a proberty containing favourite categories
                //A new array is created only containing the category clicked on
                let favouriteCategories = [categories[i]]
                //The proberty with the newly defined array is added to the user
                updateUser(user.name,'favouriteCategories',JSON.stringify(favouriteCategories))
                //Gets the users - this is of use the next time the user clicks on a category
                user = getUser(getCookies().username)[1]
                //Adds the class that indicates it is a favourite category
                categoryBtn.setAttribute('class', 'categoryBtn favouriteCategory')
            }
            
        })
    }
    //Adds the container to the popup
    popup.appendChild(categoryBtnContainer)
    
    
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