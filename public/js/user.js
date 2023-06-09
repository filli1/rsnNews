//This function is for when the user clicks on either the LOGIN text or username
function userClick() {
    let userElement = document.getElementById("user")

    //event listener for click
    userElement.addEventListener("click", async () => {
        if(loggedIn()===true){
            //if logged in, find the username in the cookie
            let user = getCookies().email
            user = await getUser(user)
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
        addInputField('email',userDetailsForm,'Email',user.email,'Email','text',true)
        addInputField('firstName',userDetailsForm,'First name',user.firstName,'First name')
        addInputField('lastName',userDetailsForm,'Last name',user.lastName,'Last name')
        addInputField('nationality',userDetailsForm,'Nationality',user.nationality,'Nationality')
        addInputField('password',userDetailsForm,'Password',user.password,'Password')
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
            logout(user.email);
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
            logout(user.email)
            deleteUser(user.userID)
            closePopup()
            clearPopup()
        })
        //This function adds an eventlistener to the form
        updateUserDetails(user)
        userDetailsFormAdded=true
    }
}

//this function updates the user details when the form is submitted
async function updateUserDetails(user) {
    let userDetailsForm = document.getElementById("userDetailsForm");
    userDetailsForm.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      let formData = new FormData(event.target);
  
      const updateUser = async () => {
        try {
          let response = await fetch(`/users/s/${user.userID}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(Object.fromEntries(formData)),
          });
          if (!response.ok) {
            let error = await response.json();
            throw new Error(`Failed to update user: ${error.message}`);
          }
          return response;
        } catch (error) {
          console.error(error);
          throw new Error(error);
        }
      };
      
  
      let updatedUser = await updateUser();
      let tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      document.cookie = `firstName=${Object.fromEntries(formData).firstName}; expires=${tomorrow}`;
      setUserName()
    });
  }
  



//Adds read article to database when the user clicks the 'Read More' button.
async function addReadArticle(articleIndex) {
  try {
    const response = await fetch('/users/read', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userID: getCookies().userID,
        newsID: newsArray[articleIndex].articleID
      })
    });
    if (!response.ok) {
      throw new Error('Unable to add read article');
    } else {
      addAlreadyReadElement();
    }
  } catch (error) {
    console.log(error);
  }
}

//This function adds the "Already Read" box in the DOM
let readArticlesUrl = "/users/read/" + getCookies().userID

const readArticles = async () => {
  try {
    let response = await fetch(readArticlesUrl, { 
        method: 'GET' 
    });
    return response.json();
  } catch (error) {
    console.log(error);
    return [];
  }
};
async function addAlreadyReadElement() {
    if (loggedIn()) {
      try {
        const readArticlesArray = await readArticles();
        for (let x = 2; x < 8; x++) {
          const id = newsArray[x].articleID;
          const url = newsArray[x].url
          if (readArticlesArray.includes(id)) {
            let articleElement = document.getElementById(`${url}`)
            const alreadyReadElement = document.createElement("span");
            const alreadyReadElementText = document.createTextNode("Already read");
            alreadyReadElement.appendChild(alreadyReadElementText);
            alreadyReadElement.setAttribute("class", "alreadyRead");
            articleElement.appendChild(alreadyReadElement);
            addAlreadyReadElement()
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
 
  //Lets a user favourite and unfavourite articles
  //First defines the endpoint using cookies
  let favouritesUrl = "/users/favourite/"

   const favourites = async () => {
    try {
       let response = await fetch(favouritesUrl + getCookies().userID, { 
           method: 'GET' 
       });
       return response.json();
     } catch (error) {
       console.log(error);
       return [];
     }
   };

  //Then defines the function
  async function addFavouriteElement() {
    // Check if the user is logged in
    if (loggedIn()) {
      try {
        // Retrieve the user's favourites array
        const favouritesArray = await favourites();
  
        // Iterate over each article and add the favourite element
        for (let x = 2; x < 8; x++) {
          const url = newsArray[x].url;
          const id = newsArray[x].articleID;
  
          // Get the article element by ID
          const article = document.getElementById(url);
          const favouriteElement = document.createElement("span");
  
          // Set the class of the favourite element based on whether the article is favourited or not
          if (favouritesArray.includes(id)) {
            favouriteElement.setAttribute("class", "favourite favouriteSelected");
          } else {
            favouriteElement.setAttribute("class", "favourite favouriteNotSelected");
          }
          article.appendChild(favouriteElement);
  
          // Attach an event listener to the favourite element
          favouriteElement.addEventListener("click", async (e) => {
            const isFavourited = e.target.classList.contains("favouriteSelected");
            if (isFavourited) {
              // If the article is already favourited, remove it from the user's favourites
              favouriteElement.classList.remove("favouriteSelected");
              favouriteElement.classList.add("favouriteNotSelected");
              await fetch(favouritesUrl, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ userID: getCookies().userID, articleID: newsArray[x].articleID }),
              });
            } else {
              // If the article is not favourited, add it to the user's favourites
              favouriteElement.classList.remove("favouriteNotSelected");
              favouriteElement.classList.add("favouriteSelected");
              await fetch(favouritesUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ userID: getCookies().userID, articleID: newsArray[x].articleID }),
              });
            }
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  

  let getLikesUrl = "/news/likes/";
  let likesUrl = "/users/likes/";
  
  const getTotalLikes = async (articleID) => {
    try {
      let response = await fetch(getLikesUrl + articleID, { method: 'GET' });
      return response.text();
    } catch (error) {
      console.log(error);
      return '0';
    }
  };
  
  const getLikedArticlesByUser = async (userID) => {
    try {
      let response = await fetch(`/users/likes/${userID}`, { method: 'GET' });
      return response.json();
    } catch (error) {
      console.log(error);
      return [];
    }
  };
  
  async function addLikeElement() {
    // Check if the user is logged in
    if (loggedIn()) {
      const userID = getCookies().userID;
      const likedArticles = await getLikedArticlesByUser(userID);
      try {
        // Iterate over each article and add the like element
        for (let x = 2; x < 8; x++) {
          const url = newsArray[x].url;
          const id = newsArray[x].articleID;
  
          // Get the article element by ID
          const article = document.getElementById(url);
          const likeElement = document.createElement("span");
          likeElement.setAttribute("class", "likeCounter")
          likeElement.classList.add("like")
          const imageElement = document.createElement("span");
  
          // Get the total number of likes for the article
          const totalLikesCount = await getTotalLikes(id);
          likeElement.textContent = totalLikesCount;
  
          // Check if the current user has liked the article
          
          const isLiked = likedArticles.includes(id);
  
          
          article.appendChild(likeElement);

           // Set the class of the like element based on whether the article is liked or not
           if (isLiked) {
            imageElement.setAttribute("class", "like likeSelected");
          } else {
            imageElement.setAttribute("class", "like likeNotSelected");
          }
          
          article.appendChild(imageElement);
  
          // Attach an event listener to the image element
          imageElement.addEventListener("click", async (e) => {
            const isLiked = imageElement.classList.contains("likeSelected");
            if (isLiked) {
              // Unlike the article
              imageElement.classList.remove("likeSelected");
              imageElement.classList.add("likeNotSelected");
              await fetch(likesUrl, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({userID: getCookies().userID, articleID: id }),
              });
              likeElement.textContent = parseInt(likeElement.textContent) - 1;
            } else {
              // Like the article
              imageElement.classList.remove("likeNotSelected");
              imageElement.classList.add("likeSelected");
              await fetch(likesUrl, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({userID: userID, articleID: id }),
              });
              likeElement.textContent = parseInt(likeElement.textContent) + 1;
            }
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  }
  

  




//this function removes all the hearts and already read boxes. This is of use if the user for example logs out
function deleteFavouriteElements(){
    let elementsToDelete = document.querySelectorAll("span.favourite, span.alreadyRead, span.like")
    elementsToDelete.forEach(e => {
        e.remove()
    })
}