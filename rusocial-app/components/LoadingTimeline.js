import React, {Component} from 'react';
import { ActivityIndicator, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';


let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


class Swipe extends Component {

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View style={{height: screenHeight-45, width: screenWidth, backgroundColor: "white", alignItems: "center", justifyContent: "center"}}>
        <ActivityIndicator size="large" color="#ff5b99" />
        <Text style={{padding: 20, textAlign: "center", color: "black", fontSize: 20, fontFamily: "Raleway-Regular"}}>Getting your timeline...</Text>
     </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
