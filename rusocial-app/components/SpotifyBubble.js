import React, {Component} from 'react';
import { SafeAreaView, StatusBar, TextInput, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';


let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


class Swipe extends Component {

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View style={{margin: 2, borderRadius: 50, height: 50, width: 'auto', backgroundColor: "black", flexDirection: "row", alignItems: "center"}}>
        <Image
          style={{height: 50, width: 50, borderRadius: 25}}
          source={{uri: this.props.image}} />
          <View style={{paddingLeft: 10, paddingRight: 10}}>
            <Text style={{fontSize: 18, color: "white", fontFamily: "Raleway-Regular"}}>{this.props.name}</Text>
          </View>
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default Swipe;
