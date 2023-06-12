import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import "./listVisitors.css";

const ButtonGoBack = () => {
  return (
    <div className="ButtonGoBack">
      <Link to="/">
        <button className="buttonGoBack" type="button"> <FormattedMessage id={"backToDashboard"}/></button>
      </Link>
    </div>
  );
};

export default ButtonGoBack;
