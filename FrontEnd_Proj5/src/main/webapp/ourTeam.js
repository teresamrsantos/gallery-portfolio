/**
 * @author Teresa Marta Ribeiro Santos  - uc2021151797
 *
 * File with the script for the our team page
 */

import { errorGeneral,getOurTeamAPI } from "./generalScript.js";

/* CONST ROOT PATH REST API */
const generalPath = "http://localhost:8080/DataServer_Proj5/rest/";
/*Pagina Principal */
var ourTeamHTML = document.querySelector(".ourTeamHTML");
/* DIV Element For MEMBERS */
var divMembersListUL = document.querySelector(".membersListUL");



if (ourTeamHTML) {
  ourTeamHTML.onload = bodyOnLoadourTeam();
}

async function bodyOnLoadourTeam() {
  getOurTeamAPI(listMembers, errorGeneral);
}

/**** CONTROLO DE IDIOMA */
var lingo = null;
document
  .querySelector(".dropdown-content")
  .addEventListener("click", function (evt) {
    if (evt.target.tagName === "BUTTON") {
      lingo = evt.target.value;
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




/* Lista as noticias publicas */
function listMembers(usersList) {
    console.log("Estou dentro do metodo");
    if (usersList.length > 0) {
        usersList.forEach((users) => {
            getMembersToFrontEnd(users);
      });
    }
    console.log(usersList);
  }
  
  /* Loads each news to the front end */
  function getMembersToFrontEnd(user) {
    console.log(user);    
    if (user.deleted === false) {
      let divUser = document.createElement("div");
      divUser.classList.add("divEachMember");
      let name = document.createElement("h3");
      name.classList.add("nameEachMember");
      let email = document.createElement("h6");
      email.classList.add("emailEachMember");
       let profileImg = document.createElement("img");
       profileImg.classList.add("profileImgEachMember");
       let biography = document.createElement("h5");
       biography.classList.add("biographyEachMember");
 
      divUser.id = user.username;
      name.innerText = user.firstName +" "+ user.lastName;
      email.innerText=user.email;
      profileImg.src = user.pictureUrl;
      if(user.biography=== undefined){
        biography.innerText="";
      } else{      biography.innerText=user.biography;}

      divUser.appendChild(profileImg);
      divUser.appendChild(name);
      divUser.appendChild(email);
      divUser.appendChild(biography);


  
      divMembersListUL.appendChild(divUser);
    }
  }
  



