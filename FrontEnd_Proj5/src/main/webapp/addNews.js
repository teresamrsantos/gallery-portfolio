/**
 * @author Teresa Marta Ribeiro Santos  - uc2021151797
 *
 * File with the script for the add Project page
 */

import {
  errorGeneral,
  getUserTokenAPI,
  getOurTeamAPI,
  getMembersProjects,
  disassociateNewsToProjectAPI,
  addNewsToProjectAPI,
  addCoauthorAPINews,
  removeCoauthorAPINews
} from "./generalScript.js";


/* CONST ROOT PATH REST API */
const generalPath = "http://localhost:8080/DataServer_Proj5/rest/";
/*Pagina Principal */
var addNewsHTML = document.querySelector(".addNewsHTML");
/***************************** inputs ***********************/
var titleInput = document.querySelector(".titleNewNews");
var descriptionInput = document.querySelector(".descriptionNewNews");
var userNameInput = document.querySelector(".authorNewNews");
var imageInput = document.querySelector(".imgNewNews");
var keywordsNews = document.querySelector(".keywordsNews");
var visibilitySelect = document.getElementById("visibilitySelect");
/************************************************************/
/* BOTAO DE EDITAR */
var addBtn = document.querySelector(".btn-addNews");
var token;
var username;
/* Verifica se esta de facto no index e chama a funcao inicial */
if (addNewsHTML) {
  addNewsHTML.onload = bodyOnLoadaddNews();
}

function bodyOnLoadaddNews() {
  let urlSearch = new URLSearchParams(window.location.search);
  username = urlSearch.get("username");
  console.log(username);
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
  document.querySelector(".errorMandatoryField-AddNews").style.display="none"
  evt.preventDefault();
  let titleField = titleInput.value;
  let descriptionField = descriptionInput.value;
  let keywordsField = keywordsNews.value;
  let coverImageField = imageInput.value;
  let visibility = visibilitySelect.value;
  console.log(visibility);
  var myJSON;
  if (
    titleField.trim() != "" &&
    descriptionField.trim() != "" &&
    keywordsField.trim() != "" &&
    coverImageField.trim() != ""
  ) {

    keywordsField =keywordsField.trim();
    keywordsField = keywordsField.replaceAll('#','');
    keywordsField = keywordsField.replaceAll(/\s+/g, ";");


    myJSON = JSON.stringify({
      title: titleField,
      description: descriptionField,
      keywordsNews: keywordsField,
      coverImage: coverImageField,
      visibility: visibility,
    });
    console.log(myJSON);
    addNewsAPI(myJSON, token, addNewsOK, errorGeneral);
  }else{
    document.querySelector(".errorMandatoryField-AddNews").style.display="inline"
  }
});

/*********************************************************/
/* SE COONSEGUIR ADICIONAR NOTUCUA -
   ESTA FUNCAO MODIFICA O ECRA +PPARA ADICIONAR CO AUTORES */
/*********************************************************/
let newsID;
function addNewsOK(publication) {
  newsID = JSON.parse(publication).idNews;

  console.log(newsID, "idNews");
  console.log("PUBLICATION OK", publication);
  titleInput.value = "";
  descriptionInput.value = "";
  keywordsNews.value = "";
  imageInput.value = "";
  visibilitySelect.value = "";
  document.querySelector(".container-news").style.display = "none";
  document.querySelector(".addCoauthorsContainer-addNews").style.display = "inline";
  getOurTeamAPI(listUsernames, errorGeneral);
}

/*********************************************************/
/** ESTA FUNCAO TRAZ O NOME DOS USERS PARA A FRONT END */
/*********************************************************/
function listUsernames(ourteam) {
  
  console.log(ourteam);
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
    ulListUsername.append(DIVUser);}
  });
}

/***********************************************/
/******** MENSAGENS DE ERRO ***********/
/*********************************************/

function seeError(error) {

  document.querySelector(".errorAddNews").display = "block";
}

/***********************************************/
/********  botao adicionar coautores***********/
/*********************************************/
function addCoauthors(evt) {
  document.querySelector(".errorAddNews").display = "none";
  evt.preventDefault();
  var userToAddUsername = evt.target.parentElement.firstChild.innerHTML;
  addCoauthorAPINews(userToAddUsername, newsID, token, addCoauthorOK, seeError);
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
  document.querySelector(".errorAddNews").display = "none";
  evt.preventDefault();
  var userToRemoveUsername = evt.target.parentElement.firstChild.id;

  removeCoauthorAPINews(
    userToRemoveUsername,
    newsID,
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

function listProjects(listProject) {
  var ulListAllNews = document.querySelector(".visibleProjects-UL-addProject");
  listProject.forEach((news) => {
    let DIVProject = document.createElement("div");
    DIVProject.classList.add("DIVProject");
    let liProject = document.createElement("li");
    liProject.classList.add("liProject");

    liProject.innerText = news.title;
    let associateProjectBTN = document.createElement("button");
    associateProjectBTN.innerHTML = '<i class="fa fa-plus-square"></i>';
    associateProjectBTN.classList.add("associateProjectBTN");
    liProject.id = news.idPublication;
    associateProjectBTN?.addEventListener("click", associateProject);
    DIVProject.append(liProject);
    DIVProject.append(associateProjectBTN);

    ulListAllNews.append(DIVProject);
  });
}

/***********************************************/
/********  botao adicionar NOTICIAS ***********/
/*********************************************/
function associateProject(evt) {
  evt.preventDefault();
  document.querySelector(".errorAddNews").display = "none";
  var pubID = evt.target.parentElement.firstChild.id;
  addNewsToProjectAPI(newsID, pubID, token, associateProjectOK, seeError);
}

function associateProjectOK(JsonNewsandPubAlltered) {
  let liToAlter = document.getElementById(
    JSON.parse(JsonNewsandPubAlltered).idPub
  );
  let divToAlter = liToAlter.parentElement;
  let disassociateProjectBTN = document.createElement("button");

  divToAlter.removeChild(divToAlter.children[1]);
  disassociateProjectBTN.innerHTML = '<i class="fa fa-minus-square"></i>';
  divToAlter.appendChild(disassociateProjectBTN);
  disassociateProjectBTN.classList.add("disassociateProjectBTN");
  divToAlter.classList.add("projectAdded");

  disassociateProjectBTN?.addEventListener("click", removeProject);
}

/***********************************************/
/********  botao remover Noticias ***********/
/*********************************************/

function removeProject(evt) {
  evt.preventDefault();
  document.querySelector(".errorAddNews").display = "none";
  var pubID = evt.target.parentElement.firstChild.id;

  disassociateNewsToProjectAPI(newsID, pubID, token, removeProjectOK, seeError);
}

function removeProjectOK(JsonNewsandPubAlltered) {
  let liToAlter = document.getElementById(
    JSON.parse(JsonNewsandPubAlltered).idPub
  );
  let divToAlter = liToAlter.parentElement;
  let addProjectBTN = document.createElement("button");

  divToAlter.removeChild(divToAlter.children[1]);
  addProjectBTN.innerHTML = '<i class="fa fa-plus-square"></i>';
  divToAlter.appendChild(addProjectBTN);
  addProjectBTN.classList.add("associateNewsBTN");
  divToAlter.classList.remove("projectAdded");

  addProjectBTN?.addEventListener("click", associateProject);
}

/***********************TERMINAR ADICAO DE PROJETO**************/
var buttonFinish = document.querySelector(".finishAddNews");
buttonFinish.addEventListener("click", (evt) => {
  evt.preventDefault();
  document.querySelector(".successAddingNews").style.display = "block";

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
var arrowNextToassociateNew = document.querySelector(
  ".nextToAssociateProjects"
);
arrowNextToassociateNew?.addEventListener("click", () => {
  document.querySelector(".errorAddNews").display = "none";
  document
    .querySelector(".addCoauthorsContainer-addNews")
    .style.display = "none"
  document.querySelector(".nextToAssociateProjects").style.display = "none";
  document.querySelector(".addNewsToProjectContainer-addNews").style.display = "block";
  if(count===0){
  getMembersProjects(token, listProjects, seeError);
  count=count+1;}
});

/***********retroceder para adicionar USERS ***************/
var buttonGetBack = document.querySelector(".backToAddUsers-addNews");

buttonGetBack?.addEventListener("click", () => {
  document
    .querySelector(".addCoauthorsContainer-addNews")
    .style.display="block";
  document.querySelector(".nextToAssociateProjects").style.display = "block";
  document.querySelector(".addNewsToProjectContainer-addNews").style.display = "none";
});

/***********************************************/
/********  ADICIONAR NOTICIAS A PROJETO API******/
/*********************************************/

/*function addNewsToProjectAPI(idNews, idPub, token, onSuccess, onError) {
  var fetchProperties = {
    method: "POST",
    headers: { token, "Content-Type": "application/json" },
  };

  fetch(
    generalPath + "publications/associateNews/" + idPub + "?idNews=" + idNews,
    fetchProperties
  )
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

/***********************************************/
/********  DESASSOCIAR NOTICIAS A PROJETO API */
/*********************************************/

/*function disassociateNewsToProjectAPI(
  idNews,
  idPub,
  token,
  onSuccess,
  onError
) {
  var fetchProperties = {
    method: "POST",
    headers: { token, "Content-Type": "application/json" },
  };

  fetch(
    generalPath +
      "publications/disassociateNews/" +
      idPub +
      "?idNews=" +
      idNews,
    fetchProperties
  )
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


/***********************************************/
/********  ADICIONAR NOTICIA API **************/
/*********************************************/

function addNewsAPI(myJSON, token, onSuccess, onError) {
  var fetchProperties = {
    method: "POST",
    headers: { token, "Content-Type": "application/json" },
    body: myJSON,
  };

  fetch(generalPath + "news/newNews", fetchProperties)
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
