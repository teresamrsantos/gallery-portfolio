const generalPath = "http://localhost:8080/DataServer_Proj5/rest/";


/***************** GET USER TOKEN API ***************/

export async function getUserTokenAPI(username, onSuccess, onError) {
  var fetchProperties = {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  };

  await fetch(generalPath + "users/token/" + username, fetchProperties)
    .then(function (response) {
      console.log(response.status);
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.status + ": " + response.statusText);
      }
    })
    .then(function (json) {
      console.log(json);
      onSuccess(json);
    })
    .catch(function (error) {
      console.log("error on getUserProfileAPI: " + error);
      onError(error);
    });
}

/***************** GET USERS API ***************/

export async function getUsersRestApi(token, onSuccess, onError) {
  var fetchProperties = {
    method: "GET",
    headers: { token, "Content-Type": "application/json" },
  };

  await fetch(generalPath + "users/deletedOurTeam", fetchProperties)
    .then(function (response) {
      console.log(response.status);
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.status + ": " + response.statusText);
      }
    })
    .then(function (json) {
      console.log(json);
      onSuccess(json);
    })
    .catch(function (error) {
      console.log("error on getUserProfileAPI: " + error);
      onError(error);
    });
}

/***************** CHANGE USER TYPE API ***************/

export async function changeUserTypeRestApi(token, username, usertype, onSuccess, onError, ) {
var url =generalPath + "users/usertype/"+username;
  var fetchProperties = {
    method: "POST",
    headers: { token, "Content-Type": "application/json" },
    body: '"'+usertype+'"',
  }
  await fetch(url, fetchProperties)
    .then(function (response) {
      console.log(response.status);
      if (response.ok) {
        return response;
      } else {
        throw Error(response.status + ": " + response.statusText);
      }
    })
    .then(function (json) {
      console.log(json);
      onSuccess(json);
    })
    .catch(function (error) {
      console.log("error on getUserProfileAPI: " + error);
      onError(error);
    });
}


/***************** ELIMINAR/RESTAURAR USER API ***************/

export async function deleteUserRestApi(token, username, onSuccess, onError, ) {
  var url =generalPath + "users/deleteUser/" + username;
  /*console.log(url,"url");
  console.log(username, "username")
  console.log(usertype, "usertype")
  console.log(token, "token")*/
    var fetchProperties = {
      method: "POST",
      headers: { token, "Content-Type": "application/json" },
    }
    await fetch(url, fetchProperties)
      .then(function (response) {
        console.log(response.status);
        if (response.ok) {
          return response;
        } else {
          throw Error(response.status + ": " + response.statusText);
        }
      })
      .then(function (json) {
        console.log(json);
        onSuccess(json);
      })
      .catch(function (error) {
        console.log("error on getUserProfileAPI: " + error);
        onError(error);
      });
  }