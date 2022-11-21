import React, {Component} from 'react';
import { SafeAreaView, StatusBar, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import AnswerButton from './AnswerButton';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


class AnswerGroup extends Component {

  constructor(props) {
    super(props);
    var selectedArray = new Array(this.props.answers.length);
    this.setState({
      selected: selectedArray
    });
  }



  state = {
    selected: []
  }

  saveAnswer = (q, a) => {
    if(q == 15 && a == 6){
      this.props.topPass.otherClick();
    }
    else{
      this.props.topPass.setState({
        otherHeight: 0,
        otherOpacity: 0
      })
    }
    var po_arr = this.props.topPass.state.pickedOptions;
    po_arr[q] = a;
    this.props.topPass.setState({
      pickedOptions: po_arr
    })
    var selectedArray = new Array(this.props.answers.length);
    selectedArray[a] = true;
    this.setState({
      selected: selectedArray
    });
  }



  render() {
    console.disableYellowBox = true;

    return (
      //
      <View style={{height: 'auto', width: '100%', flexDirection: "row", flex: 1, flexWrap: 'wrap', alignItems: "center", justifyContent: "center"}}>
      {this.props.answers.map((answerInfo, key, index) => {
        return (
          <AnswerButton key={key} pass={this} selected={this.state.selected[answerInfo.anum]} question={answerInfo.qnum} answerNum={answerInfo.anum} answer={answerInfo.answer} />
        );
      })}
      </View>
   );
 }
}

const styles = StyleSheet.create(
  {
  });

export default AnswerGroup;
