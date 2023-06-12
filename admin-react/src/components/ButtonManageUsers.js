import React from "react";
import "./home.css";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const ButtonManageUsers = () => {

  return (

    <div className="ButtonManageUsersDIV">
    <Link to="/manageUsers">
      <button className="buttonAccept" type="button">
        <FormattedMessage id={"manageUsers"} />
      </button>
    </Link>
  </div>
  
  );
};



export default ButtonManageUsers;
