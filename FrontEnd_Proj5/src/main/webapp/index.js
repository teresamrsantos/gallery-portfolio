/**
 * @author Teresa Marta Ribeiro Santos  - uc2021151797
 *
 * File with the script for the index page
 */

import { errorGeneral } from "./generalScript.js";
import {
  getUserTokenAPI,
  refreshDinamicElementsLanguage,
  getMembersNews,
  deleteNewsAPI,
} from "./generalScript.js";

/* CONST ROOT PATH REST API */
const generalPath = "http://localhost:8080/DataServer_Proj5/rest/";
/*Pagina Principal */
var indexHTML = document.querySelector(".indexHTML");
/* DIV Element For News */
var divAllNews = document.querySelector(".indexNews");
/* Button to appear the log in Form */
var buttonForLoginForm = document.querySelector(".loginButtonIndex");
/* Button to appear the register Form */
var buttonForRegisterForm = document.querySelector(".registerButtonIndex");
/* Button to appear the Register Form */
var buttonForRegisterForm = document.querySelector(".registerButtonIndex");
/* Button make RegisterForm/LoginFormDisappear */
var buttonCloseForm = document.querySelector(".closeButtonLoginForm");
/* Button make RegisterForm/LoginFormDisappear */
var buttonCloseFormRegister = document.querySelector(
  ".closeButtonregisterForm"
);

/* Verifica se esta de facto no index e chama a funcao inicial */
if (indexHTML) {
  indexHTML.onload = bodyOnLoadIndex();
}

// Funcao ao carregar corpo do index
async function bodyOnLoadIndex() {
  /* USERNAME USER */
  let urlSearch = new URLSearchParams(window.location.search);
  const username = urlSearch.get("username");
  console.log(username);

  if (username !== null) {
    getUserTokenAPI(username, saveToken, errorGeneral);
    //if (sessionStorage.getItem("loggedOnUser") === null) {
  } else {
    getPublicNews(listNews);

    // } else if (sessionStorage.getItem("loggedOnUser") !== null) {
  }
}

/***************************************************************/
/* Esta funcao gere a informacao do user recebida pelo backend */
/***************************************************************/
var userType;
var token;
function saveToken(user) {
  console.log("YO", user);
  getMembersNews(user.token, listNews, errorGeneral);
  userType = user.userType;
  token = user.token;
  console.log(userType);
  if (userType == "admin") {
    //  gett;

    getInvisibleNews(token, listNews, errorGeneral);
    getdeletedNews(token, listNews, errorGeneral);
    console.log("heiiiiiiiii");
  }
}

/* Funcao que abre o formulario de registo */
buttonForRegisterForm?.addEventListener("click", function (evt) {
  buttonForLoginForm.style.display = "none";
  buttonForRegisterForm.style.display = "none";
  document.querySelector(".successRegister").style.display = "none";
  document.querySelector(".registerFormDiv").style.display = "block";
});

/* Funcao que fecha o formulario de registo*/
buttonCloseFormRegister?.addEventListener("click", function (evt) {
  document.querySelector(".registerFormDiv").style.display = "none";

  buttonForLoginForm.style.display = "block";
  buttonForRegisterForm.style.display = "block";
});

/* Funcao que abre o formulario de Login*/
buttonForLoginForm?.addEventListener("click", function (evt) {
  buttonForLoginForm.style.display = "none";
  buttonForRegisterForm.style.display = "none";

  document.querySelector(".loginFormDiv").style.display = "block";
});

/* Funcao que fecha o formulario de Login*/
buttonCloseForm?.addEventListener("click", function (evt) {
  document.querySelector(".loginFormDiv").style.display = "none";

  buttonForLoginForm.style.display = "block";
  buttonForRegisterForm.style.display = "block";
});

/* Lista as noticias publicas */
function listNews(newsElement) {
  console.log("Estou dentro do metodo");
  console.log(newsElement);
  if (newsElement!==null &&newsElement.length > 0 ) {
    newsElement.forEach((newsElement) => {
      bringNewsToFrontEnd(newsElement);
    });
  } else {
    document.querySelector(".noNews-index").style.display="inline";
  }
}

//

/* Loads each news to the front end */
function bringNewsToFrontEnd(newsPiece) {
  document.querySelector(".noNews-index").style.display="none";
  console.log(newsPiece);
  console.log(userType);

  let divNews = document.createElement("div");
  let title = document.createElement("h3");
  let creationDate = document.createElement("span");
  let author = document.createElement("h6");
  let coverImg = document.createElement("img");
  let buttonNewsDetails = document.createElement("button");
  coverImg.src = newsPiece.coverImage;
  divNews.id = newsPiece.idNews;
  title.innerText = newsPiece.title;
  author.innerText = newsPiece.userOwnerusername;

  var creationDateArray = newsPiece.creationDate.split("T");
  var date = new Date(creationDateArray[0]);
  date.setHours(creationDateArray[1].split(":")[0]);
  date.setMinutes(creationDateArray[1].split(":")[1]);
  date.setSeconds(creationDateArray[1].split(":")[2].split(".")[0]);
  creationDate.setAttribute("data-i18n-date", date);

  console.log(date);

  let urlSearch = new URLSearchParams(window.location.search);
  var lang = urlSearch.get("lingo");
  if (lang == null) {
    lang = "en";
  }
  creationDate.innerText = date.toLocaleString(lang);

  coverImg.classList.add("coverImgNewsIndex");
  title.classList.add("titleNewsIndex");
  creationDate.classList.add("creationDateIndex");
  buttonNewsDetails.classList.add("buttonNewsDetailsIndex");
  divNews.classList.add("divEachNewsIndex");
  buttonNewsDetails.innerText = "See details";
  buttonNewsDetails.setAttribute("data-i18n", "detailsBTN");
  buttonNewsDetails?.addEventListener("click", seeNewsDetails);

  divNews.appendChild(coverImg);
  divNews.appendChild(title);
  divNews.appendChild(buttonNewsDetails);
  divNews.appendChild(author);
  divNews.appendChild(creationDate);

  /* GET ADMIN FUNCTIONALATIES FOR FRONT END */
  if (userType === "admin") {
    let buttonDeleteNews = document.createElement("button");
    let buttonEditNews = document.createElement("button");
    let invisibleNews = document.createElement("p");
    invisibleNews.style.display = "none";
    if (newsPiece.deleted === false) {
      buttonDeleteNews.innerHTML = '<i class="fa fa-trash"></i>';
    } else if (newsPiece.deleted === true) {
      buttonDeleteNews.innerHTML = '<i class="fa fa-trash-restore"></i>';
      divNews.classList.add("deleteNews");
    }
    if (newsPiece.visibility == "invisible") {
      divNews.classList.add("invisibleNews");
      invisibleNews.innerHTML =
        "This news is not visible for any member if not the owner or an admin.";
        invisibleNews.style.display="block";
         invisibleNews.setAttribute("data-i18n", "invisibleNews");
      invisibleNews.style.display = "inline";
    }

    buttonEditNews.classList.add("buttonEditNews");

    buttonEditNews.innerText = "Edit news";
    buttonEditNews.setAttribute("data-i18n", "editNewsBTN");

    buttonDeleteNews.classList.add("trash-btn-deleteNews");
    buttonDeleteNews?.addEventListener("click", deleteNews);
    buttonEditNews?.addEventListener("click", editNews);

    divNews.appendChild(buttonDeleteNews);
    divNews.appendChild(buttonEditNews);
    divNews.appendChild(invisibleNews);
  }
  divAllNews.appendChild(divNews);
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

/*********************************************************/
/******************Controlo De Idioma********************/
/*********************************************************/
var lingo = null;
document
  .querySelector(".dropdown-content")
  .addEventListener("click", function (evt) {
    if (evt.target.tagName === "BUTTON") {
      console.log("here with: ", lingo);
      lingo = evt.target.value;
    }
  });

/** FUNCAO DELETE NEWS FOR ADMIN */
function deleteNews(evt) {
  var idNews = evt.target.parentElement.id;
  console.log(idNews, "idNeeeeeeeeew");
  deleteNewsAPI(idNews, token, deleteOK, errorGeneral);
}

function deleteOK(deletedNews) {
  var deletedNews = JSON.parse(deletedNews);
  console.log(deletedNews);
  var divNews = document.getElementById(deletedNews.idNews);

  console.log(deletedNews.deleted, "deleteNews");
  if (deletedNews.deleted == true) {
    console.log(true);
    divNews.classList.add("deleteNews");
    divNews.children[5].innerHTML = '<i class="fa fa-trash-restore"></i>';
  } else if (deletedNews.deleted == false) {
    divNews.classList.remove("deleteNews");
    console.log(false);
    divNews.children[5].innerHTML = '<i class="fa fa-trash"></i>';
  }
}

/********************************************************************/
/*****************Function for searching for a keyword *************/
/********************************************************************/
var searchInput = document.querySelector(".search-data");
var searchButton = document.querySelector(".btn-search");

searchButton?.addEventListener("click", (evt) => {
  evt.preventDefault();
  /* USERNAME USER */
  let urlSearch = new URLSearchParams(window.location.search);
  const username = urlSearch.get("username");
  var keywordInput = searchInput.value;

  if (username !== null) {
    getPrivateNewsByKeywords(token, keywordInput, filterNews);
  } else {
    getPublicNewsByKeywords(keywordInput, filterNews);
  }
});

function filterNews(newsList) {
  var container = document.querySelector(".indexNews");
  container.innerHTML = "";
  listNews(newsList);
  searchInput.value = "";
}

/********************************************************************/

/* Function to redirect to the details page of the selcted news */
function seeNewsDetails(evt) {
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
  urlID.append("detailsNewsID", newsId);
  window.location.href = "detailsNews.html?" + urlID.toString();
}

/* GET PUBLIC NEWS BY KEYWORDS */
export async function getPublicNewsByKeywords(keywordString, onSuccess) {
  const urlgetPublicNews =
    generalPath + "news/searchNews?keyword=" + keywordString;
  var fetchProperties = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  return await fetch(urlgetPublicNews, fetchProperties)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw Error;
      }
    })
    .then(function (json) {
      console.log("REST API NOTICIAS PUBLICAS:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return null;
    });
}

/* GET NEWS BY KEYWORDS */
export async function getPrivateNewsByKeywords(token, keywordString, onSuccess) {
  const urlgetPublicNews =
    generalPath + "news/loggedInSearchNews?keyword=" + keywordString;
  var fetchProperties = {
    method: "GET",
    headers: { token, "Content-Type": "application/json" },
  };

  return await fetch(urlgetPublicNews, fetchProperties)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw Error;
      }
    })
    .then(function (json) {
      console.log("REST API NOTICIAS PUBLICAS:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return null;
    });
}

/* REST API - GET THE PUBLIC NEWS FOR THE MAIN PAGE */
 async function getPublicNews(onSuccess) {
  const urlgetPublicNews = generalPath + "news/publicNews";
  var fetchProperties = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  return await fetch(urlgetPublicNews, fetchProperties)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw Error;
      }
    })
    .then(function (json) {
      console.log("REST API NOTICIAS PUBLICAS:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return null;
    });
}

/* GET INVISIBLE NEWS */

async function getInvisibleNews(token, onSuccess, onError) {
  const urlgetPublicNews = generalPath + "news/invisibleNews";
  var fetchProperties = {
    method: "GET",
    headers: { token, "Content-Type": "application/json" },
  };

  return await fetch(urlgetPublicNews, fetchProperties)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw Error;
      }
    })
    .then(function (json) {
      console.log("REST API NOTICIAS PUBLICAS:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return null;
    });
}

/* GET DELETED NEWS */

async function getdeletedNews(token, onSuccess, onError) {
  console.log("ON getdeletedNews");
  const urlgetPublicNews = generalPath + "news/deletedNews";
  var fetchProperties = {
    method: "GET",
    headers: { token, "Content-Type": "application/json" },
  };

  return await fetch(urlgetPublicNews, fetchProperties)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        throw Error;
      }
    })
    .then(function (json) {
      console.log("REST API NOTICIAS PUBLICAS:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return null;
    });
}
