import React, {Component} from 'react';
import { TouchableOpacity, Text } from 'react-native';

class CheckButton extends Component {

  render() {
    console.disableYellowBox = true;

    return (
      <TouchableOpacity onClick={this.props.func} onPress={this.props.func} activeOpacity={0.7} style={{height: 'auto', width: 'auto', padding: 10, backgroundColor: "rgba(255, 91, 153, 1)", borderRadius: 30, justifyContent: "center", alignItems: "center"}}>
        <Text style={{fontSize: 20, fontFamily: "Questrial", color: "white"}}>Play Again</Text>
      </TouchableOpacity>
   );
 }
}

export default CheckButton;
