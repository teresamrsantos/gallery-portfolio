import { combineReducers } from "redux";
import updateData from "./updateData"
import language from "./languageReducer"


export default combineReducers({  updateData, language});
