import * as actionTypes from "./actionTypes";

export const updateStatsAdmin = (dataAdminStats) => ({
  type: actionTypes.UPDATE_GENERALSTATS, //UPDATEADMIN
  dataAdminStats,
  //dataAdminStats:dataAdminStats
});

export const languageControler = (lingo) => ({
  type: actionTypes.CONTROL_LANGUAGE, //UPDATEADMIN
  lingo,
  //dataAdminStats:dataAdminStats
});