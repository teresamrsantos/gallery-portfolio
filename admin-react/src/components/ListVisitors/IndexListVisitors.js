import React from "react";
import ListVisitors from "./ListVisitors";
import ButtonGoBack from "./ButtonGoBack";

const IndexListVisitors = () => {
  return (

    
    <div className="listVisitorsContainer">
      <ButtonGoBack />

      <div className="listVisitors">
        <ListVisitors />
      </div>
    </div>
  );
};

export default IndexListVisitors;
