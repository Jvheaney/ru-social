import React, {Component} from 'react';
import { SafeAreaView, StatusBar, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;




class AnswerButton extends Component {

  constructor(props) {
    super(props);
  }

  state = {

  }

  render() {
    console.disableYellowBox = true;

    return (
      //
      <View style={{width: 'auto', height: 'auto', padding: 2}}>
        <TouchableOpacity onClick={() => this.props.pass.saveAnswer(this.props.question, this.props.answerNum)} activeOpacity={0.6} style={{backgroundColor: (this.props.selected)?"#ffc0cb":"#ffffff", width: 'auto', justifyContent: 'center', alignItems: 'center', height: 'auto', borderRadius: 8, borderColor: "#ff6781", borderWidth: 3, paddingRight: 10, paddingLeft: 10, paddingTop: 15, paddingBottom: 15}}>
          <Text style={{fontFamily: "Roboto"}}>{this.props.answer}</Text>
        </TouchableOpacity>
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default AnswerButton;
