import { UPDATE_GENERALSTATS } from "../actionTypes";

//definir a estrutura inicial
const initStructure = {
    dashStats: {
      allKeywords: 0,
      mostRecentContent: [],
      mostRecentNews: [],
      mostRecentPublication: [],
      numNews: 0,
      numPublications: 0,
      numberOfAdmins: 0,
      numberOfMembers:0,
      numberOfVisitors:0,
      tobeaccepted:{}
    },
  };

const dataAdminDashBoard = (state = initStructure, action) => {
  switch (action.type) {
    case UPDATE_GENERALSTATS:
      console.log("UPDATE_GENERALSTATS");
      console.log(action);
      return {
        ...state,
        dashStats: {
          allKeywords: action.dataAdminStats.allKeywords,
          mostRecentContent:  action.dataAdminStats.mostRecentContent,
          mostRecentNews: action.dataAdminStats.mostRecentNews,
          mostRecentPublication:  action.dataAdminStats.mostRecentPublication,
          numNews:  action.dataAdminStats.numNews,
          numPublications:  action.dataAdminStats.numPublications,
          numberOfAdmins: action.dataAdminStats.numberOfAdmins,
          numberOfMembers: action.dataAdminStats.numberOfMembers,
          numberOfVisitors: action.dataAdminStats.numberOfVisitors,
          tobeaccepted:action.dataAdminStats.Tobeaccepted,
          },
       }; 

    default:
      return state;
  }
};

export default dataAdminDashBoard;

/*
const dataAdminDashBoard = (state  = "", action) => {
  console.log(state)
  console.log(action)
	switch (action.type) {
		case UPDATE_DATA:
      console.log(action.payload);
			return  {...state, payload: action.payload} //state.concat(action.payload)
		default:
			return state
	}
}

export default dataAdminDashBoard

/*const initialState = {
    dataAdminDashBoard: ""
  };

export default function(state = initialState, action) {
console.log(state);
console.log(action.payload)
  switch (action.type) {
    case UPDATE_DATA: {
      return {...state, 
        dataAdminDashBoard: action.payload}
               }
    default: {
      return state;
    }
  }
};*/
