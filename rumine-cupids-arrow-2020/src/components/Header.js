import React, {Component} from 'react';
import { SafeAreaView, StatusBar, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


class Header extends Component {

  constructor(props) {
    super(props);
  }

  state = {
  }

  fontSize = () => {
    if(screenWidth > 799){
      return 85;
    }
    else if(screenWidth > 499){
      return 55;
    }
  }

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View style={{backgroundColor: "#ff6781", height: 'auto', width: '100%', flexDirection: 'column', justifyContent: "center", alignItems: "center"}}>
        <View style={{backgroundColor: "#ff6781", height: 200, width: '100%', maxWidth: 800, alignItems: "center"}}>
          <Text style={{position: "absolute", bottom: 40, left: 40, fontFamily: "Bowlby One SC", fontSize: 40, color: "white"}}>valentine's day</Text>
          <Text style={{position: "absolute", bottom: -40, fontFamily: "Bowlby One SC", fontSize: this.fontSize(), color: "white"}}>match-o-matic</Text>
        </View>
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Header;
