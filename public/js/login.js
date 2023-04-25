//const { json } = require("express")


//Logs a user in
function login(username) {
    //Determines if a user is logged in.
    if(!loggedIn()){
        //If the user is not logged in, it checks whether a user with that username exists.
        if(getUsers().array.includes(username)){
            //if the username exists it sets a cookie with the username with expiry tomorrow.
            let today = new Date()
            let tomorrow = new Date()
            tomorrow.setDate(today.getDate()+1)

            //Set cookie
            document.cookie = `username=${username}; expires=${tomorrow}`
            console.log(`${username} logged in.`)

            document.getElementById("user").innerHTML = username;

            //these functions adds the favourite "hearts" and the articles already read. These are uer specific.
            addAlreadyReadElement()
            addFavouriteElement()
            userDetailsFormAdded=false

            //returns true
            return true
        } else {
            //logs an error if the user does not exist
            console.error(`User: ${username} does not exist.`)
            return (`User: ${username} does not exist.`)
        }
    } else {
        //logs an error if there already is a user logged in
        console.error(`${getCookies().username} is already logged in. Log this user out to log in as other user.`)
        return (`${getCookies().username} is already logged in. Log this user out to log in as other user.`)
    }
}

//Logs a user out
function logout(username){
    //Checks if there is anybody logged in and that the username in the param is equal to the cookie user
    if(loggedIn() && username===getCookies().username){
        let today = new Date()
        let yesterday = new Date()
        yesterday.setDate(today.getDate()-365)


        //Deletes cookie if the user is logged in
        document.cookie = `username=${username}; expires=${yesterday}`
        console.log(`${username} logged out.`)
        loginFormAdded = false
        document.getElementById("user").innerHTML = username;

        //This removes the favourite elements from the DOM
        deleteFavouriteElements()

        //sets the username in DOM to be login instead
        setUserName()
    } else {
        //Logs an error if the user (param) is not logged in
        console.error(`User: ${username} not logged in. User: ${getCookies().username} is currently logged in.`)
    }
    
}

//Lists all cookies as an object
function getCookies(){
    //Checks if there are any cookies set
    if(document.cookie!='') {
        //splits the cookies into an array at each "; "
        let cookies = document.cookie.split('; ');
        //Creates a cookie Object
        let cookieObj = {}
        //for each value in the cookie array
        for(let x=0;x<cookies.length;x++){
            //it will split the current [i] value into to parts at the "=" sign (into an array of 2 values)
            let thisCookie = cookies[x].split('=');
            //the first value being the name of the cookie set
            let thisCookieName = thisCookie[0]
            //the second being the value of the cookie set. Here we put the name of the cookie into the object as the proberty and the value of the cookie as the value of the object proberty.
            cookieObj[thisCookieName] = thisCookie[1]
        }
        //returns the object
        return cookieObj;
    } else {
        return 'No cookies';
    }
}

//Checks whether any user is logged in 
function loggedIn(){
    let username = getCookies().username
    if(username===undefined){
        return false
    } else {
        return true
    }
}

//function to set the username in the DOM
function setUserName(){
    if(loggedIn()){
        let username = getCookies().username
        document.getElementById("user").innerHTML = username
    } else {
        document.getElementById("user").innerHTML = "LOGIN"
    }
}

//Gets a list of all users
function getUsers(){
    //Gets the users from the localstorage
    let users = localStorage.getItem('users')

    //Checks if there are any users in the local storage, makes an empty array if not
    users = users==undefined?[]:JSON.parse(users);
    let userList = {}
    userList.obj = users
    //this creates a list (array) of all the usernames in the localstorage
    userList.array = userList.obj.map(obj => obj.name)
    return userList;
}

//Creates a user
function createUser(username,password){
    let users = getUsers();

    //Get list of users as objects
    let userList = users.obj

    //Get list of usernames as an array
    let usernames = users.array

    //Checks if the username already exists
    if(!usernames.includes(username)){
        //creates the initial user object
        let user = {
            name: username,
            password: password
        }
        //pushes the new user into the whole user array
        userList.push(user)
    
        //Sets the localstorage to the updates userlist.
        localStorage.setItem('users', JSON.stringify(userList))
        return true
    } else {
        //logs an error if the user already exists.
        console.error('User is already created')
        return 'User is already created'
    }
}

//Deletes a user
function deleteUser(username){
    //gets a list of all users. The function returns an object with both an array of all usernames but also an array of all user objects
    let users = getUsers()

    //checks if the user that should be deleted exists
    if(users.array.includes(username)){
        //finds at what index the user is at
        let deleteUserAtIndex = users.array.indexOf(username)

        //deletes the user from the array of objects
        users.obj.splice(deleteUserAtIndex,1)
    
        //sets the localstorage to the new array of ibject
        localStorage.setItem('users', JSON.stringify(users.obj))

        console.log(`User: ${username} was deleted.`)
    } else {
        //gives an error if the user does not exist
        console.error(`User: ${username} does not exist.`)
    }
    
}

//Updates a specific user with any proberty to any value
function updateUser(username,property='',value=''){

    //retrieves all users
    let users = getUsers()

    //divides the user obj into to variables
    let userObj = users.obj

    //this only contains all usernames
    let userArray = users.array

    //if the username exists
    if(userArray.includes(username)){
        //finds at what it index the user should be updated
        let updateUserAtIndex = userArray.indexOf(username)

        //retrieves the user that should be updated as an object
        let userToUpdate = userObj[updateUserAtIndex]

        //Either creates or updates the user depending if the proberty was already existing.
        userToUpdate[property] = value;

        //corrects the updated user in the user Obj
        userObj[updateUserAtIndex] = userToUpdate;

        //saves the changes to the localstorage.
        localStorage.setItem('users', JSON.stringify(userObj))
    } else {
        //Console error if the user does not exist
        console.error(`User: ${username} does not exist.`)
    }
}

//Gets information about a specific user
function getUser(username){
    //array of all users
    let users = getUsers()

    let userObj = users.obj
    let userArray = users.array

    //if the user exists
    if(userArray.includes(username)){
        //returns the user as an object with all the set proberties. The true indicates that the user was found.
        let getUserAtIndex = userArray.indexOf(username)
        return [true,userObj[getUserAtIndex]]
    } else {
        console.error(`User: ${username} does not exist.`)
        return (`User: ${username} does not exist.`)
    }
}

//Checks if the password in the param aligns with the one set in the localstorage
function checkPassword(username, password) {
    //gets the user
    let user = getUser(username)
    //checks if the user exists
    if (user[0]===true){
        //if the password aligns
        if(password === user[1].password){
            //then login the username
            let success = login(username)
            if(success===true){
                return true
            } else {
                return success
            }
            
        } else {
            //Logs an error + returns an error
            console.error("Password incorrect")
            return 'Password incorrect'
        }
    } else {
        //returns that the user does not exist
        return user
    }
}
//makes sure that the loginform cant be added more than once each time the
let loginFormAdded = false;

function addLoginForm() {
    //Makes sure the form is only added once
    if(loginFormAdded===false){
        let popup = document.getElementById("popupContent")

        //Add header/title
        let popUpTitle = document.createElement("h4")
        popUpTitle.setAttribute("id", "popupTitle")
        let popUpTitleText = document.createTextNode("Login")
        popUpTitle.appendChild(popUpTitleText)
        popup.appendChild(popUpTitle)

        //add form element
        let formElement = document.createElement("form")
        formElement.setAttribute("id", "loginform")

        //Creates inputfields
        let usernameInput = document.createElement("input")
        usernameInput.setAttribute("name", "usernameInput")
        usernameInput.setAttribute("required", "true")
        usernameInput.setAttribute("placeholder", "Brugernavn")

        let passwordInput = document.createElement("input")
        passwordInput.setAttribute("type", "password")
        passwordInput.setAttribute("name", "passwordInput")
        passwordInput.setAttribute("required", "true")
        passwordInput.setAttribute("placeholder", "Adgangskode")

        //This input field is hidden and just determines if it is a login form or a create user form.
        let formType = document.createElement("input")
        formType.setAttribute("id", "formType")
        formType.setAttribute("hidden", "true")
        formType.setAttribute("name", "type")
        formType.setAttribute("value", "login")

        let submitBtn = document.createElement("input")
        submitBtn.setAttribute("type", "submit")

        //appends the elements to the DOM
        formElement.appendChild(usernameInput)
        formElement.appendChild(passwordInput)
        formElement.appendChild(formType)
        formElement.appendChild(submitBtn)

        popup.appendChild(formElement)

        //creates a btn for when the user wants to create a user instead of login
        let createuserInsteadBtn = document.createElement("span")
        createuserInsteadBtn.setAttribute("id", "createUserInstead")
        let createuserInsteadBtnText = document.createTextNode("Har du ikke en bruger? Klik her for at oprette en ny")
        createuserInsteadBtn.style.textDecoration = "underline"
        createuserInsteadBtn.appendChild(createuserInsteadBtnText)
        popup.appendChild(createuserInsteadBtn)
        loginformEventListener()

        loginFormAdded = true
    }
}

//Switches the form type to a create user form - just updates the value of the formtype input field
function switchToCreateUser() {
    let popupTitle = document.getElementById("popupTitle")
    popupTitle.innerHTML = "Opret ny bruger"
    let formtype = document.getElementById("formType")
    formtype.setAttribute("value", "createUser")
}

//adds an eventlistener to the login form
function loginformEventListener() {
    const loginform = document.getElementById("loginform")
    loginform.addEventListener("submit", (event) => {
        event.preventDefault();
        //This code is taken from https://stackoverflow.com/questions/3547035/getting-html-form-values/66407161#66407161
        let formData = new FormData (event.target);
        let formProbs = Object.fromEntries(formData)    
        // --- Until here ^
        let action = formProbs.type

        //Checks which action to take
        if(action === 'login'){
            //Checks the password
            let success = checkPassword(formProbs.usernameInput, formProbs.passwordInput)
            if(success===true){
                //Closes the popup on success
                closePopup()
                clearPopup()
            } else {
                //puts an error in the popop Box
                popupError(success)
            }
        } else {
            //Creates a user
            let success = createUser(formProbs.usernameInput, formProbs.passwordInput)

            //checks if the user was created
            if(success===true){
                login(formProbs.usernameInput)
                closePopup()
                clearPopup()
            } else {
                //puts an error message in the popup
                popupError(success)
            }
            
        }
    })

    //event listener for create user instead
    let createUserInstead = document.getElementById("createUserInstead")
    createUserInstead.addEventListener("click", () => {
        switchToCreateUser();
    })

}