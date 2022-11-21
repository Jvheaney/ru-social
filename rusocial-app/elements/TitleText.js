import React, {Component} from 'react';
import { Linking, Text } from 'react-native';
import Hyperlink from 'react-native-hyperlink';

class TextTitle extends Component {

  render() {
    console.disableYellowBox = true;

    return (
      <>
      {(this.props.allowLinks)?
      <Hyperlink onPress={ (url, text) => Linking.openURL(url) } linkStyle={{ color: '#2980b9', fontSize: this.props.size }}>
        <Text {...this.props} style={[this.props.extraStyle, {color: (this.props.color)?this.props.color:"black", fontSize: this.props.size, fontFamily: (this.props.type == "bold")?"Raleway-Bold":(this.props.type == "med")? "Raleway-Medium":"Raleway-Regular"}]}>{this.props.text}</Text>
      </Hyperlink>
      :
      <Text {...this.props} style={[this.props.extraStyle, {color: (this.props.color)?this.props.color:"black", fontSize: this.props.size, fontFamily: (this.props.type == "bold")?"Raleway-Bold":(this.props.type == "med")? "Raleway-Medium":"Raleway-Regular"}]}>{this.props.text}</Text>
      }
      </>
   );
 }
}

export default TextTitle;
