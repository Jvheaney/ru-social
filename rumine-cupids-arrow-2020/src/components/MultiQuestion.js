import React, {Component} from 'react';
import { SafeAreaView, StatusBar, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import MultiAnswerGroup from './MultiAnswerGroup';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


class MultiQuestion extends Component {

  constructor(props) {
    super(props);
  }

  state = {
  }

  render() {
    console.disableYellowBox = true;


    return (
      //
      <View style={{paddingTop: 75, height: 'auto', width: '100%', flexDirection: 'column', justifyContent: "center", alignItems: "center"}}>
        <Text style={{paddingBottom: 10, textAlign: "center", fontSize: 30, fontFamily: "Roboto", fontWeight: "bold"}}>{this.props.qnum}. {this.props.question}</Text>
        <View style={{}}>
          <MultiAnswerGroup topPass={this.props.topPass} answers={this.props.answers} />
        </View>
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default MultiQuestion;
