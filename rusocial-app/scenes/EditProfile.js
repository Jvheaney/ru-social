import React, {Component} from 'react';
import { ActivityIndicator, KeyboardAvoidingView, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import GLOBAL from '../global.js';
import { Actions } from 'react-native-router-flux';
import { Dialog } from 'react-native-simple-dialogs';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';
import ImagePicker2 from 'react-native-image-crop-picker';
import ImagePicker from 'react-native-image-picker';
import LinearGradient from 'react-native-linear-gradient';

import Loading from '../components/Loading';

//import Dialog from "react-native-dialog";

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';

import FastImage from 'react-native-fast-image'

import navlogo from '../assets/images/NBF.png';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

const options = {
  title: 'Select Image',
  customButtons: [{ name: 'rmv', title: 'Remove Image' }],
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

  state = {
    dialogVisible: false,
    dialogTitle: "Edit Name/Age",
    dialogType: 0,
    captionNum: 0,
    nameToSave: "James",
    birthdateToSave: "1999-09-13",
    programToSave: "Engineering",
    yearToSave: "3rd Year",
    pronounsToSave: "He/Him",
    lookingForToSave: "Let's see what happens",
    bioToSave: "I like coding, going to the gym, and sipping on tequila with the boys.",
    caption0ToSave: "This is me and my boys.",
    caption1ToSave: "This is my golden retriever Max, he's the best.",
    caption2ToSave: "I just found this image online and really liked it.",
    storyHeadlineToSave: "I'm really into travelling.",
    storyToSave: "Well, I don't actually travel much but I like the idea of it! Maybe one day I will see Europe, that'd be sick.",
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
    isCropLoading: false
  }

  getMe = () => {
    this.setState({
      profile: GLOBAL.profile,
      nameToSave: GLOBAL.profile.firstname_display,
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
      storyToSave: GLOBAL.profile.story
    })
  }

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
    } catch (e) {
      // saving error
    }
  }

  uploadPicture = (source, num) => {
  var details = {
    "token": GLOBAL.authToken,
    "data": source,
    "imgnum": num
    };

    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
  return fetch('https://rumine.ca/_apiv2/gw/up/ui', {
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
            if (num == 0){
              this.setState({
                picture0: responseJson.status,
              });
              var profile = this.state.profile;
              profile.picture0 = responseJson.status;
              GLOBAL.profile.picture0 = responseJson.status;
              this._storeData("me", JSON.stringify(profile));
              this.setState({
                profile: profile
              });
            }
            else if (num == 1){
              if(responseJson.status.includes("dataerror") && source == "removeimage"){
                this.setState({
                  picture1: "",
                });
                var profile = this.state.profile;
                profile.picture1 = "";
                GLOBAL.profile.picture1 = "";
                this._storeData("me", JSON.stringify(profile));
                this.setState({
                  profile: profile,
                  picture1Loading: false
                });
              }
              else if(responseJson.status.includes("dataerror")){
                alert("There was an error with this image. Please select another.");
                this.setState({
                  picture1Loading: false
                });
              }
              else{
                this.setState({
                  picture1: responseJson.status,
                });
                var profile = this.state.profile;
                profile.picture1 = responseJson.status;
                GLOBAL.profile.picture1 = responseJson.status;
                this._storeData("me", JSON.stringify(profile));
                this.setState({
                  profile: profile
                });
              }
            }
            else if (num == 2){
              if(responseJson.status.includes("dataerror") && source == "removeimage"){
                this.setState({
                  picture2: "",
                });
                var profile = this.state.profile;
                profile.picture2 = "";
                GLOBAL.profile.picture2 = "";
                this._storeData("me", JSON.stringify(profile));
                this.setState({
                  profile: profile,
                  picture2Loading: false
                });
              }
              else if(responseJson.status.includes("dataerror")){
                alert("There was an error with this image. Please select another.");
                this.setState({
                  picture2Loading: false
                });
              }
              else{
                this.setState({
                  picture2: responseJson.status,
                });
                var profile = this.state.profile;
                profile.picture2 = responseJson.status;
                GLOBAL.profile.picture2 = responseJson.status;
                this._storeData("me", JSON.stringify(profile));
                this.setState({
                  profile: profile
                });
              }
            }
            else if (num == 3){
              if(responseJson.status.includes("dataerror") && source == "removeimage"){
                this.setState({
                  picture3: "",
                });
                var profile = this.state.profile;
                profile.picture3 = "";
                GLOBAL.profile.picture3 = "";
                this._storeData("me", JSON.stringify(profile));
                this.setState({
                  profile: profile,
                  picture3Loading: false
                });
              }
              else if(responseJson.status.includes("dataerror")){
                alert("There was an error with this image. Please select another.");
                this.setState({
                  picture3Loading: false
                });
              }
              else{
                this.setState({
                  picture3: responseJson.status,
                });
                var profile = this.state.profile;
                profile.picture3 = responseJson.status;
                GLOBAL.profile.picture3 = responseJson.status;
                this._storeData("me", JSON.stringify(profile));
                this.setState({
                  profile: profile
                });
              }
            }
          }
        }
    })
    .catch((error) => {
      this.setState({
        picture0Loading: false,
        picture1Loading: false,
        picture2Loading: false,
        picture3Loading: false
      })
      alert("We're sorry, there seems to be an error. Please try again later.")
    });

  }

  cropPicture = (source, num) => {
    ImagePicker2.openCropper({
      path: source,
      includeBase64: true,
      compressImageQuality: 1,
      width: 1024,
      height: 1024,
    }).then(image => {
        if(num == 0){
          this.setState({
            picture0Loading: true,
            isCropLoading: false
          })
        }
        else if(num == 1){
          this.setState({
            picture1Loading: true,
            isCropLoading: false
          })
        }
        else if(num == 2){
          this.setState({
            picture2Loading: true,
            isCropLoading: false
          })
        }
        else if(num == 3){
          this.setState({
            picture3Loading: true,
            isCropLoading: false
          })
        }
      this.uploadPicture(image.data, num);
    })
    .catch(error => {
      this.setState({
        isCropLoading: false
      })
    });
  }

  selectPicture = (num) => {
    var pass = this;
    this.setState({
      isCropLoading: true
    })
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        this.setState({
          isCropLoading: false
        })
      } else if (response.error) {
        alert("There was an error selecting this image or you may have to turn on permissions.")
        this.setState({
          isCropLoading: false
        })
      } else if (response.customButton) {
        if(num == 0){
          alert("You cannot remove your main picture.")
          this.setState({
            isCropLoading: false
          })
        }
        else{
          this.uploadPicture("removeimage", num);
          this.setState({
            isCropLoading: false
          })
        }
      } else {
        const source = response.uri;
        pass.cropPicture(source, num)
      }
    })
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
      //name and year
      var details = {
        "token": GLOBAL.authToken,
        "firstname_display": this.state.nameToSave,
        "birthdate": this.state.birthdateToSave
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/up/ena', {
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
                profile.firstname_display = this.state.nameToSave;
                profile.birthdate = this.state.birthdateToSave;
                GLOBAL.profile.firstname_display = this.state.nameToSave;
                GLOBAL.profile.birthdate = this.state.birthdateToSave;
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
    else if(this.state.dialogType == 5){
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
              GLOBAL.profile.lookingFor = this.state.lookingForToSave;
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

  render() {
    console.disableYellowBox = true;

    return (
      //
      <SafeAreaView style={{
        flex:1,
        backgroundColor: "#ffffff"
      }}>
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
          <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={25} color="black" /></TouchableOpacity>
          <Text style={{fontSize: 30, textAlign: "center", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>My Profile</Text>
          <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.previewprofile({fromMatchConvo: false, picture0: this.state.profile.picture0, username: this.state.profile.firstname_display, birthdate: this.state.profile.birthdate, program: this.state.profile.program, year: this.state.profile.year, bio: this.state.profile.bio, picture1: this.state.profile.picture1, caption0: this.state.profile.caption0, picture2: this.state.profile.picture2, caption1: this.state.profile.caption1, storyHeadline: this.state.profile.storyHeadline, story: this.state.profile.story, picture3: this.state.profile.picture3, caption2: this.state.profile.caption2, pronouns: this.state.profile.pronouns, lookingFor: this.state.profile.lookingFor})} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="eye" size={25} color="black" /></TouchableOpacity>
        </View>
        <ScrollView>
          <View style={{minHeight: screenHeight-50, height: 'auto', width: screenWidth, borderRadius: 20, backgroundColor: 'white'}}>
            <TouchableOpacity style={{height: 'auto', width: 'auto'}} onPress={() => this.selectPicture(0)} activeOpacity={0.8}>
              <ImageBackground onLoadStart={() => this.setState({picture0Loading: true})} onLoadEnd={() => this.setState({picture0Loading: false})} source={{uri: this.state.profile.picture0}} style={{justifyContent: "center", alignItems: "center", backgroundColor: "gray", height: screenHeight*0.65, width: screenWidth}}>
                {(this.state.picture0Loading)?<ActivityIndicator size="large" color="#ff5b99" />:<View></View>}
                {(this.state.profile.picture0 == "" && !this.state.picture0Loading)?<LineIcon name="camera" size={45} color="white" />:<View></View>}
              </ImageBackground>
              <View style={{height: 50, width: 50, borderBottomLeftRadius: 20, backgroundColor: "rgba(0,0,0,1)", position: "absolute", top: 0, right: 0, justifyContent: "center", alignItems: "center"}}>
                <LineIcon name="pencil" size={30} color="white" />
              </View>
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.75)']} style={{position: "absolute", bottom: 0}}>
                <View style={{paddingTop: 40, width: '100%', height: 'auto', flexDirection: 'row'}}>
                  <TouchableOpacity activeOpacity={0.6} onPress={() => this.showNameAge()} style={{width: '100%', height: 'auto', flexDirection: 'row'}}>
                    <Text style={{color: "#ff5b99", fontSize: 35, left: 10, top: 5, fontFamily: "Raleway-Bold"}}>{this.state.profile.firstname_display}</Text>
                    <View style={{height: '100%', width: '100%', position: 'relative'}}>
                      <View style={{left: 15, height: 6, width: 6, borderRadius: 3, backgroundColor: "#fff", position: 'absolute', bottom: 7}}></View>
                      <Text style={{paddingLeft: 25, color: "#fff", fontSize: 18, position: 'absolute', bottom: 0, fontFamily: "Raleway-Light"}}>{this.getAge()}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <TouchableOpacity activeOpacity={0.6} onPress={() => this.showProgramYear()} style={{width: '100%', height: 'auto', flexDirection: 'row'}}>
                  <Text style={{color: "#fff", fontSize: 18, left: 10, top: 5, paddingBottom: 5, fontFamily: "Raleway-Regular"}}>{this.state.profile.program}, {this.state.profile.year}</Text>
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.6} onPress={() => this.showPronounLooking()} style={{width: '100%', height: 'auto', flexDirection: 'row'}}>
                {(this.props.lookingFor == "Let's see what happens")?
                <Text style={{color: "#fff", fontSize: 16, left: 10, top: 5, paddingBottom: 20, fontFamily: "Raleway-Light"}}>{this.state.profile.pronouns}, {this.state.profile.lookingFor}</Text>
                :
                <Text style={{color: "#fff", fontSize: 16, left: 10, top: 5, paddingBottom: 20, fontFamily: "Raleway-Light"}}>{this.state.profile.pronouns}, Looking for {this.state.profile.lookingFor}</Text>
                }
              </TouchableOpacity>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity activeOpacity={0.6} onPress={() => this.showBio()} style={{height: 'auto', minHeight: screenWidth*0.15, width: screenWidth}}>
              <Text style={{position: "absolute", color: "rgba(255, 91, 153,0.25)", left: 0, top: 0, fontSize: 100, fontFamily: "Raleway-Regular"}}>❝</Text>
              <View style={{padding: 20, justifyContent: "center"}}>
                <Text style={{textAlign: "center", fontSize: 20, color: "black", fontFamily: "Raleway-Regular"}}>{this.state.profile.bio}</Text>
              </View>
              <Text style={{position: "absolute", color: "rgba(255, 91, 153,0.25)", right: 0, bottom: -35, fontSize: 100, fontFamily: "Raleway-Regular"}}>❞</Text>
            </TouchableOpacity>
            <View style={{padding: 5}}><View style={{height: screenWidth-10, width: screenWidth-10, flexDirection: 'row', borderRadius: 10, backgroundColor: this.isEnabled(1)}}>
            <TouchableOpacity style={{height: 'auto', width: 'auto'}} onPress={() => this.selectPicture(1)} activeOpacity={0.8}>
              <FastImage onLoadStart={() => this.setState({picture1Loading: true})} onLoadEnd={() => this.setState({picture1Loading: false})} source={{uri: this.state.profile.picture1, priority: FastImage.priority.normal}} style={{borderRadius: 10,justifyContent: "center", alignItems: "center", backgroundColor: "gray", height: screenWidth-10, width: screenWidth-10}}>
                {(this.state.picture1Loading)?<ActivityIndicator size="large" color="#ff5b99" />:<View></View>}
                {(!this.state.picture1Loading && this.state.profile.picture1 == "")?<LineIcon name="camera" size={45} color="white" />:<View></View>}
                {(this.state.profile.picture1 != "")?
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.75)', '#000']} style={{position: "absolute", bottom: 0}}>
                  <TouchableOpacity activeOpacity={0.6} onPress={() => this.showCaption(0)}  style={{justifyContent: "center", height: 'auto', width: screenWidth-10}}>
                    <Text style={{padding: 10, paddingTop:30, textAlign: 'center', fontSize: 20, textAlign: "center", color: "white", fontFamily: "Raleway-Regular"}}>{this.getCaption(0)} <LineIcon name="pencil" size={20} color="white" /></Text>
                  </TouchableOpacity>
                </LinearGradient>:<View></View>}
                <View style={{height: 50, width: 50, borderBottomLeftRadius: 20, borderTopRightRadius: 10, backgroundColor: "rgba(0,0,0,1)", position: "absolute", top: 0, right: 0, justifyContent: "center", alignItems: "center"}}>
                  {(this.state.profile.picture1 != "")?<LineIcon name="pencil" size={30} color="white" />:<LineIcon name="plus" size={30} color="white" />}
                </View>
              </FastImage>
            </TouchableOpacity>
            </View></View>
            <View style={{padding: 5}}><View style={{height: screenWidth-10, width: screenWidth-10, flexDirection: 'row', borderRadius: 10, backgroundColor: this.isEnabled(2)}}>
            <TouchableOpacity style={{height: 'auto', width: 'auto'}} onPress={() => this.selectPicture(2)} activeOpacity={0.8}>
              <FastImage onLoadStart={() => this.setState({picture2Loading: true})} onLoadEnd={() => this.setState({picture2Loading: false})} source={{uri: this.state.profile.picture2, priority: FastImage.priority.normal}} style={{borderRadius: 10,justifyContent: "center", alignItems: "center", backgroundColor: "gray", height: screenWidth-10, width: screenWidth-10}}>
                {(this.state.picture2Loading)?<ActivityIndicator size="large" color="#ff5b99" />:<View></View>}
                {(!this.state.picture2Loading && this.state.profile.picture2 == "")?<LineIcon name="camera" size={45} color="white" />:<View></View>}
                {(this.state.profile.picture2 != "")?
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.75)', '#000']} style={{position: "absolute", bottom: 0}}>
                  <TouchableOpacity activeOpacity={0.6} onPress={() => this.showCaption(1)}  style={{justifyContent: "center", height: 'auto', width: screenWidth-10}}>
                    <Text style={{padding: 10, paddingTop:30, textAlign: 'center', fontSize: 20, textAlign: "center", color: "white", fontFamily: "Raleway-Regular"}}>{this.getCaption(1)} <LineIcon name="pencil" size={20} color="white" /></Text>
                  </TouchableOpacity>
                </LinearGradient>:<View></View>}
                <View style={{height: 50, width: 50, borderBottomLeftRadius: 20, borderTopRightRadius: 10, backgroundColor: "rgba(0,0,0,1)", position: "absolute", top: 0, right: 0, justifyContent: "center", alignItems: "center"}}>
                  {(this.state.profile.picture2 != "")?<LineIcon name="pencil" size={30} color="white" />:<LineIcon name="plus" size={30} color="white" />}
                </View>
              </FastImage>
            </TouchableOpacity>
            </View></View>
            <View style={{padding: 5}}><View style={{height: screenWidth-10, width: screenWidth-10, flexDirection: 'row', borderRadius: 10, backgroundColor: this.isEnabled(3)}}>
            <TouchableOpacity style={{height: 'auto', width: 'auto'}} onPress={() => this.selectPicture(3)} activeOpacity={0.8}>
              <FastImage onLoadStart={() => this.setState({picture3Loading: true})} onLoadEnd={() => this.setState({picture3Loading: false})} source={{uri: this.state.profile.picture3, priority: FastImage.priority.normal}} style={{borderRadius: 10,justifyContent: "center", alignItems: "center", backgroundColor: "gray", height: screenWidth-10, width: screenWidth-10}}>
                {(this.state.picture3Loading)?<ActivityIndicator size="large" color="#ff5b99" />:<View></View>}
                {(!this.state.picture3Loading && this.state.profile.picture3 == "")?<LineIcon name="camera" size={45} color="white" />:<View></View>}
                {(this.state.profile.picture3 != "")?
                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.75)', '#000']} style={{position: "absolute", bottom: 0}}>
                  <TouchableOpacity activeOpacity={0.6} onPress={() => this.showCaption(2)}  style={{justifyContent: "center", height: 'auto', width: screenWidth-10}}>
                    <Text style={{padding: 10, paddingTop:30, textAlign: 'center', fontSize: 20, textAlign: "center", color: "white", fontFamily: "Raleway-Regular"}}>{this.getCaption(2)} <LineIcon name="pencil" size={20} color="white" /></Text>
                  </TouchableOpacity>
                </LinearGradient>:<View></View>}
                <View style={{height: 50, width: 50, borderBottomLeftRadius: 20, borderTopRightRadius: 10, backgroundColor: "rgba(0,0,0,1)", position: "absolute", top: 0, right: 0, justifyContent: "center", alignItems: "center"}}>
                  {(this.state.profile.picture3 != "")?<LineIcon name="pencil" size={30} color="white" />:<LineIcon name="plus" size={30} color="white" />}
                </View>
              </FastImage>
            </TouchableOpacity>
            </View></View>
            <View style={{height: 20, width: screenWidth}}></View>
          </View>
        </ScrollView>
        <Dialog
          visible={this.state.dialogVisible}
          dialogStyle={{marginTop: -150, maxHeight: 300}}
          onTouchOutside={() => this.closeDialog()}>
          {(this.state.dialogType == 0)?
          <View>
            <Text style={{fontSize: 20, paddingBottom: 5, paddingTop: 5, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-bold"}}>Edit your Name:</Text>
            <TextInput
              placeholder="Name"
              keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
              value={this.state.nameToSave}
              placeholderTextColor="#aaaaaa"
              style={{color: "black", padding: 5, fontSize: 18, backgroundColor: "#cecece", borderRadius: 2}}
              multiline={false}
              maxLength={16}
              onChangeText={(name) => this._handleNameChange(name)}
              >
              </TextInput>
              <Text style={{fontSize: 20, paddingBottom: 5, paddingTop: 5, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-bold"}}>Edit your Age:</Text>
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
                  datePicker: {
                    backgroundColor: '#cecece',
                    justifyContent:'center',
                    alignItems: "center"
                  }
                }}
                onDateChange={(date) => {this._handleBirthdate(date)}}
              />
          </View>
          :
          (this.state.dialogType == 1)?
          <View>
            <Text style={{fontSize: 20, paddingBottom: 5, paddingTop: 5, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-bold"}}>Edit your Program:</Text>
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
        {(this.state.isCropLoading)?<Loading />:<View></View>}
      </View>
      </SafeAreaView>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
