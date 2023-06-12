/**
 * @author Teresa Marta Ribeiro Santos  - uc2021151797
 *
 * File with the script for  listing public projects
 */
/* CONST ROOT PATH REST API */
const generalPath = "http://localhost:8080/DataServer_Proj5/rest/";
/*Pagina Projetos publicos */
var publicProjectsHTML = document.querySelector(".publicProjectsHTML");
/* UL where the project will be added */
var ulProjectList = document.querySelector(".projectListUL");

import {
  errorGeneral,
  getUserTokenAPI,
  refreshDinamicElementsLanguage,
  getMembersProjects,
  deleteProjectAPI,
} from "./generalScript.js";

/* Verifica se esta de facto  corpo dos projetos publicos e chama a funcao inicial */
if (publicProjectsHTML) {
  publicProjectsHTML.onload = bodyOnLoadpublicProjects();
}

// Funcao ao carregar corpo dos projetos publicos
async function bodyOnLoadpublicProjects() {
  let urlSearch = new URLSearchParams(window.location.search);
  const username = urlSearch.get("username");
  if (username !== null) {
    getUserTokenAPI(username, saveToken, errorGeneral);
  } else {
    getPublicProjects(listProjects, errorGeneral);
  }
}

/***************************************************************/
/* Esta funcao gere a informacao do user recebida pelo backend */
/***************************************************************/
var userType;
var token;
function saveToken(user) {
  getMembersProjects(user.token, listProjects, errorGeneral);
  userType = user.userType;
  token = user.token;
  if (userType == "admin") {
    getInvisibleProjects(token, listProjects, errorGeneral);
    getdeletedProjects(token, listProjects, errorGeneral);
  }
}

/* Lista as projetos publicas */
function listProjects(publicProjects) {
  if (publicProjects !== null && publicProjects.length > 0) {
    publicProjects.forEach((projElement) => {
      bringProjectsToFrontEnd(projElement);
    });
  } else {
    document.querySelector(".noProjects-publicprojectsdiv").style.display =
      "block";
  }

  if (lingo !== null) {
    refreshDinamicElementsLanguage(lingo);
  } else {
    let urlSearch = new URLSearchParams(window.location.search);
    const lingoURL = urlSearch.get("lingo");

    if (lingoURL !== null) {
      refreshDinamicElementsLanguage(lingoURL);
    }
  }
}

/* Loads each news to the front end */
function bringProjectsToFrontEnd(projElement) {
  document.querySelector(".noProjects-publicprojectsdiv").style.display =
    "none";
  let liProj = document.createElement("li");
  let divProj = document.createElement("div");
  let title = document.createElement("h2");
  let author = document.createElement("h6");
  let coverImg = document.createElement("img");
  let snippet = document.createElement("p");

  let buttonNewsDetails = document.createElement("button");
  coverImg.src = projElement.coverImage;
  liProj.id = projElement.idPublication;
  title.innerText = projElement.title;
  snippet.innerText = projElement.description;
  author.innerText = projElement.userOwnerusername;

  coverImg.classList.add("coverImgProj");
  snippet.classList.add("projectDetailsInPageOfAllTheProjects");
  buttonNewsDetails.classList.add("buttonProj");
  divProj.classList.add("divProj");
  liProj.classList.add("liProj");
  buttonNewsDetails.innerText = "See details";
  buttonNewsDetails.setAttribute("data-i18n", "detailsBTN");
  liProj.appendChild(coverImg);
  divProj.appendChild(buttonNewsDetails);

  if (userType == "admin") {
    let buttonProjectEdit = document.createElement("button");
    let buttonDeleteProject = document.createElement("button");

    if (projElement.deleted === false) {
      buttonDeleteProject.innerHTML = '<i class="fa fa-trash"></i>';
    } else if (projElement.deleted === true) {
      divProj.classList.add("deleteProjectPublicProjects");
      buttonDeleteProject.innerHTML = '<i class="fa fa-trash-restore"></i>';
    }

    buttonDeleteProject.classList.add("trash-btn-ListProjects");
    buttonDeleteProject?.addEventListener("click", deleteProject);
    buttonProjectEdit.classList.add("buttonProjectEdit-publicProjects");

    buttonProjectEdit.innerHTML ='<i class="fa fa-pencil-square-o" aria-hidden="true"></i>';
    //buttonProjectEdit.setAttribute("data-i18n", "editProjectBTN");
    buttonProjectEdit?.addEventListener("click", editProject);
    divProj.appendChild(buttonProjectEdit);
    divProj.appendChild(buttonDeleteProject);
  }

  buttonNewsDetails?.addEventListener("click", detailsProjectPage);

  divProj.appendChild(title);
  divProj.appendChild(author);
  divProj.appendChild(snippet);

  liProj.appendChild(divProj);
  ulProjectList.appendChild(liProj);
}

function editProject(evt) {
  var projectId = evt.target.parentElement.parentElement.id;
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
  urlID.append("projectToEditID", projectId);
  window.location.href = "editProject.html?" + urlID.toString();
}

function deleteProject(evt) {
  var idProject = evt.target.parentElement.parentElement.id;
  deleteProjectAPI(idProject, token, deleteOK, errorGeneral);
}

function deleteOK(deletedProject) {
  var deletedProject = JSON.parse(deletedProject);
  var liProject = document.getElementById(deletedProject.idPublication);
  var divProject = liProject.children[1];

  if (deletedProject.deleted == true) {
    divProject.classList.add("deleteProjectPublicProjects");
    divProject.children[2].innerHTML = '<i class="fa fa-trash-restore"></i>';
  } else if (deletedProject.deleted == false) {
    divProject.classList.remove("deleteProjectPublicProjects");

    divProject.children[2].innerHTML = '<i class="fa fa-trash"></i>';
  }
}

var lingo = null;
document
  .querySelector(".dropdown-content")
  .addEventListener("click", function (evt) {
    if (evt.target.tagName === "BUTTON") {
      lingo = evt.target.value;
    }
  });

/* Function to go to the details of a project */
function detailsProjectPage(evt) {
  var projectId = evt.target.parentElement.parentElement.id;
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

/********************************************************************/
/*****************Function for searching for a keyword *************/
/********************************************************************/
var searchInput = document.querySelector(".search-data");
var searchButton = document.querySelector(".search-lupa");

searchButton.addEventListener("click", (evt) => {
  evt.preventDefault();
  /* USERNAME USER */
  let urlSearch = new URLSearchParams(window.location.search);
  const username = urlSearch.get("username");
  var keywordInput = searchInput.value;
  if (username !== null) {
    getPrivateProjectsByKeywords(token, keywordInput, filterProjects);
  } else {
    getPublicProjectsByKeywords(keywordInput, filterProjects);
  }
});

function filterProjects(projectList) {
  var container = document.querySelector(".projectListUL");
  container.innerHTML = "";
  listProjects(projectList);
  searchInput.value = "";
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

/* REST API - GET THE PUBLIC PROJECTS FOR THE MAIN PAGE */
async function getPublicProjects(onSuccess, onError) {
  const urlgetPublicProjects = generalPath + "publications/publicPublication";
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
      console.log("REST API PROJETOS PUBLICAS:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return onError(error);
    });
}

/* GET INVISIBLE NEWS */

async function getInvisibleProjects(token, onSuccess, onError) {
  const urlgetPublicNews = generalPath + "publications/invisiblePublication";
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

async function getdeletedProjects(token, onSuccess, onError) {
  const urlgetPublicNews = generalPath + "publications/deletedPublication";
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
      console.log("REST API PROJETOS ELIMINADOS:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return null;
    });
}
