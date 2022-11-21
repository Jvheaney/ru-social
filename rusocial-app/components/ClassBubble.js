import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import EvilIcon from 'react-native-vector-icons/EvilIcons';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


class Swipe extends Component {

  render() {
    console.disableYellowBox = true;

    return (
      //
      <TouchableOpacity activeOpacity={(this.props.disabled)?1:0.8} onPress={() => {if(!this.props.disabled){this.props.func(this.props.interest)}}} style={{width: 'auto', height: 'auto'}}>
        <View style={{margin: 2, padding: 10, backgroundColor: (this.props.common)?"#5bb8ff":"gray", borderRadius: 20, flexDirection: "row", alignItems: "center"}}>
          <Text style={{fontSize: 16, color: "white", fontFamily: "Raleway-Regular"}}>{this.props.classcode}</Text>
          <View style={{height: '100%', width: 2}}></View>
          {(this.props.add)?
            <EvilIcon name="plus" size={20} color="white" />
            :
            (!this.props.disabled)?
            <EvilIcon name="minus" size={20} color="white" />
            :
            <View></View>
          }
        </View>
      </TouchableOpacity>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
