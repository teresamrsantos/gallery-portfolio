import { errorGeneral, getUserTokenAPI } from "./generalScript.js";
import { refreshDinamicElementsLanguage } from "./generalScript.js";
import { getPublicNewsByKeywords, getPrivateNewsByKeywords } from "./index.js";

/* CONST ROOT PATH REST API */
const generalPath = "http://localhost:8080/DataServer_Proj5/rest/";
/* ID do projeto que vamos consultar os detalhes */
let urlSearch = new URLSearchParams(window.location.search);
let keyword = urlSearch.get("keyword");
console.log(keyword, "keyword");

const username = urlSearch.get("username");
var token;
/*Pagina Detalhes */
var newsProjectKeywordsHTML = document.querySelector(
  ".newsProjectKeywordsHTML"
);
/*DIV onde as noticias vão ser Inseridos*/
var newsContainer = document.querySelector(".listNewsContainer");

/*DIV onde o projeto vai ser Inserido*/
var listProjectContainer = document.querySelector(".listProjectContainer");

/*Botao para retroceder para pagina de projetos*/
var backToAllNews = document.querySelector(".backToTheMainPage");

/* Verifica se esta de facto  corpo dos projetos publicos e chama a funcao inicial */
if (newsProjectKeywordsHTML) {
  newsProjectKeywordsHTML.onload = bodyOnLoaddnewsProjectKeywords();
}

document.querySelector(".searchByKeyword")?.addEventListener("click",()=>{
  document.querySelector(".searchByKeyword").style.display="none";
  document.querySelector(".keyword-toBeInserted").style.display="none";
  document.querySelector(".writeKeyword").style.display="inline";
})

document.querySelector(".saveKeyword")?.addEventListener("click",()=>{
var input =document.querySelector(".searchByKeywordInput");
  console.log(input.value)

if(input.value!==""){

  keyword=input.value;
  if (username !== null) {
    getPrivateProjectsByKeywords(keyword, token, listProjects);
    getPrivateNewsByKeywords(token, keyword, listNews);
  } else {
    getPublicNewsByKeywords(keyword, listNews);
    getPublicProjectsByKeywords(keyword, listProjects);
  }

  document.querySelector(".keyword-toBeInserted").innerText =keyword;
  document.querySelector(".searchByKeyword").style.display="inline";
  document.querySelector(".keyword-toBeInserted").style.display="inline";
  document.querySelector(".writeKeyword").style.display="none";
  listProjectContainer.innerHTML="";
  newsContainer.innerHTML="";
} else{

  document.querySelector(".writeKeyword").style.display="none";
  document.querySelector(".searchByKeyword").style.display="inline";
  document.querySelector(".keyword-toBeInserted").style.display="inline";


}

});




async function bodyOnLoaddnewsProjectKeywords() {
  document.querySelector(".keyword-toBeInserted").innerText = keyword;

  if (username !== null) {
    getUserTokenAPI(username, saveToken, errorGeneral);
  } else {
    getPublicNewsByKeywords(keyword, listNews);
    getPublicProjectsByKeywords(keyword, listProjects);
  }
}

function saveToken(user) {
  token = user.token;
  getPrivateProjectsByKeywords(keyword, token, listProjects);
  getPrivateNewsByKeywords(token, keyword, listNews);
}

/********************************************** */
/****************** LISTAR PROJETOS ** */
/********************************************** */
function listProjects(projectList) {
  console.log("Estou dentro do metodo");
  if (projectList.length > 0 && projectList != null) {
    projectList.forEach((projectElement) => {
      bringProjectToFrontEnd(projectElement);
    });
  } else {
    document.querySelector(".noProjects-keywords").style.display = "block";
  }
  console.log(projectList);
}

var lingo = null;
document
  .querySelector(".dropdown-content")
  .addEventListener("click", function (evt) {
    if (evt.target.tagName === "BUTTON") {
      lingo = evt.target.value;
    }
  });



/* Loads each project to the front end */
function bringProjectToFrontEnd(project) {
  document.querySelector(".noProjects-keywords").style.display = "none";
  console.log(project);

  let divProject = document.createElement("div");
  divProject.id = project.idPublication;

  let title = document.createElement("h3");
  title.innerText = project.title;
  let coverImg = document.createElement("img");
  let buttonProjectDetails = document.createElement("button");

  divProject.classList.add("divEachProjectIndex");
  coverImg.src = project.coverImage;
  coverImg.classList.add("coverImgProjectIndex");

  title.classList.add("titleProjectIndex");

  buttonProjectDetails.innerText = "See details";
  buttonProjectDetails.setAttribute("data-i18n", "detailsBTN");
  buttonProjectDetails.classList.add("buttonDetails");
  buttonProjectDetails?.addEventListener("click", seeDetailsProject);

  divProject.appendChild(coverImg);
  divProject.appendChild(title);
  divProject.appendChild(buttonProjectDetails);

  console.log(listProjectContainer);
  console.log(divProject);
  listProjectContainer.appendChild(divProject);
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

/********************************************** */
/****************** LISTAR NOTICIA  ** */
/********************************************** */
function listNews(newsElement) {
  console.log("Estou dentro do metodo");
  if (newsElement.length > 0 && newsElement!==null) {
    newsElement.forEach((newsElement) => {
      bringNewsToFrontEnd(newsElement);
    });
  } else {
    document.querySelector(".noNews-keywords").style.display = "block";
  }

  console.log(newsElement);
}

/* Loads each news to the front end */
function bringNewsToFrontEnd(newsPiece) {
  document.querySelector(".noNews-keywords").style.display = "none";
  console.log("hereee", newsPiece);

  let divNews = document.createElement("div");
  let title = document.createElement("h3");
  let coverImg = document.createElement("img");
  let buttonNewsDetails = document.createElement("button");

  divNews.classList.add("divEachNewsIndex");
  coverImg.src = newsPiece.coverImage;
  divNews.id = newsPiece.idNews;
  title.innerText = newsPiece.title;

  coverImg.classList.add("coverImgNewsIndex");
  title.classList.add("titleNewsIndex");

  buttonNewsDetails.setAttribute("data-i18n", "detailsBTN");

  buttonNewsDetails.innerText = "See Details";
  buttonNewsDetails.classList.add("buttonDetails");
  buttonNewsDetails?.addEventListener("click", seeDetailsNews);

  divNews.appendChild(coverImg);
  divNews.appendChild(title);
  divNews.appendChild(buttonNewsDetails);

  newsContainer.appendChild(divNews);
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

/* GET PUBLIC NEWS BY KEYWORDS */
async function getPublicProjectsByKeywords(keywordString, onSuccess) {
  const urlgetPublicNews =
    generalPath + "publications/searchPublication?keyword=" + keywordString;
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
      console.log("REST API Projetos PUBLICAS:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return null;
    });
}

/* GET NEWS BY KEYWORDS */
async function getPrivateProjectsByKeywords(keywordString, token, onSuccess) {
  const urlgetPublicNews =
    generalPath +
    "publications/loggedInSearchPublication?keyword=" +
    keywordString;
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
      console.log("REST API projeto privados:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return null;
    });
}

/************************************************** */
/**** VER DETALHES NOTICIAS******** */
/************************************************** */

function seeDetailsProject(evt) {

  console.log(evt.target.parentElement.id);
  var projectId = evt.target.parentElement.id;

  let urlSearch = new URLSearchParams(window.location.search);
  const username = urlSearch.get("username");
  var urlID = new URLSearchParams();
  const lingoURL = urlSearch.get("lingo");

  if (lingo !== null) {
    urlID.append("lingo", lingo);
  } else if (lingoURL !== null) {
    urlID.append("lingo", lingoURL);
  }

  if (username !== null) {
    urlID.append("username", username);
  }

  urlID.append("detailsProjectID", projectId);
  window.location.href = "detailsProject.html?" + urlID.toString();
}

function seeDetailsNews(evt) {
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