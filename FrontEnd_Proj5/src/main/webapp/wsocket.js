/**
 * @author Teresa Marta Ribeiro Santos
 * 
 *
 * File with the websocket connection for admin dashboard 
 */

//Selectors
//var loggedOnUser = getInfoLoggedOnUserSessionStorage();
//var token = loggedOnUser.token;
var wsocket;
let listOfNotifications;

function getInfoLoggedOnUserSessionStorage() {
  return JSON.parse(sessionStorage.getItem("loggedOnUser"));
}

function connect() {
  wsocket = new WebSocket("ws://localhost:8080/DataServer_Proj5/wsocket");
  var tokenJson = {
    token: "123",
  };
  wsocket.addEventListener("open", function () {
    wsocket.send(JSON.stringify(tokenJson));
  });
  wsocket.onmessage = onMessage;
}

function onMessage(evt) {

  //document.getElementById("category").innerHTML = arraypv[0];
  if (evt.data != null) {
    var count = 0;
    var websocketData = JSON.parse(evt.data);
    console.log(websocketData)
       
        
        }
  };

window.addEventListener("load", connect, false);
