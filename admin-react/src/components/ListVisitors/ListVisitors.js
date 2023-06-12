import React from "react";
//import "../../components/styleComponents.css";
import { useSelector } from "react-redux";
import gettoken from "../../token.js";
import { wsocketSendAcceptedOrNot } from "../../wsocket.js";
import { FormattedMessage } from "react-intl";

const ListVisitors = () => {
  const adminData = useSelector((state) => state.updateData.dashStats);
  var token = gettoken();
  console.log(token, "adminData");
  console.log(adminData.tobeaccepted, "ToBeApproved");
  var userslist = adminData.tobeaccepted;

  //let usernameList = [];
  //for (let i = 0; i < userslist.length; i++) {
  //  usernameList.push(userslist[i].Username);
 // }

  function acceptUser(evt) {
    var button = evt.target
    var itemSelected =evt.target.parentElement
    var usernameToWebSocket = itemSelected.parentElement.firstChild.id;

    var jsonVerify = {
      token: token,
      actionType: "acceptVisitor",
      username: usernameToWebSocket,
      acceptedOrNot: true,
    };

    wsocketSendAcceptedOrNot(jsonVerify);
    button.innerHTML = "Accepted";
button.style = "background-color:green"
     console.log(usernameToWebSocket);
     var button = evt.target
  }

  function declineUser(evt) {
    var button = evt.target
    var itemSelected =evt.target.parentElement
    var usernameToWebSocket  = itemSelected.parentElement.firstChild.id;
    var jsonVerify = {
      token: token,
      actionType: "acceptVisitor",
      username: usernameToWebSocket,
      acceptedOrNot: false,
    };


      console.log(evt.target)  
    wsocketSendAcceptedOrNot(jsonVerify);

    button.innerHTML = "Declined";
    button.style = "background-color:red"

  //  itemSelected.remove();
    console.log(usernameToWebSocket);
  }

  return (
    <div className="userList">
      <h2 className="userSelectTitle">  <FormattedMessage id={"userSelect"}/> </h2>
      <ul className="listOfVisitors">
        {userslist && userslist.length
          ? userslist.map((anObjectMapped) => {
              return (
                <div className="userListDIV" key={anObjectMapped.username}>
                  <li id={anObjectMapped.username} key={anObjectMapped.username} className="userListLI">
                    <img className="visitorImg" src={ anObjectMapped.picture}/>
                    <div className="visitorUsername" >
                    {anObjectMapped.username} 
                    </div>
                  </li>
                  
                  <div className="buttonsListVisitors">
                  <button className="acceptButton" onClick={acceptUser}>
                  <FormattedMessage id={"acceptUser"} />
                 
                  </button>
                  <button className="declineButton" onClick={declineUser}>
                  <FormattedMessage id={"declineButton"} />
            
                  </button>
                  </div>
                </div>
              );
            })
          : null}
      </ul>
    </div>
  );
};

export default ListVisitors;
