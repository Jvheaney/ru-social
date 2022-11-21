import React, {Component} from 'react';
import { KeyboardAvoidingView, Linking, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Actions } from 'react-native-router-flux';
import GLOBAL from '../global.js';
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';

import GenderButton from '../components/GenderButton';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


import navlogo from '../assets/images/NBF_2.png';

class Swipe extends Component {

  componentDidMount() {
    if(GLOBAL.authToken == null || GLOBAL.authToken == undefined || GLOBAL.authToken == ""){
      Actions.replace("login");
    }
  }


  state = {
    clicked: [false, false, false, false, false],
    clickedIdentify: [false, false, false, false, false, false, false]
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

  saveStep = () => {
    if(this.state.clicked.includes(true) && this.state.clickedIdentify.includes(true)){
      GLOBAL.profileCreate.interested_male = this.state.clicked[0];
      GLOBAL.profileCreate.interested_female = this.state.clicked[1];
      GLOBAL.profileCreate.interested_nb = this.state.clicked[2];
      GLOBAL.profileCreate.interested_trans = this.state.clicked[3];
      GLOBAL.profileCreate.interested_other = this.state.clicked[4];
      GLOBAL.profileCreate.gender = this.state.clickedIdentify.indexOf(true);
      Actions.step3();
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
      }} behavior="position" enabled>
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
            <Text style={{fontSize: 26, paddingTop: 6, paddingLeft: 15, textAlign: "left", color: "white", fontFamily: "Raleway-Bold", justifyContent: "center"}}>Step 2:</Text>
            </View>
            <Text style={{fontSize: 26, paddingTop: 5, paddingBottom: 10, paddingLeft: 15, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-Bold"}}>My Preferences</Text>


              <Text style={{fontSize: 22, paddingTop: 20, paddingBottom: 20, paddingLeft: 15, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-Bold"}}>I identify as:</Text>
            <GenderButton func={() => this._handleGenderSelected(0)} selected={this.state.clickedIdentify[0]} gender={"Male"} />
            <GenderButton func={() => this._handleGenderSelected(1)} selected={this.state.clickedIdentify[1]} gender={"Female"} />
            <GenderButton func={() => this._handleGenderSelected(2)} selected={this.state.clickedIdentify[2]} gender={"Non-Binary"} />
            <GenderButton func={() => this._handleGenderSelected(3)} selected={this.state.clickedIdentify[3]} gender={"Transgender"} />
            <GenderButton func={() => this._handleGenderSelected(4)} selected={this.state.clickedIdentify[4]} gender={"Transgender Male"} />
            <GenderButton func={() => this._handleGenderSelected(5)} selected={this.state.clickedIdentify[5]} gender={"Transgender Female"} />
            <GenderButton func={() => this._handleGenderSelected(6)} selected={this.state.clickedIdentify[6]} gender={"Other"} />
            <Text style={{fontSize: 22, paddingTop: 20, paddingBottom: 20, paddingLeft: 15, textAlign: "left", color: "#cf2d6a", fontFamily: "Raleway-Bold"}}>I am interested in (select all that apply):</Text>
            <GenderButton func={() => this._handleSelected(0)} selected={this.state.clicked[0]} gender={"Male"} />
            <GenderButton func={() => this._handleSelected(1)} selected={this.state.clicked[1]} gender={"Female"} />
            <GenderButton func={() => this._handleSelected(2)} selected={this.state.clicked[2]} gender={"Non-Binary"} />
            <GenderButton func={() => this._handleSelected(3)} selected={this.state.clicked[3]} gender={"Transgender"} />
            <GenderButton func={() => this._handleSelected(4)} selected={this.state.clicked[4]} gender={"Other"} />



            <View style = {{marginTop: 25, justifyContent: "center", alignItems: "center"}}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => this.saveStep()} style={{marginBottom: 50, height: 60, width: screenWidth*0.5, backgroundColor: "#cf2d6a", borderRadius: 25, justifyContent: "center", alignItems: "center"}}>
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
