import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import store from "./Redux/store";
import { Provider } from "react-redux";
import gettoken from "./token";
import setupSocket from "./wsocket";


/******* USERNAME USER *******/

var token = gettoken();
var jsonVerify = {
  token: token,
  actionType: "stats",
};

console.log(jsonVerify, "json - Index");
export const socket = setupSocket(store.dispatch, jsonVerify);

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById("root")
);
