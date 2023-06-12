/**
 * @author Teresa Marta Ribeiro Santos  - uc2021151797
 *
 * File with the script for the add Project page
 */

import {
  errorGeneral,
  getUserTokenAPI,
  getMembersNews,
  disassociateNewsToProjectAPI,
  addNewsToProjectAPI,
  addCoauthorAPIProject,
  removeCoauthorAPIProject,
} from "./generalScript.js";
import { getOurTeamAPI } from "./generalScript.js";

/* CONST ROOT PATH REST API */
const generalPath = "http://localhost:8080/DataServer_Proj5/rest/";
/*Pagina Principal */
var addProjectHTML = document.querySelector(".addProjectHTML");
/***************************** inputs ***********************/
var titleInput = document.querySelector(".titleNewProject");
var descriptionInput = document.querySelector(".descriptionNewProject");
var userNameInput = document.querySelector(".authorNewProject");
var imageInput = document.querySelector(".imgNewProject");
var keywordsProject = document.querySelector(".keywordsProject");
var visibilitySelect = document.getElementById("visibilitySelect");
/************************************************************/
/* BOTAO DE EDITAR */
var addBtn = document.querySelector(".btn-addProject");
var token;
var username;
/* Verifica se esta de facto no index e chama a funcao inicial */
if (addProjectHTML) {
  addProjectHTML.onload = bodyOnLoadaddProject();
}

function bodyOnLoadaddProject() {
  let urlSearch = new URLSearchParams(window.location.search);
  username = urlSearch.get("username");

  userNameInput.value = username;

  if (username !== null) {
    getUserTokenAPI(username, saveToken, errorGeneral);
  } else {
    errorGeneral;
  }
}

function saveToken(user) {
  console.log("User", user);
  token = user.token;
  console.log("token", token);
  console.log("username", username);
}

addBtn?.addEventListener("click", (evt) => {
  document.querySelector(".errorMandatoryField-AddProject").style.display =
    "none";
  evt.preventDefault();
  let titleField = titleInput.value;
  let descriptionField = descriptionInput.value;
  let keywordsField = keywordsProject.value;
  let coverImageField = imageInput.value;
  let visibility = visibilitySelect.value;

  var myJSON;
  if (
    titleField.trim() != "" &&
    descriptionField.trim() != "" &&
    keywordsField.trim() != "" &&
    coverImageField.trim() != ""
  ) {
    keywordsField = keywordsField.trim();
    keywordsField = keywordsField.replaceAll("#", "");
    keywordsField = keywordsField.replaceAll(/\s+/g, ";");

    myJSON = JSON.stringify({
      title: titleField,
      description: descriptionField,
      keywordsPublication: keywordsField,
      coverImage: coverImageField,
      visibility: visibility,
    });
    console.log(myJSON);
    addProjectAPI(myJSON, token, addProjectOK, errorGeneral);
  } else {
    document.querySelector(".errorMandatoryField-AddProject").style.display =
      "inline";
  }
});

/*********************************************************/
/* SE COONSEGUIR ADICIONAR PROJETO -
 ESTA FUNCAO MODIFICA O ECRA +PPARA ADICIONAR CO AUTORES */
/*********************************************************/
let pubID;
function addProjectOK(publication) {
  pubID = JSON.parse(publication).idPublication;
  titleInput.value = "";
  descriptionInput.value = "";
  keywordsProject.value = "";
  imageInput.value = "";
  visibilitySelect.value = "";
  document.querySelector(".container-project").style.display = "none";
  document.querySelector(".addCoauthorsContainer").style.display = "inline";
  getOurTeamAPI(listUsernames, errorGeneral);
}

/*********************************************************/
/** ESTA FUNCAO TRAZ O NOME DOS USERS PARA A FRONT END */
/*********************************************************/
function listUsernames(ourteam) {
  var ulListUsername = document.querySelector(".coauthorsList-UL");

  ourteam.forEach((user) => {
    if (user.username !== username) {
      let DIVUser = document.createElement("div");
      DIVUser.classList.add("DIVUsername");
      let liUser = document.createElement("li");
      liUser.classList.add("liUsername");

      liUser.innerText = user.username;

      let addCoauthorBTN = document.createElement("button");
      addCoauthorBTN.innerHTML = '<i class="fa fa-plus-square"></i>';
      addCoauthorBTN.classList.add("addCoauthorBtn");
      liUser.id = user.username;
      addCoauthorBTN?.addEventListener("click", addCoauthors);
      DIVUser.append(liUser);
      DIVUser.append(addCoauthorBTN);
      ulListUsername.append(DIVUser);
    }
  });
}

/***********************************************/
/******** MENSAGENS DE ERRO ***********/
/*********************************************/

function seeError(error) {
  document.querySelector(".errorAddingProject").display = "block";
}

/***********************************************/
/********  botao adicionar coautores***********/
/*********************************************/
function addCoauthors(evt) {
  document.querySelector(".errorAddingProject").display = "none";
  evt.preventDefault();
  var userToAddUsername = evt.target.parentElement.firstChild.innerHTML;
  addCoauthorAPIProject(
    userToAddUsername,
    pubID,
    token,
    addCoauthorOK,
    seeError
  );
}

function addCoauthorOK(username) {
  let liToAlter = document.getElementById(username);
  let divToAlter = liToAlter.parentElement;
  let removeCoauthorBTN = document.createElement("button");

  divToAlter.removeChild(divToAlter.children[1]);
  removeCoauthorBTN.innerHTML = '<i class="fa fa-minus-square"></i>';
  divToAlter.appendChild(removeCoauthorBTN);
  removeCoauthorBTN.classList.add("removeCoauthorBTN");
  divToAlter.classList.add("userAdded");

  removeCoauthorBTN?.addEventListener("click", removeCoauthor);
}

/***********************************************/
/********  botao remover coautores***********/
/*********************************************/

function removeCoauthor(evt) {
  document.querySelector(".errorAddingProject").display = "none";
  evt.preventDefault();
  var userToRemoveUsername = evt.target.parentElement.firstChild.id;
  removeCoauthorAPIProject(
    userToRemoveUsername,
    pubID,
    token,
    removeCoauthorOK,
    seeError
  );
}

function removeCoauthorOK(username) {
  let liToAlter = document.getElementById(username);
  let divToAlter = liToAlter.parentElement;
  let addCoauthorBTN = document.createElement("button");

  divToAlter.removeChild(divToAlter.children[1]);
  addCoauthorBTN.innerHTML = '<i class="fa fa-plus-square"></i>';
  divToAlter.appendChild(addCoauthorBTN);
  addCoauthorBTN.classList.add("addCoauthorBtn");
  divToAlter.classList.remove("userAdded");

  addCoauthorBTN?.addEventListener("click", addCoauthors);
}

/***************************************************************************/
/****************************** Associate news to Project*******************/
/***************************************************************************/

function listNews(newsList) {
  var ulListAllNews = document.querySelector(".visibleProjects-UL");

  newsList.forEach((news) => {
    let DIVNews = document.createElement("div");
    DIVNews.classList.add("DIVNews");
    let liNews = document.createElement("li");
    liNews.classList.add("liNews");

    liNews.innerText = news.title;
    let associateNewsBTN = document.createElement("button");
    associateNewsBTN.innerHTML = '<i class="fa fa-plus-square"></i>';
    associateNewsBTN.classList.add("associateNewsBTN");
    liNews.id = news.idNews;
    associateNewsBTN?.addEventListener("click", associateNews);
    DIVNews.append(liNews);
    DIVNews.append(associateNewsBTN);
    ulListAllNews.append(DIVNews);
  });
}

/***********************************************/
/********  botao adicionar NOTICIAS ***********/
/*********************************************/
function associateNews(evt) {
  document.querySelector(".errorAddingProject").display = "none";
  evt.preventDefault();
  var newsID = evt.target.parentElement.firstChild.id;
  addNewsToProjectAPI(newsID, pubID, token, associateNewsOK, seeError);
}

function associateNewsOK(JsonNewsandPubAlltered) {
  let liToAlter = document.getElementById(
    JSON.parse(JsonNewsandPubAlltered).idNews
  );
  let divToAlter = liToAlter.parentElement;
  let disassociateNewsBTN = document.createElement("button");

  divToAlter.removeChild(divToAlter.children[1]);
  disassociateNewsBTN.innerHTML = '<i class="fa fa-minus-square"></i>';
  divToAlter.appendChild(disassociateNewsBTN);
  disassociateNewsBTN.classList.add("disassociateNewsBTN");
  divToAlter.classList.add("newsAdded");

  disassociateNewsBTN?.addEventListener("click", removeNews);
}

/***********************************************/
/********  botao remover Noticias ***********/
/*********************************************/

function removeNews(evt) {
  document.querySelector(".errorAddingProject").display = "none";
  evt.preventDefault();
  var newsID = evt.target.parentElement.firstChild.id;
  disassociateNewsToProjectAPI(newsID, pubID, token, removeNewsOK, seeError);
}

function removeNewsOK(JsonNewsandPubAlltered) {
  let liToAlter = document.getElementById(
    JSON.parse(JsonNewsandPubAlltered).idNews
  );
  let divToAlter = liToAlter.parentElement;
  let addNewsBTN = document.createElement("button");

  divToAlter.removeChild(divToAlter.children[1]);
  addNewsBTN.innerHTML = '<i class="fa fa-plus-square"></i>';
  divToAlter.appendChild(addNewsBTN);
  addNewsBTN.classList.add("associateNewsBTN");
  divToAlter.classList.remove("newsAdded");

  addNewsBTN?.addEventListener("click", associateNews);
}

/***********************TERMINAR ADICAO DE PROJETO**************/
var buttonFinish = document.querySelector(".finishAddProject");
buttonFinish.addEventListener("click", (evt) => {
  evt.preventDefault();
  document.querySelector(".sucessAddingProject").style.display = "block";

  let urlSearch = new URLSearchParams(window.location.search);
  const username = urlSearch.get("username");
  var urlID = new URLSearchParams();
  const lingoURL = urlSearch.get("lingo");

  if (lingo != null) {
    urlID.append("lingo", lingo);
  } else if (lingoURL != null) {
    urlID.append("lingo", lingoURL);
  }

  if (username !== null) {
    urlID.append("username", username);
  }

  setTimeout(
    () => (location.href = "index.html?" + urlID.toString()),

    1500
  );
});

/**** CONTROLO DE IDIOMA */
var lingo = null;
document
  .querySelector(".dropdown-content")
  .addEventListener("click", function (evt) {
    if (evt.target.tagName === "BUTTON") {
      lingo = evt.target.value;
    }
  });

/***********AVANCAR PARA ASSOCIAR/DESASSOCIAR NOTICIAS***************/
var count = 0;
var arrowNextToassociateNew = document.querySelector(".nextToAssociateNews");
arrowNextToassociateNew?.addEventListener("click", () => {
  document.querySelector(".errorAddingProject").display = "none";
  document.querySelector(".addCoauthorsContainer").style.display = "none";
  document.querySelector(".nextToAssociateNews").style.display = "none";
  document.querySelector(".addNewsToProjectContainer").style.display = "block";
  if (count === 0) {
    getMembersNews(token, listNews, seeError);
    count = count + 1;
  }
});

/***********retroceder para adicionar USERS ***************/
var buttonGetBack = document.querySelector(".backToAddUsers");

buttonGetBack?.addEventListener("click", () => {
  document.querySelector(".addCoauthorsContainer").style.display = "block";
  document.querySelector(".nextToAssociateNews").style.display = "block";
  document.querySelector(".addNewsToProjectContainer").style.display = "none";
});

/***********************************************/
/********  ADICIONAR PROJETO API **************/
/*********************************************/

function addProjectAPI(myJSON, token, onSuccess, onError) {
  var fetchProperties = {
    method: "POST",
    headers: { token, "Content-Type": "application/json" },
    body: myJSON,
  };

  fetch(generalPath + "publications/newPublication", fetchProperties)
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
