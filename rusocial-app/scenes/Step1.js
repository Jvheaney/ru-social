import React, {Component} from 'react';
import { KeyboardAvoidingView, Linking, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import DatePicker from 'react-native-datepicker';
import RNPickerSelect from 'react-native-picker-select';
import GLOBAL from '../global.js';
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


import navlogo from '../assets/images/NBF_2.png';

class Swipe extends Component {

  componentDidMount() {
    this.getPrograms()
    if(GLOBAL.authToken == null || GLOBAL.authToken == undefined || GLOBAL.authToken == ""){
      Actions.replace("login");
    }
  }

  state = {
    nameToSave: "",
    birthdateToSave: "",
    programToSave: "",
    yearToSave: "",
    programsToPick: []
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

  saveStep = () => {
    if(this.state.nameToSave != "" && this.state.nameToSave != null && this.state.birthdateToSave != "" && this.state.birthdateToSave != "null" && this.state.birthdateToSave != null && this.state.programToSave != "" && this.state.programToSave != "null" && this.state.programToSave != null && this.state.yearToSave != "" && this.state.yearToSave != null && this.state.yearToSave != "null"){
      GLOBAL.profileCreate.firstname_display = this.cleanSmartPunctuation(this.state.nameToSave);
      GLOBAL.profileCreate.birthdate = this.state.birthdateToSave;
      GLOBAL.profileCreate.program = this.state.programToSave;
      GLOBAL.profileCreate.year = this.state.yearToSave;
      Actions.step2();
    }
    else{
      alert("You are missing profile details.");
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
        <ScrollView>
          <View style={{height: 'auto', width: screenWidth, borderRadius: 20, backgroundColor: 'white'}}>
            <View style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 50, width: screenWidth, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
              <View style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}></View>
              <Image source={navlogo} style={{resizeMode: 'contain', height: 40, width: 120}}></Image>
              <View style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}></View>
            </View>
            <View  style={{ marginTop:10, marginLeft: 15, height : 50, width : 110,backgroundColor: "#cf2d6a"}}>
            <Text style={{fontSize: 26, paddingTop: 6, paddingLeft: 15, textAlign: "left", color: "white", fontFamily: "Raleway-Bold", justifyContent: "center"}}>Step 1:</Text>

            </View>
            <Text style={{fontSize: 26, paddingTop: 5, paddingBottom: 20, paddingLeft: 15, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-Bold"}}>Background Info</Text>


            <Text style={{fontSize: 20, paddingTop: 20, paddingBottom: 20, paddingLeft: 17, textAlign: "left", color: "#ff1e73", fontFamily: "Raleway-Bold"}}>My name is...</Text>
            <TextInput
              placeholder="Name"
              value={this.state.nameToSave}
              keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
              placeholderTextColor="#aaaaaa"
              style={{color: "black", padding: 10, fontSize: 25, width: screenWidth*0.9, left: screenWidth*0.05, backgroundColor: "white", borderRadius: 10, borderColor: "#f78cb4", borderWidth: 2}}
              multiline={false}
              maxLength={16}
              onChangeText={(name) => this._handleNameChange(name)}
              >
              </TextInput>
              <Text style={{fontSize: 20, paddingTop: 20, paddingBottom: 20, paddingLeft: 15, textAlign: "left", color: "#ff1e73", fontFamily: "Raleway-Bold"}}>My birthday is:</Text>
              <DatePicker
                style={{backgroundColor: "white", width: screenWidth*0.93, left: screenWidth*0.04, borderWidth: 2, borderRadius: 10, borderColor: "#f78cb4"}}
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
              <Text style={{fontSize: 20, paddingTop: 20, paddingBottom: 20, paddingLeft: 15, textAlign: "left", color: "#ff1e73", fontFamily: "Raleway-Bold"}}>My program is:</Text>
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
                style={{ inputIOS: {fontSize: 20, color: "black", fontSize: 18, padding: 10, backgroundColor: "white", borderWidth: 2, borderRadius: 10, borderColor: "#f78cb4", width: screenWidth*0.9, left: screenWidth*0.05}}}
              />
              <Text style={{fontSize: 20, paddingTop: 20, paddingBottom: 20, paddingLeft: 15, textAlign: "left", color: "#ff1e73", fontFamily: "Raleway-Bold"}}>Which year are you in?</Text>
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
                style={{ inputIOS: {fontSize: 20, color: "black", fontSize: 18, padding: 10, backgroundColor: "white", borderWidth: 2, borderRadius: 10, borderColor: "#f78cb4", width: screenWidth*0.9, left: screenWidth*0.05}}}
              />
            <View style = {{marginTop: 25, justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.saveStep()} style={{height: 60, width: screenWidth*0.5, backgroundColor: "#cf2d6a", borderRadius: 25, justifyContent: "center", alignItems: "center"}}>
                  <Text style={{color: "white", fontSize: 25, fontFamily: "Raleway-Bold"}}>Next Step</Text>
            </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </SafeAreaView>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
