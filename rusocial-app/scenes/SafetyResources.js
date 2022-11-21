import React, {Component} from 'react';
import { SafeAreaView, Linking, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { WebView } from 'react-native-webview';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;



class Swipe extends Component {

  componentDidMount() {
  }


  state = {
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
          <Text style={{fontSize: 25, textAlign: "center", color: "black", fontFamily: "Raleway-Bold"}}>Safety Resources</Text>
          <View style={{position: 'absolute', height: 50, width: 'auto', right: 10, alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
          </View>
        </View>
        <WebView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          ref={(ref) => this.webView = ref}
          source={{ uri: 'https://rumine.ca/safety/mobile.html' }}
          onNavigationStateChange={(navState) => {
            if(navState.url != "https://rumine.ca/safety/mobile.html"){
              Linking.openURL(navState.url);
              this.webView.stopLoading();
            }
          }}
       />
      </View>
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
