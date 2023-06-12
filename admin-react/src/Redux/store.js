//import { configureStore } from "@reduxjs/toolkit";
import { createStore } from "redux";
import rootReducer from "./reducers";

//export default configureStore(rootReducer);
export default createStore(rootReducer);