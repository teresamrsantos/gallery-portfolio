/**
 * @author Teresa Marta Ribeiro Santos  - uc2021151797
 *
 * File with the user profile(edit) for the index page
 */

import { errorGeneral } from "./generalScript.js";
import { getUserProfileAPI, getUserTokenAPI } from "./generalScript.js";

/* CONST ROOT PATH REST API */
const generalPath = "http://localhost:8080/DataServer_Proj5/rest/";
/*Pagina Principal */
var userProfileHTML = document.querySelector(".userProfileHTML");
/***************************** inputs ***********************/
var firstNameInput = document.querySelector(".firstNameRegister");
var lastNameInput = document.querySelector(".lastNameRegister");
var emailInput = document.querySelector(".emailRegister");
var photoInput = document.querySelector(".pictureRegister");
var usernameInput = document.querySelector(".usernameRegister");
var passwordInput = document.querySelector(".passwordRegister");
var biographyInput = document.querySelector(".biographyEdit");
/************************************************************/
/* BOTAO DE EDITAR */
var editBtn = document.querySelector(".btn-edit");
var token;
var username;
/* Verifica se esta de facto no index e chama a funcao inicial */
if (userProfileHTML) {
  userProfileHTML.onload = bodyOnLoaduserProfile();
}

function bodyOnLoaduserProfile() {
  let urlSearch = new URLSearchParams(window.location.search);
  const username = urlSearch.get("username");
  if (username !== null) {
    getUserTokenAPI(username, saveToken, errorGeneral);
  }
}

function saveToken(user) {
  console.log("YO", user);
  token = user.token;
  username = user.username;
  getUserProfileAPI(token, username, loadUserInfoToScreen, errorGeneral);
}

function loadUserInfoToScreen(user) {
  console.log(user);
  firstNameInput.value = user.firstName;
  lastNameInput.value = user.lastName;
  emailInput.value = user.email;
  photoInput.value = user.pictureUrl;
  usernameInput.value = user.username;
  passwordInput.value = user.password;
  biographyInput.value = user.biography;

  document.querySelector(".userPhoto").src = user.pictureUrl;
  document.querySelector(".username").innerText =
    user.firstName + " " + user.lastName;
}

editBtn?.addEventListener("click", (evt) => {
  evt.preventDefault();
  let firstNameField = firstNameInput.value;
  let lastNameField = lastNameInput.value;
  let usernameField = usernameInput.value;
  let passwordField = passwordInput.value;
  let biographyField = biographyInput.value;
  let emailField = emailInput.value;
  let imageField = photoInput.value;
  var myJSON;
  if (
    firstNameField != "" &&
    lastNameField != "" &&
    passwordField != "" &&
    emailField != "" &&
    imageField != ""
  ) {
    myJSON = JSON.stringify({
      firstName: firstNameField,
      lastName: lastNameField,
      username: usernameField,
      password: passwordField,
      biography: biographyField,
      email: emailField,
      pictureUrl: imageField,
    });
  }

  console.log(token);

  editUserProfileAPI(
    myJSON,
    token,
    username,
    sucessOnSavingUser,
    errorOnSavingUser
  );
});

function sucessOnSavingUser() {
  getUserProfileAPI(token, username, loadUserInfoToScreen, errorGeneral);
}

function errorOnSavingUser(error) {
  console.log(error);
}

/***********************************************/
/***************** EDITAR USER API  ***********/
/*********************************************/

function editUserProfileAPI(myJSON, token, username, onSuccess, onError) {
  var fetchProperties = {
    method: "POST",
    headers: { token, "Content-Type": "application/json" },
    body: myJSON,
  };

  fetch(generalPath + "users/editProfile/" + username, fetchProperties)
    .then(function (response) {
      console.log(response.status);
      if (response.ok) {
        return response.text();
      } else {
        throw Error(response.status + ": " + response.statusText);
      }
    })
    .then(function (json) {
      console.log(json);
      onSuccess(json);
    })
    .catch(function (error) {
      console.log("error on EditProfileUser: " + error);
      onError(error);
    });
}


/**** CONTROLO DE IDIOMA */
var lingo = null;
document
  .querySelector(".dropdown-content")
  .addEventListener("click", function (evt) {
    if (evt.target.tagName === "BUTTON") {
      lingo = evt.target.value;
    }
  });

document.querySelector(".search-lupa").addEventListener("click", (evt)=>{
  evt.preventDefault();
let keyword=document.querySelector(".search-data").value;
if(keyword!=="") {
    let urlSearch = new URLSearchParams(window.location.search);
    const username = urlSearch.get("username");
    var urlID = new URLSearchParams();
    const lingoURL = urlSearch.get("lingo");

    if (lingo != null) {
      urlID.append("lingo", lingo);
      console.log(lingo, "lingo");
    } else if (lingoURL != null) {
      console.log(lingoURL, "lingoURL");
      urlID.append("lingo", lingoURL);
    }

    if (username !== null) {
      urlID.append("username", username);
    }
    urlID.append("keyword", keyword);

    location.href =
      "NewsprojectKeyword.html?"+urlID.toString();}}
);

