/**
 * @author Teresa Marta Ribeiro Santos  - uc2021151797
 *
 * File with the script for the login
 */
/* CONST ROOT PATH REST API */
const generalPath = "http://localhost:8080/DataServer_Proj5/rest/";
/* Button Login*/
var loginButton = document.querySelector(".btnLogin");
/*caixa de texto do nome de utilizador*/
var inputUsername = document.querySelector(".usernameLogin");
/*caixa de texto da password de utilizador*/
var inputPassword = document.querySelector(".passwordLogin");

loginButton?.addEventListener("click", function (evt) {
  evt.preventDefault();
  document.querySelector(".errorLogin").style.display = "none";

  console.log("inputUsername");
  console.log(inputUsername.value);
  console.log("inputPassword");
  console.log(inputPassword.value);
  var username = inputUsername.value;
  var password = inputPassword.value;

  if (username != "" && password != "") {
    //corre função de login de api.js
    loginAPI(username, password, loginOK, loginNOTOK);
  } else if (username != "" && password == "") {
    inputPassword.focus();
  } else if (username == "" && password != "") {
    inputUsername.focus();
  }
});

/***********************************************/
/***************** LOGIN API ******************/
/*********************************************/

function loginAPI(usernameInput, passwordInput, onSuccess, onError) {
  var myJSON = JSON.stringify({
    username: usernameInput,
    password: passwordInput,
  });

  var fetchProperties = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: myJSON,
  };

  fetch(generalPath + "users/login", fetchProperties)
    .then(function (response) {
      console.log(response.status);
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.status + ": " + response.statusText);
      }
    })
    .then(function (json) {
      console.log(json);
      onSuccess(json);
    })
    .catch(function (error) {
      console.log("error on login: " + error);
      onError(error);
    });
}

function loginOK(user) {
  console.log(user);

  console.log(user.username);
  var urlID = new URLSearchParams();
  urlID.append("username", user.username);

  inputUsername.value = "";
  inputPassword.value = "";
  document.querySelector(".containerSlides").style.display = "none";
  document.querySelector(".userInfoContainer").style.display = "block";
  document.querySelector(".dropdownUser").style.display = "flex";
  document.querySelector(".usernameUser").innerText = user.username;
  document.querySelector(".userProfileButton").style.display = "block";
  document.querySelector(".LogoutButton").style.display = "block";
  //location.replace("firstPageProfileUser.html");
  window.location.href = "index.html?" + urlID.toString();
}

function loginNOTOK(error) {
  console.log(error);
  inputUsername.value = "";
  inputPassword.value = "";
  document.querySelector(".errorLogin").style.display = "inline-block";
}
