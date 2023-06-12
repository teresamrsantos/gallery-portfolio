import store from "./Redux/store";
import {languageControler} from "./Redux/actions" 


let urlSearch = new URLSearchParams(window.location.search);

//var token = "123";
//var username = "tsantos";
//var lingo = null;

var token = urlSearch.get("token");
var username = urlSearch.get("username");
var lingo = urlSearch.get("lingo");

export default function gettoken() {
  return token;
}

export function getusername() {
  return username;
}

//
//?lingo=pt&username=tsantos&token=67dadb36-04c3-4ed0-b247-92001292c28d

//Lingo Default
if(lingo==null || lingo == undefined){
  lingo = "en";
}
var myJson = {
    language: lingo,
};
store.dispatch(languageControler(myJson));

