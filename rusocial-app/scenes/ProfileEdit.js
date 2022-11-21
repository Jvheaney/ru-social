import React, {Component} from 'react';
import { Keyboard, TouchableWithoutFeedback, ActivityIndicator, KeyboardAvoidingView, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import GLOBAL from '../global.js';
import interests from '../interests.js';
import badges from '../badges.js';
import { Actions } from 'react-native-router-flux';
import { Dialog } from 'react-native-simple-dialogs';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';
import ImagePicker2 from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from "react-native-raw-bottom-sheet";
import { WebView } from 'react-native-webview';

import { AutoDragSortableView } from 'react-native-drag-sort';

import ProfileBadge from '../components/ProfileBadge';
import SpotifyBubble from '../components/SpotifyBubble';
import InterestBubble from '../components/InterestBubble';
import ProfileImage from '../components/ProfileImage';

import Loading from '../components/Loading';

//import Dialog from "react-native-dialog";

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcon from 'react-native-vector-icons/EvilIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import FastImage from 'react-native-fast-image'

import navlogo from '../assets/images/NBF.png';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

let gotArtistData = false;
let interestInput = "";
let active_images_editable = [];

const options = {
  title: 'Select Image',
  quality: 0.5,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class Swipe extends Component {

  // Dialog Types
  // Name/Age 0
  // Program/Year 1
  // Bio 2
  // Caption 3
  // Story 4
  // Looking For 5

  // CaptionNum
  // First picture 0
  // Second picture 1
  // Third picture 2

  componentDidMount(){
    this.getMe();
  }

  componentWillUnmount() {
    gotArtistData = false;
    active_images_editable = [];
  }

  state = {
    image_loading: [false, false, false, false],
    images: [],
    dialogVisible: false,
    dialogTitle: "Edit Name/Age",
    dialogType: 0,
    captionNum: 0,
    nameToSave: "",
    lastnameToSave: "",
    birthdateToSave: "",
    programToSave: "",
    yearToSave: "",
    pronounsToSave: "",
    lookingForToSave: "",
    bioToSave: "",
    caption0ToSave: "",
    caption1ToSave: "",
    caption2ToSave: "",
    storyHeadlineToSave: "",
    storyToSave: "",
    picture0: "",
    picture1: "",
    picture2: "",
    picture3: "",
    profile: {},
    programsToPick: [],
    picture0Loading: false,
    picture1Loading: false,
    picture2Loading: false,
    picture3Loading: false,
    isCropLoading: false,
    imageIndex: 0,
    spotifyLoading: true,
    temp_spotifyData: [],
    addedInterests: {},
    addedBadges: {},
    images_editable: []
  }

  fromArrayToObject = (array) => {
    if(array === undefined){
      return {};
    }
    var data = JSON.parse(array);
    var obj = {};
    for(var i = 0; i<data.length; i++){
      obj[data[i]] = true;
    }
    return obj;
  }

  getMe = () => {
    this.setState({
      profile: GLOBAL.profile,
      images: (GLOBAL.profile.image3 == undefined)?(GLOBAL.profile.image2 == undefined)?(GLOBAL.profile.image1 == undefined)?[GLOBAL.profile.image0]:[GLOBAL.profile.image0, GLOBAL.profile.image1]:[GLOBAL.profile.image0, GLOBAL.profile.image1, GLOBAL.profile.image2]:[GLOBAL.profile.image0, GLOBAL.profile.image1, GLOBAL.profile.image2, GLOBAL.profile.image3],
      images_editable: [GLOBAL.profile.image0, GLOBAL.profile.image1, GLOBAL.profile.image2, GLOBAL.profile.image3],
      nameToSave: GLOBAL.profile.firstname_display,
      lastnameToSave: GLOBAL.profile.lastname,
      birthdateToSave: GLOBAL.profile.birthdate,
      programToSave: GLOBAL.profile.program,
      yearToSave: GLOBAL.profile.year,
      pronounsToSave: GLOBAL.profile.pronouns,
      lookingForToSave: GLOBAL.profile.lookingFor,
      bioToSave: GLOBAL.profile.bio,
      caption0ToSave: GLOBAL.profile.caption0,
      caption1ToSave: GLOBAL.profile.caption1,
      caption2ToSave: GLOBAL.profile.caption2,
      storyHeadlineToSave: GLOBAL.profile.storyHeadline,
      storyToSave: GLOBAL.profile.story,
      addedInterests: this.fromArrayToObject(GLOBAL.profile.interests),
      addedBadges: this.fromArrayToObject(GLOBAL.profile.badges)
    })
    active_images_editable = [GLOBAL.profile.image0, GLOBAL.profile.image1, GLOBAL.profile.image2, GLOBAL.profile.image3];
  }

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
    } catch (e) {
      // saving error
    }
  }

  uploadPicture = (source, index) => {


    var fd = new FormData();
    fd.append("token", GLOBAL.authToken)
    fd.append("imageFile", source)

  /*var details = {
    "token": GLOBAL.authToken,
    "media": source
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");*/
  return fetch('https://rumine.ca/_apiv2/media/upload', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      'Accept': 'application/json'
    },
    body: fd,
    }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson == "logout"){
          Actions.replace("login");
        }
        else if(responseJson.status == "dataerror"){
          if(responseJson.token != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          alert("There was an error with this image. Please select another.");
        }
        else{
          if(responseJson.status == "wrongdata"){
            if(responseJson.token != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            alert("There was an error, please restart the app.");
          }
          else {
            if(responseJson.token != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            var images = this.state.images_editable;
            var arr = this.state.image_loading;
            arr[index] = false;
            images[index] = responseJson.status;
            active_images_editable[index] = responseJson.status;
            this.setState({
              images_editable: images,
              image_loading: arr
            });
          }
        }
    })
    .catch((error) => {
      console.log(error);
      var arr = this.state.image_loading;
      arr[index] = false;
      this.setState({
        image_loading: arr
      });
      alert("We're sorry, there seems to be an error. Please try again later.")
    });

  }

  cropPicture = (source, index) => {
    ImagePicker2.openCropper({
      path: source.path,
      width: 1200,
      height: 2000,
    }).then(image => {
      this.uploadPicture({
        uri: image.path,
        type: image.mime,
        name: image.filename || `filename1.jpg`,
      }, index);
    })
    .catch(error => {
      console.log(error);
      var arr = this.state.image_loading;
      arr[index] = false;
      this.setState({
        image_loading: arr
      })
      alert("There was an issue with cropping this image, or you cancelled the cropping.");
    });
  }

  selectPicture = (index) => {
    var arr = this.state.image_loading;
    arr[index] = true;
    this.setState({
      image_loading: arr
    })
    var pass = this;
    ImagePicker2.openPicker({
      mediaType: "photo",
      compressImageQuality: 0.8,
      forceJpg: true
    }).then(response => {
        pass.cropPicture(response, index)
    }).catch(error => {
      console.log(error);
      var arr = this.state.image_loading;
      arr[index] = false;
      this.setState({
        image_loading: arr
      })
      alert("There was an issue with selecting this image, or you cancelled the selection.");
    });
  }

  showNameAge = () => {
    this.setState({
      dialogVisible: true,
      dialogTitle: "Edit Name/Age",
      dialogType: 0
    })
  }

  showProgramYear = () => {
    if(this.state.programsToPick.length == 0){
      this.getPrograms();
    }
    this.setState({
      dialogVisible: true,
      dialogTitle: "Edit Program/Year",
      dialogType: 1
    })
  }

  showBio = () => {
    this.setState({
      dialogVisible: true,
      dialogTitle: "Edit Bio",
      dialogType: 2
    })
  }

  showPronounLooking = () => {
    this.setState({
      dialogVisible: true,
      dialogTitle: "Edit Pronouns/Looking For",
      dialogType: 5
    })
  }

  showCaption = (num) => {
    if(num == 0){
      if(this.state.profile.picture1 != ""){
        this.setState({
          dialogVisible: true,
          dialogTitle: "Edit Caption",
          dialogType: 3,
          captionNum: num
        })
      }
      else{
        alert("You must upload a picture before adding a caption.");
      }
    }
    else if(num == 1){
      if(this.state.profile.picture2 != ""){
        this.setState({
          dialogVisible: true,
          dialogTitle: "Edit Caption",
          dialogType: 3,
          captionNum: num
        })
      }
      else{
        alert("You must upload a picture before adding a caption.");
      }
    }
    else if(num == 2){
      if(this.state.profile.picture3 != ""){
        this.setState({
          dialogVisible: true,
          dialogTitle: "Edit Caption",
          dialogType: 3,
          captionNum: num
        })
      }
      else{
        alert("You must upload a picture before adding a caption.");
      }
    }

  }

  showStory = () => {
    this.setState({
      dialogVisible: true,
      dialogTitle: "Edit Story",
      dialogType: 4
    })
  }

  _handleNameChange = (name) => {
    this.setState({
      nameToSave: name
    })
  }

  _handleLastnameChange = (name) => {
    this.setState({
      lastnameToSave: name
    })
  }

  _handleBio = (bio) => {
    this.setState({
      bioToSave: bio
    })
  }

  cleanSmartPunctuation = (value) => {
    if(value != null){
      return value.replace(/[‘]/g, "'").replace(/[‛]/g, "'").replace(/[“]/g, '"').replace(/[‟]/g, '"').replace(/[’]/g, "'").replace(/[”]/g, '"').replace(/[′]/g, "'").replace(/[″]/g, '"').replace(/[‵]/g, "'").replace(/[‶]/g, '"').replace(/[—]/g, '-').replace(/[–]/g, '-')
    }
    else{
      return "";
    }
  }

  saveChanges = () => {
    if(this.state.dialogType == 0){

      if(this.state.nameToSave == null || this.state.nameToSave.length == 0 || this.state.lastnameToSave == null || this.state.lastnameToSave.length == 0 || this.state.birthdateToSave == null){
        alert("You must fill in all profile fields.");
        return;
      }

      var sanitized_fn = this.cleanSmartPunctuation(this.state.nameToSave).replace(/[`~!@#$%^&*()_|+=?;:",.<>\{\}\[\]\\\/]/gi, '').replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();
      var sanitized_ln = this.cleanSmartPunctuation(this.state.lastnameToSave).replace(/[`~!@#$%^&*()_|+=?;:",.<>\{\}\[\]\\\/]/gi, '').replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();

      if(sanitized_fn.length == 0 || sanitized_ln.length == 0){
        alert("Special characters are not allowed in the name fields.");
        return;
      }

      //name and year
      var details = {
        "token": GLOBAL.authToken,
        "firstname_display": sanitized_fn,
        "lastname": sanitized_ln,
        "birthdate": this.state.birthdateToSave
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/up/eflna', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody,
      }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson == "logout"){
            this.closeDialog();
            Actions.replace("login");
          }
          else if(responseJson.status == "server-error"){
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            alert("There was an error, please try again later.")
          }
          else{
            if(responseJson.status == "wrongdata"){
              if(responseJson.token != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              alert("There was an error changing your profile.");
            }
            else if(responseJson.status == "success"){
              if(responseJson.token != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
                var profile = this.state.profile;
                profile.firstname_display = sanitized_fn;
                profile.birthdate = this.state.birthdateToSave;
                profile.lastname = sanitized_ln;
                GLOBAL.profile.firstname_display = sanitized_fn;
                GLOBAL.profile.birthdate = this.state.birthdateToSave;
                GLOBAL.profile.lastname = sanitized_ln;
                try{
                  GLOBAL.friends.lastname = sanitized_ln;
                  GLOBAL.friends.birthdate = this.state.birthdateToSave;
                  this._storeData("friends-me", JSON.stringify(GLOBAL.friends));
                }
                catch(e) {
                  console.log(e);
                }
                this._storeData("me", JSON.stringify(profile));
                this.setState({
                  profile: profile
                });
                this.closeDialog();
            }
          }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
    }
    else if(this.state.dialogType == 1){

      if(this.state.programToSave == null || this.state.programToSave.length == 0 || this.state.yearToSave == null || this.state.yearToSave.length == 0){
        alert("You must fill in all profile fields.");
        return;
      }

      //prog/year
      var details = {
        "token": GLOBAL.authToken,
        "program": this.state.programToSave,
        "year": this.state.yearToSave
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/up/epy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody,
      }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson == "logout"){
            this.closeDialog();
            Actions.replace("login");
          }
          else if(responseJson.status == "server-error"){
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            alert("There was an error, please try again later.")
          }
          else{
            if(responseJson.status == "wrongdata"){
              if(responseJson.token != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              alert("There was an error changing your profile.");
            }
            else if(responseJson.status == "success"){
              if(responseJson.token != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
                var profile = this.state.profile;
                profile.program = this.state.programToSave;
                profile.year = this.state.yearToSave;
                GLOBAL.profile.program = this.state.programToSave;
                GLOBAL.profile.year = this.state.yearToSave;
                if(GLOBAL.friends == null || GLOBAL.friends == undefined){
                  GLOBAL.friends = {};
                }
                GLOBAL.friends.program = this.state.programToSave;
                GLOBAL.friends.year = this.state.yearToSave;
                this._storeData("me", JSON.stringify(profile));
                this._storeData("friends-me", JSON.stringify(GLOBAL.friends));
                this.setState({
                  profile: profile
                });
                this.closeDialog();
            }
          }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
    }
    else if(this.state.dialogType == 5){

      if(this.state.pronounsToSave == null || this.state.pronounsToSave.length == 0 || this.state.lookingForToSave == null || this.state.lookingForToSave.length == 0){
        alert("You must fill in all profile fields.");
        return;
      }

      //pronouns/lookingfor
      var details = {
        "token": GLOBAL.authToken,
        "pronouns": this.cleanSmartPunctuation(this.state.pronounsToSave),
        "lookingfor": this.state.lookingForToSave
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/up/eplf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody,
      }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson == "logout"){
            this.closeDialog();
            Actions.replace("login");
          }
          else if(responseJson.status == "server-error"){
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            alert("There was an error, please try again later.")
          }
          else{
            if(responseJson.status == "wrongdata"){
              if(responseJson.token != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              alert("There was an error changing your profile.");
            }
            else if(responseJson.status == "success"){
              if(responseJson.token != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              var profile = this.state.profile;
              profile.pronouns = this.state.pronounsToSave;
              profile.lookingFor = this.state.lookingForToSave;
              GLOBAL.profile.pronouns = this.state.pronounsToSave;
              if(GLOBAL.friends == null || GLOBAL.friends == undefined){
                GLOBAL.friends = {};
              }
              GLOBAL.friends.pronouns = this.state.pronounsToSave;
              GLOBAL.profile.lookingFor = this.state.lookingForToSave;
              this._storeData("me", JSON.stringify(profile));
              this._storeData("friends-me", JSON.stringify(GLOBAL.friends));
              this.setState({
                profile: profile
              });
              this.closeDialog();
            }
          }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
    }
    else if(this.state.dialogType == 2){
      //bio
      var details = {
        "token": GLOBAL.authToken,
        "bio": this.cleanSmartPunctuation(this.state.bioToSave)
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/up/eb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody,
      }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson == "logout"){
            this.closeDialog();
            Actions.replace("login");
          }
          else if(responseJson.status == "server-error"){
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            alert("There was an error, please try again later.")
          }
          else{
            if(responseJson.status == "wrongdata"){
              if(responseJson.token != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              alert("There was an error changing your profile.");
            }
            else if(responseJson.status == "success"){
              if(responseJson.token != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
                var profile = this.state.profile;
                profile.bio = this.state.bioToSave;
                GLOBAL.profile.bio = this.state.bioToSave;
                this._storeData("me", JSON.stringify(profile));
                this.setState({
                  profile: profile
                });
                this.closeDialog();
            }
          }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
    }
    else if(this.state.dialogType == 3){
      //captions
      if(this.state.captionNum == 0){
        var num = 0;
        var cap = this.state.caption0ToSave;
        var details = {
          "token": GLOBAL.authToken,
          "caption0": this.cleanSmartPunctuation(cap),
          "captionNum": 0
          };
      }
      else if(this.state.captionNum == 1){
        var num = 1;
        var cap = this.state.caption1ToSave
        var details = {
          "token": GLOBAL.authToken,
          "caption1": this.cleanSmartPunctuation(cap),
          "captionNum": 1
          };
      }
      else if(this.state.captionNum == 2){
        var num = 2;
        var cap = this.state.caption2ToSave;
        var details = {
          "token": GLOBAL.authToken,
          "caption2": this.cleanSmartPunctuation(cap),
          "captionNum": 2
          };
      }
        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/up/ec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody,
      }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson == "logout"){
            this.closeDialog();
            Actions.replace("login");
          }
          else if(responseJson.status == "server-error"){
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            alert("There was an error, please try again later.")
          }
          else{
            if(responseJson.status == "wrongdata"){
              if(responseJson.token != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              alert("There was an error changing your profile.");
            }
            else if(responseJson.status == "success"){
              if(responseJson.token != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
                var profile = this.state.profile;
                if(num == 0){
                  profile.caption0 = cap;
                  GLOBAL.profile.caption0 = cap;
                }
                else if(num == 1){
                  profile.caption1 = cap;
                  GLOBAL.profile.caption1 = cap;
                }
                else {
                  profile.caption2 = cap;
                  GLOBAL.profile.caption2 = cap;
                }
                this._storeData("me", JSON.stringify(profile));
                this.setState({
                  profile: profile
                });
                this.closeDialog();
            }
          }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
    }
    else if(this.state.dialogType == 4){
      //story/headline
      var details = {
        "token": GLOBAL.authToken,
        "storyheadline": this.cleanSmartPunctuation(this.state.storyHeadlineToSave),
        "story": this.cleanSmartPunctuation(this.state.storyToSave)
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/up/es', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody,
      }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson == "logout"){
            this.closeDialog();
            Actions.replace("login");
          }
          else if(responseJson.status == "server-error"){
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            alert("There was an error, please try again later.")
          }
          else{
            if(responseJson.status == "wrongdata"){
              if(responseJson.token != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              alert("There was an error changing your profile.");
            }
            else if(responseJson.status == "success"){
              if(responseJson.token != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
                var profile = this.state.profile;
                profile.storyHeadline = this.state.storyHeadlineToSave;
                GLOBAL.profile.storyHeadline = this.state.storyHeadlineToSave;
                profile.story = this.state.storyToSave;
                GLOBAL.profile.story = this.state.storyToSave;
                this._storeData("me", JSON.stringify(profile));
                this.setState({
                  profile: profile
                });
                this.closeDialog();
            }
          }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
    }
  }

  cancelChanges = () => {
    this.closeDialog();
    this.setState({
      dialogVisible: false
    });
  }

  getCurrentDate = () => {
    var currentDate = new Date();
    currentDate.setDate( currentDate.getDate() );
    currentDate.setFullYear( currentDate.getFullYear() - 18 );
    return currentDate;
  }

  _handleBirthdate = (date) => {
    this.setState({
      birthdateToSave: date
    });
  }

  _handleProgram = (value) => {
    this.setState({
      programToSave: value
    })
  }

  _handleYear = (value) => {
    this.setState({
      yearToSave: value
    })
  }

  getAge = () => {
    var date1 = new Date(this.state.profile.birthdate);
    var date2 = new Date();
    var diffTime = Math.abs(date2 - date1);
    var diff = Math.floor(diffTime / (1000 * 60 * 60 * 24) / 365);
    return diff;
  }

  getPrograms =() => {
    var details = {
      "token": GLOBAL.authToken
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/up/gp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody,
    }).then((response) => response.json())
    .then((responseJson) => {
      if(responseJson.status == "server-error"){
        if(responseJson['token'] != "NA"){
          this._storeData("authToken", responseJson.token);
          GLOBAL.authToken = responseJson.token;
        }
        alert("There was a problem server side. Please try again later.");
      }
      else{
        if(responseJson['token'] != "NA"){
          this._storeData("authToken", responseJson.token);
          GLOBAL.authToken = responseJson.token;
        }
        this.setState({
          programsToPick: responseJson['programs']
        })
      }
    })
    .catch((error) => {
      alert("We're sorry, there seems to be an error. Please try again later.")
    });
  }

  getCaptionSelected = () => {
    if (this.state.captionNum == 0){
      return this.state.caption0ToSave;
    }
    else if (this.state.captionNum == 1){
      return this.state.caption1ToSave;
    }
    else if (this.state.captionNum == 2){
      return this.state.caption2ToSave;
    }
  }

  _handleCaption = (num, caption) => {
    if (num == 0){
      this.setState({
        caption0ToSave: caption
      })
    }
    else if (num == 1){
      this.setState({
        caption1ToSave: caption
      })
    }
    else if (this.state.captionNum == 2){
      this.setState({
        caption2ToSave: caption
      })
    }
  }

  _handleStoryHeadline = (headline) => {
    this.setState({
      storyHeadlineToSave: headline
    })
  }

  _handlePronouns= (pronouns) => {
    this.setState({
      pronounsToSave: pronouns
    })
  }

  _handleLookingFor= (lookingFor) => {
    this.setState({
      lookingForToSave: lookingFor
    })
  }

  _handleStory = (story) => {
    this.setState({
      storyToSave: story
    })
  }

  closeDialog = () => {
    this.setState({
      dialogVisible: false,
      nameToSave: this.state.profile.firstname_display,
      lastnameToSave: this.state.profile.lastname,
      birthdateToSave: this.state.profile.birthdate,
      programToSave: this.state.profile.program,
      yearToSave: this.state.profile.year,
      bioToSave: this.state.profile.bio,
      caption0ToSave: this.state.profile.caption0,
      caption1ToSave: this.state.profile.caption1,
      caption2ToSave: this.state.profile.caption2,
      storyHeadlineToSave: this.state.profile.storyHeadline,
      storyToSave: this.state.profile.story
    });
  }

  isEnabled = (picNum) => {
    if(picNum == 1){
      if(this.state.profile.picture1 == ""){
        return "#c9c9c9";
      }
      else{
        return "transparent";
      }
    }
    else if(picNum == 2){
      if(this.state.profile.picture2 == ""){
        return "#c9c9c9";
      }
      else{
        return "transparent";
      }
    }
    else if(picNum == 3){
      if(this.state.profile.picture3 == ""){
        return "#c9c9c9";
      }
      else{
        return "transparent";
      }
    }
    else if(picNum == 4){
      //this is actually story portion
      if(this.state.profile.storyHeadline == "" || this.state.profile.storyHeadline == undefined || this.state.profile.storyHeadline == null){
        return "#c9c9c9";
      }
      else{
        return "transparent";
      }
    }
  }

  getCaption = (num) => {
    if(num == 0 && this.state.profile.picture1 != ""){
      return this.state.profile.caption0;
    }
    else if(num == 1 && this.state.profile.picture2 != ""){
      return this.state.profile.caption1;
    }
    else if(num == 2 && this.state.profile.picture3 != ""){
      return this.state.profile.caption2;
    }
    else{
      return "";
    }
  }

  getStory = () => {
    if(this.state.profile.storyHeadline != ""){
      return this.state.profile.story;
    }
    else{
      return "";
    }
  }

  renderImageBars = () => {
    var imageBars = [];
    for(var i = 0; i<this.state.images.length; i++){
      imageBars.push(<View style={{margin: 5, borderRadius: 5, height: 5, width: (screenWidth/(this.state.images.length))*0.8, backgroundColor: (this.state.imageIndex == i)?"white":"rgba(0,0,0,0.5)"}}></View>)
    }

    return imageBars;
  }

  decreaseImageIndex = () => {
    if(this.state.imageIndex > 0){
      this.setState({
        imageIndex: this.state.imageIndex - 1
      })
    }
  }

  increaseImageIndex = () => {
    if(this.state.imageIndex < this.state.images.length-1){
      this.setState({
        imageIndex: this.state.imageIndex + 1
      })
    }
  }

  onMessage = (event) => {
    var spotify_data = JSON.parse(event.nativeEvent.data);
    this.RBSheet.close();
    this.setState({
      spotifyLoading: true
    });
    var artists = [];
    var artist_ids = [];
    for(var i = 0; i<spotify_data.length; i++){
      var artist = {};
      artist["artist_name"] = spotify_data[i].name;
      artist["artist_image"] = spotify_data[i].images[0]['url'];
      artist["artist_id"] = spotify_data[i].id;
      artists.push(artist);
      artist_ids.push(spotify_data[i].id);
    }

    var profile = this.state.profile;

    profile.top_5_spotify = JSON.stringify(artist_ids);
    GLOBAL.profile.top_5_spotify = JSON.stringify(artist_ids);
    if(GLOBAL.friends == null || GLOBAL.friends == undefined){
      GLOBAL.friends = {};
    }
    GLOBAL.friends.top_5_spotify = JSON.stringify(artist_ids);
    this._storeData("me", JSON.stringify(profile));
    this._storeData("friends-me", JSON.stringify(GLOBAL.friends));


    this.setState({
      spotifyLoading: false,
      temp_spotifyData: artists,
      profile: profile
    })

  }

  renderInterests = () => {
    var added = 0;
    var interests_to_return = [];
    for (const [key, value] of Object.entries(this.state.addedInterests)) {
      added++;
      interests_to_return.push(<InterestBubble disabled func={this.removeInterest} key={key} interest={this.capitalizeFirstLetter(key)} />);
    }
    if(added == 0){
      return(<Text style={{fontSize: 14, paddingBottom: 5, paddingTop: 5, color: "black", fontFamily: "Raleway-Medium"}}>Add your interests by tapping the pencil icon!</Text>)
    }
    return (interests_to_return);
  }

  renderArtists = () => {
    var artistBubbles = [];
    if(this.state.temp_spotifyData.length > 0){
      for(var i = 0; i<this.state.temp_spotifyData.length; i++){
        artistBubbles.push(<SpotifyBubble name={this.state.temp_spotifyData[i].artist_name} image={this.state.temp_spotifyData[i].artist_image} />);
      }
      return artistBubbles;
    }
    else{
      var data = JSON.parse(this.state.profile.top_5_spotify);
      if(!gotArtistData){
        gotArtistData = true;
        const artist_data = this.getArtists(data);
      }

      return(<View></View>);
    }

  }

  hideSpotify = () => {
    this.RemoveSpotify.close();
    var profile = this.state.profile;
    profile.top_5_spotify = undefined;
    GLOBAL.profile.top_5_spotify = undefined;
    this._storeData("me", JSON.stringify(profile));
    this.setState({
      spotifyLoading: false,
      temp_spotifyData: [],
      profile: profile
    });

      var details = {
          "token": GLOBAL.authToken
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/up/hsa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody,
      }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson == "logout"){
            Actions.replace("login");
          }
          else if(responseJson.status == "server-error"){
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            alert("There was an error, please try again later.")
          }
          else{
            if(responseJson.status == "success"){
              if(responseJson.token != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
            }
          }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
  }

  hideInterests = () => {
    this.RemoveInterests.close();
    var profile = this.state.profile;
    profile.interests = undefined;
    GLOBAL.profile.interests = undefined;
    this._storeData("me", JSON.stringify(profile));
    this.setState({
      addedInterests: {},
      profile: profile
    });

      var details = {
          "token": GLOBAL.authToken
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/up/hi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody,
      }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson == "logout"){
            Actions.replace("login");
          }
          else if(responseJson.status == "server-error"){
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            alert("There was an error, please try again later.")
          }
          else{
            if(responseJson.status == "success"){
              if(responseJson.token != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
            }
          }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
  }

  hideBadges = () => {
    this.RemoveBadges.close();
    var profile = this.state.profile;
    profile.badges = undefined;
    GLOBAL.profile.badges = undefined;
    this._storeData("me", JSON.stringify(profile));
    this.setState({
      addedBadges: {},
      profile: profile
    });

      var details = {
          "token": GLOBAL.authToken
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/up/hb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody,
      }).then((response) => response.json())
        .then((responseJson) => {
          if(responseJson == "logout"){
            Actions.replace("login");
          }
          else if(responseJson.status == "server-error"){
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            alert("There was an error, please try again later.")
          }
          else{
            if(responseJson.status == "success"){
              if(responseJson.token != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
            }
          }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
  }

  getArtists = (data) => {
    var details = {
        "artist_1": data[0],
        "artist_2": data[1],
        "artist_3": data[2],
        "artist_4": data[3],
        "artist_5": data[4]
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/up/gsa', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody,
    }).then((response) => response.json())
      .then((responseJson) => {
        if(Array.isArray(responseJson.artist_data)){
          this.setState({
            spotifyLoading: false,
            temp_spotifyData: responseJson.artist_data
          })
        }
        else{
          this.setState({
            spotifyLoading: false
          })
        }
    })
    .catch((error) => {
      alert("We're sorry, there seems to be an error. Please try again later.")
    });
  }

   capitalizeFirstLetter = (string) => {
     return string.charAt(0).toUpperCase() + string.slice(1);
   }

  addInterest = (interest) => {
    if(interest.length == 0){
      return 0;
    }
    if(Object.keys(this.state.addedInterests).length == 10){
      alert("You can only add a maximum of 10 interests.");
      return 0;
    }
    this.interestTextInput.clear();
    interestInput = "";
    var interests_added = this.state.addedInterests;
    interests_added[this.cleanSmartPunctuation(interest).toLowerCase()] = true;
    this.setState({
      addedInterests: interests_added
    });
  }

  removeInterest = (interest) => {
    var interests_added = this.state.addedInterests;
    delete interests_added[this.cleanSmartPunctuation(interest).toLowerCase()];
    this.setState({
      addedInterests: interests_added
    });
  }

  renderAddedInterests = () => {
    var interests_to_return = [];
    for (const [key, value] of Object.entries(this.state.addedInterests)) {
      interests_to_return.push(<InterestBubble func={this.removeInterest} key={key} interest={this.capitalizeFirstLetter(key)} />);
    }
    return (interests_to_return);
  }

  renderSuggestedInterests = () => {
    var added = 0;
    var suggestions = [];
    for(var i = 0; i<interests.length; i++){
      if(!this.state.addedInterests[interests[i].toLowerCase()]){
        var interestToPass = interests[i].slice(0);
        added++;
        suggestions.push(<InterestBubble func={this.addInterest} key={interests[i]} interest={interests[i]} add />);
      }
      if(added === 3){
        break;
      }
    }

    return suggestions;
  }

  saveInterests = () => {
    this.InterestsSheet.close();
    var interest_array = [];
    for (const [key, value] of Object.entries(this.state.addedInterests)) {
      interest_array.push(key);
    }
    var details = {
        "token": GLOBAL.authToken,
        "interests": JSON.stringify(interest_array)
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/up/si', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody,
    }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson == "logout"){
          Actions.replace("login");
        }
        else if(responseJson.status == "server-error"){
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          alert("There was an error, please try again later.")
        }
        else{
          if(responseJson.status == "success"){
            if(responseJson.token != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            var profile = this.state.profile;
            profile.interests = JSON.stringify(interest_array);
            GLOBAL.profile.interests = JSON.stringify(interest_array);
            this._storeData("me", JSON.stringify(profile));
            this.setState({
              profile: profile
            })
          }
        }
    })
    .catch((error) => {
      alert("We're sorry, there seems to be an error. Please try again later.")
    });
  }

  addBadge = (badge_code) => {
    if(Object.keys(this.state.addedBadges).length == 3){
      alert("You can only add a maximum of 3 badges.");
      return 0;
    }
    var added_badges = this.state.addedBadges;
    added_badges[badge_code] = true;
    this.setState({
      addedBadges: added_badges
    })
  }

  removeBadge = (badge_code) => {
    var added_badges = this.state.addedBadges;
    delete added_badges[badge_code]
    this.setState({
      addedBadges: added_badges
    })
  }


  renderBadges = () => {
    var badges_to_render = [];
    for (const [key, value] of Object.entries(this.state.addedBadges)) {
      badges_to_render.push(
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "flex-start"}}>
          <ProfileBadge type={key} />
          <Text style={{marginLeft: 10, fontSize: 20, color: "black", fontFamily: "Raleway-Medium"}}>{badges[key].badge_name}</Text>
        </View>
      );
    }
    return(badges_to_render);
  }

  renderAddedBadges = () => {
    var badges_to_render = [];
    for (const [key, value] of Object.entries(this.state.addedBadges)) {
      badges_to_render.push(<View style={{alignItems: "center", margin: 5, minWidth: 90}}><ProfileBadge type={key} /><Text style={{fontSize: 12, marginTop: 5, color: "black", fontFamily: "Raleway-Medium"}}>{badges[key].badge_name}</Text><TouchableOpacity activeOpacity={0.7} onPress={() => this.removeBadge(key)} style={{position: "absolute", top:0, right: 0, backgroundColor: "gray", height: 16, width: 16, borderRadius: 8, justifyContent: "center", alignItems: "center"}}><Text style={{fontSize: 12, color: "white"}}>X</Text></TouchableOpacity></View>);
    }
    return(badges_to_render);
  }

  renderBadgeOptions = () => {
    var badges_to_render = [];
    for (const [key, value] of Object.entries(badges)) {
      if(!this.state.addedBadges[key]){
        badges_to_render.push(<TouchableOpacity activeOpacity={0.8} onPress={() => this.addBadge(key)} style={{flexDirection: "row", alignItems: "center"}}><ProfileBadge type={key} /><Text style={{fontSize: 20, marginLeft: 10, color: "black", fontFamily: "Raleway-Medium"}}>{value.badge_name}</Text></TouchableOpacity>);
      }
    }
    return(badges_to_render);
  }

  saveBadges = () => {
    this.BadgesSheet.close();
    var badges_array = [];
    for (const [key, value] of Object.entries(this.state.addedBadges)) {
      badges_array.push(key);
    }
    var details = {
        "token": GLOBAL.authToken,
        "badges": JSON.stringify(badges_array)
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/up/sb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody,
    }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson == "logout"){
          Actions.replace("login");
        }
        else if(responseJson.status == "server-error"){
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          alert("There was an error, please try again later.")
        }
        else{
          if(responseJson.status == "success"){
            if(responseJson.token != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            var profile = this.state.profile;
            profile.badges = JSON.stringify(badges_array);
            GLOBAL.profile.badges = JSON.stringify(badges_array);
            this._storeData("me", JSON.stringify(profile));
            this.setState({
              profile: profile
            })
          }
        }
    })
    .catch((error) => {
      alert("We're sorry, there seems to be an error. Please try again later.")
    });
  }

  callhook = (item) => {
  }

  onAddImage = (index) => {
    this.selectPicture(index);
  }

  onRemoveImage = (index) => {
    var atleastOneImage = false;
    for(var i = 0; i<active_images_editable.length; i++){
      if(index != i && active_images_editable[i] !== undefined){
        atleastOneImage = true;
        break;
      }
    }
    if(atleastOneImage){
      active_images_editable[index] = undefined;
      var images = this.state.images_editable;
      images[index] = undefined;
      this.setState({
        images_editable: images
      })
    }
    else{
      alert("You must have one image.");
    }
  }

  saveProfileImages = () => {
    var images_array_to_send = [];
    for(var i=0; i<active_images_editable.length; i++){
      if(active_images_editable[i] != undefined && active_images_editable[i] != null && active_images_editable[i] != "null" && active_images_editable[i] != "undefined"){
        images_array_to_send.push(active_images_editable[i]);
      }
    }
    if(images_array_to_send[0] == undefined){
      alert("You must pick at least one image.");
      return;
    }
    this.PictureSheet.close();
    var details = {
        "token": GLOBAL.authToken,
        "image0": images_array_to_send[0],
        "image1": (images_array_to_send[1] == undefined)?null:images_array_to_send[1],
        "image2": (images_array_to_send[2] == undefined)?null:images_array_to_send[2],
        "image3": (images_array_to_send[3] == undefined)?null:images_array_to_send[3]
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/up/spi', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody,
    }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson == "logout"){
          Actions.replace("login");
        }
        else if(responseJson.status == "server-error"){
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          alert("There was an error, please try again later.")
        }
        else{
          if(responseJson.status == "success"){
            if(responseJson.token != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
            var profile = this.state.profile;
            profile.image0 = images_array_to_send[0];
            profile.image1 = images_array_to_send[1];
            profile.image2 = images_array_to_send[2];
            profile.image3 = images_array_to_send[3];
            GLOBAL.profile.image0 = images_array_to_send[0];
            GLOBAL.profile.image1 = images_array_to_send[1];
            GLOBAL.profile.image2 = images_array_to_send[2];
            GLOBAL.profile.image3 = images_array_to_send[3];
            this._storeData("me", JSON.stringify(profile));
            this.setState({
              profile: profile,
              images: images_array_to_send
            })
          }
        }
    })
    .catch((error) => {
      alert("We're sorry, there seems to be an error. Please try again later.")
    });
  }

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View style={{
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: "white"
      }}>
      <SafeAreaView style={{
        backgroundColor: "#ffffff"
      }}></SafeAreaView>
      <View style={{
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: "white"
      }}>
      <StatusBar
        barStyle="dark-content"  // Here is where you change the font-color
        />
        <View style={{backgroundColor: "white", height: 50, width: screenWidth, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={20} color="black" /></TouchableOpacity>
          <Text style={{fontSize: 20, textAlign: "center", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>My Dating Profile</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.previewprofile({fromMatchConvo: false})} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="eye" size={25} color="black" /></TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{minHeight: screenHeight-50, height: 'auto', width: screenWidth, borderRadius: 20, backgroundColor: 'white'}}>
            <View style={{height: screenHeight*0.75, width: screenWidth}}>
              <View style={{height: 'auto', width: '100%', backgroundColor: 'white'}}>
                  <FastImage onLoadStart={() => this.setState({pictureLoading: true})} onLoadEnd={() => this.setState({pictureLoading: false})} source={{uri: "https://rumine.ca/_i/s/i.php?i=" + this.state.images[this.state.imageIndex], priority: FastImage.priority.high}} style={{justifyContent: "center", alignItems: "center", backgroundColor: "gray", height: '100%', width: '100%'}}>
                    {(this.state.pictureLoading)?<ActivityIndicator size="large" color="#ff5b99" />:<View></View>}
                  </FastImage>
                  <View style={{position: "absolute", top: 0, height: 15, width: '100%', flexDirection: "row", justifyContent: "center", alignItems: "center"}}>{this.renderImageBars()}</View>
                  {(false)?<View style={{position: "absolute", top: 0, right: 0, height: 'auto', width: 'auto', backgroundColor: "#1fb1ff", borderBottomLeftRadius: 10}}>
                    <Text style={{color: "#fff", fontSize: 16, padding: 10, fontFamily: "Raleway-Regular"}}>Suggested</Text>
                  </View>:<View></View>}
                  <TouchableOpacity activeOpacity={1} onPress={() => this.decreaseImageIndex()} style={{position: "absolute", height: '100%', width: '30%'}}>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={1} onPress={() => this.increaseImageIndex()} style={{position: "absolute", right: 0, height: '100%', width: '30%'}}>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={1} onPress={() => this.state.profile.openFullProfile()} style={{position: "absolute", bottom: 0, height: 120, width: '100%'}}>
                    <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.75)']} style={{position: "absolute", bottom: 0, width: '100%'}}>
                      <View style={{paddingTop: 40, width: '100%', height: 'auto', flexDirection: 'row'}}>
                      <TouchableOpacity activeOpacity={0.6} onPress={() => this.showNameAge()} style={{width: '100%', height: 'auto', flexDirection: 'row'}}>
                        <Text style={{color: "#ff5b99", fontSize: 35, left: 10, top: 5, fontFamily: "Raleway-Bold"}}>{this.state.profile.firstname_display}</Text>
                        <View style={{height: '100%', width: '100%', position: 'relative'}}>
                          <View style={{left: 15, height: 6, width: 6, borderRadius: 3, backgroundColor: "#fff", position: 'absolute', bottom: 7}}></View>
                          <Text style={{paddingLeft: 25, color: "#fff", fontSize: 18, position: 'absolute', bottom: 0, fontFamily: "Raleway-Light"}}>{this.getAge()}</Text>
                        </View>
                      </TouchableOpacity>
                      </View>
                      <TouchableOpacity activeOpacity={0.6} onPress={() => this.showProgramYear()} style={{width: '100%', height: 'auto', flexDirection: 'row', maxWidth: screenWidth*0.8}}>
                        <Text style={{color: "#fff", fontSize: 15, left: 10, top: 5, paddingBottom: 5, fontFamily: "Raleway-Regular"}}>{this.state.profile.program}, {this.state.profile.year}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity activeOpacity={0.6} onPress={() => this.showPronounLooking()} style={{width: '100%', height: 'auto', flexDirection: 'row'}}>
                        {(this.state.profile.lookingFor == "Let's see what happens")?
                        <Text style={{color: "#fff", fontSize: 12, left: 10, top: 5, paddingBottom: 20, fontFamily: "Raleway-Light"}}>{this.state.profile.pronouns}, {this.state.profile.lookingFor}</Text>
                        :
                        <Text style={{color: "#fff", fontSize: 12, left: 10, top: 5, paddingBottom: 20, fontFamily: "Raleway-Light"}}>{this.state.profile.pronouns}, Looking for {this.state.profile.lookingFor}</Text>
                        }
                      </TouchableOpacity>
                      <View style={{height: 10, width: '100%'}}></View>
                    </LinearGradient>
                  </TouchableOpacity>
              </View>
              <TouchableOpacity activeOpacity={0.8} onPress={() => this.PictureSheet.open()} style={{position: "absolute", height: 50, width: 50, top: screenHeight*0.60, right: 5, justifyContent: "center", alignItems: "center"}}>
              <LineIcon name="pencil" size={25} color="white" />
            </TouchableOpacity>
            </View>
            <View style={{minHeight: 200, height: 'auto', width: screenWidth, backgroundColor: "white", borderRadius: 15, top: -20}}>
              {(true)?
                  <TouchableOpacity activeOpacity={0.6} onPress={() => this.showBio()} style={{height: 'auto', minHeight: screenWidth*0.15, width: screenWidth}}>
                    <View style={{padding: 20, flexDirection: "row"}}>
                      <Text style={{textAlign: "left", fontSize: 20, color: "black", fontFamily: "Raleway-Regular"}}>{this.state.profile.bio} <LineIcon name="pencil" size={15} color="black" /></Text>
                    </View>
                  </TouchableOpacity>
               :<View></View>}
              {(true)?
                <View style={{width: screenWidth, justifyContent: "center", alignItems: "center"}}>
                  {(this.state.profile.badges && this.state.profile.badges.length > 2)?
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this.RemoveBadges.open()} style={{height: 25, width: 30, position: "absolute", top: 5, left: 5}}>
                    <LineIcon name="close" size={18} color="red" />
                  </TouchableOpacity>:<View></View>}
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this.BadgesSheet.open()} style={{height: 25, width: 30, position: "absolute", top: 5, right: 0}}>
                    <LineIcon name="pencil" size={18} color="black" />
                  </TouchableOpacity>
                  <Text style={{textAlign: "center", fontSize: 20, color: "black", fontFamily: "Raleway-Bold"}}>A little about me...</Text>
                <View style={{height: 'auto', width: 200, marginTop: 10, marginBottom: 10, justifyContent: "center"}}>
                  {this.renderBadges()}
                </View>
               </View>
              :<View></View>}
              {(true)?
              <View style={{height: 'auto', marginTop: 20, marginBottom: 20, alignItems: "center"}}>
                {(this.state.profile.interests && this.state.profile.interests.length > 2)?
                <TouchableOpacity activeOpacity={0.7} onPress={() => this.RemoveInterests.open()} style={{height: 25, width: 30, position: "absolute", top: 5, left: 5}}>
                  <LineIcon name="close" size={18} color="red" />
                </TouchableOpacity>:<View></View>}
                <TouchableOpacity activeOpacity={0.7} onPress={() => this.InterestsSheet.open()} style={{height: 25, width: 30, position: "absolute", top: 5, right: 0}}>
                  <LineIcon name="pencil" size={18} color="black" />
                </TouchableOpacity>
                <Text style={{textAlign: "center", fontSize: 20, color: "black", fontFamily: "Raleway-Bold"}}>My Interests are...</Text>
                <View style={{margin: 10, width: screenWidth*0.8, justifyContent: "center", alignItems: "center", height: 'auto', flexDirection: "row", flexWrap: "wrap"}}>
                  {this.renderInterests()}
                </View>
              </View>
             :
             <View></View>
             }
             {(true)?
             <View style={{height: 'auto', marginTop: 20, marginBottom: 20, alignItems: "center"}}>
               {(this.state.profile.top_5_spotify && this.state.profile.top_5_spotify.length > 2)?
                 <TouchableOpacity activeOpacity={0.7} onPress={() => this.RemoveSpotify.open()} style={{height: 25, width: 30, position: "absolute", top: 5, left: 5}}>
                 <LineIcon name="close" size={18} color="red" />
               </TouchableOpacity>:<View></View>}
               <TouchableOpacity activeOpacity={0.7} onPress={() => this.RBSheet.open()} style={{height: 25, width: 30, position: "absolute", top: 5, right: 0}}>
                 <LineIcon name="pencil" size={18} color="black" />
               </TouchableOpacity>
               <Text style={{textAlign: "center", fontSize: 20, color: "black", fontFamily: "Raleway-Bold"}}>My Top 5 Spotify Artists</Text>
               <View style={{width: screenWidth, alignItems: "center"}}>
                 <Text style={{fontSize: 14, paddingBottom: 5, textAlign: "left", color: "gray", fontFamily: "Raleway-regular"}}>This will sync with your friends profile.</Text>
               </View>
               {(this.state.profile.top_5_spotify && this.state.profile.top_5_spotify.length > 0)?
                 <View style={{margin: 10, width: screenWidth*0.8, justifyContent: "center", alignItems: "center", height: 'auto', flexDirection: "row", flexWrap: "wrap"}}>
                 {this.renderArtists()}
                 {(this.state.spotifyLoading)?
                  <View><Text>LOADING</Text></View>:<View></View>}
               </View>
                :
                <View><Text>Link your spotify</Text></View>
                }
             </View>:<View></View>
            }
            </View>
          </View>
        </ScrollView>
        <Dialog
          visible={this.state.dialogVisible}
          dialogStyle={{marginTop: -150, maxHeight: 350}}
          onTouchOutside={() => this.closeDialog()}>
          {(this.state.dialogType == 0)?
          <View>
            <Text style={{fontSize: 20, paddingBottom: 5, paddingTop: 5, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-bold"}}>Edit your Name:</Text>
            <Text style={{fontSize: 12, paddingBottom: 5, textAlign: "left", color: "gray", fontFamily: "Raleway-regular"}}>Your first name will not sync with your friends profile.</Text>
            <TextInput
              placeholder="First name"
              keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
              value={this.state.nameToSave}
              placeholderTextColor="#aaaaaa"
              style={{color: "black", padding: 5, fontSize: 18, backgroundColor: "#cecece", borderRadius: 2}}
              multiline={false}
              maxLength={32}
              onChangeText={(name) => this._handleNameChange(name)}
              >
              </TextInput>
              <Text style={{fontSize: 12, paddingTop: 5, paddingBottom: 5, textAlign: "left", color: "gray", fontFamily: "Raleway-regular"}}>Your last name will not be displayed on dating.</Text>
              <TextInput
                placeholder="Last name"
                keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                value={this.state.lastnameToSave}
                placeholderTextColor="#aaaaaa"
                style={{color: "black", padding: 5, fontSize: 18, backgroundColor: "#cecece", borderRadius: 2}}
                multiline={false}
                maxLength={48}
                onChangeText={(name) => this._handleLastnameChange(name)}
                >
                </TextInput>
              <Text style={{fontSize: 20, paddingBottom: 5, paddingTop: 5, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-bold"}}>Edit your Age:</Text>
              <Text style={{fontSize: 12, paddingBottom: 5, textAlign: "left", color: "gray", fontFamily: "Raleway-regular"}}>This will sync with your friends profile.</Text>
              <DatePicker
                style={{width: '103%'}}
                date={this.state.birthdateToSave}
                mode="date"
                placeholder="select date"
                format="YYYY-MM-DD"
                minDate="1900-01-01"
                maxDate={this.getCurrentDate()}
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    height: 0,
                    width: 0,
                  },
                  dateInput: {
                    fontSize: 20,
                    color: "black",
                    backgroundColor: "#cecece",
                    borderRadius: 2,
                    borderWidth: 0,
                  },
                }}
                onDateChange={(date) => {this._handleBirthdate(date)}}
              />
          </View>
          :
          (this.state.dialogType == 1)?
          <View>
            <Text style={{fontSize: 20, paddingBottom: 5, paddingTop: 5, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-bold"}}>Edit your Program:</Text>
            <Text style={{fontSize: 14, paddingBottom: 5, textAlign: "left", color: "gray", fontFamily: "Raleway-regular"}}>This will sync with your friends profile.</Text>
            <RNPickerSelect
              onValueChange={(value) => this._handleProgram(value)}
              items={this.state.programsToPick}
              placeholder={{
                label: 'Select a Program...',
                value: null,
                color: 'gray',
                fontSize: 20,
                fontWeight: 'bold',
              }}
              value={this.state.programToSave}
              style={{ inputIOS: {fontSize: 20, color: "black", fontSize: 18, padding: 5, backgroundColor: "#cecece", borderRadius: 2}}}
            />
            <Text style={{fontSize: 20, paddingBottom: 5, paddingTop: 5, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-bold"}}>Edit your Year:</Text>
            <Text style={{fontSize: 14, paddingBottom: 5, textAlign: "left", color: "gray", fontFamily: "Raleway-regular"}}>This will sync with your friends profile.</Text>
            <RNPickerSelect
              onValueChange={(value) => this._handleYear(value)}
              items={[{ label: "1st Year", value: "1st Year" }, { label: "2nd Year", value: "2nd Year" }, { label: "3rd Year", value: "3rd Year" }, { label: "4th Year", value: "4th Year" }, { label: "5th Year", value: "5th Year" }, { label: "6th Year", value: "6th Year" }, { label: "7th Year", value: "7th Year" },]}
              placeholder={{
                label: 'Select a Year...',
                value: null,
                color: 'gray',
                fontSize: 20,
                fontWeight: 'bold',
              }}
              value={this.state.yearToSave}
              style={{ inputIOS: {fontSize: 20, color: "black", fontSize: 18, padding: 5, backgroundColor: "#cecece", borderRadius: 2}}}
            />
          </View>: (this.state.dialogType == 2)?
          <View style={{maxHeight: 260}}>
            <Text style={{fontSize: 20, paddingBottom: 5, paddingTop: 5, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-bold"}}>Edit your Bio:</Text>
            <Text style={{fontSize: 14, paddingBottom: 5, textAlign: "left", color: "gray", fontFamily: "Raleway-regular"}}>This will not sync with your friends profile.</Text>
            <TextInput
              placeholder="Bio"
              value={this.state.bioToSave}
              placeholderTextColor="#aaaaaa"
              style={{maxHeight: 140, color: "black", padding: 5, fontSize: 18, backgroundColor: "#cecece", borderRadius: 2}}
              multiline={true}
              maxLength={1024}
              onChangeText={(bio) => this._handleBio(bio)}
              >
              </TextInput>
          </View>:(this.state.dialogType == 3)?
          <View style={{maxHeight: 260}}>
            <Text style={{fontSize: 20, paddingBottom: 5, paddingTop: 5, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-bold"}}>Edit your Caption:</Text>
            <TextInput
              placeholder="Caption"
              value={this.getCaptionSelected()}
              placeholderTextColor="#aaaaaa"
              style={{maxHeight: 140, color: "black", padding: 5, fontSize: 18, backgroundColor: "#cecece", borderRadius: 2}}
              multiline={true}
              blurOnSubmit = {true}
              onSubmitEditing={null}
              maxLength={64}
              onChangeText={(caption) => this._handleCaption(this.state.captionNum, caption)}
              >
              </TextInput>
          </View>: (this.state.dialogType == 4)?
          <View style={{maxHeight: 260}}>
            <Text style={{fontSize: 20, paddingBottom: 5, paddingTop: 5, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-bold"}}>Edit your Story Headline:</Text>
            <TextInput
              placeholder="Headline"
              value={this.state.storyHeadlineToSave}
              placeholderTextColor="#aaaaaa"
              style={{color: "black", padding: 5, fontSize: 18, backgroundColor: "#cecece", borderRadius: 2}}
              multiline={false}
              maxLength={32}
              onChangeText={(headline) => this._handleStoryHeadline(headline)}
              >
              </TextInput>
            <Text style={{fontSize: 20, paddingBottom: 5, paddingTop: 5, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-bold"}}>Edit your Story:</Text>
            <TextInput
              placeholder="Story"
              value={this.state.storyToSave}
              placeholderTextColor="#aaaaaa"
              style={{maxHeight: 120, color: "black", padding: 5, fontSize: 18, backgroundColor: "#cecece", borderRadius: 2}}
              multiline={true}
              maxLength={1024}
              onChangeText={(story) => this._handleStory(story)}
              >
              </TextInput>
          </View>:
          <View>
            <Text style={{fontSize: 20, paddingBottom: 5, paddingTop: 5, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-bold"}}>Edit your Pronouns:</Text>
            <Text style={{fontSize: 14, paddingBottom: 5, textAlign: "left", color: "gray", fontFamily: "Raleway-regular"}}>This will sync with your friends profile.</Text>
            <TextInput
              placeholder="Pronouns"
              value={this.state.pronounsToSave}
              placeholderTextColor="#aaaaaa"
              style={{maxHeight: 120, color: "black", padding: 5, fontSize: 18, backgroundColor: "#cecece", borderRadius: 2}}
              multiline={false}
              maxLength={16}
              onChangeText={(pronouns) => this._handlePronouns(pronouns)}
              >
              </TextInput>
            <Text style={{fontSize: 20, paddingBottom: 5, paddingTop: 5, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-bold"}}>Edit what you're Looking For:</Text>
            <Text style={{fontSize: 14, paddingBottom: 5, textAlign: "left", color: "gray", fontFamily: "Raleway-regular"}}>This will not appear on your friends profile.</Text>
            <RNPickerSelect
              onValueChange={(value) => this._handleLookingFor(value)}
              items={[{ label: "Relationship", value: "Relationship" }, { label: "Friends with Benefits", value: "Friends with Benefits" }, { label: "Let's see what happens", value: "Let's see what happens" }, { label: "Something Casual", value: "Something Casual" },]}
              placeholder={{
                label: 'Select what you\'re looking for...',
                value: null,
                color: 'gray',
                fontSize: 20,
                fontWeight: 'bold',
              }}
              value={this.state.lookingForToSave}
              style={{ inputIOS: {fontSize: 20, color: "black", fontSize: 18, padding: 5, backgroundColor: "#cecece", borderRadius: 2}}}
            />
          </View>
          }
          <View style={{paddingTop: 10, height: 40, width: '100%', flexDirection: "row", justifyContent: "space-between"}}>
            <TouchableOpacity onPress={() => this.cancelChanges()} style={{height: 30, width: 100, backgroundColor: "red", borderRadius: 5, alignItems: "center", justifyContent: "center"}} activeOpacity={0.8}>
              <Text style={{fontSize: 16, textAlign: "center", color: "white", fontFamily: "Raleway-bold"}}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.saveChanges()} style={{height: 30, width: 100, backgroundColor: "green", borderRadius: 5, alignItems: "center", justifyContent: "center"}} activeOpacity={0.8}>
              <Text style={{fontSize: 16, textAlign: "center", color: "white", fontFamily: "Raleway-bold"}}>Save</Text>
            </TouchableOpacity>
          </View>
        </Dialog>
        <RBSheet
          closeOnDragDown={true}
          ref={ref => {
            this.RemoveSpotify = ref;
          }}
          height={screenHeight*0.25}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25
            }
          }}
          >
            <View style={{height: screenHeight*0.2, width: screenWidth, alignItems: "center", justifyContent: "center"}}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => this.hideSpotify()} style={{height: 50, width: screenWidth*0.8, borderRadius: 30, justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "red"}}>
                <Text style={{fontSize: 20, textAlign: "center", color: "red", fontFamily: "Raleway-Medium"}}>Hide My Spotify Artists</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={() => this.RemoveSpotify.close()} style={{marginTop: 20, height: 50, width: screenWidth*0.8, borderRadius: 30, justifyContent: "center", alignItems: "center", backgroundColor: "gray"}}>
                <Text style={{fontSize: 20, textAlign: "center", color: "white", fontFamily: "Raleway-Medium"}}>Cancel</Text>
              </TouchableOpacity>
          </View>
        </RBSheet>
        <RBSheet
          closeOnDragDown={true}
          ref={ref => {
            this.RemoveInterests = ref;
          }}
          height={screenHeight*0.25}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25
            }
          }}
          >
            <View style={{height: screenHeight*0.2, width: screenWidth, alignItems: "center", justifyContent: "center"}}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => this.hideInterests()} style={{height: 50, width: screenWidth*0.8, borderRadius: 30, justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "red"}}>
                <Text style={{fontSize: 20, textAlign: "center", color: "red", fontFamily: "Raleway-Medium"}}>Hide My Interests</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={() => this.RemoveInterests.close()} style={{marginTop: 20, height: 50, width: screenWidth*0.8, borderRadius: 30, justifyContent: "center", alignItems: "center", backgroundColor: "gray"}}>
                <Text style={{fontSize: 20, textAlign: "center", color: "white", fontFamily: "Raleway-Medium"}}>Cancel</Text>
              </TouchableOpacity>
          </View>
        </RBSheet>
        <RBSheet
          closeOnDragDown={true}
          ref={ref => {
            this.RemoveBadges = ref;
          }}
          height={screenHeight*0.25}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25
            }
          }}
          >
            <View style={{height: screenHeight*0.2, width: screenWidth, alignItems: "center", justifyContent: "center"}}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => this.hideBadges()} style={{height: 50, width: screenWidth*0.8, borderRadius: 30, justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "red"}}>
                <Text style={{fontSize: 20, textAlign: "center", color: "red", fontFamily: "Raleway-Medium"}}>Hide My Badges</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.8} onPress={() => this.RemoveBadges.close()} style={{marginTop: 20, height: 50, width: screenWidth*0.8, borderRadius: 30, justifyContent: "center", alignItems: "center", backgroundColor: "gray"}}>
                <Text style={{fontSize: 20, textAlign: "center", color: "white", fontFamily: "Raleway-Medium"}}>Cancel</Text>
              </TouchableOpacity>
          </View>
        </RBSheet>
        <RBSheet
          closeOnDragDown={(Platform.OS === "ios")?true:false}
          ref={ref => {
            this.RBSheet = ref;
          }}
          height={screenHeight*0.9}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25
            }
          }}
          >
            <View style={{height: screenHeight*0.85, width: screenWidth}}>
              <View style={{height: 20, width: screenWidth, backgroundColor: "white", justifyContent: "center", alignItems: "center"}}>
                {(Platform.OS === "android")?
                <TouchableOpacity onPress={() => this.RBSheet.close()} activeOpacity={0.7} style={{height: 20, width: 'auto', borderRadius: 20, paddingLeft: 10, paddingRight: 10, backgroundColor: "gray", justifyContent: "center", alignItems: "center"}}>
                  <Text style={{fontSize: 16, textAlign: "center", color: "white", fontFamily: "Raleway-Medium"}}>Close</Text>
                </TouchableOpacity>
                :<View></View>}
              </View>
              <WebView
                source={{ uri: 'https://rumine.ca/apiv2/spotify.php?tok=' + GLOBAL.authToken }}
                style={{ height: '95%', width: '100%' }}
                onMessage={this.onMessage}
              />
          </View>
        </RBSheet>
        <RBSheet
          closeOnDragDown={true}
          ref={ref => {
            this.InterestsSheet = ref;
          }}
          height={screenHeight*0.9}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25
            }
          }}
          >
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()} style={{height: screenHeight*0.85, width: screenWidth}}>
              <View style={{height: screenHeight*0.85, width: '100%'}}>
                <ScrollView>
                <View style={{height: 20, width: '100%'}}>
                </View>
                <View style={{width: screenWidth, justifyContent: "center", alignItems: "center", height: 'auto', flexDirection: "row", flexWrap: "wrap"}}>
                  <View style={{width: 'auto', height: 'auto'}}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => this.addInterest(interestInput)} style={{margin: 2, padding: 8, borderColor: "#ff5b99", borderWidth: 2, borderRadius: 20, flexDirection: "row", alignItems: "center"}}>
                      <TextInput
                        ref={ref => {
                          this.interestTextInput = ref;
                        }}
                        style={{padding: 5, borderColor: "gray", borderBottomWidth: 1, fontSize: 22, minWidth: screenWidth*0.2, textAlign: "center"}}
                        placeholder={"Cooking"}
                        placeholderTextColor={"#cecece"}
                        multiline={false}
                        maxLength={16}
                        onChangeText={(text) => {interestInput = text}}
                      />
                      <View style={{height: '100%', width: 2}}></View>
                      <EvilIcon name="plus" size={30} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={{marginTop: 5, fontSize: 15, color: "black", fontFamily: "Raleway-Medium", textAlign: "center"}}>Suggested:</Text>
                <View style={{marginTop: 5, width: screenWidth, justifyContent: "center", alignItems: "center", height: 'auto', flexDirection: "row", flexWrap: "wrap"}}>
                  {this.renderSuggestedInterests()}
                </View>
                <Text style={{fontSize: 20, marginLeft: 10, marginTop: 10, color: "black", fontFamily: "Raleway-Medium"}}>Added Interests</Text>
                <View style={{margin: 10, width: screenWidth, alignItems: "center", height: 'auto', flexDirection: "row", flexWrap: "wrap"}}>
                  {this.renderAddedInterests()}
                </View>
                <View style={{height: 'auto', width: screenWidth, alignItems: "center", justifyContent: "space-between", flexDirection: "row"}}>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => this.InterestsSheet.close()} style={{margin: 5, height: 'auto', width: 'auto', padding: 10, borderRadius: 30, justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "gray"}}>
                    <Text style={{fontSize: 20, textAlign: "center", color: "gray", fontFamily: "Raleway-Medium"}}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => this.saveInterests()} style={{margin: 5, height: 'auto',  width: 'auto', padding: 10, borderRadius: 30, justifyContent: "center", alignItems: "center", backgroundColor: "green"}}>
                    <Text style={{fontSize: 20, textAlign: "center", color: "white", fontFamily: "Raleway-Medium"}}>Save My Interests</Text>
                  </TouchableOpacity>
                </View>
                <View style={{width: screenWidth, alignItems: "center"}}>
                  <Text style={{fontSize: 14, paddingBottom: 5, textAlign: "left", color: "gray", fontFamily: "Raleway-regular"}}>This will not sync with your friends profile.</Text>
                </View>
              </ScrollView>
              </View>
            </TouchableWithoutFeedback>
        </RBSheet>
        <RBSheet
          closeOnDragDown={true}
          ref={ref => {
            this.BadgesSheet = ref;
          }}
          height={screenHeight*0.9}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25
            }
          }}
          >
            <View style={{height: screenHeight*0.85, width: screenWidth}}>
              <View style={{height: '100%', width: '100%'}}>
                <ScrollView>
                <View style={{height: 20, width: '100%'}}>
                </View>
                <Text style={{marginLeft: 10, fontSize: 22, color: "black", fontFamily: "Raleway-Medium"}}>Selected:</Text>
                <ScrollView horizontal style={{height: 100, width: screenWidth, flexDirection: "row"}}>
                  {this.renderAddedBadges()}
                </ScrollView>
                <Text style={{marginLeft: 10, marginBottom: 5, fontSize: 22, color: "black", fontFamily: "Raleway-Medium"}}>Options:</Text>
                <View style={{height: screenHeight*0.4, width: screenWidth*0.9, marginLeft: screenWidth*0.05}}>
                  <ScrollView>
                    {this.renderBadgeOptions()}
                  </ScrollView>
                </View>
                <View style={{height: 'auto', width: screenWidth, alignItems: "center", justifyContent: "space-between", flexDirection: "row"}}>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => this.BadgesSheet.close()} style={{margin: 5, height: 'auto', width: 'auto', padding: 10, borderRadius: 30, justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "gray"}}>
                    <Text style={{fontSize: 20, textAlign: "center", color: "gray", fontFamily: "Raleway-Medium"}}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => this.saveBadges()} style={{margin: 5, height: 'auto',  width: 'auto', padding: 10, borderRadius: 30, justifyContent: "center", alignItems: "center", backgroundColor: "green"}}>
                    <Text style={{fontSize: 20, textAlign: "center", color: "white", fontFamily: "Raleway-Medium"}}>Save My Badges</Text>
                  </TouchableOpacity>
                </View>
                <View style={{width: screenWidth, alignItems: "center"}}>
                  <Text style={{fontSize: 14, paddingBottom: 5, textAlign: "left", color: "gray", fontFamily: "Raleway-regular"}}>This will not sync with your friends profile.</Text>
                </View>
                </ScrollView>
              </View>
            </View>
        </RBSheet>
        <RBSheet
          closeOnDragDown={true}
          ref={ref => {
            this.PictureSheet = ref;
          }}
          height={screenHeight*0.9}
          openDuration={250}
          customStyles={{
            container: {
              justifyContent: "center",
              alignItems: "center",
              borderTopLeftRadius: 25,
              borderTopRightRadius: 25
            }
          }}
          >
            <View style={{height: screenHeight*0.85, width: screenWidth}}>
              <View style={{height: '100%', width: '100%'}}>
                <ScrollView>
                <View style={{height: 20, width: '100%'}}>
                </View>
                <Text style={{marginLeft: 10, fontSize: 22, color: "black", fontFamily: "Raleway-Medium"}}>My Images:</Text>
                <Text style={{marginLeft: 10, fontSize: 14, color: "black", fontFamily: "Raleway-Light"}}>Hold and drag to change the order of your images.</Text>
                <View style={{display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", marginLeft: (screenWidth-((((screenWidth/(screenHeight*0.75))*190)*2) + 40))/2}}>
                  <AutoDragSortableView
                    delayLongPress={150}
                    dataSource={this.state.images_editable}
                    parentWidth={(((screenWidth/(screenHeight*0.75))*190)*2) + 40}
                    childrenWidth= {(screenWidth/(screenHeight*0.75))*190}
                    childrenHeight={190}
                    marginChildrenTop={10}
                    marginChildrenBottom={10}
                    marginChildrenRight={10}
                    marginChildrenLeft={10}
                    onDataChange={(data) => {this.setState({images_editable: data}); active_images_editable = data}}
                    keyExtractor={(item,index)=> item}
                    renderItem={(item,index)=>{
                      return (
                        <View>
                        <ProfileImage loading={this.state.image_loading[index]} onAddImage={() => this.onAddImage(index)} onRemoveImage={() => this.onRemoveImage(index)} index={index + 1} image={this.state.images_editable[index]} />
                      </View>)
                    }}
                  />
                </View>
                <View style={{height: screenHeight*0.1, width: screenWidth, alignItems: "center", justifyContent: "space-between", flexDirection: "row"}}>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => {this.setState({images_editable: [GLOBAL.profile.image0, GLOBAL.profile.image1, GLOBAL.profile.image2, GLOBAL.profile.image3]}); active_images_editable = [GLOBAL.profile.image0, GLOBAL.profile.image1, GLOBAL.profile.image2, GLOBAL.profile.image3]; this.PictureSheet.close()}} style={{margin: 5, height: 'auto', width: 'auto', padding: 10, borderRadius: 30, justifyContent: "center", alignItems: "center", borderWidth: 3, borderColor: "gray"}}>
                    <Text style={{fontSize: 20, textAlign: "center", color: "gray", fontFamily: "Raleway-Medium"}}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => this.saveProfileImages()} style={{margin: 5, height: 'auto',  width: 'auto', padding: 10, borderRadius: 30, justifyContent: "center", alignItems: "center", backgroundColor: "green"}}>
                    <Text style={{fontSize: 20, textAlign: "center", color: "white", fontFamily: "Raleway-Medium"}}>Save My Images</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
              </View>
            </View>
        </RBSheet>
        {(this.state.isCropLoading)?<Loading />:<View></View>}
      </View>
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
