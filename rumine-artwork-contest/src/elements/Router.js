import React, {Component} from "react"
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity } from "react-native"

import Home from '../scenes/Home';
import Thanks from '../scenes/Thanks';

class Router extends Component {

  state = {
    screen: "home"
  }

  render() {
    console.disableYellowBox = true;

    return (
      <View style={{height: '100%', width: '100%', backgroundColor: "#F88444"}}>
        {(this.state.screen == "home")?
          <Home changePage={(screen) => this.setState({screen})}></Home>
        :
          <Thanks></Thanks>
        }
      </View>
   );
 }
}

export default Router;
