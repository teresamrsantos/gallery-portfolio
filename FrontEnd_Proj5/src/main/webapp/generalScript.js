/**
 * @author Teresa Marta Ribeiro Santos  - uc2021151797
 *
 * File with the general functions for all the webservice
 */

import Translator from "./translator.js";
/* CONST ROOT PATH REST API */
const generalPath = "http://localhost:8080/DataServer_Proj5/rest/";
/* USERNAME USER */
let urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get("username");
var token;
var userType;
console.log(username, "HEREEEEEEEE");
var urlID = new URLSearchParams();

/**  verificar se ha um user loggado ou nao e esconder/mostrar itens de acordo*/
if (username !== null) {
  getUserTokenAPI(username, saveToken, errorGeneral);
  console.log(userType);
 
}

function saveToken(user) {
  token = user.token;
  userType = user.userType;

   if (document.querySelector(".LogoutButton")) {
    document.querySelector(".LogoutButton").style.display = "block";
  }
  if (document.querySelector(".userProfileButton")) {
    document.querySelector(".userProfileButton").style.display = "block";
  }
  if (document.querySelector(".containerSlides")) {
    document.querySelector(".containerSlides").style.display = "none";
  }
  if (document.querySelector(".userInfoContainer")) {
    document.querySelector(".userInfoContainer").style.display = "block";
  }
  if (document.querySelector(".dropdownUser")) {
    document.querySelector(".dropdownUser").style.display = "inline-block";
  }
  if (document.querySelector(".usernameUser")) {
    document.querySelector(".usernameUser").innerText = username;
  }
  if (document.querySelector(".buttonAdmin") && userType == "admin") {
console.log("here inside if")
    document.querySelector(".buttonAdmin").style.display = "block";
  }
}

/********************************************************************* */
/***************************TRADUÇAO********************************** */
/********************************************************************* */
//criar este objeto que vai ter as linguagens e a localização dos dicheiros
var translator = new Translator({
  persist: false,
  languages: ["en", "pt"],
  defaultLanguage: "en",
  detectLanguage: true,
  filesLocation: "/i18n",
});

//vazio usa a linguagem default
//translator.load();

//Vai procurar pelo idioma guardado no url se houver
let lingo = urlSearch.get("lingo");
console.log(lingo, "lingo - General Script");
lingo === null
  ? (lingo = "en")
  : ((lingo = lingo), urlID.append("lingo", lingo));
translator.load(lingo);

document
  .querySelector(".dropdown-content")
  .addEventListener("click", function (evt) {
    if (evt.target.tagName === "BUTTON") {
      console.log("here with: ", lingo);
      if (
        urlSearch.get("lingo") &&
        urlSearch.get("lingo") !== evt.target.value
      ) {
        urlID.delete("lingo");
        urlID.append("lingo", evt.target.value);
      } else {
        urlID.append("lingo", evt.target.value);
      }
      translator.refresh_elements(evt.target.value);
      dates_conversion(evt.target.value)
    }
  });

export function refreshDinamicElementsLanguage(lingo) {
  translator.refresh_elements(lingo);
}

export function dates_conversion(lingo){
  const alldates = document.querySelectorAll("[data-i18n-date]");
  alldates.forEach(date=> {
    const data = new Date(date.getAttribute('data-i18n-date'));
    date.innerHTML=data.toLocaleString(lingo);
  })
}

/***********************BOTOES DE NAVEGAÇAO*************************/
document.querySelector(".homeBtn")?.addEventListener("click", (evt) => {
  if (username !== null) {
    urlID.append("username", username);
  }

  location.href = "index.html?" + urlID.toString();

});

document.querySelector(".ourProjectsBtn")?.addEventListener("click", (evt) => {
  if (username !== null) {
    // var urlID = new URLSearchParams();
    urlID.append("username", username);
  }
  location.href = "publicProjects.html?" + urlID.toString();
  //} else {
  //   location.href = "publicProjects.html";
  // }
});

document.querySelector(".ourTeamBtn")?.addEventListener("click", (evt) => {
  /* USERNAME USER */
  if (username !== null) {
    //   var urlID = new URLSearchParams();
    urlID.append("username", username);
  }
  location.href = "ourTeam.html?" + urlID.toString();
  // } else {
  //    location.href = "ourTeam.html";
  //  }
});

/***********************BUTTON User Profile *************************/
document
  .querySelector(".userProfileButton")
  ?.addEventListener("click", (evt) => {
    // var urlID = new URLSearchParams();
    urlID.append("username", username);
    location.href = "userProfile.html?" + urlID.toString();
  });

/*********************** erro geral *************************/
export function errorGeneral(error) {
  document.querySelector(".generalError").style.display = "block";
  //sessionStorage.clear();

  setTimeout(() => 
    location.href="index.html"
  , 1500);


  console.log("error");
  console.log(error);
}

/******************************************************/
/*****************    LOGOUT           ***************/
/**************************************************/
var LogoutButton = document.querySelector(".LogoutButton");

LogoutButton?.addEventListener("click", (evt) => {
  logoutAPI(token, logoutOK, errorGeneral);
});

function logoutOK() {
  location.href = "index.html?"+ urlID.toString();
}
/******************************************************/
/******** BOTOES MY ACOUNT USER loggado *************/
/**************************************************/
var addProject = document.querySelector(".addProject");
addProject?.addEventListener("click", (evt) => {
  urlID.append("username", username);
  location.href = "addProject.html?" + urlID.toString();
});

var addNews = document.querySelector(".addNews");
addNews?.addEventListener("click", (evt) => {
  urlID.append("username", username);
  location.href = "addNews.html?" + urlID.toString();
});

var listAllNews = document.querySelector(".myNews");
listAllNews?.addEventListener("click", (evt) => {
  urlID.append("username", username);
  location.href = "listUsersNews.html?" + urlID.toString();
});

var listAllProjects = document.querySelector(".myProjects");
listAllProjects?.addEventListener("click", (evt) => {
  urlID.append("username", username);
  location.href = "listUserProjects.html?" + urlID.toString();
});

var adminDashboard = document.querySelector(".buttonAdmin");
adminDashboard?.addEventListener("click", (evt) => {
  urlID.append("username", username);
  urlID.append("token", token);
  location.href = "index-react.html?" + urlID.toString();
});


/******************************************************/
/***************** GET USER TOKEN API ***************/
/**************************************************/

export function getUserTokenAPI(username, onSuccess, onError) {
  var fetchProperties = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  fetch(generalPath + "users/token/" + username, fetchProperties)
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
      console.log("error on getUserProfileAPI: " + error);
      onError(error);
    });
}

/******************************************************/
/***************** GET USER PROFILE API ***************/
/**************************************************/

export function getUserProfileAPI(token, username, onSuccess, onError) {
  var fetchProperties = {
    method: "GET",
    headers: { token, "Content-Type": "application/json" },
  };

  fetch(generalPath + "users/" + username, fetchProperties)
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
      console.log("error on getUserProfileAPI: " + error);
      onError(error);
    });
}

/******************************************************/
/***************** LOGOUT ****************************/
/**************************************************/

function logoutAPI(token, onSuccess, onError) {
  fetch(generalPath + "users/logout", {
    method: "POST",
    headers: {
      token,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  })
    .then(function (response) {
      console.log(response.status);
      if (response.ok) {
        onSuccess();
      } else {
        throw Error(response.status + ": " + response.statusText);
      } //se for not ok, faz skip a todos os then que vêm a seguir e faz trigger ao catch
    })
    .catch(function (error) {
      console.log(" error on logout: " + error);
      onError(error);
    });
}

/******************************************************/
/***************** GET OUR TEAM ******************/
/**************************************************/

export async function getOurTeamAPI(onSuccess, onError) {
  var fetchProperties = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  return await fetch(generalPath + "users/ourTeam")
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
      console.log("error on getOurTeamAPI: " + error);
      onError(error);
    });
}

/******************************************************/
/***************** GET THE PUBLIC AND  MEMBERS ONLY NEWS FOR THE MAIN PAGE  *************/
/**************************************************/
/* REST API - GET THE PUBLIC AND MEMBERS ONLY NEWS FOR THE MAIN PAGE */
export async function getMembersNews(token, onSuccess, onError) {
  const urlgetMembersNews = generalPath + "news/membersOnlyNews";
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
      console.log("REST API NOTICIAS membros:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return onError(error);
    });
}

/******************************************************/
/***************** GET THE PUBLIC AND  MEMBERS ONLY PROJECTS FOR THE MAIN PAGE  *************/
/**************************************************/
/* REST API - GET THE MEMBERS PROJECTS FOR THE MAIN PAGE */
export async function getMembersProjects(token, onSuccess, onError) {
  const urlgetPublicProjects =
    generalPath + "publications/membersOnlyPublication";
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
      console.log("REST API PROJETOS MEMBROS:");
      console.log(json);
      return onSuccess(json);
    })
    .catch((error) => {
      return onError(error);
    });
}

/***********************************************/
/********  ADICIONAR CO-AUTOR API NEWS **************/
/*********************************************/

export function addCoauthorAPINews(
  username,
  idNews,
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
      "news/addMembersNews/" +
      idNews +
      "?listUsernames=" +
      username,
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
/********  REMOVER CO-AUTOR API NEWWS **************/
/*********************************************/

export function removeCoauthorAPINews(
  username,
  idNews,
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
      "news/removeMembersNews/" +
      idNews +
      "?listUsernames=" +
      username,
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
/********  ADICIONAR NOTICIAS A PROJETO API******/
/*********************************************/

export function addNewsToProjectAPI(idNews, idPub, token, onSuccess, onError) {
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
      console.log("error on addNewsToProjectAPI: " + error);
      onError(error);
    });
}

/***********************************************/
/********  DESASSOCIAR NOTICIAS A PROJETO API */
/*********************************************/

export function disassociateNewsToProjectAPI(
  idNews,
  idPub,
  token,
  onSuccess,
  onError
) {
  console.log(idNews, "idNews");
  console.log(idPub, "idPub");
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
/********  ADICIONAR CO-AUTOR API **************/
/*********************************************/

export function addCoauthorAPIProject(
  username,
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
      "publications/addMembersPublication/" +
      idPub +
      "?listUsernames=" +
      username,
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
/********  REMOVER CO-AUTOR API **************/
/*********************************************/

export function removeCoauthorAPIProject(
  username,
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
      "publications/removeMembersPublication/" +
      idPub +
      "?listUsernames=" +
      username,
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
/******** DELETE NEWS  API **************/
/*********************************************/

export function deleteNewsAPI(idNews, token, onSuccess, onError) {
  var fetchProperties = {
    method: "POST",
    headers: { token, "Content-Type": "application/json" },
  };

  fetch(
    generalPath + "news/deleteNews/" + idNews,

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
/******** DELETE PROJECT  API **************/
/*********************************************/

export function deleteProjectAPI(idPub, token, onSuccess, onError) {
  var fetchProperties = {
    method: "POST",
    headers: { token, "Content-Type": "application/json" },
  };

  fetch(
    generalPath + "publications/deletePublication/" + idPub,

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
