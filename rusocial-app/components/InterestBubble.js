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
        <View style={{margin: 2, padding: 8, borderColor: (this.props.friends)?"#5bb8ff":"#ff5b99", borderWidth: 2, borderRadius: 20, flexDirection: "row", alignItems: "center", backgroundColor: 'white'}}>
          <Text style={{fontSize: 16, color: "black", fontFamily: "Raleway-Regular"}}>{this.props.interest}</Text>
          <View style={{height: '100%', width: 2}}></View>
          {(this.props.add)?
            <EvilIcon name="plus" size={20} color="black" />
            :
            (!this.props.disabled)?
            <EvilIcon name="minus" size={20} color="black" />
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
