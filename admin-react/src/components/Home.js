import React from "react";
import "./home.css";
import FeaturedInfo from "./featuredinfo/FeaturedInfo";
import ButtonListVisitors from "./ButtonListVisitors";
import ButtonManageUsers from "./ButtonManageUsers";
import GetUsers from "./GetUserInfo";
import { FormattedMessage } from "react-intl";

const Home = () => {
  return (
    <div className="dashboardContainer">
      <div
        class="mySlides"
       >
        <img class="imgSlideShow" />
        <div class="textSlides">
          <h1 className="adminsDashboardTitle">
            <FormattedMessage id={"adminsDashboard"} />
          </h1>
        </div>
      </div>

      <GetUsers />
      <div className="home"></div>

      <ButtonListVisitors />
      <ButtonManageUsers />
      <FeaturedInfo />
    </div>
  );
};

export default Home;
