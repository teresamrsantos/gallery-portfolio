/**
 * @author Teresa Marta Ribeiro Santos  - uc2021151797
 *
 * File with the script for registerUser
 */
/* CONST ROOT PATH REST API */
const generalPath = "http://localhost:8080/DataServer_Proj5/rest/";
/* Button Register*/
var registerButton = document.querySelector(".btn-register");
/*Input first Name*/
var inputFirstName = document.querySelector(".firstNameRegister");
/*Input last Name*/
var inputLastName = document.querySelector(".lastNameRegister");
/*Input email*/
var inputEmail = document.querySelector(".emailRegister");
/*Input biography*/
var inputBiography = document.querySelector(".biographyRegister");
/*Input username*/
var inputUsername = document.querySelector(".usernameRegister");
/*Input password */
var inputPassword = document.querySelector(".passwordRegister");
/*Input pictureUrl */
var inputpictureUrl = document.querySelector(".pictureRegister");

registerButton?.addEventListener("click", function (evt) {
  evt.preventDefault();
  //  document.querySelector(".errorLogin").style.display="none";
  console.log("here");
  document.querySelector(".error-mandatory").style.display = "none";
  document.querySelector(".error-register").style.display = "none";
  var firstName = inputFirstName.value.trim();
  var lastName = inputLastName.value.trim();
  var userName = inputUsername.value.trim();
  var password = inputPassword.value.trim();
  var email = inputEmail.value.trim();
  var pictureUrl = inputpictureUrl.value.trim();
  var biography = inputBiography.value.trim();

  if (
    firstName === "" ||
    lastName === "" ||
    userName === "" ||
    password === "" ||
    email === ""
  ) {
    console.log("Olha aí mens");
    document.querySelector(".error-mandatory").style.display = "block";
  } else {
    var myJSON = JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      username: userName,
      password: password,
      email: email,
      pictureUrl: pictureUrl,
      biography: biography,
    });

    console.log(myJSON);
    registerAPI(myJSON, registerOK, registerKO);
  }
});

/***********************************************/
/***************** REGISTER API ******************/
/*********************************************/

function registerAPI(myJSON, onSuccess, onError) {
  var fetchProperties = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: myJSON,
  };

  fetch(generalPath + "users/register", fetchProperties)
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
      console.log("error on Register: " + error);
      onError(error);
    });
}

function registerOK(user) {
  console.log(user);

  inputFirstName.value = "";
  inputLastName.value = "";
  inputUsername.value = "";
  inputPassword.value = "";
  inputEmail.value = "";
  inputpictureUrl.value = "";
  inputBiography.value = "";

  document.querySelector(".successRegister").style.display = "inline-block";
}

function registerKO(error) {
  console.log(error);
  document.querySelector(".error-register").style.display = "block";
  inputFirstName.value = "";
  inputLastName.value = "";
  inputUsername.value = "";
  inputPassword.value = "";
  inputEmail.value = "";
  inputpictureUrl.value = "";
  inputBiography.value = "";

  /* inputUsername.value="";
    inputPassword.value="";
    document.querySelector(".errorLogin").style.display="inline-block";*/
}
