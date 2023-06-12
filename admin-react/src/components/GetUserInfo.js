import React from "react";
import "./home.css";
import { useState, useEffect } from "react";
import { getUserTokenAPI } from "../restApi";
import { getusername } from "../token.js";
import { FormattedMessage } from "react-intl";

var token;
var username = getusername();
console.log(username);
export default function GetUsers() {
 

  const [user, saveUserToken] = useState();
  useEffect(() => {
    getUserTokenAPI(
      username,
      (usersInfo) => {
        let user = usersInfo;
        username = user.firstName + " " + user.lastName;
        token = user.token;
        saveUserToken(user);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  return (
    <div className="userGreeting">
      <h2 className="userGreeting">
      {" "}
          <FormattedMessage id={"greeting"} />{" "}

    {username}
      </h2>
    </div>
  );
}

/*const mapStateToProps = (state) => {
  return { username: state.user_Selection.username };
};


export default connect(mapStateToProps, { userSelected })(GetUsers);*/
