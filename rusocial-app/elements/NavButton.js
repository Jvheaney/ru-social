import React, {Component} from 'react';
import { View, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

class NavButton extends Component {

  getColor = () => {
    if(this.props.color === "white" && !this.props.center){
      return "#4080ff";
    }
    else if(this.props.center){
      return "transparent";
    }
    else{
      return "white";
    }
  }

  render() {
    console.disableYellowBox = true;

    return (
      <>
        <TouchableOpacity activeOpacity={0.7} onPress={this.props.click} style={{height: '100%', width: this.props.width, justifyContent: "center", alignItems: "center"}}>
          <View style={{height: 35, width: 35, backgroundColor: this.getColor(), borderRadius: 25, justifyContent: "center", alignItems: "center"}}>
            <Icon size={20} name={this.props.icon} color={this.props.color} />
          </View>
        </TouchableOpacity>
      </>
   );
 }
}

export default NavButton;
