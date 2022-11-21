const API_URL = "https://" + window.base_url + "/apiv3/";
const API_URL_IMAGE = "{https://rumine.ca/_apiv2/media/artwork/upload}";

//Networking
export const apiCall = async function(endpoint, data){
  var formBody = [];
  for (var property in data) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(data[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return fetch(API_URL + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    },
    body: formBody,
  }).then((response) => response.json())
    .then((responseJson) => {
      //error handling
      if(responseJson != null && responseJson.status === 500){
        alert("There seems to be a server error, please try again later.");
      }

      return responseJson;
  })
  .catch((error) => {
    alert("We're sorry, there seems to be an error. Please try again later.")
  });
}

//Networking
export const imageUpload = async function(data){
  var fd = new FormData();
  fd.append("imageFile", data)
  return fetch(API_URL_IMAGE, {
    method: 'POST',
    headers: {
      'Accept': 'application/json'
    },
    body: fd,
  }).then((response) => response.json())
    .then((responseJson) => {
      //error handling
      if(responseJson != null && responseJson.status === 500){
        alert("There seems to be a server error, please try again later.");
      }

      return responseJson;
  })
  .catch((error) => {
    alert("We're sorry, there seems to be an error. Please try again later.")
  });
}
