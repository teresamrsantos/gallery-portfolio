import { updateStatsAdmin } from "./Redux/actions";
import { socket } from "./index";
import gettoken from "./token";

const token = gettoken();
console.log("token");
console.log(token);
export var socketConnected = false;

const setupSocket = (dispatch, tokenJson) => {
  console.log("Aquiii connectWSocket");
  const socket = new WebSocket("ws://localhost:8080/DataServer_Proj5/wsocket");

  socket.onopen = () => {
    socket.send(JSON.stringify(tokenJson));
  };

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("SOCKET DATA");
    console.log(data);
    socketConnected = true;

    dispatch(updateStatsAdmin(data));
  };
  return socket;
};

export function wsocketSendAcceptedOrNot(jsonObject) {
  console.log("at sendUsername");
  console.log(jsonObject);
  if (socketConnected === true) {
    socket.send(JSON.stringify(jsonObject));
  }
}

export default setupSocket;

/*UserStats:
activitiesFinishedOverDeadline: 1
findActivitiesUnfinished: 2
nextActivities: 0
totalActivitiesFinished: 3
totalNumberActivities: 5 */

//"{\"AdminDashboard\":{\"AverageActivities\":1,\"PiechartStats\":[{\"AllOpenActivities\":3,\"OverDeadline\":0,\"AllClosedActivities\":0}],\"NumberOfUsers\":3,\"LineGraphStats\":[{\"2022-04-05\":1,\"2022-04-03\":2}]}}
// dispatch(receiveData(data.AdminDashboard.AverageActivities, data.AdminDashboard.NumberOfUsers))
