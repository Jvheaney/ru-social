import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";
//import Shimmer from 'react-native-shimmer';
import Bong from '../assets/svgs/Bong.svg';
import ConvoStarter from '../assets/svgs/ConvoStarter.svg';
import Commuter from '../assets/svgs/Commuter.svg';
import Gym from '../assets/svgs/Gym.svg';
import Penguin from '../assets/svgs/Penguin.svg';
import GradStudent from '../assets/svgs/GradStudent.svg';
import Res from '../assets/svgs/Res.svg';
import Coffee from '../assets/svgs/Coffee.svg';
import Pride from '../assets/svgs/Pride.svg';
import Aquarius from '../assets/svgs/Aquarius.svg';
import Aries from '../assets/svgs/Aries.svg';
import Cancer from '../assets/svgs/Cancer.svg';
import Capricorn from '../assets/svgs/Capricorn.svg';
import Gemini from '../assets/svgs/Gemini.svg';
import Leo from '../assets/svgs/Leo.svg';
import Libra from '../assets/svgs/Libra.svg';
import Pisces from '../assets/svgs/Pisces.svg';
import Sagittarius from '../assets/svgs/Sagittarius.svg';
import Scorpio from '../assets/svgs/Scorpio.svg';
import Taurus from '../assets/svgs/Taurus.svg';
import Virgo from '../assets/svgs/Virgo.svg';
import BLM from '../assets/svgs/BLM.svg';
import StopHate from '../assets/svgs/StopHate.svg';
import StopAAPIHate from '../assets/svgs/StopAAPIHate.svg';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


class Swipe extends Component {

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View style={{borderWidth: 2, borderColor: (this.props.friends)?"#5bb8ff":"#ff5b99", margin: 3, height: 60, width: 60, borderRadius: 30, backgroundColor: "#fff", justifyContent: "center", alignItems: "center"}}>
        <View>
        {(this.props.type == "WEED420")?
          <Bong style={{height: 40, width: 40}} />
          :
          (this.props.type == "CONVOSTARTER")?
          <ConvoStarter style={{height: 40, width: 40}} />
          :
          (this.props.type == "COMMUTER")?
          <Commuter style={{height: 35, width: 35}} />
          :
          (this.props.type == "WORKOUT")?
          <Gym style={{height: 40, width: 40}} />
          :
          (this.props.type == "ILUVPENG")?
          <Penguin style={{height: 40, width: 40}} />
          :
          (this.props.type == "GRADSTU")?
          <GradStudent style={{height: 40, width: 40}} />
          :
          (this.props.type == "RES")?
          <Res style={{height: 40, width: 40}} />
          :
          (this.props.type == "COFFEE")?
          <Coffee style={{height: 40, width: 40}} />
          :
          (this.props.type == "AQUARIUS")?
          <Aquarius style={{height: 40, width: 40}} />
          :
          (this.props.type == "ARIES")?
          <Aries style={{height: 40, width: 40}} />
          :
          (this.props.type == "CANCER")?
          <Cancer style={{height: 40, width: 40}} />
          :
          (this.props.type == "CAPRICORN")?
          <Capricorn style={{height: 40, width: 40}} />
          :
          (this.props.type == "GEMINI")?
          <Gemini style={{height: 40, width: 40}} />
          :
          (this.props.type == "LEO")?
          <Leo style={{height: 40, width: 40}} />
          :
          (this.props.type == "LIBRA")?
          <Libra style={{height: 40, width: 40}} />
          :
          (this.props.type == "PISCES")?
          <Pisces style={{height: 40, width: 40}} />
          :
          (this.props.type == "SAGITTARIUS")?
          <Sagittarius style={{height: 40, width: 40}} />
          :
          (this.props.type == "SCORPIO")?
          <Scorpio style={{height: 40, width: 40}} />
          :
          (this.props.type == "TAURUS")?
          <Taurus style={{height: 40, width: 40}} />
          :
          (this.props.type == "VIRGO")?
          <Virgo style={{height: 40, width: 40}} />
          :
          (this.props.type == "PRIDE")?
          <Pride style={{height: 40, width: 40}} />
          :
          (this.props.type == "BLM")?
          <BLM style={{height: 40, width: 40}} />
          :
          (this.props.type == "StopHate")?
          <StopHate style={{height: 40, width: 40}} />
          :
          (this.props.type == "StopAAPIHate")?
          <StopAAPIHate style={{height: 40, width: 40}} />
          :
          <View></View>
        }
        </View>
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
