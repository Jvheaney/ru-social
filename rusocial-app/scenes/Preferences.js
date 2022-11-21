import React, {Component} from 'react';
import { Linking, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity, CheckBox} from 'react-native';
import GLOBAL from '../global.js';
import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";
import AsyncStorage from '@react-native-community/async-storage';

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Switch } from 'react-native-switch';
import GenderButton from '../components/GenderButton';
import Icon from 'react-native-vector-icons/FontAwesome'

import navlogo from '../assets/images/NBF.png';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;



class Swipe extends Component {

  state = {
    clicked: (GLOBAL.profile == undefined)?[]:[GLOBAL.profile.int_m, GLOBAL.profile.int_f, GLOBAL.profile.int_nb, GLOBAL.profile.int_t, GLOBAL.profile.int_o],
    clickedPriority: (GLOBAL.friends == undefined)?[]:[(GLOBAL.friends.algo_pref==0), (GLOBAL.friends.algo_pref==1), (GLOBAL.friends.algo_pref==2), (GLOBAL.friends.algo_pref==3), (GLOBAL.friends.algo_pref==4)],
    clickedIdentify: (GLOBAL.profile == undefined)?[]:[(GLOBAL.profile.gender==0)?true:false, (GLOBAL.profile.gender==1)?true:false, (GLOBAL.profile.gender==2)?true:false, (GLOBAL.profile.gender==3)?true:false, (GLOBAL.profile.gender==4)?true:false, (GLOBAL.profile.gender==5)?true:false, (GLOBAL.profile.gender==6)?true:false],
    startAge: (GLOBAL.profile == undefined || GLOBAL.profile.start_age == null)?18:GLOBAL.profile.start_age,
    endAge: (GLOBAL.profile == undefined || GLOBAL.profile.end_age == null)?40:GLOBAL.profile.end_age,
    reshowProfiles: (GLOBAL.profile == undefined || GLOBAL.profile.reshow_profiles == null)?true:GLOBAL.profile.reshow_profiles,
    friendsProfileExists: (GLOBAL.friends == undefined || GLOBAL.friends.firstname_display == undefined)?false:true,
    datingProfileExists: (GLOBAL.profile == undefined || GLOBAL.profile.firstname_display == undefined)?false:true
  }

  _storeData = async (key, value) => {
    try {
      var keyToSave = "@" + key;
      await AsyncStorage.setItem(keyToSave, value)
    } catch (e) {
      // saving error
    }
  }

  _handleSelectedPriority = (num) => {
    var clickedArr = [false, false, false];
    clickedArr[num] = true;
    this.setState({
      clickedPriority : clickedArr
    })
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

  savePref = () => {
      var gender = 9;
      var genderKey = "";

      var friendsPriority = 0;

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

      //Checking friends
      if(this.state.clickedPriority[0]){
        friendsPriority = 0;
      }
      else if(this.state.clickedPriority[1]){
        friendsPriority = 1;
      }
      else if(this.state.clickedPriority[2]){
        friendsPriority = 2;
      }
      else if(this.state.clickedPriority[3]){
        friendsPriority = 3;
      }
      else if(this.state.clickedPriority[4]){
        friendsPriority = 4;
      }

      if(this.state.datingProfileExists && !this.state.clicked.includes(true)){
        alert("You must pick at least one interested in option.");
        return;
      }

      if(this.state.friendsProfileExists && this.state.datingProfileExists){
        var details = {
          "token": GLOBAL.authToken,
          "gender": gender,
          "interested_male": this.state.clicked[0],
          "interested_female": this.state.clicked[1],
          "interested_nb": this.state.clicked[2],
          "interested_trans": this.state.clicked[3],
          "interested_other": this.state.clicked[4],
          "start_age": this.state.startAge,
          "end_age": this.state.endAge,
          "reshow_profiles": this.state.reshowProfiles,
          "friends_algo_pref": friendsPriority,
          "datingProfileExists": this.state.datingProfileExists,
          "friendsProfileExists": this.state.friendsProfileExists
          };
      }
      else if(this.state.friendsProfileExists){
        var details = {
          "token": GLOBAL.authToken,
          "friends_algo_pref": friendsPriority,
          "datingProfileExists": this.state.datingProfileExists,
          "friendsProfileExists": this.state.friendsProfileExists
          };
      }
      else{
        var details = {
          "token": GLOBAL.authToken,
          "gender": gender,
          "interested_male": this.state.clicked[0],
          "interested_female": this.state.clicked[1],
          "interested_nb": this.state.clicked[2],
          "interested_trans": this.state.clicked[3],
          "interested_other": this.state.clicked[4],
          "start_age": this.state.startAge,
          "end_age": this.state.endAge,
          "reshow_profiles": this.state.reshowProfiles,
          "datingProfileExists": this.state.datingProfileExists,
          "friendsProfileExists": this.state.friendsProfileExists
          };
      }

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        return fetch('https://rumine.ca/_apiv2/gw/up/ep', {
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
              if(responseJson.token != "NA"){
                this._storeData("authToken", responseJson.token);
                GLOBAL.authToken = responseJson.token;
              }
              alert("There was an error saving your preferences.");
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
                    if(this.state.friendsProfileExists && this.state.datingProfileExists){
                      var profile = GLOBAL.profile;
                      var friends_profile = GLOBAL.friends;
                      friends_profile.algo_pref = friendsPriority;
                      GLOBAL.friends = friends_profile;
                      profile.gender = gender;
                      profile.int_m = this.state.clicked[0];
                      profile.int_f = this.state.clicked[1];
                      profile.int_nb = this.state.clicked[2];
                      profile.int_t = this.state.clicked[3];
                      profile.int_o = this.state.clicked[4];
                      profile.start_age = this.state.startAge;
                      profile.end_age = this.state.endAge;
                      profile.reshow_profiles = this.state.reshowProfiles;
                      GLOBAL.profile = profile;
                      GLOBAL.changedPref = true;
                      this._storeData("me", JSON.stringify(profile));
                      this._storeData("friends-me", JSON.stringify(friends_profile));
                    }
                    else if(this.state.friendsProfileExists){
                      var friends_profile = GLOBAL.friends;
                      friends_profile.algo_pref = friendsPriority;
                      GLOBAL.friends = friends_profile;
                      GLOBAL.changedPref = true;
                      this._storeData("friends-me", JSON.stringify(friends_profile));
                    }
                    else{
                      var profile = GLOBAL.profile;
                      profile.gender = gender;
                      profile.int_m = this.state.clicked[0];
                      profile.int_f = this.state.clicked[1];
                      profile.int_nb = this.state.clicked[2];
                      profile.int_t = this.state.clicked[3];
                      profile.int_o = this.state.clicked[4];
                      profile.start_age = this.state.startAge;
                      profile.end_age = this.state.endAge;
                      profile.reshow_profiles = this.state.reshowProfiles;
                      GLOBAL.profile = profile;
                      GLOBAL.changedPref = true;
                      this._storeData("me", JSON.stringify(profile));
                    }

                    Actions.pop();
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
      <View style={{flex: 1}}>
      <SafeAreaView style={{
        backgroundColor: "white"
      }}></SafeAreaView>
      <View style={{
        flex: 1,
        height: screenHeight,
        width: screenWidth,
        backgroundColor: "#f8f8ff"
      }}>
      <StatusBar
         barStyle="dark-content"  // Here is where you change the font-color
        ////#ff1e73
        //f78cb4
        />
        <View style={{backgroundColor: "white", height: 40, width: screenWidth, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.pop()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}><LineIcon style={{left: 10}} name="arrow-left" size={20} color="black" /></TouchableOpacity>
            <Text style={{fontSize: 25, textAlign: "center", color: "black", fontFamily: "Raleway-Bold"}}>Preferences</Text>
          </View>
          <View style={{alignItems: "center", justifyContent: "center"}}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.savePref()} style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}>
              <Text style={{fontSize: 18, textAlign: "center", color: "black", fontFamily: "Raleway-Regular"}}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView>
          <View style={{minHeight: '100%', minHeight: screenHeight, height: 'auto', width: screenWidth, backgroundColor: '#f8f8ff'}}>
            {(this.state.datingProfileExists)?
            <View>
              <View style={{marginLeft: 5, marginTop: 20, flexDirection: "row", alignItems: "center"}}>
                <Icon name="heart" size={20} color="#ff5b99" family={"FontAwesome"} />
                <Text style={{paddingLeft: 5, fontSize: 25, color: "black", fontFamily: "Raleway-Bold"}}>Dating Preferences</Text>
              </View>

              <View style={{marginTop: 30, width: screenWidth, backgroundColor: "white", height: 'auto', paddingLeft: screenWidth*0.05}}>
                <View style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-Regular"}}>Reshow Left Swipes (after 24h)</Text>
                  </View>
                  <Switch
                    circleSize={25}
                    value={this.state.reshowProfiles}
                    onValueChange={(val) => this.setState({reshowProfiles: val})}
                    backgroundActive={'#ff5b99'}
                  />
                </View>
                <View style={{marginBottom: 10, height: 'auto', width: screenWidth*0.9, flexDirection: "column", justifyContent: "space-between"}}>
                  <Text style={{fontSize: 18, textAlign: "left", color: "black", fontFamily: "Raleway-Regular"}}>Age Filter:</Text>
                  <Text style={{fontSize: 16, paddingTop: 5, paddingBottom: 10, textAlign: "left", color: "gray", fontFamily: "Raleway-Regular"}}>Show me users: {this.state.startAge} to {(this.state.endAge == 40)?"40+":this.state.endAge}</Text>
                  <View style={{height: 'auto', width: screenWidth, flexDirection: "column", justifyContent: "center"}}>
                    <MultiSlider
                      markerStyle={{backgroundColor: "white", borderWidth: 1, height: 25, width: 25}}
                      selectedStyle={{backgroundColor: "#ff5b99"}}
                      min={18}
                      max={40}
                      sliderLength={screenWidth*0.85}
                      snapped={true}
                      enableLeft={true}
                      enableRight={true}
                      values={[this.state.startAge,this.state.endAge]}
                      onValuesChange={(e) => this.setState({startAge: e[0], endAge: e[1]})}
                      containerStyle={{
                        height: 15,
                        marginLeft: 10
                      }}
                    />
                  </View>
                </View>
              </View>

              <View style={{marginTop: 30, width: screenWidth, backgroundColor: "white", height: 'auto', paddingLeft: screenWidth*0.05}}>
                <Text style={{marginTop: 10, marginBottom: 5, fontSize: 18, textAlign: "left", color: "black", fontFamily: "Raleway-Medium"}}>I am interested in (select all that apply):</Text>
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
                <Text style={{marginTop: 10, marginBottom: 5, fontSize: 18, textAlign: "left", color: "black", fontFamily: "Raleway-Medium"}}>I identify as:</Text>
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
              </View>:<View></View>}
          {(this.state.friendsProfileExists)?
          <View>
            <View style={{marginLeft: 5, marginTop: 25, flexDirection: "row", alignItems: "center"}}>
              <Icon name="users" size={20} color="#5bb8ff" family={"FontAwesome"} />
              <Text style={{paddingLeft: 5, fontSize: 25, color: "black", fontFamily: "Raleway-Bold"}}>Friends Preferences</Text>
            </View>

            <View style={{marginTop: 30, width: screenWidth, backgroundColor: "white", height: 'auto', paddingLeft: screenWidth*0.05}}>
              <Text style={{marginTop: 10, marginBottom: 5, fontSize: 18, textAlign: "left", color: "black", fontFamily: "Raleway-Medium"}}>Prioritize showing me:</Text>
              <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleSelectedPriority(0)} style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-Regular"}}>Students with the same classes</Text>
                </View>
                {(this.state.clickedPriority[0])?<Icon name="check" size={20} color="#5bb8ff" family={"FontAwesome"} />:<View></View>}
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleSelectedPriority(1)}  style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-Regular"}}>Students in the same program</Text>
                </View>
                {(this.state.clickedPriority[1])?<Icon name="check" size={20} color="#5bb8ff" family={"FontAwesome"} />:<View></View>}
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleSelectedPriority(2)}  style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-Regular"}}>Students with the same interests</Text>
                </View>
                {(this.state.clickedPriority[2])?<Icon name="check" size={20} color="#5bb8ff" family={"FontAwesome"} />:<View></View>}
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleSelectedPriority(3)}  style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-Regular"}}>Students with the same artists</Text>
                </View>
                {(this.state.clickedPriority[3])?<Icon name="check" size={20} color="#5bb8ff" family={"FontAwesome"} />:<View></View>}
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleSelectedPriority(4)}  style={{height: 'auto', width: screenWidth*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <View style={{flexDirection: "row", alignItems: "center"}}>
                  <Text style={{fontSize: 18, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Raleway-Regular"}}>Random</Text>
                </View>
                {(this.state.clickedPriority[4])?<Icon name="check" size={20} color="#5bb8ff" family={"FontAwesome"} />:<View></View>}
              </TouchableOpacity>
            </View>
          </View>:<View></View>}

            <View style={{height: 50, width: screenWidth}}></View>
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
