import React, {Component} from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Linking, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';
import ImagePicker from 'react-native-image-picker';
import ImagePicker2 from 'react-native-image-crop-picker';
import GLOBAL from '../global.js';
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import {check, request, PERMISSIONS, RESULTS, checkNotifications, requestNotifications} from 'react-native-permissions';

import UIButton from '../components/UIButton';
import GenderButton from '../components/GenderButton';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

import FastImage from 'react-native-fast-image'

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
    if(GLOBAL.authToken == null || GLOBAL.authToken == undefined || GLOBAL.authToken == ""){
      Actions.replace("login");
    }
  }


  state = {
    bioToSave: "",
    picture0: "",
    pronounsToSave: "",
    lookingForToSave: "",
    pictureLoading: false,
    isCropLoading: false
  }

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
      Actions.replace("swipe", {firstTime: true});
    } catch (e) {
      // saving error
    }
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

  cleanSmartPunctuation = (value) => {
    return value.replace(/[‘]/g, "'").replace(/[‛]/g, "'").replace(/[“]/g, '"').replace(/[‟]/g, '"').replace(/[’]/g, "'").replace(/[”]/g, '"').replace(/[′]/g, "'").replace(/[″]/g, '"').replace(/[‵]/g, "'").replace(/[‶]/g, '"').replace(/[—]/g, '-').replace(/[–]/g, '-')
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
                  this._storeData("me", JSON.stringify({'firstname_display': GLOBAL.profileCreate.firstname_display,
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
                  'reshow_profiles': true
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

  cropPicture = (source, num) => {
    ImagePicker2.openCropper({
      path: source,
      includeBase64: true,
      compressImageQuality: 1,
      width: screenWidth,
      height: screenHeight*0.75,
    }).then(image => {
      this.setState({
        pictureLoading: true,
        isCropLoading: false
      })
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
        alert("There was an error selecting this image.")
        this.setState({
          isCropLoading: false
        })
      } else {
        const source = response.uri;
        pass.cropPicture(source, num)
      }
    })
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
        <ScrollView>
          <View style={{height: 'auto', width: screenWidth, borderRadius: 20, backgroundColor: 'white'}}>
          <View style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 50, width: screenWidth, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 30, width: 50}}><LineIcon style={{left: 10}} name="arrow-left" size={25} color="black" /></TouchableOpacity>
              <Image source={navlogo} style={{resizeMode: 'contain', height: 40, width: 120}}></Image>
              <View style={{flexDirection: "row", height: 50, width: 50, alignItems: "flex-start"}}></View>

            </View>
            <View  style={{ marginTop:10, marginLeft: 15, height : 50, width : 110,backgroundColor: "#cf2d6a"}}>
            <Text style={{fontSize: 26, paddingTop: 6, paddingLeft: 15, textAlign: "left", color: "white", fontFamily: "Raleway-Bold", justifyContent: "center"}}>Step 3:</Text>
            </View>
            <Text style={{fontSize: 26, paddingTop: 5, paddingBottom: 10, paddingLeft: 15, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-Bold"}}>My Profile</Text>


            <Text style={{fontSize: 20, paddingTop: 30, paddingBottom: 20, paddingLeft: 15, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-Bold"}}>Here's a picture of me:</Text>
            <TouchableOpacity style={{height: 'auto', width: 'auto'}} onPress={() => this.selectPicture(0)} activeOpacity={0.8}>
              <FastImage onLoadStart={() => this.setState({pictureLoading: true})} onLoadEnd={() => this.setState({pictureLoading: false})} source={{uri: 'https://rumine.ca/_i/s/i.php?i=' + this.state.picture0, priority: FastImage.priority.normal}} style={{justifyContent: "center", alignItems: "center", backgroundColor: "gray", height: screenHeight*0.75, width: screenWidth}}>
                {(this.state.pictureLoading)?<ActivityIndicator size="large" color="#ff5b99" />:<View></View>}
                {(this.state.picture0 == "" && !this.state.pictureLoading)?<LineIcon name="camera" size={45} color="white" />:<View></View>}
              </FastImage>
              <View style={{height: 50, width: 50, borderTopLeftRadius: 20, backgroundColor: "rgba(0,0,0,1)", position: "absolute", bottom: 0, right: 0, justifyContent: "center", alignItems: "center"}}>
                <LineIcon name="pencil" size={30} color="white" />
              </View>
            </TouchableOpacity>
            <Text style={{fontSize: 20, paddingTop: 30, paddingBottom: 20, paddingLeft: 20, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-Bold"}}>Create your bio:</Text>
            <TextInput
              placeholder="Bio"
              value={this.state.bioToSave}
              placeholderTextColor="#aaaaaa"
              style={{color: "black", padding: 10, fontSize: 20, width: screenWidth*0.9, left: screenWidth*0.05, backgroundColor: "white", borderRadius: 10, borderColor: "#f78cb4", borderWidth: 2}}
              multiline={true}
              maxLength={1024}
              onChangeText={(bio) => this._handleBioChange(bio)}
              >
              </TextInput>
              <Text style={{fontSize: 20, paddingTop: 30, paddingBottom: 20, paddingLeft: 20, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-Bold"}}>My Pronouns are:</Text>
              <TextInput
                placeholder="Pronouns"
                value={this.state.pronounsToSave}
                placeholderTextColor="#aaaaaa"
                style={{color: "black", padding: 10, fontSize: 20, width: screenWidth*0.9, left: screenWidth*0.05, backgroundColor: "white", borderRadius: 10, borderColor: "#f78cb4", borderWidth: 2}}
                multiline={false}
                maxLength={16}
                onChangeText={(pronouns) => this._handlePronouns(pronouns)}
                >
                </TextInput>
              <Text style={{fontSize: 20, paddingTop: 30, paddingBottom: 20, paddingLeft: 20, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-Bold"}}>I'm Looking For:</Text>
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
                style={{ inputIOS: {fontSize: 20, color: "black", fontSize: 18, padding: 10,backgroundColor: "white", borderRadius: 10, borderColor: "#f78cb4", borderWidth: 2, width: screenWidth*0.9, left: screenWidth*0.05}}}
              />
              <View style = {{marginTop: 25, justifyContent: "center", alignItems: "center"}}>
              <TouchableOpacity activeOpacity={0.8} onPress={() => this.saveProfile()} style={{marginBottom: 50, height: 60, width: screenWidth*0.5, backgroundColor: "#cf2d6a", borderRadius: 25, justifyContent: "center", alignItems: "center"}}>
                    <Text style={{color: "white", fontSize: 25, fontFamily: "Raleway-Bold"}}>Finish</Text>
              </TouchableOpacity>
              </View>




          </View>
        </ScrollView>
        {(this.state.isCropLoading)?<Loading />:<View></View>}
      </KeyboardAvoidingView>
      </SafeAreaView>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
