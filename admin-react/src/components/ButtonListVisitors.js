import React from "react";
import "./home.css";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const ButtonListVisitors = () => {

  return (
    <div className="ButtonListVisitorsDIV">
      <Link to="/listVisitors">
        <button className="buttonAccept" type="button">
          <FormattedMessage id={"acceptRegistragions"} />
        </button>
      </Link>
    </div>
  );
};

export default ButtonListVisitors;
