import React, {Component} from 'react';
import { View } from 'react-native';

class CheckButton extends Component {

  render() {
    console.disableYellowBox = true;

    return (
      <View style={{display: "flex", flex: 1, alignItems: "center"}}>
				<View style={{height: '100%', width: '90%', alignItems: "center", justifyContent: "center"}}>
          {this.props.children}
				</View>
			</View>
   );
 }
}

export default CheckButton;
