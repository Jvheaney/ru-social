import React, {Component} from 'react';
import { View } from 'react-native';

class Container extends Component {

  render() {
    console.disableYellowBox = true;

    return (
      <View style={{display: "flex", flex: 1, alignItems: "center"}}>
				<View style={{height: '100%', width: '100%', alignItems: "center", justifyContent: "center"}}>
          {this.props.children}
				</View>
			</View>
   );
 }
}

export default Container;
