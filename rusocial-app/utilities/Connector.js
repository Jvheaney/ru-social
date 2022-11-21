import GLOBAL from '../global';
import AsyncStorage from '@react-native-community/async-storage';

//Environment
const apiURL = "https://rumine.ca/_apiv2/"; //test

//Image
const imageURL = "https://rumine.ca/_i/s/i.php?i=";

//Async saving
const _storeData = async (key, value) => {
  try {
    var keyToSave = "@" + key;
    await AsyncStorage.setItem(keyToSave, value)
  } catch (e) {
    // saving error
  }
}

//Networking

const remoteDebug = async function(message){
  var formdata = new FormData();
  formdata.append("message", message);
  return fetch(apiURL + "/debug", {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data;'
    },
    body: formdata,
  })
  .catch((error) => {
    console.log(error);
  });
}

const apiCall = async function(endpoint, data){
  if(endpoint != "/a/c" && endpoint != "/a/s"){
    data.append("token", GLOBAL.authToken);
  }

  return fetch(apiURL + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data;'
    },
    body: data,
  }).then((response) => response.json())
    .then((responseJson) => {
      //error handling
      if(responseJson.status === 500){
        alert("There seems to be a server error, please try again later.");
      }

      //handle the token here
      if(responseJson.token != null && responseJson.token != "NA"){
        GLOBAL.authToken = responseJson.token;
        _storeData("authToken", responseJson.token);
      }

      return responseJson;
  })
  .catch((error) => {
    console.log(error);
    if(endpoint != "/gw/sync"){
      alert("We're sorry, there seems to be an error. Please try again later.")
    }
  });
}

module.exports = {apiCall, imageURL, remoteDebug};
