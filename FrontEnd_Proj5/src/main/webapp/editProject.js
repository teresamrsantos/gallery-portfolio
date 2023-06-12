import {
  errorGeneral,
  getUserTokenAPI,
  getOurTeamAPI,
  addCoauthorAPIProject,
  removeCoauthorAPIProject,
  getMembersNews,
  disassociateNewsToProjectAPI,
  addNewsToProjectAPI,
} from "./generalScript.js";

/* CONST ROOT PATH REST API */
const generalPath = "http://localhost:8080/DataServer_Proj5/rest/";
/* ID do projeto que vamos consultar os detalhes */
let urlSearch = new URLSearchParams(window.location.search);
const idPublication = urlSearch.get("detailsNewsID");
/*Pagina Detalhes */
var editProjectHTML = document.querySelector(".editProjectHTML");
/*DIV onde o projeto vai ser Inserido*/
var projectContainerFormEdit = document.querySelector(".container-Editproject");
/***************************** inputs ***********************/
var titleInput = document.querySelector(".titleNewNews");
var descriptionInput = document.querySelector(".descriptionNewNews");
var userNameInput = document.querySelector(".authorNewNews");
var imageInput = document.querySelector(".imgNewNews");
var keywordsInput = document.querySelector(".keywordsNews");
var visibilitySelect = document.getElementById("visibilitySelect");
/*Botao para retroceder para pagina de projetos*/
var backToAllProject = document.querySelector(".Backtoyourproject");
/*Botao EDITAR NOTICIAS*/
var saveBTN = document.querySelector(".btn-editProjectSave");

var username;
var token;
/* Verifica se esta de facto  corpo dos projetos publicos e chama a funcao inicial */
if (editProjectHTML) {
  editProjectHTML.onload = bodyOnLoadeditNews();
}

async function bodyOnLoadeditNews() {
  const username = urlSearch.get("username");
  if (username !== null) {
    getUserTokenAPI(username, saveToken, errorGeneral);
  }
}

function saveToken(user) {
  username = user.username;
  token = user.token;
  var idPublication = urlSearch.get("projectToEditID");
  getOneMEMBERSNewsRestApi(token, idPublication, loadNewsDetails, errorGeneral);
  /*getprojectsrelatedtoproject(
      user.token,
      listarProjetosRelacionadosNoticia,
      NoProjectsAssociated
    );*/
}

/***********************************************/
/******** Carregar informacao da noticia***********/
/*********************************************/
function loadNewsDetails(project) {
  /* Carregar informacao para a frontend */
  titleInput.value = project.title;
  descriptionInput.innerText = project.description;
  userNameInput.value = project.userOwnerusername;
  imageInput.value = project.coverImage;

  keywordsNews.value = project.keywordsPublication.replaceAll(";", " ");

  visibilitySelect.value = project.visibility;
}

/** BOTAO RETROVCEDER PARA A PAGINA DE NOTICIAS DO USER */
backToAllProject?.addEventListener("click", () => {
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
  location.href = "listUserProjects.html?" + urlID.toString();
});

/* Controlo de idioma */
var lingo = null;
document
  .querySelector(".dropdown-content")
  .addEventListener("click", function (evt) {
    if (evt.target.tagName === "BUTTON") {
      lingo = evt.target.value;
    }
  });

/** BOTAO EDITAR NOTICIAS */
saveBTN?.addEventListener("click", (evt) => {
  evt.preventDefault();
  document.querySelector(".errorMandatoryField-EditProject").style.display="none"
  var idPublication = urlSearch.get("projectToEditID");
  let titleField = titleInput.value;
  let descriptionField = descriptionInput.value;
  let keywordsField = keywordsInput.value;
  let coverImageField = imageInput.value;
  let visibility = visibilitySelect.value;

  var myJSON;
  if (
    titleField.trim() != "" &&
    descriptionField.trim() != "" &&
    keywordsField.trim() != "" &&
    coverImageField.trim() != ""
  ) {
    keywordsField = keywordsField.replace(/\s+/g, ";");

    myJSON = JSON.stringify({
      title: titleField,
      description: descriptionField,
      keywordsPublication: keywordsField,
      coverImage: coverImageField,
      visibility: visibility,
      userOwnerusername: username,
    });
    editProjectAPI(myJSON, token, idPublication, editProjectOK, errorGeneral);
  } else {
    document.querySelector(".errorMandatoryField-EditProject").style.display="inline"
  }
});

var usernamesList;
let projectID;
var editProjectCount = 0;
var usernameOwner
function editProjectOK(project) {
  var projectproject = JSON.parse(project);

  projectID = projectproject.idPublication;
  projectContainerFormEdit.style.display = "none";
  document.querySelector(".addCoauthorsContainer-EditProject").style.display =
    "inline";
    usernameOwner=projectproject.userOwnerusername;
  document.querySelector(".nextToAssociateProjects-EditProject").style.display="block";
  usernamesList = projectproject.coautorUsernamePublicationList;
  if (editProjectCount == 0) {
    getOurTeamAPI(listUsernames, errorGeneral);
    editProjectCount++;
  }
}

/*********************************************************/
/** ESTA FUNCAO TRAZ O NOME DOS USERS PARA A FRONT END */
/*********************************************************/
function listUsernames(ourteam) {
  var ulListUsername = document.querySelector(".coauthorsList-UL");

  ourteam.forEach((user) => {
    if(user.username !==usernameOwner ){
    let DIVUser = document.createElement("div");
    DIVUser.classList.add("DIVUsername");
    let liUser = document.createElement("li");
    liUser.classList.add("liUsername");

    liUser.innerText = user.username;
    let addCoauthorBTN = document.createElement("button");
    for (let i = 0; i < usernamesList.length; i++) {
      if (usernamesList[i] == user.username) {
        addCoauthorBTN.innerHTML = '<i class="fa fa-minus-square"></i>';
        addCoauthorBTN?.addEventListener("click", removeCoauthor);
        addCoauthorBTN.classList.add("removeCoauthorBTN");
        DIVUser.classList.add("userAdded");
        break;
      } else {
        addCoauthorBTN.innerHTML = '<i class="fa fa-plus-square"></i>';
        addCoauthorBTN?.addEventListener("click", addCoauthors);
      }
    }
    if (usernamesList.length == 0) {
      addCoauthorBTN.innerHTML = '<i class="fa fa-plus-square"></i>';
      addCoauthorBTN?.addEventListener("click", addCoauthors);
    }

    addCoauthorBTN.classList.add("addCoauthorBtn");
    liUser.id = user.username;

    DIVUser.append(liUser);
    DIVUser.append(addCoauthorBTN);
    ulListUsername.append(DIVUser);}
  });
}

/***********************************************/
/********  botao adicionar coautores***********/
/*********************************************/
function addCoauthors(evt) {
  evt.preventDefault();
  document.querySelector(".errorEditingProject").display = "none";
  var userToAddUsername = evt.target.parentElement.firstChild.innerHTML;
  addCoauthorAPIProject(
    userToAddUsername,
    projectID,
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
  evt.preventDefault();
  var userToRemoveUsername = evt.target.parentElement.firstChild.id;
  document.querySelector(".errorEditingProject").display = "none";
  removeCoauthorAPIProject(
    userToRemoveUsername,
    projectID,
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

/***********************************************/
/******** MENSAGENS DE ERRO ***********/
/*********************************************/

function seeError(error) {
  document.querySelector(".errorEditingProject").display = "block";
}
/********************************************************************/
/***********AVANCAR PARA ASSOCIAR/DESASSOCIAR Projetos a Noticia***************/
/********************************************************************/

var arrowNextToassociateNew = document.querySelector(
  ".nextToAssociateProjects-EditProject"
);
var countNextToAssociateNews =0;
arrowNextToassociateNew?.addEventListener("click", () => {
  document.querySelector(".errorEditingProject").display = "none";
  document
    .querySelector(".addCoauthorsContainer-EditProject")
    .style.display="none"
  arrowNextToassociateNew.style.display = "none";
  document.querySelector(".addNewsToProjectContainer-EditProject").style.display = "block";
  getnewsrelatedtoproject(
    urlSearch.get("projectToEditID"),
    token,
    listNewsRelatedToProjectFunction,
    seeError
  );
  if(countNextToAssociateNews==0){
  getMembersNews(token, listNews, seeError);
  countNextToAssociateNews++;}
});

var listNewsRelatedToProject;
function listNewsRelatedToProjectFunction(NewsRelatedToProjects) {
  listNewsRelatedToProject = NewsRelatedToProjects;
}

/***********retroceder para adicionar USERS ***************/
var buttonGetBack = document.querySelector(".backToAddUsers-EditProject");

buttonGetBack?.addEventListener("click", () => {
  
  document
    .querySelector(".addCoauthorsContainer-EditProject")
    .style.display="block";
  document.querySelector(".nextToAssociateProjects-EditProject").style.display =
    "block";
  document.querySelector(
    ".addNewsToProjectContainer-EditProject"
  ).style.display = "none";
});

/***********retroceder para EDITAR PROJETO ***************/
var buttonGetBackEditProject = document.querySelector(".backTEditProject");
buttonGetBackEditProject?.addEventListener("click", () => {
  document.querySelector(".addCoauthorsContainer-EditProject").style.display =
    "none";
  document.querySelector(".nextToAssociateProjects-EditProject").style.display =
    "none";
  projectContainerFormEdit.style.display = "block";
});

/***************************************************************************/
/****************************** Associate project to Project*******************/
/***************************************************************************/

function listNews(listNews) {
  
  var ulListAllProject = document.querySelector(".visibleProjects-UL");

  if (listNews.length > 0) {
    listNews.forEach((project) => {
      let DIVProject = document.createElement("div");
      DIVProject.classList.add("DIVProject-EditProject");
      let liProject = document.createElement("li");
      liProject.classList.add("liProject");

      liProject.id = project.idNews;
      liProject.innerText = project.title;
      let associateNewsBTN = document.createElement("button");
      associateNewsBTN.classList.add("associateNewsBTN");

      for (let i = 0; i < listNewsRelatedToProject.length; i++) {
        if (listNewsRelatedToProject[i].idNews == project.idNews) {
          associateNewsBTN.innerHTML = '<i class="fa fa-minus-square"></i>';
          associateNewsBTN?.addEventListener("click", removeProject);
          associateNewsBTN.classList.add("disassociateNewsBTN");
          DIVProject.classList.add("projectAdded");
          break;
        } else {
          associateNewsBTN.innerHTML = '<i class="fa fa-plus-square"></i>';
          associateNewsBTN?.addEventListener("click", associateNews);
        }
      }

      if (listNewsRelatedToProject.length == 0) {
        associateNewsBTN.innerHTML = '<i class="fa fa-plus-square"></i>';
        associateNewsBTN?.addEventListener("click", associateNews);
      }

      //  associateNewsBTN?.addEventListener("click", associateNews);
      DIVProject.append(liProject);
      DIVProject.append(associateNewsBTN);
      ulListAllProject.append(DIVProject);
    });
  }
}

/***********************************************/
/********  botao adicionar NOTICIAS ***********/
/*********************************************/
function associateNews(evt) {
  document.querySelector(".errorEditingProject").display = "none";
  evt.preventDefault();

  var newsID = evt.target.parentElement.firstChild.id;

  addNewsToProjectAPI(newsID, projectID, token, associateNewsOK, seeError);
}

function associateNewsOK(JsonNewsandPubAlltered) {
  let liToAlter = document.getElementById(
    JSON.parse(JsonNewsandPubAlltered).idNews
  );

  let divToAlter = liToAlter.parentElement;

  divToAlter.removeChild(divToAlter.children[1]);
  let disassociateNewsBTN = document.createElement("button");
  disassociateNewsBTN.innerHTML = '<i class="fa fa-minus-square"></i>';
  divToAlter.appendChild(disassociateNewsBTN);
  disassociateNewsBTN.classList.add("disassociateNewsBTN");
  divToAlter.classList.add("projectAdded");

  disassociateNewsBTN?.addEventListener("click", removeProject);
}

/***********************************************/
/********  botao remover Noticias ***********/
/*********************************************/

function removeProject(evt) {
  document.querySelector(".errorEditingProject").display = "none";
  evt.preventDefault();
  var newsID = evt.target.parentElement.firstChild.id;
  disassociateNewsToProjectAPI(
    newsID,
    projectID,
    token,
    removeProjectOK,
    seeError
  );
}

function removeProjectOK(JsonNewsandPubAlltered) {
  let liToAlter = document.getElementById(
    JSON.parse(JsonNewsandPubAlltered).idNews
  );
  let divToAlter = liToAlter.parentElement;

  divToAlter.removeChild(divToAlter.children[1]);
  let addProjectBTN = document.createElement("button");

  addProjectBTN.innerHTML = '<i class="fa fa-plus-square"></i>';
  divToAlter.appendChild(addProjectBTN);
  addProjectBTN.classList.add("associateNewsBTN");
  divToAlter.classList.remove("projectAdded");

  addProjectBTN?.addEventListener("click", associateNews);
}

/***********************TERMINAR ADICAO DE PROJETO**************/
var buttonFinish = document.querySelector(".finishAddProject-EditProject");
buttonFinish.addEventListener("click", (evt) => {
  evt.preventDefault();
  document.querySelector(".successEditingProject").style.display = "block";

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

/* REST API - GET ONE MEMBERS only project  */
async function getOneMEMBERSNewsRestApi(
  token,
  idPublication,
  onSuccess,
  onError
) {
  const urlgetPublicNews = generalPath + "publications/" + idPublication;
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
/********  EDITAR NOTICIAS API **************/
/*********************************************/

function editProjectAPI(myJSON, token, idPublication, onSuccess, onError) {
  var fetchProperties = {
    method: "POST",
    headers: { token, "Content-Type": "application/json" },
    body: myJSON,
  };

  fetch(
    generalPath + "publications/editPublication/" + idPublication,
    fetchProperties
  )
    .then(function (response) {
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
/********  GET NEWS RELATED TO PROJECTS **************/
/*********************************************/
/* REST API - GET NEWS RELATED TO PROJECTS*/
async function getnewsrelatedtoproject(
  idPublication,
  token,
  onSuccess,
  onError
) {
  const urlgetPublicNews =
    generalPath + "publications/newsAssociatedToPublication/" + idPublication;
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
