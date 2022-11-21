import React, {Component} from 'react';
import { TouchableOpacity, Text } from 'react-native';

class CheckButton extends Component {

  render() {
    console.disableYellowBox = true;

    return (
      <TouchableOpacity onClick={this.props.func} onPress={this.props.func} activeOpacity={0.7} style={{height: 60, width: 60, backgroundColor: "rgba(255, 91, 153, 1)", borderRadius: 30, justifyContent: "center", alignItems: "center"}}>
        <Text style={{fontSize: 50, marginBottom: 3, marginLeft: 2, fontFamily: "Questrial", color: "white"}}>&#8250;</Text>
      </TouchableOpacity>
   );
 }
}

export default CheckButton;
