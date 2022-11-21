import React, {Component} from 'react';
import { KeyboardAvoidingView, Linking, SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import GLOBAL from '../global.js';
import LineIcon from 'react-native-vector-icons/SimpleLineIcons';
import PenguinAndZebraSkating from '../assets/svgs/penguin_and_zebra_skating.svg';
import DatingPenguins from '../assets/svgs/dating_penguins.svg';


let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;




import navlogo from '../assets/images/NBF_2.png';

class Swipe extends Component {

  componentDidMount() {
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
          <View style={{height: 'auto', width: screenWidth, borderRadius: 20, backgroundColor: 'white'}}>
            <View style={{borderTopLeftRadius: 20, borderTopRightRadius: 20, height: 50, width: screenWidth, flexDirection: "row", justifyContent: "space-between", alignItems: "center"}}>
              <View style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}></View>
              <Image source={navlogo} style={{resizeMode: 'contain', height: 40, width: 120}}></Image>
              <View style={{flexDirection: "row", height: 50, width: 50, alignItems: "center"}}></View>
            </View>
            <ScrollView contentContainerStyle={{height: '100%', width: '100%', top: 50}}>
           <View style={{padding: 5, justifyContent: "center", alignItems: "center"}}>
           <Text style={{fontSize: 40, paddingBottom: 20, textAlign: "left", color: "#ff5b99", fontFamily: "Raleway-Bold"}}>Hey 👋</Text>
            <Text style={{fontSize: 25, paddingBottom: 10, textAlign: "justify", color: "black", fontFamily: "Raleway-Bold", flexWrap:"wrap", maxWidth: screenWidth*0.95}}>Welcome to RU Mine.</Text>
            <Text style={{fontSize: 20, textAlign: "center", color: "black", fontFamily: "Raleway-Medium", flexWrap:"wrap", maxWidth: screenWidth*0.8}}>What kind of profile would you like to make?</Text>

            <TouchableOpacity activeOpacity={0.7} onPress={()=> Actions.replace("datingCP1")} style={{borderRadius: 20, borderWidth: 1, margin: 10, height: screenWidth*0.45, width: screenWidth*0.45, backgroundColor: 'white', justifyContent: "center", alignItems: "center"}}>
              <DatingPenguins style={{height: '60%', width: '100%'}} />
              <Text style={{fontSize: 20, textAlign: "center", color: "black", fontFamily: "Raleway-Medium", flexWrap:"wrap", color: "#ff5b99"}}>Dating <LineIcon size={14} name={"arrow-right-circle"} /></Text>
            </TouchableOpacity>

            <TouchableOpacity activeOpacity={0.7} onPress={()=> Actions.replace("friendsCP1")} style={{borderRadius: 20, borderWidth: 1, margin: 10, height: screenWidth*0.45, width: screenWidth*0.45, backgroundColor: 'white', justifyContent: "center", alignItems: "center"}}>
              <PenguinAndZebraSkating style={{height: '60%', width: '100%'}} />
              <Text style={{fontSize: 20, textAlign: "center", color: "black", fontFamily: "Raleway-Medium", flexWrap:"wrap", color: "#5bb8ff"}}>Friends <LineIcon size={14} name={"arrow-right-circle"} /></Text>
            </TouchableOpacity>

            <Text style={{fontSize: 15, paddingBottom: 30, textAlign: "center", color: "black", fontFamily: "Raleway-Regular", flexWrap:"wrap", maxWidth: screenWidth*0.8}}>You can create the other type of profile at any time in the settings screen.</Text>
          </View>
          </ScrollView>
        </View>
        </KeyboardAvoidingView>
        </SafeAreaView>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
