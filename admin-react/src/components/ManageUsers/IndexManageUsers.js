import React from "react";
import ButtonGoBack from "../ListVisitors/ButtonGoBack";
import ManageUsers from "./ManageUsers";
import "./manageUsers.css"

const IndexManageUsers = () => {
  return (
    <div className="manageUsersContainer">
    <ButtonGoBack />


      <div className="manageUsers">
        <ManageUsers />
      </div>
    </div>
  );
};

export default IndexManageUsers;