import { CONTROL_LANGUAGE } from "../actionTypes";

//definir a estrutura inicial
const initStructure = {
    language:  "en" ,
  };

const language = (state = initStructure, action) => {
  switch (action.type) {
    case CONTROL_LANGUAGE:
      console.log("CONTROL_LANGUAGE");
      console.log(action.lingo.language);
      return {
        ...state,
        language:  action.lingo.language ,
       }; 

    default:
      return state;
  }
};

export default language;
