import React, {Component} from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';

import cameraLoader from '../assets/images/camera_loader.gif';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


class Swipe extends Component {

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View style={{height: screenHeight-55, width: screenWidth, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center"}}>
        <Image
          source={cameraLoader}
          style={{height: 48, width: 48}}
          resizeMode='contain'
        />
        <Text style={{padding: 20, textAlign: "center", color: "black", fontSize: 20, fontFamily: "Raleway-Regular"}}>Editing your Picture...</Text>
     </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
