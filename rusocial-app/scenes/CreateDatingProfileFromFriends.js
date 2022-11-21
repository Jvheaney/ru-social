import React, {Component} from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import BlockedUserItem from '../components/BlockedUserItem';
import Icon from 'react-native-vector-icons/FontAwesome'

import GLOBAL from '../global.js';
import AsyncStorage from '@react-native-community/async-storage';
import cache from '../in_memory_cache.js';


import navlogo from '../assets/images/NBF.png';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

let clickedCreate = false;

class Swipe extends Component {

  componentDidMount() {

  }

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
    } catch (e) {
      // saving error
    }
  }

  createProfileCall = (gender) => {
    var details = {
      "token": GLOBAL.authToken,
      "gender": gender,
      "interested_male": this.state.clicked[0],
      "interested_female": this.state.clicked[1],
      "interested_nb": this.state.clicked[2],
      "interested_trans": this.state.clicked[3],
      "interested_other": this.state.clicked[4],
      "lookingfor": this.state.lookingForToSave,
      "birthdate": (this.state.hasBirthdate)?GLOBAL.friends.birthdate:this.state.birthdateToSave
      };

      var formBody = [];
      for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");


    return fetch('https://rumine.ca/_apiv2/gw/up/mfp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: formBody,

    }).then((response) => response.json())
      .then((responseJson) => {
        clickedCreate = false;
        if(responseJson == "logout"){
          Actions.replace("login");
        }
        else if(responseJson.status == "server-error"){
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          alert("We could not create your profile right now. Please try again later.");
        }
        else{
          if(responseJson['token'] != "NA"){
            this._storeData("authToken", responseJson.token);
            GLOBAL.authToken = responseJson.token;
          }
          GLOBAL.profile = {};
          GLOBAL.profile.firstname_display = GLOBAL.friends.firstname_display;
          if(GLOBAL.friends.lastname == undefined){
            GLOBAL.profile.lastname = "";
          }
          else{
            GLOBAL.profile.lastname = GLOBAL.friends.lastname;
          }
          GLOBAL.profile.pronouns = GLOBAL.friends.pronouns;
          GLOBAL.profile.year = GLOBAL.friends.year;
          GLOBAL.profile.program = GLOBAL.friends.program;
          GLOBAL.profile.top_5_spotify = GLOBAL.friends.top_5_spotify;
          GLOBAL.profile.badges = GLOBAL.friends.badges;
          GLOBAL.profile.interests = GLOBAL.friends.interests;
          GLOBAL.profile.bio = GLOBAL.friends.bio;
          GLOBAL.profile.image0 = GLOBAL.friends.image0;
          GLOBAL.profile.start_age = 18;
          GLOBAL.profile.end_age = 40;
          GLOBAL.profile.reshow_profiles = true;
          GLOBAL.profile.gender = gender;
          GLOBAL.profile.int_m = this.state.clicked[0];
          GLOBAL.profile.int_f = this.state.clicked[1];
          GLOBAL.profile.int_nb = this.state.clicked[2];
          GLOBAL.profile.int_t = this.state.clicked[3];
          GLOBAL.profile.int_o = this.state.clicked[4];
          GLOBAL.profile.lookingFor = this.state.lookingForToSave;
          GLOBAL.profile.birthdate = (this.state.hasBirthdate)?GLOBAL.friends.birthdate:this.state.birthdateToSave;
          GLOBAL.profile.show_me = true;
          this._storeData("me",JSON.stringify(GLOBAL.profile));
          if(this.props.pass){
            this.props.pass.setState({datingProfileExists:true, datingEnabled: true, myPicture: "https://rumine.ca/_i/s/i.php?i=" + GLOBAL.profile.image0});
            GLOBAL.justMadeDatingProfile = true;
          }
          Actions.replace('profileEdit');
        }
      })
      .catch((error) => {
        clickedCreate = false;
        alert("We're sorry, there seems to be an error. Please try again later.")
      });
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

  _handleLookingFor= (lookingFor) => {
    this.setState({
      lookingForToSave: lookingFor
    })
  }

  createProfile = () => {
    var gender = 9;
    var genderKey = "";

    if(this.state.clickedIdentify[0] == true){
      gender = 0;
      genderKey = "male";
    }
    else if(this.state.clickedIdentify[1] == true){
      gender = 1;
      genderKey = "female";
    }
    else if(this.state.clickedIdentify[2] == true){
      gender = 2;
      genderKey = "non-binary";
    }
    else if(this.state.clickedIdentify[3] == true){
      gender = 3;
      genderKey = "transgender";
    }
    else if(this.state.clickedIdentify[4] == true){
      gender = 4;
      genderKey = "transgender male";
    }
    else if(this.state.clickedIdentify[5] == true){
      gender = 5;
      genderKey = "transgender female";
    }
    else if(this.state.clickedIdentify[6] == true){
      gender = 6;
      genderKey = "other";
    }

    if(!this.state.clicked.includes(true)){
      alert("You must pick at least one interested in option.");
      return;
    }

    if(gender == 9){
      alert("You must pick how you identify.");
      return;
    }

    if((GLOBAL.friends.birthdate == "" || GLOBAL.friends.birthdate == null || GLOBAL.friends.birthdate == "null") && (this.state.birthdateToSave == "" || this.state.birthdateToSave == "null" || this.state.birthdateToSave == null)){
      alert("You must specify your birthdate.");
      return;
    }

    if(!clickedCreate){
      clickedCreate = true;
      this.setState({
        calledCreate: true
      });
      this.createProfileCall(gender);
    }
  }


  state = {
    clicked: [false, false, false, false, false],
    clickedIdentify: [false, false, false, false, false, false, false],
    calledCreate: false,
    birthdateToSave: "",
    hasBirthdate: (GLOBAL.friends.birthdate == undefined)?false:true
    }

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View style={{
        flex:1}}>
      <SafeAreaView style={{
        backgroundColor: "white"
      }}>
      </SafeAreaView>
      <View style={{
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: "white"
      }}>
      <StatusBar
        barStyle="dark-content" // Here is where you change the font-color
        />
        <View style={{backgroundColor: "white", height: 50, width: screenWidth, flexDirection: "row", alignItems: "center"}}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={20} color="black" /></TouchableOpacity>
          <Text style={{fontSize: 25, textAlign: "center", color: "black", fontFamily: "Raleway-Bold"}}>Create Profile</Text>
          <View style={{position: 'absolute', height: 50, width: 'auto', right: 10, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
          </View>
        </View>
        <ScrollView>
          <View style={{margin: 15, justifyContent: "center", alignItems: "center"}}>
            <Text style={{fontSize: 16, textAlign: "center", color: "black", fontFamily: "Raleway-Medium"}}>We're going to use this information from your friends profile to create your dating profile:</Text>
            <View style={{marginTop: 10}}>
              <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Name and Pronouns.</Text>
              {(this.state.hasBirthdate)?
                <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Birthdate.</Text>
                :
                <View></View>
              }
              <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Program and Year.</Text>
              <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Interests.</Text>
              <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Profile Badges.</Text>
              <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Spotify Artists.</Text>
              <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Bio.</Text>
              <Text style={{marginTop: 10, textAlign: "left", fontSize: 14, color: "black", fontFamily: "Raleway-Regular"}}>- Your Main Image.</Text>
          </View>
            <Text style={{marginTop: 10, fontSize: 16, textAlign: "center", color: "black", fontFamily: "Raleway-Medium"}}>You will be able to edit these in the next step.</Text>
            <Text style={{marginTop: 10, marginBottom: 10, fontSize: 16, textAlign: "center", color: "black", fontFamily: "Raleway-Medium"}}>We just need a bit more information:</Text>
            <View style={{backgroundColor: "#f8f8ff"}}>
            <View style={{marginTop: 30, width: screenWidth, backgroundColor: "white", height: 'auto', paddingLeft: screenWidth*0.05}}>
              <Text style={{marginTop: 10, marginBottom: 5, fontSize: 18, textAlign: "left", color: "#ff5b99", fontFamily: "Raleway-Medium"}}>I am interested in (select all that apply):</Text>
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

            <View style={{marginTop: 30, width: screenWidth, backgroundColor: "white", height: 'auto', paddingLeft: screenWidth*0.05}}>
              <Text style={{marginTop: 10, marginBottom: 5, fontSize: 18, textAlign: "left", color: "#ff5b99", fontFamily: "Raleway-Medium"}}>I identify as:</Text>
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
            {(!this.state.hasBirthdate)?
            <View style={{height: 'auto', width: screenWidth, marginTop: 30, backgroundColor: 'white'}}>
              <Text style={{paddingLeft: screenWidth*0.05, marginTop: 10, marginBottom: 5, fontSize: 18, textAlign: "left", color: "#ff5b99", fontFamily: "Raleway-Medium"}}>My birthdate is:</Text>
              <View style={{width: '100%', justifyContent: "center", alignItems: "center", marginBottom: 15}}>
                <DatePicker
                  style={{width: '80%'}}
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
                      backgroundColor: "#f0f0f0",
                      borderWidth: 0,
                      borderRadius: 20
                    },
                    datePicker: {
                      backgroundColor: '#f0f0f0',
                      justifyContent:'center',
                      alignItems: "center"
                    }
                  }}
                  onDateChange={(date) => {this._handleBirthdate(date)}}
                />
              </View>
            </View>:<View></View>}

            <View style={{height: 'auto', width: screenWidth, marginTop: 30, marginBottom: 30, backgroundColor: 'white'}}>
              <Text style={{paddingLeft: screenWidth*0.05, marginTop: 10, marginBottom: 5, fontSize: 18, textAlign: "left", color: "#ff5b99", fontFamily: "Raleway-Medium"}}>I'm looking for:</Text>
              <View style={{width: '100%', justifyContent: "center", alignItems: "center", marginBottom: 15}}>
                <View style={{width: '80%'}}>
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
                    style={{ inputIOS: {fontSize: 20, color: "black", fontSize: 18, padding: 5, backgroundColor: "#f0f0f0", borderRadius: 20, height: 40}}}
                  />
                </View>
              </View>
            </View>

          </View>
          </View>
          <View style={{height: 100, width: '100%', justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {this.createProfile();}} style={{margin: 5, height: 45, padding: 15, width: '60%', backgroundColor: "#ff5b99", borderRadius: 20, alignItems: "center", justifyContent: "center"}}>
              {(this.state.calledCreate)?
                <View>
                  <ActivityIndicator size="small" color="white" />
                </View>
                :<Text style={{textAlign: "center", fontSize: 14, color: "white", fontFamily: "Raleway-Bold"}}>Continue to Edit Profile</Text>}
            </TouchableOpacity>
          </View>
          <View style={{height: 50, width: '100%', justifyContent: "center", alignItems: "center"}}>
          </View>
        </ScrollView>
      </View>
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
