import { errorGeneral, getUserTokenAPI } from "./generalScript.js";
import { refreshDinamicElementsLanguage } from "./generalScript.js";
/* CONST ROOT PATH REST API */
const generalPath = "http://localhost:8080/DataServer_Proj5/rest/";
/* ID do projeto que vamos consultar os detalhes */
let urlSearch = new URLSearchParams(window.location.search);
const idNews = urlSearch.get("detailsNewsID");
console.log(idNews, "ID");
/*Pagina Detalhes */
var detailsNewsHTML = document.querySelector(".detailsNewstHTML");
/*DIV onde o projeto vai ser Inserido*/
var newsContainer = document.querySelector(".newsDetailsPageContainer");
/*Botao para retroceder para pagina de projetos*/
var backToAllNews = document.querySelector(".backToTheMainPage");

/* Verifica se esta de facto  corpo dos projetos publicos e chama a funcao inicial */
if (detailsNewsHTML) {
  detailsNewsHTML.onload = bodyOnLoaddetailsNews();
}

async function bodyOnLoaddetailsNews() {
  let urlSearch = new URLSearchParams(window.location.search);
  const username = urlSearch.get("username");
  if (username !== null) {
    getUserTokenAPI(username, saveToken, errorGeneral);
  } else {
    getOnePublicNewsRestApi(loadNewsDetails, errorGeneral);
    getprojectsrelatedtonewspublic(
      listarProjetosRelacionadosNoticia,
      NoProjectsAssociated
    );
  }
}

function saveToken(user) {
  console.log("YO", user);
  getOneMEMBERSNewsRestApi(user.token, loadNewsDetails, errorGeneral);
  getprojectsrelatedtonews(
    user.token,
    listarProjetosRelacionadosNoticia,
    NoProjectsAssociated
  );
}

/*if(username===null){
  //if (sessionStorage.getItem("loggedOnUser") === null) {
    getPublicNews(listNews);} else {
getUserTokenAPI(username,saveToken, errorGeneral)
 // } else if (sessionStorage.getItem("loggedOnUser") !== null) {
   
  }
}*/
/* Controlo de idioma */
var lingo = null;
document
  .querySelector(".dropdown-content")
  .addEventListener("click", function (evt) {
    if (evt.target.tagName === "BUTTON") {
      console.log("here with: ", evt.target.value);
      lingo = evt.target.value;
      console.log("EVENT LISTNER LINGO", lingo);
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


backToAllNews?.addEventListener("click", function () {
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

  console.log("APENDICES URL DETALHES NOTICIAS:", urlID.toString());
  location.href = "index.html?" + urlID.toString();
});

function loadNewsDetails(news) {
  console.log(news);

  document.querySelector(".newsTitle").innerText = news.title;
  document.querySelector(".newsImage").src = news.coverImage;
  document.querySelector(".newsAuthor").innerText =
    " " + news.userOwnerusername;

  document
    .querySelector(".updatedDate")
    .setAttribute("data-i18n-date", new Date(news.updateDate).toISOString());
  document
    .querySelector(".creationDate")
    .setAttribute("data-i18n-date", new Date(news.creationDate).toISOString());

  var lang = urlSearch.get("lingo");
  if (lang == null) {
    lang = "en";
  }
  document.querySelector(".creationDate").innerText = new Date(
    news.creationDate
  ).toLocaleString(lang);

  document.querySelector(".updatedDate").innerText = new Date(
    news.updateDate
  ).toLocaleString(lang);

  document.querySelector(".newsDescription").innerText = news.description;
  let divKeyword = document.querySelector(".divKeyword");
  let divCoauthor = document.querySelector(".divCoauthor");

  let keywordsList = news.keywordsNews;

  if (keywordsList !== null && keywordsList.length > 0) {
    let keywordsArray = news.keywordsNews.split(";");
    var keyword;
    for (let i = 0; i < keywordsArray.length; i++) {
      keyword = document.createElement("a");
      keyword.innerText = "#" + keywordsArray[i] + " ";
      keyword.addEventListener(
        "click",
        () =>{
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
          urlID.append("keyword", keywordsArray[i]);

          location.href =
            "NewsprojectKeyword.html?"+urlID.toString();}
      );
      keyword.classList.add("keywordNews");
      divKeyword.appendChild(keyword);
    }
  }

  let coauthorsArray = news.coautorUsernameNewsList;
  for (let i = 0; i < coauthorsArray.length; i++) {
    var coauthor = document.createElement("p");
    coauthor.innerText = coauthorsArray[i];
    coauthor.classList.add("coauthorNews");
    divCoauthor.appendChild(coauthor);
  }
}

/* REST API - GET ONE PUBLIC PROJECT */
async function getOnePublicNewsRestApi(onSuccess, onError) {
  const urlgetPublicNews = generalPath + "news/public/" + idNews;
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
      console.log("REST API Noticias:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return onError(error);
    });
}

/* REST API - GET PROJECTS RELATED TO NEWS */
async function getprojectsrelatedtonewspublic(onSuccess, onError) {
  const urlgetPublicNews =
    generalPath + "news/publicationsAssociatedToNewsPUBLIC/" + idNews;
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
      console.log("REST API PROJETO RELACIONADO COM NOTICIAS:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return onError(error);
    });
}

function listarProjetosRelacionadosNoticia(projectList) {
  console.log(projectList);
  var relatedProjectsDiv = document.querySelector(".divRelatedProjects");
  if (projectList !== null && projectList.length > 0) {
    var ListOfProjects = document.createElement("ul");
    relatedProjectsDiv.appendChild(ListOfProjects);
    projectList.forEach((project) => {
      var itemProjectLi = document.createElement("li");
      ListOfProjects.appendChild(itemProjectLi);
      itemProjectLi.classList.add("itemProjectLi");

      var divTitleProject = document.createElement("div");
      divTitleProject.classList.add("divTitleProject");
      itemProjectLi.appendChild(divTitleProject);

      var documentTitle = document.createElement("h6");
      documentTitle.classList.add("documentTitle");
      documentTitle.innerText = project.title;
      console.log(window.location);
      documentTitle.style.cursor="pointer";
      documentTitle.addEventListener("click", () => {
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
        urlID.append("detailsProjectID", project.idPublication);

        location.href = "detailsProject.html?" + urlID.toString();
      });
      divTitleProject.append(documentTitle);

      var divImageProject = document.createElement("div");
      divImageProject.classList.add("divImageProject");
      itemProjectLi.appendChild(divImageProject);

      var projectImage = divImageProject.appendChild(
        document.createElement("img")
      );
      projectImage.classList.add("projectImage");
      projectImage.src = project.coverImage;
      projectImage.style.height = "100px";
      projectImage.style.width = "200px";

      console.log(project);
    });
  }
}

function NoProjectsAssociated(error) {
  console.log(error);
}

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

/* REST API - GET ONE MEMBERS only news  */
async function getOneMEMBERSNewsRestApi(token, onSuccess, onError) {
  const urlgetPublicNews = generalPath + "news/" + idNews;
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
      console.log("REST API PROJETO:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return onError(error);
    });
}

/***********************************************/
/********  RGET PROJECTS RELATED TO NEWS **************/
/*********************************************/
/* REST API - GET PROJECTS RELATED TO NEWS */
async function getprojectsrelatedtonews(token, onSuccess, onError) {
  const urlgetPublicNews =
    generalPath + "news/publicationsAssociatedToNews/" + idNews;
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
      console.log("REST API PROJETO RELACIONADO COM NOTICIAS:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return onError(error);
    });
}
