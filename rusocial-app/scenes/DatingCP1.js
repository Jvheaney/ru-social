import React, {Component} from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Linking, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';
import GLOBAL from '../global.js';
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import Icon from 'react-native-vector-icons/FontAwesome'
import {check, request, PERMISSIONS, RESULTS, checkNotifications, requestNotifications} from 'react-native-permissions';
import ImagePicker from 'react-native-image-picker';
import ImagePicker2 from 'react-native-image-crop-picker';
import FastImage from 'react-native-fast-image'

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


import navlogo from '../assets/images/NBF_2.png';
import Loading from '../components/Loading';

const options = {
  title: 'Select Image',
  quality: 1,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class Swipe extends Component {

  componentDidMount() {
    this.getPrograms()
    if(GLOBAL.authToken == null || GLOBAL.authToken == undefined || GLOBAL.authToken == ""){
      Actions.replace("login");
    }
  }

  state = {
    nameToSave: GLOBAL.firstname,
    lastnameToSave: GLOBAL.lastname,
    birthdateToSave: "",
    programToSave: "",
    yearToSave: "",
    programsToPick: [],
    stepNum: 1,
    clicked: [false, false, false, false, false],
    clickedIdentify: [false, false, false, false, false, false, false],
    bioToSave: "",
    picture0: "",
    pronounsToSave: "",
    lookingForToSave: "",
    pictureLoading: false,
    isCropLoading: false,
    savedStep: [false, false, false]
  }

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
      //Actions.replace("swipe", {firstTime: true});
    } catch (e) {
      // saving error
    }
  }

  _handleSelected = (num) => {
    if(this.state.clicked[num]){
      var clickedArr = this.state.clicked;
      clickedArr[num] = false;
      this.setState({
        clicked : clickedArr
      })
    }
    else{
      var clickedArr = this.state.clicked;
      clickedArr[num] = true;
      this.setState({
        clicked: clickedArr
      })
    }
  }

  _handleGenderSelected = (num) => {
      var clickedArr = [false, false, false, false, false, false, false];
      clickedArr[num] = true;
      this.setState({
        clickedIdentify : clickedArr
      })
  }

  cleanSmartPunctuation = (value) => {
    return value.replace(/[‘]/g, "'").replace(/[‛]/g, "'").replace(/[“]/g, '"').replace(/[‟]/g, '"').replace(/[’]/g, "'").replace(/[”]/g, '"').replace(/[′]/g, "'").replace(/[″]/g, '"').replace(/[‵]/g, "'").replace(/[‶]/g, '"').replace(/[—]/g, '-').replace(/[–]/g, '-')
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

  _handleProgram = (value) => {
    this.setState({
      programToSave: value
    })
  }

  _handleNameChange = (name) => {
    this.setState({
      nameToSave: name
    })
  }

  _handleLastNameChange = (name) => {
    this.setState({
      lastnameToSave: name
    })
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

  _handleYear = (value) => {
    this.setState({
      yearToSave: value
    })
  }

  checkPermissionsAndroid = () => {
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            this._storeData("allowLocation", "false");
            break;
          case RESULTS.DENIED:
            this._storeData("allowLocation", "false");
            break;
          case RESULTS.GRANTED:
            this.toggleLocationStatus();
            this._storeData("allowLocation", "true");
            break;
          case RESULTS.BLOCKED:
            this._storeData("allowLocation", "false");
            break;
        }
      })
      .catch(error => {
      });
      check(PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              this._storeData("allowLocation", "false");
              GLOBAL.allowLocation = "false";
              break;
            case RESULTS.DENIED:
              this._storeData("allowLocation", "false");
              GLOBAL.allowLocation = "false";
              break;
            case RESULTS.GRANTED:
              this.toggleLocationStatus();
              this._storeData("allowLocation", "true");
              GLOBAL.allowLocation = "true";
              break;
            case RESULTS.BLOCKED:
              this._storeData("allowLocation", "false");
              GLOBAL.allowLocation = "false";
              break;
          }
        })
        .catch(error => {
        });
        check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION)
          .then(result => {
            switch (result) {
              case RESULTS.UNAVAILABLE:
                this._storeData("allowLocation", "false");
                GLOBAL.allowLocation = "false";
                break;
              case RESULTS.DENIED:
                this._storeData("allowLocation", "false");
                GLOBAL.allowLocation = "false";
                break;
              case RESULTS.GRANTED:
                this.toggleLocationStatus();
                this._storeData("allowLocation", "true");
                GLOBAL.allowLocation = "true";
                break;
              case RESULTS.BLOCKED:
                this._storeData("allowLocation", "false");
                GLOBAL.allowLocation = "false";
                break;
            }
          })
          .catch(error => {
          });
          checkNotifications().then(({status, settings}) => {
            if(status == "granted"){
              this._storeData("allowNotification", "true");
              GLOBAL.allowNotification = "true";
            }
            else{
              requestNotifications(['alert', 'sound']).then(({status, settings}) => {
                if(status == "granted"){
                  this.toggleNotificationStatus();
                  this._storeData("allowNotification", "true");
                  GLOBAL.allowNotification = "true";
                }
                else{
                  this._storeData("allowNotification", "false");
                  GLOBAL.allowNotification = "false";
                }
              });
            }
          });
  }

  checkPermissionsIOS = () => {
    check(PERMISSIONS.IOS.LOCATION_ALWAYS)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            this._storeData("allowLocation", "false");
            break;
          case RESULTS.DENIED:
            this._storeData("allowLocation", "false");
            break;
          case RESULTS.GRANTED:
            this.toggleLocationStatus();
            this._storeData("allowLocation", "true");
            break;
          case RESULTS.BLOCKED:
            this._storeData("allowLocation", "false");
            break;
        }
      })
      .catch(error => {
      });
      check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
        .then(result => {
          switch (result) {
            case RESULTS.UNAVAILABLE:
              this._storeData("allowLocation", "false");
              GLOBAL.allowLocation = "false";
              break;
            case RESULTS.DENIED:
              this._storeData("allowLocation", "false");
              GLOBAL.allowLocation = "false";
              break;
            case RESULTS.GRANTED:
              this.toggleLocationStatus();
              this._storeData("allowLocation", "true");
              GLOBAL.allowLocation = "true";
              break;
            case RESULTS.BLOCKED:
              this._storeData("allowLocation", "false");
              GLOBAL.allowLocation = "false";
              break;
          }
        })
        .catch(error => {
        });
          checkNotifications().then(({status, settings}) => {
            if(status == "granted"){
              this.toggleNotificationStatus();
              this._storeData("allowNotification", "true");
              GLOBAL.allowNotification = "true";
            }
            else{
              requestNotifications(['alert', 'sound']).then(({status, settings}) => {
                if(status == "granted"){
                  this.toggleNotificationStatus();
                  this._storeData("allowNotification", "true");
                  GLOBAL.allowNotification = "true";
                }
                else{
                  this._storeData("allowNotification", "false");
                  GLOBAL.allowNotification = "false";
                }
              });
            }
          });
  }

  toggleLocationStatus = () => {
      var details = {
        "token": GLOBAL.authToken,
        "toggle_value": true
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/s/l', {
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
          else if(responseJson.status == "wrongdata"){
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
          }
          else{
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
          }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
  }

  toggleNotificationStatus = () => {
      var details = {
        "token": GLOBAL.authToken,
        "toggle_value": true
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      return fetch('https://rumine.ca/_apiv2/gw/s/n', {
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
          else if(responseJson.status == "wrongdata"){
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
          }
          else{
            if(responseJson['token'] != "NA"){
              this._storeData("authToken", responseJson.token);
              GLOBAL.authToken = responseJson.token;
            }
          }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
  }

  saveProfile = async () => {
    if(this.state.picture0 == "null" || this.state.picture0 == null || this.state.picture0 == "" || GLOBAL.profileCreate.firstname_display == "" || GLOBAL.profileCreate.firstname_display == "null" || GLOBAL.profileCreate.birthdate == "" || GLOBAL.profileCreate.birthdate == "null" || GLOBAL.profileCreate.birthdate == null || GLOBAL.profileCreate.program == "" || GLOBAL.profileCreate.program == null || GLOBAL.profileCreate.program == "null" || GLOBAL.profileCreate.year == "" || GLOBAL.profileCreate.year == "null" || GLOBAL.profileCreate.year == null || this.state.pronounsToSave == "" || this.state.lookingForToSave == "" || this.state.lookingForToSave == null || this.state.lookingForToSave == "null"){
      alert("You are missing profile details.");
    }
    else{
      const t1 = await requestNotifications(['alert', 'lockScreen', 'notificationCenter']).then(({status, settings}) => {});
      const t2 = await request(
        Platform.select({
          android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
        }),
        Platform.select({
          android: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
          ios: PERMISSIONS.IOS.LOCATION_ALWAYS,
        }),
        Platform.select({
          android: PERMISSIONS.ACCESS_BACKGROUND_LOCATION
        }),
      );
      if(Platform.OS == "ios"){
        this.checkPermissionsIOS();
      }
      else{
        this.checkPermissionsAndroid();
      }
      GLOBAL.profileCreate.token = GLOBAL.authToken;
      GLOBAL.profileCreate.bio = this.cleanSmartPunctuation(this.state.bioToSave);
      GLOBAL.profileCreate.pronouns = this.cleanSmartPunctuation(this.state.pronounsToSave);
      GLOBAL.profileCreate.lookingfor = this.state.lookingForToSave;
        var formBody = [];
        for (var property in GLOBAL.profileCreate) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(GLOBAL.profileCreate[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        return fetch('https://rumine.ca/_apiv2/gw/up/c', {
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
            else if(responseJson.status == "save-error"){
              alert("There was an error saving your profile. Please try again later.");
            }
            else if(responseJson.status == "wrongdata"){
              alert("There was an error with the data. Please fill in the steps again.");
            }
            else if(responseJson.status == "success"){
                if(responseJson.token != "NA"){
                  this._storeData("authToken", responseJson.token);
                  GLOBAL.authToken = responseJson.token;
                }
                else{
                  this._storeData("friends-me", JSON.stringify({}));
                  this._storeData("me", JSON.stringify({'firstname_display': GLOBAL.profileCreate.firstname_display,
                  'lastname': GLOBAL.profileCreate.lastname,
                  'birthdate': GLOBAL.profileCreate.birthdate,
                  'program': GLOBAL.profileCreate.program,
                  'year': GLOBAL.profileCreate.year,
                  'bio': GLOBAL.profileCreate.bio,
                  'pronouns': GLOBAL.profileCreate.pronouns,
                  'lookingFor': GLOBAL.profileCreate.lookingfor,
                  'badges':"[]",
                  'interests':"[]",
                  'top_5_spotify':"[]",
                  'image0': this.state.picture0,
                  'image1': undefined,
                  'image2': undefined,
                  'image3': undefined,
                  'gender': GLOBAL.profileCreate.gender,
                  'int_m': GLOBAL.profileCreate.interested_male,
                  'int_f': GLOBAL.profileCreate.interested_female,
                  'int_nb': GLOBAL.profileCreate.interested_nb,
                  'int_t': GLOBAL.profileCreate.interested_trans,
                  'int_o': GLOBAL.profileCreate.interested_other,
                  'start_age': 18,
                  'end_age': 40,
                  'reshow_profiles': true,
                  'show_me': true
                  }));
                  Actions.replace("swipe", {firstTime: true});
                }
              }
        })
        .catch((error) => {
          alert("We're sorry, there seems to be an error. Please try again later.")
        });
    }
  }

  uploadPicture = (source, num) => {
    var fd = new FormData();
    fd.append("token", GLOBAL.authToken)
    fd.append("imageFile", source)
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
        else if(responseJson.status == "wrongdata"){
          alert("There was an error, please restart the app.");
        }
        else if(responseJson.status == "dataerror"){
          alert("There was an error with this image. Please select another.");
        }
        else{
          if(responseJson.token != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          this.setState({
            picture0: responseJson.status,
          });
          GLOBAL.profileCreate.image0 = responseJson.status;
        }
    })
    .catch((error) => {
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
    });
  }

  selectPicture = (index) => {
    this.setState({pictureLoading: true})
    var pass = this;
    ImagePicker2.openPicker({
      mediaType: "photo",
      compressImageQuality: 0.8,
      forceJpg: true
    }).then(response => {
        pass.cropPicture(response, index)
    });
  }

  _handleBioChange = (bio) => {
    this.setState({
      bioToSave: bio
    })
  }

  _handleLookingFor= (lookingFor) => {
    this.setState({
      lookingForToSave: lookingFor
    })
  }

  _handlePronouns = (pronouns) => {
    this.setState({
      pronounsToSave: pronouns
    })
  }

  saveStep1 = () => {
    if(this.state.nameToSave != "" && this.state.nameToSave != null && this.state.lastnameToSave != "" && this.state.lastnameToSave != null && this.state.birthdateToSave != "" && this.state.birthdateToSave != "null" && this.state.birthdateToSave != null && this.state.programToSave != "" && this.state.programToSave != "null" && this.state.programToSave != null && this.state.yearToSave != "" && this.state.yearToSave != null && this.state.yearToSave != "null"){

      var sanitized_fn = this.cleanSmartPunctuation(this.state.nameToSave).replace(/[`~!@#$%^&*()_|+=?;:",.<>\{\}\[\]\\\/]/gi, '').replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();
      var sanitized_ln = this.cleanSmartPunctuation(this.state.lastnameToSave).replace(/[`~!@#$%^&*()_|+=?;:",.<>\{\}\[\]\\\/]/gi, '').replace(/([\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '').trim();

      if(sanitized_fn.length == 0 || sanitized_ln.length == 0){
        alert("Special characters are not allowed in the name fields.");
        return;
      }

      GLOBAL.profileCreate.firstname_display = sanitized_fn;
      GLOBAL.profileCreate.lastname = sanitized_ln;
      GLOBAL.profileCreate.birthdate = this.state.birthdateToSave;
      GLOBAL.profileCreate.program = this.state.programToSave;
      GLOBAL.profileCreate.year = this.state.yearToSave;
      this.setState({
        stepNum: 2,
        savedStep: [true, false, false]
      })
    }
    else{
      alert("You are missing profile details.");
    }
  }

  saveStep2 = () => {
    if(this.state.clicked.includes(true) && this.state.clickedIdentify.includes(true)){
      GLOBAL.profileCreate.interested_male = this.state.clicked[0];
      GLOBAL.profileCreate.interested_female = this.state.clicked[1];
      GLOBAL.profileCreate.interested_nb = this.state.clicked[2];
      GLOBAL.profileCreate.interested_trans = this.state.clicked[3];
      GLOBAL.profileCreate.interested_other = this.state.clicked[4];
      GLOBAL.profileCreate.gender = this.state.clickedIdentify.indexOf(true);
      this.setState({
        stepNum: 3,
        savedStep: [true, true, false]
      })
    }
    else{
      alert("Please select at least one of each field.");
    }
  }

  render() {
    console.disableYellowBox = true;

    return (
      //
      <SafeAreaView style={{
        flex:1,
        backgroundColor: "white"
      }}>
      <KeyboardAvoidingView style={{
        flex: 1,
        backgroundColor: "white"
      }}
      keyboardVerticalOffset={
        Platform.select({
          ios: () => 0,
          android: () => -200
        })()}
      behavior="padding" enabled>
      <StatusBar
        barStyle="dark-content" // Here is where you change the font-color
        />
          <View style={{height: 'auto', width: screenWidth, borderRadius: 20, backgroundColor: 'white'}}>
            <View style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 50, width: screenWidth, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
              <TouchableOpacity activeOpacity={0.7} onPress={() => Actions.replace("createprofile")} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center", justifyContent: "center"}}><LineIcon name={"arrow-left"} size={20} /></TouchableOpacity>
              <Image source={navlogo} style={{resizeMode: 'contain', height: 40, width: 120}}></Image>
              <View style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}></View>
            </View>
            <View style={{position: "absolute", top: 50, width: screenWidth, height: 5}}>
              <View style={{height: '100%', width: this.state.stepNum*(screenWidth/3), backgroundColor: "#ff5b99"}}>
              </View>
            </View>
            <ScrollView>
              {(this.state.stepNum == 1)?
              <View style={{minHeight: screenHeight}}>
                <View  style={{ marginTop:30, marginLeft: 15, height : 50, width : 110,backgroundColor: "#ff5b99"}}>
                  <Text style={{fontSize: 26, paddingTop: 6, paddingLeft: 15, textAlign: "left", color: "white", fontFamily: "Raleway-Bold", justifyContent: "center"}}>Step 1:</Text>
                </View>
                <Text style={{fontSize: 26, paddingTop: 5, paddingBottom: 20, paddingLeft: 15, textAlign: "left", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>Background Info</Text>


                <Text style={{fontSize: 20, paddingTop: 20, paddingBottom: 20, paddingLeft: 17, textAlign: "left", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>My first name is...</Text>
                <TextInput
                  placeholder="First name"
                  value={this.state.nameToSave}
                  keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                  placeholderTextColor="#aaaaaa"
                  style={{color: "black", padding: 10, fontSize: 25, width: screenWidth*0.9, left: screenWidth*0.05, backgroundColor: "white", borderRadius: 10, borderColor: "#ff5b99", borderWidth: 2}}
                  multiline={false}
                  maxLength={32}
                  onChangeText={(name) => this._handleNameChange(name)}
                  >
                </TextInput>
                <Text style={{fontSize: 20, paddingTop: 20, paddingBottom: 20, paddingLeft: 17, textAlign: "left", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>My last name is...</Text>
                <TextInput
                  placeholder="Last name"
                  value={this.state.lastnameToSave}
                  keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                  placeholderTextColor="#aaaaaa"
                  style={{color: "black", padding: 10, fontSize: 25, width: screenWidth*0.9, left: screenWidth*0.05, backgroundColor: "white", borderRadius: 10, borderColor: "#ff5b99", borderWidth: 2}}
                  multiline={false}
                  maxLength={48}
                  onChangeText={(name) => this._handleLastNameChange(name)}
                  >
                </TextInput>
                <Text style={{fontSize: 12, paddingLeft: 20, textAlign: "left", color: "black", fontFamily: "Raleway-Medium"}}>Your last name will not be displayed on your profile.</Text>
                <Text style={{fontSize: 20, paddingTop: 20, paddingBottom: 20, paddingLeft: 15, textAlign: "left", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>My birthday is:</Text>
                <DatePicker
                  style={{backgroundColor: "white", width: screenWidth*0.93, left: screenWidth*0.04, borderWidth: 2, borderRadius: 10, borderColor: "#ff5b99"}}
                  date={this.state.birthdateToSave}
                  mode="date"
                  placeholder="Select Your Birthday"
                  placeholderTextColor = "black"
                  format="YYYY-MM-DD"
                  minDate="1900-01-01"
                  maxDate={this.getCurrentDate()}
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    borderRadius: 10,
                    dateIcon: {
                      height: 0,
                      width: 0,
                    },
                    dateInput: {
                      fontSize: 20,
                      color: "black",
                      backgroundColor: "white",
                      placeholderTextColor: "black",
                      borderRadius: 10,
                      borderWidth: 0,
                    },
                    placeholderText: {
                      fontSize: 20,
                      color: '#aaaaaa',
                      textAlign:"left"
                    }
                  }}
                  onDateChange={(date) => {this._handleBirthdate(date)}}
                />
                <Text style={{fontSize: 20, paddingTop: 20, paddingBottom: 20, paddingLeft: 15, textAlign: "left", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>My program is:</Text>
                <RNPickerSelect
                  onValueChange={(value) => this._handleProgram(value)}
                  items={this.state.programsToPick}
                  placeholder={{
                    label: 'Select a Program...',
                    value: null,
                    color: 'black',
                    placeholderTextColor: "black",
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}
                  value={this.state.programToSave}
                  style={{ inputIOS: {fontSize: 20, color: "black", fontSize: 18, padding: 10, backgroundColor: "white", borderWidth: 2, borderRadius: 10, borderColor: "#ff5b99", width: screenWidth*0.9, left: screenWidth*0.05}}}
                />
                <Text style={{fontSize: 20, paddingTop: 20, paddingBottom: 20, paddingLeft: 15, textAlign: "left", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>Which year are you in?</Text>
                <RNPickerSelect
                  onValueChange={(value) => this._handleYear(value)}
                  items={[{ label: "1st Year", value: "1st Year" }, { label: "2nd Year", value: "2nd Year" }, { label: "3rd Year", value: "3rd Year" }, { label: "4th Year", value: "4th Year" }, { label: "5th Year", value: "5th Year" }, { label: "6th Year", value: "6th Year" }, { label: "7th Year", value: "7th Year" },]}
                  placeholder={{
                    label: 'Select a Year...',
                    value: null,
                    color: 'black',
                    fontSize: 20,
                    fontWeight: 'bold',
                  }}
                  value={this.state.yearToSave}
                  style={{ inputIOS: {fontSize: 20, color: "black", fontSize: 18, padding: 10, backgroundColor: "white", borderWidth: 2, borderRadius: 10, borderColor: "#ff5b99", width: screenWidth*0.9, left: screenWidth*0.05}}}
                />
                <View style = {{marginTop: 25, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                  <View style={{height: 50, width: screenWidth*0.25, alignItems: "center", justifyContent: "center"}}>
                    {(this.state.stepNum != 1)?
                    <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({stepNum: this.state.stepNum--})} style={{height: '100%', width: '40%', backgroundColor: "white", justifyContent: "center", alignItems: "center", borderRadius: 20}}>
                      <Icon size={20} name={"arrow-left"} color={"black"} />
                    </TouchableOpacity>:<View></View>}
                  </View>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => this.saveStep1()} style={{height: 60, width: screenWidth*0.5, backgroundColor: "#ff5b99", borderRadius: 25, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{color: "white", fontSize: 25, fontFamily: "Raleway-Bold"}}>Next Step</Text>
                  </TouchableOpacity>
                  <View style={{height: 50, width: screenWidth*0.25, alignItems: "center", justifyContent: "center"}}>
                    {(this.state.stepNum != 3 && this.state.savedStep[this.state.stepNum-1])?
                    <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({stepNum: 2})} style={{height: '100%', width: '40%', backgroundColor: "white", justifyContent: "center", alignItems: "center", borderRadius: 20}}>
                      <Icon size={20} name={"arrow-right"} color={"black"} />
                    </TouchableOpacity>:<View></View>}
                  </View>
                </View>
                <View style={{height: 120, width: screenWidth}}></View>
              </View>
              :
              (this.state.stepNum == 2)?
              <View style={{minHeight: screenHeight}}>
                <View  style={{ marginTop:30, marginLeft: 15, height : 50, width : 110,backgroundColor: "#ff5b99"}}>
                  <Text style={{fontSize: 26, paddingTop: 6, paddingLeft: 15, textAlign: "left", color: "white", fontFamily: "Raleway-Bold", justifyContent: "center"}}>Step 2:</Text>
                </View>
                <Text style={{fontSize: 26, paddingTop: 5, paddingBottom: 20, paddingLeft: 15, textAlign: "left", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>My Preferences</Text>

                <View style={{marginTop: 30, width: screenWidth, backgroundColor: "white", height: 'auto', paddingLeft: screenWidth*0.05}}>
                  <Text style={{marginTop: 10, marginBottom: 5, fontSize: 18, textAlign: "left", color: "black", fontFamily: "Raleway-Bold"}}>I identify as:</Text>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleGenderSelected(0)} style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-Regular"}}>Male</Text>
                    </View>
                    {(this.state.clickedIdentify[0])?<Icon name="check" size={20} color="#ff5b99" family={"FontAwesome"} />:<View></View>}
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleGenderSelected(1)}  style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-Regular"}}>Female</Text>
                    </View>
                    {(this.state.clickedIdentify[1])?<Icon name="check" size={20} color="#ff5b99" family={"FontAwesome"} />:<View></View>}
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleGenderSelected(2)}  style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-Regular"}}>Non-Binary</Text>
                    </View>
                    {(this.state.clickedIdentify[2])?<Icon name="check" size={20} color="#ff5b99" family={"FontAwesome"} />:<View></View>}
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleGenderSelected(3)}  style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-Regular"}}>Transgender</Text>
                    </View>
                    {(this.state.clickedIdentify[3])?<Icon name="check" size={20} color="#ff5b99" family={"FontAwesome"} />:<View></View>}
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleGenderSelected(4)}  style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-Regular"}}>Transgender Male</Text>
                    </View>
                    {(this.state.clickedIdentify[4])?<Icon name="check" size={20} color="#ff5b99" family={"FontAwesome"} />:<View></View>}
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleGenderSelected(5)}  style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-Regular"}}>Transgender Female</Text>
                    </View>
                    {(this.state.clickedIdentify[5])?<Icon name="check" size={20} color="#ff5b99" family={"FontAwesome"} />:<View></View>}
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleGenderSelected(6)}  style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-Regular"}}>Other</Text>
                    </View>
                    {(this.state.clickedIdentify[6])?<Icon name="check" size={20} color="#ff5b99" family={"FontAwesome"} />:<View></View>}
                  </TouchableOpacity>
                </View>

                <View style={{marginTop: 30, width: screenWidth, backgroundColor: "white", height: 'auto', paddingLeft: screenWidth*0.05}}>
                  <Text style={{marginTop: 10, marginBottom: 5, fontSize: 18, textAlign: "left", color: "black", fontFamily: "Raleway-Bold"}}>I am interested in (select all that apply):</Text>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleSelected(0)} style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-Regular"}}>Male</Text>
                    </View>
                    {(this.state.clicked[0])?<Icon name="check" size={20} color="#ff5b99" family={"FontAwesome"} />:<View></View>}
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleSelected(1)}  style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-Regular"}}>Female</Text>
                    </View>
                    {(this.state.clicked[1])?<Icon name="check" size={20} color="#ff5b99" family={"FontAwesome"} />:<View></View>}
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleSelected(2)}  style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-Regular"}}>Non-Binary</Text>
                    </View>
                    {(this.state.clicked[2])?<Icon name="check" size={20} color="#ff5b99" family={"FontAwesome"} />:<View></View>}
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleSelected(3)}  style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-Regular"}}>Transgender</Text>
                    </View>
                    {(this.state.clicked[3])?<Icon name="check" size={20} color="#ff5b99" family={"FontAwesome"} />:<View></View>}
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleSelected(4)}  style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                      <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-Regular"}}>Other</Text>
                    </View>
                    {(this.state.clicked[4])?<Icon name="check" size={20} color="#ff5b99" family={"FontAwesome"} />:<View></View>}
                  </TouchableOpacity>
                </View>

                <View style = {{marginTop: 25, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                  <View style={{height: 50, width: screenWidth*0.25, alignItems: "center", justifyContent: "center"}}>
                    {(this.state.stepNum != 1)?
                    <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({stepNum: 1})} style={{height: '100%', width: '40%', backgroundColor: "white", justifyContent: "center", alignItems: "center", borderRadius: 20}}>
                      <Icon size={20} name={"arrow-left"} color={"black"} />
                    </TouchableOpacity>:<View></View>}
                  </View>
                  <TouchableOpacity activeOpacity={0.8} onPress={() => this.saveStep2()} style={{height: 60, width: screenWidth*0.5, backgroundColor: "#ff5b99", borderRadius: 25, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{color: "white", fontSize: 25, fontFamily: "Raleway-Bold"}}>Next Step</Text>
                  </TouchableOpacity>
                  <View style={{height: 50, width: screenWidth*0.25, alignItems: "center", justifyContent: "center"}}>
                    {(this.state.stepNum != 3 && this.state.savedStep[this.state.stepNum-1])?
                    <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({stepNum: 3})} style={{height: '100%', width: '40%', backgroundColor: "white", justifyContent: "center", alignItems: "center", borderRadius: 20}}>
                      <Icon size={20} name={"arrow-right"} color={"black"} />
                    </TouchableOpacity>:<View></View>}
                  </View>
                </View>
                <View style={{height: 120, width: screenWidth}}></View>
              </View>
              :
              <View style={{minHeight: screenHeight}}>
                <View  style={{ marginTop:30, marginLeft: 15, height : 50, width : 110,backgroundColor: "#ff5b99"}}>
                  <Text style={{fontSize: 26, paddingTop: 6, paddingLeft: 15, textAlign: "left", color: "white", fontFamily: "Raleway-Bold", justifyContent: "center"}}>Step 3:</Text>
                </View>
                <Text style={{fontSize: 26, paddingTop: 5, paddingBottom: 20, paddingLeft: 15, textAlign: "left", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>My Profile</Text>

                <Text style={{fontSize: 20, paddingTop: 30, paddingBottom: 20, paddingLeft: 15, textAlign: "left", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>Here's a picture of me:</Text>
                <TouchableOpacity style={{height: 'auto', width: 'auto'}} onPress={() => this.selectPicture(0)} activeOpacity={0.8}>
                  <FastImage onLoadEnd={() => this.setState({pictureLoading: false})} source={{uri: 'https://rumine.ca/_i/s/i.php?i=' + this.state.picture0, priority: FastImage.priority.normal}} style={{justifyContent: "center", alignItems: "center", backgroundColor: "gray", height: screenHeight*0.75, width: screenWidth}}>
                    {(this.state.pictureLoading)?<ActivityIndicator size="large" color="#ff5b99" />:<View></View>}
                    {(this.state.picture0 == "" && !this.state.pictureLoading)?<LineIcon name="camera" size={45} color="white" />:<View></View>}
                  </FastImage>
                  <View style={{height: 50, width: 50, borderTopLeftRadius: 20, backgroundColor: "rgba(0,0,0,1)", position: "absolute", bottom: 0, right: 0, justifyContent: "center", alignItems: "center"}}>
                    <LineIcon name="pencil" size={30} color="white" />
                  </View>
                </TouchableOpacity>
                <Text style={{fontSize: 20, paddingTop: 30, paddingBottom: 20, paddingLeft: 20, textAlign: "left", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>Create your bio:</Text>
                <TextInput
                  placeholder="Bio"
                  value={this.state.bioToSave}
                  placeholderTextColor="#aaaaaa"
                  style={{color: "black", padding: 10, fontSize: 20, width: screenWidth*0.9, left: screenWidth*0.05, backgroundColor: "white", borderRadius: 10, borderColor: "#ff5b99", borderWidth: 2}}
                  multiline={true}
                  maxLength={1024}
                  onChangeText={(bio) => this._handleBioChange(bio)}
                  >
                  </TextInput>
                  <Text style={{fontSize: 20, paddingTop: 30, paddingBottom: 20, paddingLeft: 20, textAlign: "left", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>My Pronouns are:</Text>
                  <TextInput
                    placeholder="Pronouns"
                    value={this.state.pronounsToSave}
                    placeholderTextColor="#aaaaaa"
                    style={{color: "black", padding: 10, fontSize: 20, width: screenWidth*0.9, left: screenWidth*0.05, backgroundColor: "white", borderRadius: 10, borderColor: "#ff5b99", borderWidth: 2}}
                    multiline={false}
                    maxLength={16}
                    onChangeText={(pronouns) => this._handlePronouns(pronouns)}
                    >
                    </TextInput>
                  <Text style={{fontSize: 20, paddingTop: 30, paddingBottom: 20, paddingLeft: 20, textAlign: "left", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>I'm Looking For:</Text>
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
                    style={{ inputIOS: {fontSize: 20, color: "black", fontSize: 18, padding: 10,backgroundColor: "white", borderRadius: 10, borderColor: "#ff5b99", borderWidth: 2, width: screenWidth*0.9, left: screenWidth*0.05}}}
                  />
                  <View style = {{marginTop: 25, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
                    <View style={{height: 50, width: screenWidth*0.25, alignItems: "center", justifyContent: "center"}}>
                      {(this.state.stepNum != 1)?
                      <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({stepNum: 2})} style={{height: '100%', width: '40%', backgroundColor: "white", justifyContent: "center", alignItems: "center", borderRadius: 20}}>
                        <Icon size={20} name={"arrow-left"} color={"black"} />
                      </TouchableOpacity>:<View></View>}
                    </View>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => this.saveProfile()} style={{height: 60, width: screenWidth*0.5, backgroundColor: "#ff5b99", borderRadius: 25, justifyContent: "center", alignItems: "center"}}>
                      <Text style={{color: "white", fontSize: 25, fontFamily: "Raleway-Bold"}}>Finish</Text>
                    </TouchableOpacity>
                    <View style={{height: 50, width: screenWidth*0.25, alignItems: "center", justifyContent: "center"}}>
                      {(this.state.stepNum != 3 && this.state.savedStep[this.state.stepNum-1])?
                      <TouchableOpacity activeOpacity={0.7} onPress={() => this.setState({stepNum: 3})} style={{height: '100%', width: '40%', backgroundColor: "white", justifyContent: "center", alignItems: "center", borderRadius: 20}}>
                        <Icon size={20} name={"arrow-right"} color={"black"} />
                      </TouchableOpacity>:<View></View>}
                    </View>
                  </View>
                  <View style={{height: 120, width: screenWidth}}></View>
              </View>
              }
            </ScrollView>
          </View>
      </KeyboardAvoidingView>
      </SafeAreaView>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
