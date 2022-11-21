import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import { Actions } from 'react-native-router-flux';
import Dialog from "react-native-dialog";
import ProfileBadge from './ProfileBadge';
import badges from '../badges.js';

import LineIcon from 'react-native-vector-icons/SimpleLineIcons';


let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


class Swipe extends Component {

  renderBadges = (badges_passed) => {
    var data = JSON.parse(badges_passed);
    var badges_to_render = [];
    for (var i = 0; i<data.length; i++) {
      badges_to_render.push(
          <ProfileBadge type={data[i]} />
      );
    }
    return(badges_to_render);
  }

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View style={{
          borderRadius: (this.props.full)?0:20,
          height: (this.props.full)?screenHeight*0.76:screenHeight*0.76,
          width: (this.props.full)?screenWidth:screenWidth-20,
          backgroundColor: "white",
          alignItems: "center",
          justifyContent: "center",
          shadowColor: '#000',
          shadowOffset: { width: 2, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 2}}>
            <View style={{borderRadius: (this.props.full)?0:20, height: '100%', width: '100%', overflow: (Platform.OS === 'android')?"visible":"hidden"}}>
              {this.props.profile()}
              {(this.props.full)?<View></View>:
              <View style={{elevation: 99999, position: "absolute", top: 15, right: 0, height: 80, width: 'auto', justifyContent: "space-between", flexDirection: "row"}}>
                {
                  (this.props.badges && this.props.badges.length > 2)?
                  <View>{this.renderBadges(this.props.badges)}</View>
                  :<View></View>
                }
              </View>}
            </View>
     </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
