import {
  errorGeneral,
  getUserTokenAPI,
  getOurTeamAPI,
  addCoauthorAPINews,
  removeCoauthorAPINews,
  getMembersProjects,
  disassociateNewsToProjectAPI,
  addNewsToProjectAPI,
} from "./generalScript.js";

/* CONST ROOT PATH REST API */
const generalPath = "http://localhost:8080/DataServer_Proj5/rest/";
/* ID do projeto que vamos consultar os detalhes */
let urlSearch = new URLSearchParams(window.location.search);
const idNews = urlSearch.get("detailsNewsID");
console.log(idNews, "ID");
/*Pagina Detalhes */
var editNewsHTML = document.querySelector(".editNewsHTML");
/*DIV onde o projeto vai ser Inserido*/
var newsContainerFormEdit = document.querySelector(".container-Editnews");
/***************************** inputs ***********************/
var titleInput = document.querySelector(".titleNewNews");
var descriptionInput = document.querySelector(".descriptionNewNews");
var userNameInput = document.querySelector(".authorNewNews");
var imageInput = document.querySelector(".imgNewNews");
var keywordsNews = document.querySelector(".keywordsNews");
var visibilitySelect = document.getElementById("visibilitySelect");
/*Botao para retroceder para pagina de projetos*/
var backToAllNews = document.querySelector(".Backtoyournews");
/*Botao EDITAR NOTICIAS*/
var saveBTN = document.querySelector(".btn-addNews");

var username;
var token;
/* Verifica se esta de facto  corpo dos projetos publicos e chama a funcao inicial */
if (editNewsHTML) {
  editNewsHTML.onload = bodyOnLoadeditNews();
}

async function bodyOnLoadeditNews() {
  console.log("aqiiii");
  const username = urlSearch.get("username");
  if (username !== null) {
    getUserTokenAPI(username, saveToken, errorGeneral);
  }
}

function saveToken(user) {
  console.log("YO", user);
  username = user.username;
  token = user.token;
  var idNews = urlSearch.get("newsToEditID");
  getOneMEMBERSNewsRestApi(token, idNews, loadNewsDetails, errorGeneral);
  /*getprojectsrelatedtonews(
    user.token,
    listarProjetosRelacionadosNoticia,
    NoProjectsAssociated
  );*/
}

/***********************************************/
/******** Carregar informacao da noticia***********/
/*********************************************/
function loadNewsDetails(news) {
  /* Carregar informacao para a frontend */
  titleInput.value = news.title;
  descriptionInput.innerText = news.description;
  userNameInput.value = news.userOwnerusername;
  imageInput.value = news.coverImage;
  keywordsNews.value = news.keywordsNews.replaceAll(";", " ");
  visibilitySelect.value = news.visibility;
}

/** BOTAO RETROVCEDER PARA A PAGINA DE NOTICIAS DO USER */
backToAllNews?.addEventListener("click", () => {
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

  location.href = "listUsersNews.html?" + urlID.toString();
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
  document.querySelector(".errorMandatoryField-EditNews").style.display="none"
  document.querySelector(".errorEditNews").display = "none";
  evt.preventDefault();
  var idNews = urlSearch.get("newsToEditID");
  let titleField = titleInput.value;
  let descriptionField = descriptionInput.value;
  let keywordsField = keywordsNews.value;
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
      keywordsNews: keywordsField,
      coverImage: coverImageField,
      visibility: visibility,
      userOwnerusername: username,
    });
    editNewsAPI(myJSON, token, idNews, editNewsOK, errorGeneral);
  } else (
   document.querySelector(".errorMandatoryField-EditNews").style.display="inline"
  )
});

var usernamesList;
let newsID;
var editNewsOkCount =0;
var newsOwner;
function editNewsOK(news) {

  var newsnews = JSON.parse(news);

  newsID = newsnews.idNews;
  newsContainerFormEdit.style.display = "none";
  document.querySelector(".addCoauthorsContainer-EditNews").style.display = "inline";

  usernamesList = newsnews.coautorUsernameNewsList;
  newsOwner=newsnews.userOwnerusername;
  if(editNewsOkCount==0){
  getOurTeamAPI(listUsernames, errorGeneral);
  editNewsOkCount=editNewsOkCount+1;
  }
  var arrowNextToassociateNew = document.querySelector(
    ".nextToAssociateProjects"
  );
  arrowNextToassociateNew.style.display ="block";
}

/*********************************************************/
/** ESTA FUNCAO TRAZ O NOME DOS USERS PARA A FRONT END */
/*********************************************************/
function listUsernames(ourteam) {
  var ulListUsername = document.querySelector(".coauthorsList-UL");
  ourteam.forEach((user) => {
    if(user.username!==newsOwner){
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
    if(usernamesList.length==0){
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
  document.querySelector(".errorEditNews").display = "none";
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
  document.querySelector(".errorEditNews").display = "none";
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

/***********************************************/
/******** MENSAGENS DE ERRO ***********/
/*********************************************/

function seeError(error) {
  document.querySelector(".errorEditNews").display = "block";
}
/********************************************************************/
/***********AVANCAR PARA ASSOCIAR/DESASSOCIAR Projetos a Noticia***************/
/********************************************************************/
var count =0;
var arrowNextToassociateNew = document.querySelector(
  ".nextToAssociateProjects"
);
arrowNextToassociateNew?.addEventListener("click", () => {
  document.querySelector(".errorEditNews").display = "none";
  document
    .querySelector(".addCoauthorsContainer-EditNews")
    .style.display="none";
  arrowNextToassociateNew.style.display = "none";
  document.querySelector(".addNewsToProjectContainer-EditNews").style.display =
    "block";
    if(count===0){
  getprojectsrelatedtonews(
    urlSearch.get("newsToEditID"),
    token,
    listProjectsRelatedToNewsFunction,
    seeError
  );
  getMembersProjects(token, listProjects, seeError);
count=count+1;}
});

var listProjectsRelatedToNews;
function listProjectsRelatedToNewsFunction(ProjectsRelatedToNews) {
  listProjectsRelatedToNews = ProjectsRelatedToNews;
}

/***********retroceder para adicionar USERS ***************/
var buttonGetBack = document.querySelector(".backToAddUsers-EditNews");

buttonGetBack?.addEventListener("click", () => {

  document
    .querySelector(".addCoauthorsContainer-EditNews")
    .style.display="block";
  document.querySelector(".nextToAssociateProjects").style.display = "block";
  document.querySelector(".addNewsToProjectContainer-EditNews").style.display = "none";
});


var buttonGetBackEditNews =document.querySelector(".backTEditNews");
buttonGetBackEditNews?.addEventListener("click", () => {

  document
    .querySelector(".addCoauthorsContainer-EditNews")
    .style.display="none";
  document.querySelector(".nextToAssociateProjects").style.display = "none";
  newsContainerFormEdit.style.display = "block";
});



/***************************************************************************/
/****************************** Associate news to Project*******************/
/***************************************************************************/

function listProjects(listProject) {
  console.log(listProject);
  var ulListAllNews = document.querySelector(".visibleProjects-UL-editNews");
  console.log("ulListAllNews", ulListAllNews);
  if(listProject.length>0){
  listProject.forEach((project) => {
    let DIVProject = document.createElement("div");
    DIVProject.classList.add("DIVProject");
    let liProject = document.createElement("li");
    liProject.classList.add("liProject");

    liProject.innerText = project.title;
    let associateProjectBTN = document.createElement("button");
    associateProjectBTN.classList.add("associateProjectBTN");
    for (let i = 0; i < listProjectsRelatedToNews.length; i++) {
      if (listProjectsRelatedToNews[i].idPublication == project.idPublication) {
        console.log(
          "DENTRO DO IF Projecy",
          listProjectsRelatedToNews[i].idPublication
        );
        associateProjectBTN.innerHTML = '<i class="fa fa-minus-square"></i>';
        associateProjectBTN?.addEventListener("click", removeProject);
        associateProjectBTN.classList.add("disassociateNewsBTN");
        DIVProject.classList.add("newsAdded");
        break;
      } else {
        associateProjectBTN.innerHTML = '<i class="fa fa-plus-square"></i>';
        associateProjectBTN?.addEventListener("click", associateProject);
      }

        }

        if(listProjectsRelatedToNews.length==0){
          associateProjectBTN.innerHTML = '<i class="fa fa-plus-square"></i>';
          associateProjectBTN?.addEventListener("click", associateProject);
        }
    

    liProject.id = project.idPublication;
    //  associateProjectBTN?.addEventListener("click", associateProject);
    DIVProject.append(liProject);
    DIVProject.append(associateProjectBTN);
    console.log("DIVProject", DIVProject);
    ulListAllNews.append(DIVProject);
  });}
}

/***********************************************/
/********  botao adicionar NOTICIAS ***********/
/*********************************************/
function associateProject(evt) {
  document.querySelector(".errorEditNews").display = "none";
  evt.preventDefault();

  console.log(newsID, "idnews");
  var pubID = evt.target.parentElement.firstChild.id;
  console.log(pubID, "pubID");
  addNewsToProjectAPI(newsID, pubID, token, associateProjectOK, seeError);
}

function associateProjectOK(JsonNewsandPubAlltered) {
  console.log(JsonNewsandPubAlltered);

  let liToAlter = document.getElementById(
    JSON.parse(JsonNewsandPubAlltered).idPub
  );
  let divToAlter = liToAlter.parentElement;
  console.log(liToAlter.parentElement);
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
  document.querySelector(".errorEditNews").display = "none";
  evt.preventDefault();
  console.log("removeProject");
  console.log(newsID, "idnews");
  console.log(evt.target.parentElement);

  var pubID = evt.target.parentElement.firstChild.id;

  disassociateNewsToProjectAPI(newsID, pubID, token, removeProjectOK, seeError);
}

function removeProjectOK(JsonNewsandPubAlltered) {
  console.log(JsonNewsandPubAlltered);

  let liToAlter = document.getElementById(
    JSON.parse(JsonNewsandPubAlltered).idPub
  );
  let divToAlter = liToAlter.parentElement;
  divToAlter.classList.remove("newsAdded");
  console.log(liToAlter.parentElement);
  let addProjectBTN = document.createElement("button");

  divToAlter.removeChild(divToAlter.children[1]);
  addProjectBTN.innerHTML = '<i class="fa fa-plus-square"></i>';
  divToAlter.appendChild(addProjectBTN);
  addProjectBTN.classList.add("associateNewsBTN");
  divToAlter.classList.remove("projectAdded");

  addProjectBTN?.addEventListener("click", associateProject);
}

/***********************TERMINAR ADICAO DE PROJETO**************/
var buttonFinish = document.querySelector(".finishEditNews");
buttonFinish.addEventListener("click", (evt) => {
  evt.preventDefault();
  console.log("here");
  document.querySelector(".successEditingNews").style.display = "block";

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

  setTimeout(
    () => (location.href = "index.html?" + urlID.toString()),

    1500
  );
});

/* REST API - GET ONE MEMBERS only news  */
async function getOneMEMBERSNewsRestApi(token, idNews, onSuccess, onError) {
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
/********  EDITAR NOTICIAS API **************/
/*********************************************/

function editNewsAPI(myJSON, token, idNews, onSuccess, onError) {
  var fetchProperties = {
    method: "POST",
    headers: { token, "Content-Type": "application/json" },
    body: myJSON,
  };

  fetch(generalPath + "news/editNews/" + idNews, fetchProperties)
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
/********  RGET PROJECTS RELATED TO NEWS **************/
/*********************************************/
/* REST API - GET PROJECTS RELATED TO NEWS */
async function getprojectsrelatedtonews(idNews, token, onSuccess, onError) {
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
