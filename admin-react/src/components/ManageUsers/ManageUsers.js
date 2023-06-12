import React from "react";
//import "../../components/styleComponents.css";
import { useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import {
  getUsersRestApi,
  changeUserTypeRestApi,
  deleteUserRestApi,
} from "../../restApi";
import getoken, { getusername } from "../../token";

const ManageUsers = () => {
  const [userslist, setUsers] = useState([]);
  //var userslist = []
  const usernameAdmin = getusername();
  console.log(usernameAdmin, "usernameAdmin");
  useEffect(() => {
    getUsersRestApi(
      token,
      (usersFromDB) => {
        let userslist = usersFromDB;
        for (let i = 0; i < userslist.length; i++) {
          if (userslist[i].username == usernameAdmin) {
            console.log(i, "useeer");

            userslist.splice(i, 1);
          }
        }
        console.log(userslist);
        setUsers(userslist);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  var token = getoken();
  function deleteUser(evt) {
    var username = evt.target.parentElement.parentElement.id;
    var liUserDeleted = evt.target.parentElement.parentElement;
    var button = evt.target;
    var selector =  button.parentElement.children[0];
console.log(selector);
    deleteUserRestApi(
      token,
      username,
      () => {
        if (liUserDeleted.classList.contains("userDeleted")) {
          button.innerHTML = "Delete";
         
          selector.classList.remove("deactivate");
          button.classList.remove("userDeletedBtn");
          liUserDeleted.classList.remove("userDeleted");
        } else {
          selector.classList.add("deactivate");
          console.log(selector)
          button.innerHTML = "Restore";
          button.classList.add("userDeletedBtn");
          liUserDeleted.classList.add("userDeleted");
        }
      },
      (error) => console.log(error)
    );
  }

  function changeUserType(evt) {
    var userType = evt.target.value;
    var username = evt.target.parentElement.parentElement.id;
    //var usertype2 = userType.replace('"', '')
    console.log(username, token, userType, "INFO USER ");

    changeUserTypeRestApi(
      token,
      username,
      userType,
      () => (evt.target.value = userType),
      (error) => console.log(error)
    );
  }
  return (
    <div className="userList">
      <h2 className="userSelectTitle">
        {" "}
        <FormattedMessage id={"manageUsers"} />{" "}
      </h2>
      <ul className="manageMembers">
        {userslist && userslist.length
          ? userslist.map((anObjectMapped) => {
              if (anObjectMapped.deleted === false) {
                return (
                  <div className="DIVlistOfUsers">
                    <li
                      className="liUsersToManage"
                      key={anObjectMapped.username}
                      id={anObjectMapped.username}
                    >
                      <img
                        className="ImgUser"
                        src={anObjectMapped.pictureUrl}
                      />
                      <div className="visitorUsername">
                        {anObjectMapped.username}
                      </div>
                      <div className="selectUserDeleteButtonDIV">
                        <select
                          id="manageUserType"
                          onChange={changeUserType}
                          className="selectUserType"
                          value={anObjectMapped.userType}
                        >
                          <FormattedMessage id={"admin"}>
                            {(id) => (
                              <option className="option" value="admin">
                                {id}
                              </option>
                            )}
                          </FormattedMessage>
                          <FormattedMessage id={"member"}>
                            {(id) => (
                              <option className="option" value="member">
                                {id}
                              </option>
                            )}
                          </FormattedMessage>
                        </select>
                        <button
                          className="buttonTrashUsher"
                          onClick={deleteUser}
                        >
                          <FormattedMessage id={"delete"} />
                        </button>
                      </div>
                    </li>
                  </div>
                );
              } else {
                return (
                  <div className="DIVlistOfUsers">
                    <li
                      className="liUsersToManage userDeleted"
                      key={anObjectMapped.username}
                      id={anObjectMapped.username}
                    >
                      <img
                        className="ImgUser"
                        src={anObjectMapped.pictureUrl}
                      />
                      <div className="visitorUsername">
                        {anObjectMapped.username}
                      </div>
                      <div className="selectUserDeleteButtonDIV">
                        <select
                          id="manageUserType"
                          onChange={changeUserType}
                          className="selectUserType deactivate"
                          value={anObjectMapped.userType}
                        >
                          <FormattedMessage id={"admin"}>
                            {(id) => (
                              <option className="option" value="admin">
                                {id}
                              </option>
                            )}
                          </FormattedMessage>
                          <FormattedMessage id={"member"}>
                            {(id) => (
                              <option className="option" value="member">
                                {id}
                              </option>
                            )}
                          </FormattedMessage>
                        </select>
                        <button
                          className="buttonTrashUsher userDeletedBtn"
                          onClick={deleteUser}
                        >
                          <FormattedMessage id={"restore"} />
                        </button>
                      </div>
                    </li>
                  </div>
                );
              }
            })
          : null}
      </ul>
    </div>
  );
};

export default ManageUsers;
