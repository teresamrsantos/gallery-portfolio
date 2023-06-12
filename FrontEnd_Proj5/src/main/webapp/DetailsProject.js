import {
  errorGeneral,
  getUserTokenAPI,
  refreshDinamicElementsLanguage,
} from "./generalScript.js";

/* CONST ROOT PATH REST API */
const generalPath = "http://localhost:8080/DataServer_Proj5/rest/";
/* ID do projeto que vamos consultar os detalhes */
let urlSearch = new URLSearchParams(window.location.search);
const idProject = urlSearch.get("detailsProjectID");
/*Pagina Detalhes */
var detailsProjectHTML = document.querySelector(".detailsProjectHTML");
/*DIV onde o projeto vai ser Inserido*/
var projectContainer = document.querySelector(".projectContainer");
/*Botao para retroceder para pagina de projetos*/
var backToAllProjects = document.querySelector(".backToOurProjects");

/* Verifica se esta de facto  corpo dos projetos publicos e chama a funcao inicial */
if (detailsProjectHTML) {
  detailsProjectHTML.onload = bodyOnLoaddetailsProject();
}

async function bodyOnLoaddetailsProject() {
  let urlSearch = new URLSearchParams(window.location.search);
  const username = urlSearch.get("username");
  if (username !== null) {
    getUserTokenAPI(username, saveToken, errorGeneral);
  } else {
    getOnePublicProjectRestApi(loadProjectDetails, errorGeneral);
    getnewsrelatedtoprojectsPublics(
      listarNoticiasRelacionadosProjetos,
      NoProjectsAssociated
    );
  }
}

function saveToken(user) {
  console.log("YO", user);
  getOneMEMBERSProjectRestApi(user.token, loadProjectDetails, errorGeneral);
  getnewsrelatedtoprojects(
    user.token,
    listarNoticiasRelacionadosProjetos,
    NoProjectsAssociated
  );
}

function loadProjectDetails(project) {
  console.log(project);

  document.querySelector(".projectTitle").innerText = project.title;
  document.querySelector(".projectImage").src = project.coverImage;
  document.querySelector(".projectAuthor").innerText =
    project.userOwnerusername;



    document
    .querySelector(".updatedDate")
    .setAttribute("data-i18n-date", new Date(project.updateDate).toISOString());
  document
    .querySelector(".creationDate")
    .setAttribute("data-i18n-date", new Date(project.creationDate).toISOString());



    var lang = urlSearch.get("lingo");
    if(lang==null){
      lang="en"}
      document.querySelector(".creationDate").innerText = new Date(
        project.creationDate
      ).toLocaleString(lang);
    
      document.querySelector(".updatedDate").innerText = new Date(
        project.updateDate
      ).toLocaleString(lang);

  document.querySelector(".projectDescription").innerText = project.description;
  let divKeyword = document.querySelector(".divKeywordProject");
  let divCoauthor = document.querySelector(".divCoauthorProject");

  let keywordsList = project.keywordsPublication;
  if (keywordsList !== null) {
    let keywordsArray = project.keywordsPublication.split(";");
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
      keyword.classList.add("keywordProject");
      divKeyword.appendChild(keyword);
    }
  }

  let coauthorsArray = project.coautorUsernamePublicationList;
  for (let i = 0; i < coauthorsArray.length; i++) {
    console.log(coauthorsArray[i]);
    var coauthorsArrayA = document.createElement("a");
    coauthorsArrayA.innerText = coauthorsArray[i];
    coauthorsArrayA.classList.add("coauthorProject");
    divCoauthor.appendChild(coauthorsArrayA);
  }
}

/* CONTROLO DE IDIOMA */
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
  
backToAllProjects?.addEventListener("click", function () {
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

  console.log("APENDICES URL DETALHES projetos:", urlID.toString());
  location.href = "publicProjects.html?" + urlID.toString();
});

/* REST API - GET ONE PUBLIC PROJECT */
async function getOnePublicProjectRestApi(onSuccess, onError) {
  const urlgetPublicProjects = generalPath + "publications/public/" + idProject;
  var fetchProperties = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  return await fetch(urlgetPublicProjects, fetchProperties)
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

/* REST API - GET ONE MEMBERS PROJECT */
async function getOneMEMBERSProjectRestApi(token, onSuccess, onError) {
  const urlgetPublicProjects = generalPath + "publications/" + idProject;
  var fetchProperties = {
    method: "GET",
    headers: { token, "Content-Type": "application/json" },
  };

  return await fetch(urlgetPublicProjects, fetchProperties)
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

/* REST API - GET RELATED NEWS TO THE  PROJECT */
async function getnewsrelatedtoprojectsPublics(onSuccess, onError) {
  const urlgetPublicNews =
    generalPath + "publications/newsAssociatedToPublicationPUBLIC/" + idProject;
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
      console.log("REST API Noticias RELACIONADO COM Projeto:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return onError(error);
    });
}

/* REST API - GET PROJECTS RELATED TO NEWS */
async function getnewsrelatedtoprojects(token, onSuccess, onError) {
  const urlgetPublicNews =
    generalPath + "publications/newsAssociatedToPublication/" + idProject;
  var fetchProperties = {
    method: "GET",
    headers: { token, "Content-Type": "application/json" },
  };

  return await fetch(urlgetPublicNews, fetchProperties)
    .then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        //throw Error;
      }
    })
    .then(function (json) {
      console.log("REST API Noticias RELACIONADO COM Projeto:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return onError(error);
    });
}

function listarNoticiasRelacionadosProjetos(projectList) {
  console.log(projectList);
  var relatedProjectsDiv = document.querySelector(".divRelatedNews");
  if (projectList !== null && projectList.length > 0) {
    var ListOfProjects = document.createElement("ul");
    relatedProjectsDiv.appendChild(ListOfProjects);
    projectList.forEach((project) => {
      var itemProjectLi = document.createElement("li");
      ListOfProjects.appendChild(itemProjectLi);
      itemProjectLi.classList.add("itemNewsLi");

      var divTitleProject = document.createElement("div");
      divTitleProject.classList.add("divTitlNews");
      itemProjectLi.appendChild(divTitleProject);

      var documentTitle = document.createElement("h6");
      documentTitle.classList.add("newsTitleRelated");

      documentTitle.innerText = project.title;
      documentTitle.addEventListener("click", ()=> location.href = "detailsNews.html?detailsNewsID="+project.idNews);
      documentTitle.style.cursor="pointer";
      divTitleProject.append(documentTitle);

      var divImageProject = document.createElement("div");
      divImageProject.classList.add("divImageNewsRelated");
      itemProjectLi.appendChild(divImageProject);

      var projectImage = divImageProject.appendChild(
        document.createElement("img")
      );
      projectImage.classList.add("newsImageRelated");
      projectImage.src = project.coverImage;
      projectImage.style.height = "100px";
      projectImage.style.width = "200px";

      console.log(project);
    });
  }
}

function NoProjectsAssociated(error) {
  console.log("Nao tem projetos");
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
