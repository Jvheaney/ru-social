import React, {Component} from 'react';
import { ActivityIndicator, Linking, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";
import GLOBAL from '../global.js';
import LinearGradient from 'react-native-linear-gradient';
import {check, request, PERMISSIONS, RESULTS, checkNotifications, requestNotifications} from 'react-native-permissions';

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';

import GenderButton from '../components/GenderButton';
import navlogo from '../assets/images/NBF_2.png';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

GoogleSignin.configure({
  scopes: [], // what API you want to access on behalf of the user, default is email and profile
  webClientId: '', // client ID of type WEB for your server (needed to verify user ID and offline access)
  androidClientId: '',
  offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
  forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
});

class Swipe extends Component {

  componentDidMount() {
    this.getMessagesFromRuMine();
  }

  state = {
    homeMessages: [],
    signInLoading: false
  }

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
    } catch (e) {
      // saving error
    }
  }

  checkPermissionsAndroid = () => {
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then(result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
            this.toggleLocationStatus(false);
            this._storeData("allowLocation", "false");
            break;
          case RESULTS.DENIED:
            this.toggleLocationStatus(false);
            this._storeData("allowLocation", "false");
            break;
          case RESULTS.GRANTED:
            this.toggleLocationStatus(true);
            this._storeData("allowLocation", "true");
            break;
          case RESULTS.BLOCKED:
            this.toggleLocationStatus(false);
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
              this.toggleLocationStatus(false);
              this._storeData("allowLocation", "false");
              GLOBAL.allowLocation = "false";
              break;
            case RESULTS.DENIED:
              this.toggleLocationStatus(false);
              this._storeData("allowLocation", "false");
              GLOBAL.allowLocation = "false";
              break;
            case RESULTS.GRANTED:
              this.toggleLocationStatus(true);
              this._storeData("allowLocation", "true");
              GLOBAL.allowLocation = "true";
              break;
            case RESULTS.BLOCKED:
              this.toggleLocationStatus(false);
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
                this.toggleLocationStatus(false);
                this._storeData("allowLocation", "false");
                GLOBAL.allowLocation = "false";
                break;
              case RESULTS.DENIED:
                this.toggleLocationStatus(false);
                this._storeData("allowLocation", "false");
                GLOBAL.allowLocation = "false";
                break;
              case RESULTS.GRANTED:
                this.toggleLocationStatus(true);
                this._storeData("allowLocation", "true");
                GLOBAL.allowLocation = "true";
                break;
              case RESULTS.BLOCKED:
                this.toggleLocationStatus(false);
                this._storeData("allowLocation", "false");
                GLOBAL.allowLocation = "false";
                break;
            }
          })
          .catch(error => {
          });
          checkNotifications().then(({status, settings}) => {
            if(status == "granted"){
              this.toggleNotificationStatus(true);
              this._storeData("allowNotification", "true");
              GLOBAL.allowNotification = "true";
            }
            else{
              requestNotifications(['alert', 'sound']).then(({status, settings}) => {
                if(status == "granted"){
                  this.toggleNotificationStatus(true);
                  this._storeData("allowNotification", "true");
                  GLOBAL.allowNotification = "true";
                }
                else{
                  this.toggleNotificationStatus(false);
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
            this.toggleLocationStatus(false);
            this._storeData("allowLocation", "false");
            break;
          case RESULTS.DENIED:
            this.toggleLocationStatus(false);
            this._storeData("allowLocation", "false");
            break;
          case RESULTS.GRANTED:
            this.toggleLocationStatus(true);
            this._storeData("allowLocation", "true");
            break;
          case RESULTS.BLOCKED:
            this.toggleLocationStatus(false);
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
              this.toggleLocationStatus(false);
              this._storeData("allowLocation", "false");
              GLOBAL.allowLocation = "false";
              break;
            case RESULTS.DENIED:
              this.toggleLocationStatus(false);
              this._storeData("allowLocation", "false");
              GLOBAL.allowLocation = "false";
              break;
            case RESULTS.GRANTED:
              this.toggleLocationStatus(true);
              this._storeData("allowLocation", "true");
              GLOBAL.allowLocation = "true";
              break;
            case RESULTS.BLOCKED:
              this.toggleLocationStatus(false);
              this._storeData("allowLocation", "false");
              GLOBAL.allowLocation = "false";
              break;
          }
        })
        .catch(error => {
        });
          checkNotifications().then(({status, settings}) => {
            if(status == "granted"){
              this.toggleNotificationStatus(true);
              this._storeData("allowNotification", "true");
              GLOBAL.allowNotification = "true";
            }
            else{
              requestNotifications(['alert', 'sound']).then(({status, settings}) => {
                if(status == "granted"){
                  this.toggleNotificationStatus(true);
                  this._storeData("allowNotification", "true");
                  GLOBAL.allowNotification = "true";
                }
                else{
                  this.toggleNotificationStatus(false);
                  this._storeData("allowNotification", "false");
                  GLOBAL.allowNotification = "false";
                }
              });
            }
          });
  }

  toggleLocationStatus = (value) => {
      var details = {
        "token": GLOBAL.authToken,
        "toggle_value": value
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

  toggleNotificationStatus = (value) => {
      var details = {
        "token": GLOBAL.authToken,
        "toggle_value": value
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

  getDefaults = () => {
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
    return fetch('https://rumine.ca/_apiv2/gw/s/g', {
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
          alert("There was a problem fetching your default settings.");
          GLOBAL.allowLocation = JSON.stringify(false);
          GLOBAL.allowNotification = JSON.stringify(false);
          this._storeData("allowLocation", GLOBAL.allowLocation);
          this._storeData("allowNotification", GLOBAL.allowNotification);
          Actions.replace("swipe");
        }
      }
      else{
        if(responseJson['token'] != "NA"){
          this._storeData("authToken", responseJson.token);
          GLOBAL.authToken = responseJson.token;
        }
        GLOBAL.allowLocation = JSON.stringify(responseJson.status.location);
        GLOBAL.allowNotification = JSON.stringify(responseJson.status.notifications);
        this._storeData("allowLocation", GLOBAL.allowLocation);
        this._storeData("allowNotification", GLOBAL.allowNotification);
        Actions.replace("swipe");
      }
    })
    .catch((error) => {
      alert("We're sorry, there seems to be an error. Please try again later.")
    });
  }

  getMyProfile = async (authToken) => {
    const t1 = await requestNotifications(['alert', 'lockScreen', 'notificationCenter']).then(({status, settings}) => {
    });
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
      const t1 = await this.checkPermissionsIOS();
    }
    else{
      const t2 = this.checkPermissionsAndroid();
    }
    var details = {
      "token": authToken
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");


    return fetch('https://rumine.ca/_apiv2/gw/up/p', {
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
          alert("There was an error getting your profile. Please try again later.");
        }
        else{
          var profData = responseJson.status.profile;
          this._storeData("me", JSON.stringify({
            'firstname_display': profData.firstname_display,
            'birthdate': profData.birthdate,
            'program': profData.program,
            'year': profData.year,
            'pronouns': profData.pronouns,
            'lookingFor': profData.lookingFor,
            'bio': profData.bio,
            'gender': profData.gender,
            'int_m': profData.interested_male,
            'int_f': profData.interested_female,
            'int_nb': profData.interested_nb,
            'int_t': profData.interested_trans,
            'int_o': profData.interested_other,
            'start_age': profData.start_age,
            'end_age': profData.end_age,
            'reshow_profiles': profData.reshow_profiles,
            'image0': profData.image0,
            'image1': profData.image1,
            'image2': profData.image2,
            'image3': profData.image3,
            'top_5_spotify': profData.top_5_spotify,
            'interests': profData.interests,
            'badges': profData.badges
          }));
          this.getDefaults();
        }
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please try again later.")
      });

  }

  sendTokenToBackend = (idToken) => {
    var details = {
      "idToken": idToken
      };
      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
    return fetch('https://rumine.ca/_apiv2/gw/acc/s2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody,
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          signInLoading: false
        })
        this.signOut();
        if(responseJson == "posterror"){
          alert("There seems to be an error. Please restart the app.");
        }
        else if(responseJson == "tokenerror"){
          alert("There seems to be a server error. Please try again later.");
        }
        else if(responseJson == "wrongaccount"){
          alert("Please use your school account.");
        }
        else if(responseJson == "professor"){
          alert("This app is only available to students at this time. If this was a mistake, please send us an email by using the support link below.");
        }
        else if(responseJson['status'] == "returning"){
          this._storeData("authToken", responseJson['token']);
          GLOBAL.authToken = responseJson['token'];

          //Do profile work Here

          var profData = responseJson.dating;
          if(profData == null){
            this._storeData("me", JSON.stringify({}));
          }
          else{
            this._storeData("me", JSON.stringify({
              'firstname_display': profData.firstname_display,
              'lastname': profData.lastname,
              'birthdate': profData.birthdate,
              'program': profData.program,
              'year': profData.year,
              'pronouns': profData.pronouns,
              'lookingFor': profData.lookingFor,
              'bio': profData.bio,
              'gender': profData.gender,
              'int_m': profData.int_m,
              'int_f': profData.int_f,
              'int_nb': profData.int_nb,
              'int_t': profData.int_t,
              'int_o': profData.int_o,
              'start_age': profData.start_age,
              'end_age': profData.end_age,
              'reshow_profiles': profData.reshow_profiles,
              'image0': (profData.image0=="null")?null:profData.image0,
              'image1': (profData.image1=="null")?null:profData.image1,
              'image2': (profData.image2=="null")?null:profData.image2,
              'image3': (profData.image3=="null")?null:profData.image3,
              'top_5_spotify': profData.top_5_spotify,
              'interests': profData.interests,
              'badges': profData.badges,
              'show_me': profData.datingEnabled
            }));
          }

          var fprofData = responseJson.friends;
          if(fprofData == null){
            this._storeData("friends-me", JSON.stringify({}));
          }
          else{
            this._storeData("friends-me", JSON.stringify({
              'userid': fprofData.userid,
              'firstname_display': fprofData.firstname_display,
              'lastname': fprofData.lastname,
              'birthdate': fprofData.birthdate,
              'program': fprofData.program,
              'year': fprofData.year,
              'pronouns': fprofData.pronouns,
              'bio': fprofData.bio,
              'image0': (fprofData.image0=="null")?null:fprofData.image0,
              'image1': (fprofData.image1=="null")?null:fprofData.image1,
              'image2': (fprofData.image2=="null")?null:fprofData.image2,
              'image3': (fprofData.image3=="null")?null:fprofData.image3,
              'top_5_spotify': fprofData.top_5_spotify,
              'interests': fprofData.interests,
              'badges': fprofData.badges,
              'classes': fprofData.classes,
              'algo_pref': fprofData.algo_pref,
              'show_me': fprofData.show_me
            }));
          }

          this._storeData("allowLocation", JSON.stringify(profData.allow_location_tracking));
          this._storeData("allowNotification", JSON.stringify(profData.allow_notifications));

          Actions.replace("swipe");

        }
        else if(responseJson['status'] == "newuser") {
          this._storeData("authToken", responseJson['token']);
          GLOBAL.authToken = responseJson['token'];
          GLOBAL.firstname = responseJson['firstname'];
          GLOBAL.lastname = responseJson['lastname'];
          Actions.replace("createprofile");
        }
    })
    .catch((error) => {
      this.setState({
        signInLoading: false
      })
      alert("We're sorry, there seems to be an error. Please try again later.")
    });

  }

  getMessagesFromRuMine = () => {
    return fetch('{alt_server_url}/emr_msg/message.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          homeMessages: responseJson
        })
    })
    .catch((error) => {
    });

  }

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };

  signIn = async () => {
    if(this.state.signInLoading){
      return;
    }
    this.setState({
      signInLoading: true
    })
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    this.sendTokenToBackend(userInfo.idToken);
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
      this.setState({
        signInLoading: false
      })
    } else if (error.code === statusCodes.IN_PROGRESS) {
      alert("Please restart the app.");
      this.setState({
        signInLoading: false
      })
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      alert("Please update Google Play Services to continue.");
      this.setState({
        signInLoading: false
      })
    } else {
      alert("Servers are busy, please try again.");
      this.setState({
        signInLoading: false
      })
    }
  }
};

  renderMessages = () => {
    var messagesToPush = [];
    for(var i = 0; i<this.state.homeMessages.length; i++){
      messagesToPush.push(
        <View key={i} style={{margin: 5, height: 'auto', minHeight: 50, width: screenWidth*0.9, backgroundColor: "tomato", justifyContent: "center", padding: 20, borderRadius: 15}}>
          <Text style={{fontSize: 15, textAlign: "justify", color: "black", fontFamily: "Raleway-bold"}}>Message from RU Mine:</Text>
          <Text style={{fontSize: 15, textAlign: "justify", color: "black", fontFamily: "Raleway-regular"}}>{this.state.homeMessages[i].message}</Text>
        </View>
      );
    }
    return (<View style={{position: "absolute", top: 50}}>{messagesToPush}</View>);
  }

  render() {
    console.disableYellowBox = true;

    return (
      //
      <>
      <SafeAreaView style={{ flex:0, backgroundColor: '#ffffff' }} />
      <SafeAreaView style={{
        flex:1,
        backgroundColor: "#5bb8ff"
      }}>
      <View style={{
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: "white"
      }}>
      <StatusBar
       barStyle="dark-content"// Here is where you change the font-color

        //terms. Privacy Policy and Cookies Policy
        //#ff1e73
        //f78cb4
        //#ff5b99
        />
        <LinearGradient colors={['#ffffff', '#ffffff', '#ffffff', '#5bb8ff']} style={{height: '100%', width: '100%'}}>
          <View style={{height: '100%', width: screenWidth, justifyContent: "center", alignItems: "center"}}>
            <Image source={navlogo} style={{resizeMode: 'contain', height: 70, width: screenWidth}}></Image>
            <View style={{height: 20, width: screenWidth}} />
            <TouchableOpacity activeOpacity={0.5} onPress={() => this.signIn()} style={{width: screenWidth*0.5, backgroundColor: "#ff5b99", borderRadius: 20, height: 45, justifyContent: "center", alignItems: "center"}}>
              {(!this.state.signInLoading)?
                <Text style={{fontSize: 20, textAlign: "center", color: "white", fontFamily: "Raleway-Regular"}}>Sign In</Text>
                :
                <ActivityIndicator size={"small"} color={"white"} />
              }
            </TouchableOpacity>

          <View style={{position: "absolute", bottom: 30, height: 'auto', width: screenWidth*0.9, flexDirection:"row", flexWrap: 'wrap', textalign: "justify", justifyContent:"center", alignContent:"center"}}>

            <Text style={{fontSize: 15, textAlign: "justify", color: "black", fontFamily: "Raleway-light"}}>By signing in, you agree to our </Text>
            <Text style={{fontSize: 15, textAlign: "justify", color: "black", fontFamily: "Raleway-regular", textDecorationLine:"underline"}} onPress={ ()=> Linking.openURL('https://rumine.ca/tos') } >Terms of Service.</Text>
            <Text style={{fontSize: 15, textAlign: "justify", color: "black", fontFamily: "Raleway-light"}}>Learn how we process your data in our  </Text>
            <Text style={{fontSize: 15, textAlign: "justify", color: "black", fontFamily: "Raleway-regular", textDecorationLine:"underline"}} onPress={ ()=> Linking.openURL('https://rumine.ca/privacy') } >Privacy Policy.</Text>
            <View style={{height: 'auto', width: '100%'}}>
              <Text style={{fontSize: 15, textAlign: "center", color: "black", fontFamily: "Raleway-regular", textDecorationLine:"underline"}} onPress={ ()=> Linking.openURL('https://rumine.ca/support') } >Contact support for sign in issues.</Text>
            </View>
           </View>
           {this.renderMessages()}
          </View>
          </LinearGradient>
      </View>
      </SafeAreaView>
    </>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
