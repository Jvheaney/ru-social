import React, {Component} from 'react';
import { StatusBar, Dimensions, SafeAreaView, View } from 'react-native';

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;

class Container extends Component {

  constructor(props) {
    super(props)
  }

  render() {
    console.disableYellowBox = true;

    return (
      <SafeAreaView style={{
        flex:1,
        backgroundColor: (this.props.sabc === undefined)?(this.props.bc)?this.props.bc:"white":this.props.sabc
      }}>
        <View style={{
          flex: 1,
          height: screenHeight,
          width: screenWidth,
          backgroundColor: (this.props.bc)?this.props.bc:"white"
        }}>
          {this.props.children}
        </View>
      </SafeAreaView>
   );
 }
}

export default Container;
