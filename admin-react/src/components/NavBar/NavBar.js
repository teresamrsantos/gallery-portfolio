import React from "react";
import "./navbar.css";
import store from "../../Redux/store";
import { FormattedMessage } from "react-intl";
import { languageControler } from "../../Redux/actions";
import { getusername } from "../../token";
import { useSelector } from "react-redux";

const NavBar = () => {
  const username = getusername();
  var urlID = new URLSearchParams();

  const locale = useSelector((state) => state.language.language);
  console.log(locale, "LANGUAGE");

  function changeLanguage(evt) {
    var lingo = evt.target.value;
    var myJson = {
      language: lingo,
    };
    store.dispatch(languageControler(myJson));
  }

  function callUrlToGoBack(evt) {
    var whereTo = evt.target.value;

    urlID.append("username", username);
    urlID.append("lingo", locale);

    switch (whereTo) {
      case "home":
        window.location.href = "/src/main/webapp/index.html?" + urlID.toString();
        break;
      case "project":
        window.location.href = "/src/main/webapp/publicProjects.html?" + urlID.toString();
        break;
      case "ourTeam":
        window.location.href = "/src/main/webapp/ourTeam.html?" + urlID.toString();
        break;
      case "addProject":
        window.location.href = "/src/main/webapp/addProject.html?" + urlID.toString();
        break;
      case "myprojects":
        window.location.href = "/src/main/webapp/listUserProjects.html?" + urlID.toString();
        break;
      case "addNews":
        window.location.href = "/src/main/webapp/addNews.html?" + urlID.toString();
        break;
      case "myNews":
        window.location.href = "/src/main/webapp/listUsersNews.html?" + urlID.toString();
        break;
    }
  }

  return (
    <div>
      <nav id="navbar">
        <div className="logo">LoremIpsum</div>
        <div className="nav-items">
          <button
            className="buttonNav homeBtn"
            value="home"
            onClick={callUrlToGoBack}
          >
            <FormattedMessage id={"home"} />
          </button>

          <button
            className="buttonNav ourProjectsBtn"
            value="project"
            onClick={callUrlToGoBack}
          >
            <FormattedMessage id={"projects"} />
          </button>

          <button
            className="buttonNav ourTeamBtn"
            value="ourTeam"
            onClick={callUrlToGoBack}
          >
            <FormattedMessage id={"ourTeam"} />
          </button>

          <div className=" dropdownUser">
            <button className="buttonNav userNavBtn">
              <FormattedMessage id={"myaccount"} />
            </button>

            <div className="dropdown-contentUser" id="dropdown-contentUser">
              <button
                className="buttonUser addProject"
                onClick={callUrlToGoBack}
                value="addProject"
              >
                <FormattedMessage id={"addProject"} />
              </button>

              <button
                className="buttonUser myProjects"
                onClick={callUrlToGoBack}
                value="myProjects"
              >
                <FormattedMessage id={"myProjects"} />
              </button>

              <button
                className="buttonUser addNews"
                onClick={callUrlToGoBack}
                value="addNews"
              >
                <FormattedMessage id={"addNews"} />
              </button>

              <button
                className="buttonUser myNews"
                value="myNews"
                onClick={callUrlToGoBack}
              >
                <FormattedMessage id={"myNews"} />
              </button>

              <button className="buttonAdmin">
                <FormattedMessage id={"adminButton"} />
              </button>
            </div>
          </div>
        </div>

        <div className="dropdown">
          <button className="dropbtn">
            <i className="fa fa-globe" aria-hidden="true"></i>
          </button>
          <div
            className="dropdown-content"
            onClick={changeLanguage}
            id="dropdown-content"
          >
            <button name="lang" className="en" value="en">
              <img
                src="https://raw.githubusercontent.com/lipis/flag-icons/c1efa9d9a94d62a4da54916f4061cbf9bbadff1d/flags/4x3/gb.svg"
                alt=""
              />
            </button>
            <button name="lang" className="pt" value="pt">
              <img
                src="https://raw.githubusercontent.com/lipis/flag-icons/c1efa9d9a94d62a4da54916f4061cbf9bbadff1d/flags/4x3/pt.svg"
                alt=""
              />
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
