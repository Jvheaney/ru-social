import React, {Component} from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome5';

import TitleText from './TitleText';

class CheckButton extends Component {

  render() {
    console.disableYellowBox = true;

    return (
      <>
      <TouchableOpacity activeOpacity={0.4} onPress={this.props.changeChecked} style={{height: 30, paddingLeft: 10, width: '100%', flexDirection: "row", alignItems: "center"}}>
        <View style={{borderWidth: 1, borderRadius: 5, height: 20, width: 20, backgroundColor: (this.props.checked)?"black":"white", justifyContent: "center", alignItems: "center"}}>
          {(this.props.checked)?<Icon color={"white"} size={14} name={"check"} />:<View></View>}
        </View>
      </TouchableOpacity>
      </>
   );
 }
}

export default CheckButton;
