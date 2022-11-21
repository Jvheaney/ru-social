import React, {Component} from 'react';
import { SafeAreaView, StatusBar, Alert, StyleSheet, ScrollView, Platform, View, Image, ImageBackground, Text, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';

import AnswerButton from './AnswerButton';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


class MultiAnswerGroup extends Component {

  constructor(props) {
    super(props);
  }



  state = {
    selected: Array(this.props.answers.length)
  }

  saveAnswer = (q, a) => {
    var po_arr = this.props.topPass.state.pickedOptions;
    var selectedArr = this.state.selected;
    if(selectedArr[a]){
      selectedArr[a] = false;
      this.setState({
        selected: selectedArr
      });
    }
    else{
      selectedArr[a] = true;
      this.setState({
        selected: selectedArr
      });
    }
    po_arr[q] = JSON.stringify(selectedArr);
    this.props.topPass.setState({
      pickedOptions: po_arr
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

export default MultiAnswerGroup;
