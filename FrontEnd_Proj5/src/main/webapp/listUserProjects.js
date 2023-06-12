/**
 * @author Teresa Marta Ribeiro Santos  - uc2021151797
 *
 * File with the script for  listing public projects
 */

 import {
    errorGeneral,
    getUserTokenAPI,
    refreshDinamicElementsLanguage,
    deleteProjectAPI
  } from "./generalScript.js";
  
  /* CONST ROOT PATH REST API */
  const generalPath = "http://localhost:8080/DataServer_Proj5/rest/";
  /*Pagina Projetos publicos */
  var listUserProjectHTML = document.querySelector(".listUserProjectHTML");
  /* UL where the project will be added */
  var listProjectContainer = document.querySelector(".listProjectContainer");
  /* UL where the ASSOCIATED project will be added */
  var listProjectAssociatedContainer = document.querySelector(
    ".listProjectAssociatedContainer"
  );
  
  var token;
  var username;
  
  /* Verifica se esta de facto  corpo dos projetos publicos e chama a funcao inicial */
  if (listUserProjectHTML) {
    listUserProjectHTML.onload = bodyOnLoadlistUserProject();
  }
  
  // Funcao ao carregar corpo dos projetos publicos
  async function bodyOnLoadlistUserProject() {
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
    getusersProjectListApi(token, username, listProject, errorGeneral);
    getusersAssociatedProjectListApi(
      token,
      username,
      listProjectAssociated,
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
  function listProject(projectList) {
    console.log("Estou dentro do metodo");
    if (projectList!=null  && projectList.length > 0 ) {
        projectList.forEach((projectElement) => {
        bringProjectToFrontEnd(projectElement);
      });
    } else {
      document.querySelector(".noProjects-listUserProjects").style.display="inline";
    }
  
  
    console.log(projectList);
  }
  
  /* Loads each project to the front end */
  function bringProjectToFrontEnd(project) {
    console.log(project);
    document.querySelector(".noProjects-listUserProjects").style.display="none";
    let divProject = document.createElement("div");
    divProject.id = project.idPublication;

    let title = document.createElement("h3");
    let coverImg = document.createElement("img");
    let buttonProjectEdit = document.createElement("button");
    let buttonDeleteProject = document.createElement("button");
    divProject.classList.add("divEachProjectIndex");
    coverImg.src = project.coverImage;
    coverImg.classList.add("coverImgProjectIndex");


    title.innerText = project.title;
    title.classList.add("titleProjectIndex");


    if (project.deleted === false) {
      buttonDeleteProject.innerHTML = '<i class="fa fa-trash"></i>';
    } else if (project.deleted === true) {
      buttonDeleteProject.innerHTML = '<i class="fa fa-trash-restore"></i>';
      divProject.classList.add("deleteProject");
    }
    buttonDeleteProject.classList.add("trash-btn-editProject");
    buttonDeleteProject?.addEventListener("click", deleteProject);
    buttonProjectEdit.classList.add("buttonProjectEdit");
  
    buttonProjectEdit.innerText = "Edit project";
    buttonProjectEdit.setAttribute("data-i18n", "editProjectBTN");
    buttonProjectEdit?.addEventListener("click", editProject);
  
    divProject.appendChild(coverImg);
    divProject.appendChild(title);
    divProject.appendChild(buttonProjectEdit);
    divProject.appendChild(buttonDeleteProject);
  
    listProjectContainer.appendChild(divProject);
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
  
  function editProject(evt) {
    var projectId = evt.target.parentElement.id;
    let urlSearch = new URLSearchParams(window.location.search);
    const username = urlSearch.get("username");
    var urlID = new URLSearchParams();
    const lingoURL = urlSearch.get("lingo");
  
    if (lingo !== null) {
      urlID.append("lingo", lingo);
      console.log(lingo, " seeProjectDetails lingo");
    } else if (lingoURL !== null) {
      console.log(lingoURL, " seeProjectDetails lingoURL");
      urlID.append("lingo", lingoURL);
    }
  
    if (username !== null) {
      urlID.append("username", username);
    }
    urlID.append("projectToEditID", projectId);
    window.location.href = "editProject.html?" + urlID.toString();
  }
  
  function deleteProject(evt) {
    var idProject = evt.target.parentElement.id;
  
    console.log(idProject, "idNeeeeeeeeew");
    deleteProjectAPI(idProject, token, deleteOK, seeError);
  }
  
  function deleteOK(deletedProject) {
    var deletedProject = JSON.parse(deletedProject);
    console.log(deletedProject);
    var divProject = document.getElementById(deletedProject.idPublication);
  
    console.log(deletedProject.deleted, "deleteProject");
    if (deletedProject.deleted == true) {
      console.log(true);
      divProject.classList.add("deleteProject");
      divProject.children[3].innerHTML = '<i class="fa fa-trash-restore"></i>';
    } else if (deletedProject.deleted == false) {
      divProject.classList.remove("deleteProject");
      console.log(false);
      divProject.children[3].innerHTML = '<i class="fa fa-trash"></i>';
    }
  }
  
  /********************************************** */
  /****************** LISTAR NOTICIAS QUE SOU MEMBRO ** */
  /********************************************** */
  
  function listProjectAssociated(projectList) {
    console.log(projectList,"yo");
    if (projectList!==null && projectList.length > 0) {
        projectList.forEach((project) => {
        bringAssociatedProjectToFrontEnd(project);
      });
    } else {
      console.log("here")
      document.querySelector(".noProjects-listUserProjectsMembers").style.display="inline";
    }
  }
  
  /* Loads each project to the front end */
  function bringAssociatedProjectToFrontEnd(project) {
    console.log(project);
    document.querySelector(".noProjects-listUserProjectsMembers").style.display="none";
    if (project.deleted === false) {
      let divProject = document.createElement("div");
      let title = document.createElement("h3");
      let coverImg = document.createElement("img");
      let buttonDisassociateProject = document.createElement("button");
      divProject.classList.add("divEachProjectIndex");
      coverImg.src = project.coverImage;
      divProject.id = project.idPublication;
      title.innerText = project.title;
  
      coverImg.classList.add("coverImgProjectIndex");
      title.classList.add("titleProjectIndex");
      buttonDisassociateProject.innerHTML = "Disassociate";
      buttonDisassociateProject.setAttribute("data-i18n", "disassociateProjectBtn");
      buttonDisassociateProject.classList.add("disassociateProjectBtn");
      buttonDisassociateProject?.addEventListener("click", disassociateProject);
  
      divProject.appendChild(coverImg);
      divProject.appendChild(title);
  
      divProject.appendChild(buttonDisassociateProject);
  
      listProjectAssociatedContainer.appendChild(divProject);
      // }
    }
  
    
   
  }
  
  var idProject;
  function disassociateProject(evt) {
    idProject = evt.target.parentElement.id;
    let urlSearch = new URLSearchParams(window.location.search);
    console.log(idProject, "idNeeeeeeeeew");
    disassociateUserFromProjectAPI(
      token,
      username,
      idProject,
      disassociateApi,
      seeError
    );
    /*"Está a escolher desassociar se deste conteúdo, esta ação não é possivel de ser desfeita. Se, no futuro quiser voltar a associar-se terá que entrar em contacto com o criador do conteudo. Pretende desassociar-se ?"
  const lingoURL = urlSearch.get("lingo");
  console.log(lingo)
  
  if( lingo === "pt"){
   var textForProject = "Está a escolher desassociar se deste conteúdo, esta ação não é possivel ser desfeita. Se, no futuro quiser voltar a associar-se terá que entrar em contacto com o criador do conteudo. Pretende desassociar-se ?"
  } 
  var textForProject = "You are choosing to disassociate yourself from this content, this action cannot be undone. If, in the future, you want to re-associate yourself, you will have to contact the creator of the content. Do you want to disassociate ?"
  
  
  
    if (confirm(textForProject)) {
      disassociateApi(idProject);
    } else {
      console.log(textForProject)
    }*/
  }
  
  function disassociateApi(username) {
    console.log("here");
  
    var elem = document.getElementById(idProject);
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
  
  async function disassociateUserFromProjectAPI(
    token,
    username,
    idPublication,
    onSuccess,
    onError
  ) {
    const urlgetMembersProject =
      generalPath +
      "publications/removeMembersPublication/" +
      idPublication +
      "?listUsernames=" +
      username;
    var fetchProperties = {
      method: "POST",
      headers: { token, "Content-Type": "application/json" },
    };
  
    return await fetch(urlgetMembersProject, fetchProperties)
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
  
  async function getusersAssociatedProjectListApi(
    token,
    username,
    onSuccess,
    onError
  ) {
    const urlgetMembersProject = generalPath + "publications/userCoauthorPublication/" + username;
    var fetchProperties = {
      method: "GET",
      headers: { token, "Content-Type": "application/json" },
    };
  
    return await fetch(urlgetMembersProject, fetchProperties)
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
  async function getusersProjectListApi(token, username, onSuccess, onError) {
    const urlgetMembersProject = generalPath + "publications/userOwnPublication/" + username;
    var fetchProperties = {
      method: "GET",
      headers: { token, "Content-Type": "application/json" },
    };
  
    return await fetch(urlgetMembersProject, fetchProperties)
      .then(function (response) {
        if (response.ok) {
          return response.json();
        } else {
          throw Error;
        }
      })
      .then(function (json) {
        console.log("REST API Project:");
        console.log(json);
        return onSuccess(json);
      })
      .catch((error) => {
        return onError(error);
      });
  }
  
