//const { json } = require("express")


//Logs a user in
async function login(email) {
    if (!loggedIn()) {
        try {
            const user = await getUser(email);
            console.log(user[1]);
            let today = new Date();
            let tomorrow = new Date();
            tomorrow.setDate(today.getDate() + 1);
            document.cookie = `email=${email}; expires=${tomorrow}`;
            document.cookie = `firstName=${user[1].firstName}; expires=${tomorrow}`;
            document.cookie = `userID=${user[1].userID}; expires=${tomorrow}`;
            console.log(`${email} logged in.`);
            document.getElementById("user").innerHTML = user["1"].firstName;
            userDetailsFormAdded = false;
  
            return true;
        } catch (error) {
            throw new Error(`Email: ${email} does not exist.`);
        }
    } else {
        console.error(`${getCookies().email} is already logged in. Log this user out to log in as other user.`);
        return `${getCookies().email} is already logged in. Log this user out to log in as other user.`;
    }
}


//Logs a user out
function logout(email){
    //Checks if there is anybody logged in and that the username in the param is equal to the cookie user
    if(loggedIn() && email===getCookies().email){
        let today = new Date()
        let yesterday = new Date()
        yesterday.setDate(today.getDate()-365)
        const cookies = getCookies()
        deleteFavouriteElements()

        //Deletes cookie if the user is logged in
        document.cookie = `email=; expires=${yesterday.toUTCString()}; path =/`
        document.cookie = `firstName=; expires=${yesterday.toUTCString()}; path=/`
        console.log(`${email} logged out.`)
        loginFormAdded = false
        document.getElementById("user").innerHTML = email;

        //This removes the favourite elements from the DOM
        deleteFavouriteElements()

        //sets the username in DOM to be login instead
        setUserName()
    } else {
        //Logs an error if the user (param) is not logged in
        console.error(`User: ${email} not logged in. User: ${s(getCookie).email} is currently logged in.`)
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
            //the second being the value of the cookie set. Here we put the name of the cookie into the object as the property and the value of the cookie as the value of the object property.
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
    let username = getCookies().email
    if(username===undefined){
        return false
    } else {
        return true
    }
}

//function to set the username in the DOM
function setUserName(){
    if(loggedIn()){
        let firstName = getCookies().firstName
        document.getElementById("user").innerHTML = firstName
    } else {
        document.getElementById("user").innerHTML = "LOGIN"
    }
}


//Creates a user
async function createUser(email,password){
    const addUser = async () => {
        try {
            const user = {
                firstName: null,
                lastName: null,
                email: email,
                password: password,
                nationality: null
            }
            let response = await fetch('/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user)
            })
            if (!response.ok) {
                throw new Error(`Failed to load resource: the server responded with a status of ${response.status} (${response.statusText})`);
              }
              const data = await response.json();
              return data
            } catch (error) {
                throw new Error(error)
            }
          };
          
          let userID = await addUser();
          return userID
}

//Deletes a user
async function deleteUser(userID){
  const deleteUserRequest = async () => {
    try {
      const response = await fetch(`/users/s/${userID}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to load resource: the server responded with a status of ${response.status} (${response.statusText})`);
      }
      const data = await response.json();
      console.log(data.message);
      deleteFavouriteElements()
      return data
    } catch (error) {
      throw new Error(error)
    }
  }
  let deletedUser = await deleteUserRequest();
    
}

//Gets information about a specific user
async function getUser(email){ 
    const fetchUser = async () => {
        try {
            let response = await fetch(`/users/s/${email}`, {
                method: 'GET'
            })
            if (!response.ok) {
                throw new Error(`Failed to load resource: the server responded with a status of ${response.status} (${response.statusText})`);
              }
              const data = await response.json();
              return data
            } catch (error) {
                console.error(error)
                throw new Error(error)
            }
          };
          
          let user = await fetchUser();
          return user
}

//Checks if the password in the param aligns with the one set in the database
async function checkPassword(username, password) {
    try {
      // get the user
      const user = await getUser(username);
  
      // check the password
      if (password === user[1].password) {
        // log in the user
        const success = await login(username);
        if (success === true) {
          return true;
        } else {
          throw new Error("Failed to log in.");
        }
      } else {
        throw new Error("Password incorrect");
      }
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
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
        usernameInput.setAttribute("placeholder", "Email")

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
    const loginform = document.getElementById("loginform");
    loginform.addEventListener("submit", (event) => {
      
      event.preventDefault();
      // get the form data
      const formData = new FormData(event.target);
      const formProbs = Object.fromEntries(formData);
  
      // check which action to take
      const action = formProbs.type;
      if (action === "login") {
        
        // check the password
        checkPassword(formProbs.usernameInput, formProbs.passwordInput)
          .then((success) => {
            if (success === true) {
              closePopup();
              clearPopup();
              addAlreadyReadElement();
              addFavouriteElement();  
              addLikeElement()
            } else {
              popupError(success);
            }
          })
          .catch((error) => {
            popupError(error.message);
            console.error(error);
          });
      } else {
        // create a user
        createUser(formProbs.usernameInput, formProbs.passwordInput)
          .then((email) => {
            // log in the user with the newly created email address
            return login(formProbs.usernameInput);
          })
          .then((success) => {
            if (success === true) {
              closePopup();
              clearPopup();
              addAlreadyReadElement();
              addFavouriteElement();  
              addLikeElement()
            } else {
              popupError("Failed to log in.");
            }
          })
          .catch((error) => {
            popupError(error.message);
            console.error(error);
          });
      }
    });
  
    // add event listener for "Create User Instead" button
    const createUserInstead = document.getElementById("createUserInstead");
    createUserInstead.addEventListener("click", () => {
      switchToCreateUser();
    });
  }
  