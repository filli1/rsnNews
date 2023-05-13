//This function displays the popup to the user
function displayPopup() {
    const popupElement = document.getElementById("popup")
    popupElement.style.display = 'block';
}

//This popup hides the popup for the user
function closePopup() {
    const popupElement = document.getElementById("popup")
    popupElement.style.display = 'none';
}

//This function clears the content of the popup
function clearPopup(){
    const popupContent = document.getElementById("popupContent")
    popupContent.innerHTML = ''
}

//This function creates an error message as the very last element of its contents.
function popupError(errorMsg){
    const popupContent = document.getElementById("popupContent")
    //Creates it if it is not there already
    if(document.getElementById('popupError')===null) {
        let errorElement = document.createElement("div")
        let errorElementText = document.createTextNode("!  " + errorMsg)
        errorElement.setAttribute('class', 'error')
        errorElement.setAttribute('id', 'popupError')
        errorElement.appendChild(errorElementText)
        popupContent.appendChild(errorElement)
    } else {
        let errorElement = document.getElementById('popupError')
        errorElement.innerHTML = "!  " + errorMsg
    }

}

//This function closes and clears the popup when the close button is clicked.
window.addEventListener("DOMContentLoaded", () => {
    const popupCloseBtn = document.getElementById("closeBtn")
    popupCloseBtn.addEventListener("click", () => {
        closePopup()
        clearPopup()
        userDetailsFormAdded=false;
        loginFormAdded=false;
        favouritesClicked=false;
    })
})