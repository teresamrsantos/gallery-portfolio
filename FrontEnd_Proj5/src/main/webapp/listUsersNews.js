/**
 * @author Teresa Marta Ribeiro Santos  - uc2021151797
 *
 * File with the script for  listing public projects
 */

import {
  errorGeneral,
  getUserTokenAPI,
  refreshDinamicElementsLanguage,
  deleteNewsAPI,
} from "./generalScript.js";

/* CONST ROOT PATH REST API */
const generalPath = "http://localhost:8080/DataServer_Proj5/rest/";
/*Pagina Projetos publicos */
var listUserNewsHTML = document.querySelector(".listUserNewsHTML");
/* UL where the news will be added */
var listNewsContainer = document.querySelector(".listNewsContainer");
/* UL where the ASSOCIATED news will be added */
var listNewsAssociatedContainer = document.querySelector(
  ".listNewsAssociatedContainer"
);

var token;
var username;

/* Verifica se esta de facto  corpo dos projetos publicos e chama a funcao inicial */
if (listUserNewsHTML) {
  listUserNewsHTML.onload = bodyOnLoadlistUserNews();
}

// Funcao ao carregar corpo dos projetos publicos
async function bodyOnLoadlistUserNews() {
  let urlSearch = new URLSearchParams(window.location.search);
  const username = urlSearch.get("username");
  console.log(username);
  if (username !== null) {
    getUserTokenAPI(username, saveToken, errorGeneral);
  }
}

function saveToken(user) {
  console.log("YO", user);
  token = user.token;
  username = user.username;
  getusersNewsListApi(token, username, listNews, errorGeneral);
  getusersAssociatedNewsListApi(
    token,
    username,
    listNewsAssociated,
    errorGeneral
  );
}

/*Controlo de Idioma*/
var lingo = null;
document
  .querySelector(".dropdown-content")
  .addEventListener("click", function (evt) {
    if (evt.target.tagName === "BUTTON") {
      console.log("here with: ", lingo);
      lingo = evt.target.value;
    }
  });

/********************************************** */
/****************** LISTAR NOTICIAS QUE CRIEI** */
/********************************************** */
function listNews(newsElement) {
  console.log("Estou dentro do metodo");
  if (newsElement !== null && newsElement.length > 0) {
    newsElement.forEach((newsElement) => {
      bringNewsToFrontEnd(newsElement);
    });
  } else {
    document.querySelector(".noNews-listUserNews").style.display = "inline";
  }

  console.log(newsElement);
}

/* Loads each news to the front end */
function bringNewsToFrontEnd(newsPiece) {
  console.log(newsPiece);
  document.querySelector(".noNews-listUserNews").style.display = "none";

  let divNews = document.createElement("div");
  let title = document.createElement("h3");
  let coverImg = document.createElement("img");
  let buttonNewsEdit = document.createElement("button");
  let buttonDeleteNews = document.createElement("button");
  divNews.classList.add("divEachNewsIndex");
  coverImg.src = newsPiece.coverImage;
  divNews.id = newsPiece.idNews;
  title.innerText = newsPiece.title;

  coverImg.classList.add("coverImgNewsIndex");
  title.classList.add("titleNewsIndex");
  if (newsPiece.deleted === false) {
    buttonDeleteNews.innerHTML = '<i class="fa fa-trash"></i>';
  } else if (newsPiece.deleted === true) {
    buttonDeleteNews.innerHTML = '<i class="fa fa-trash-restore"></i>';
    divNews.classList.add("deleteNews");
  }
  buttonDeleteNews.classList.add("trash-btn-listuserNews");
  buttonDeleteNews?.addEventListener("click", deleteNews);
  buttonNewsEdit.classList.add("buttonNewsEdit");

  buttonNewsEdit.innerText = "Edit news";
  buttonNewsEdit.setAttribute("data-i18n", "editNewsBTN");
  buttonNewsEdit?.addEventListener("click", editNews);

  divNews.appendChild(coverImg);
  divNews.appendChild(title);
  divNews.appendChild(buttonNewsEdit);
  divNews.appendChild(buttonDeleteNews);

  listNewsContainer.appendChild(divNews);
  // }
  if (lingo !== null) {
    console.log(lingo);
    refreshDinamicElementsLanguage(lingo);
  } else {
    let urlSearch = new URLSearchParams(window.location.search);
    const lingoURL = urlSearch.get("lingo");
    if (lingoURL !== null) {
      refreshDinamicElementsLanguage(lingoURL);
    }
  }
}

function editNews(evt) {
  var newsId = evt.target.parentElement.id;
  let urlSearch = new URLSearchParams(window.location.search);
  const username = urlSearch.get("username");
  var urlID = new URLSearchParams();
  const lingoURL = urlSearch.get("lingo");

  if (lingo !== null) {
    urlID.append("lingo", lingo);
    console.log(lingo, " seeNewsDetails lingo");
  } else if (lingoURL !== null) {
    console.log(lingoURL, " seeNewsDetails lingoURL");
    urlID.append("lingo", lingoURL);
  }

  if (username !== null) {
    urlID.append("username", username);
  }
  urlID.append("newsToEditID", newsId);
  window.location.href = "editNews.html?" + urlID.toString();
}

function deleteNews(evt) {
  var idNews = evt.target.parentElement.id;

  console.log(idNews, "idNeeeeeeeeew");
  deleteNewsAPI(idNews, token, deleteOK, seeError);
}

function deleteOK(deletedNews) {
  var deletedNews = JSON.parse(deletedNews);
  console.log(deletedNews);
  var divNews = document.getElementById(deletedNews.idNews);

  console.log(deletedNews.deleted, "deleteNews");
  if (deletedNews.deleted == true) {
    console.log(true);
    divNews.classList.add("deleteNews");
    divNews.children[3].innerHTML = '<i class="fa fa-trash-restore"></i>';
  } else if (deletedNews.deleted == false) {
    divNews.classList.remove("deleteNews");
    console.log(false);
    divNews.children[3].innerHTML = '<i class="fa fa-trash"></i>';
  }
}

/********************************************** */
/****************** LISTAR NOTICIAS QUE SOU MEMBRO ** */
/********************************************** */

function listNewsAssociated(newsList) {
  console.log(newsList);
  if (newsList !== null && newsList.length > 0) {
    newsList.forEach((newsElement) => {
      bringAssociatedNewsToFrontEnd(newsElement);
    });
  } else {
    document.querySelector(".noNews-listUserNewsMembers").style.display =
      "inline";
  }
}

/* Loads each news to the front end */
function bringAssociatedNewsToFrontEnd(newsPiece) {
  console.log(newsPiece);
  document.querySelector(".noNews-listUserNewsMembers").style.display = "none";
  if (newsPiece.deleted === false) {
    let divNews = document.createElement("div");
    let title = document.createElement("h3");
    let coverImg = document.createElement("img");
    let buttonDisassociateNews = document.createElement("button");
    divNews.classList.add("divEachNewsIndex");
    coverImg.src = newsPiece.coverImage;
    divNews.id = newsPiece.idNews;
    title.innerText = newsPiece.title;

    coverImg.classList.add("coverImgNewsIndex");
    title.classList.add("titleNewsIndex");
    buttonDisassociateNews.innerHTML = "Disassociate";
    buttonDisassociateNews.setAttribute("data-i18n", "disassociateNewsBtn");
    buttonDisassociateNews.classList.add("disassociateNewsBtn");
    buttonDisassociateNews?.addEventListener("click", disassociateNews);

    divNews.appendChild(coverImg);
    divNews.appendChild(title);

    divNews.appendChild(buttonDisassociateNews);

    listNewsAssociatedContainer.appendChild(divNews);
    // }
  }
}

var idNews;
function disassociateNews(evt) {
  idNews = evt.target.parentElement.id;
  let urlSearch = new URLSearchParams(window.location.search);
  console.log(idNews, "idNeeeeeeeeew");
  disassociateUserFromNewsAPI(
    token,
    username,
    idNews,
    disassociateApi,
    seeError
  );
  /*"Está a escolher desassociar se deste conteúdo, esta ação não é possivel de ser desfeita. Se, no futuro quiser voltar a associar-se terá que entrar em contacto com o criador do conteudo. Pretende desassociar-se ?"
const lingoURL = urlSearch.get("lingo");
console.log(lingo)

if( lingo === "pt"){
 var textForNews = "Está a escolher desassociar se deste conteúdo, esta ação não é possivel ser desfeita. Se, no futuro quiser voltar a associar-se terá que entrar em contacto com o criador do conteudo. Pretende desassociar-se ?"
} 
var textForNews = "You are choosing to disassociate yourself from this content, this action cannot be undone. If, in the future, you want to re-associate yourself, you will have to contact the creator of the content. Do you want to disassociate ?"



  if (confirm(textForNews)) {
    disassociateApi(idNews);
  } else {
    console.log(textForNews)
  }*/
}

function disassociateApi(username) {
  console.log("here");

  var elem = document.getElementById(idNews);
  elem.parentNode.removeChild(elem);
}

function removeLi() {}
/***********************************************/
/******** MENSAGENS DE ERRO ***********/
/*********************************************/

function seeError(error) {
  document.querySelector(".errorAddingProject").display = "block";
}

/***********************************************/
/******** DESASSOCIAR-SE ***********/
/*********************************************/

async function disassociateUserFromNewsAPI(
  token,
  username,
  idNews,
  onSuccess,
  onError
) {
  const urlgetMembersNews =
    generalPath +
    "news/removeMembersNews/" +
    idNews +
    "?listUsernames=" +
    username;
  var fetchProperties = {
    method: "POST",
    headers: { token, "Content-Type": "application/json" },
  };

  return await fetch(urlgetMembersNews, fetchProperties)
    .then(function (response) {
      if (response.ok) {
        return response.text();
      } else {
        throw Error;
      }
    })
    .then(function (json) {
      console.log("REST API NOTICIA:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return onError(error);
    });
}

/******************************************************/
/***************** GET ASSOCIATED NEWS FROM USER *************/
/**************************************************/

async function getusersAssociatedNewsListApi(
  token,
  username,
  onSuccess,
  onError
) {
  const urlgetMembersNews = generalPath + "news/userCoauthorNews/" + username;
  var fetchProperties = {
    method: "GET",
    headers: { token, "Content-Type": "application/json" },
  };

  return await fetch(urlgetMembersNews, fetchProperties)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw Error;
      }
    })
    .then(function (json) {
      console.log("REST API NOTICIA:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return onError(error);
    });
}

/******************************************************/
/***************** GET THE NEWS FROM USER *************/
/**************************************************/
/* REST API - GET THE PUBLIC AND MEMBERS ONLY NEWS FOR THE MAIN PAGE */
async function getusersNewsListApi(token, username, onSuccess, onError) {
  const urlgetMembersNews = generalPath + "news/userOwnNews/" + username;
  var fetchProperties = {
    method: "GET",
    headers: { token, "Content-Type": "application/json" },
  };

  return await fetch(urlgetMembersNews, fetchProperties)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw Error;
      }
    })
    .then(function (json) {
      console.log("REST API NOTICIA:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return onError(error);
    });
}
