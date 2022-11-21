import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";

import DatingPenguins from '../assets/svgs/dating_penguins.svg';


let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

const feedbackOptions = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false
};


class Swipe extends Component {

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View pointerEvents="box-none" style={{height: screenHeight, width: screenWidth, backgroundColor: "white", alignItems: "center", justifyContent: "center"}}>
        <DatingPenguins style={{marginTop: 20, marginBottom: 20, height: screenWidth*0.5, width: screenWidth*0.8}} />
        <View style={{marginLeft: 20, marginRight: 20}}>
          <Text style={{fontSize: 16, textAlign: "center", color: "black", fontFamily: "Raleway-Bold"}}>It looks like you swiped through everybody!</Text>
          <Text style={{fontSize: 15, textAlign: "center", color: "black", fontFamily: "Raleway-Medium"}}>Come back later to find more matches!</Text>
        </View>
        <TouchableOpacity activeOpacity={0.7} onPress={() => {ReactNativeHapticFeedback.trigger("impactLight", feedbackOptions); this.props.func()}} style={{margin: 10, height: 40, width: 100, backgroundColor: '#ff5b99', borderRadius: 20, justifyContent: "center", alignItems: "center"}}>
         <Text style={{fontSize: 15, color: "white", fontFamily: "Raleway-Medium"}}>Refresh</Text>
       </TouchableOpacity>
     </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
