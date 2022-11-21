import React, {Component} from 'react';
import { View, TouchableOpacity } from 'react-native';

import TitleText from '../elements/TitleText';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

class ChatTopNav extends Component {

  render() {
    console.disableYellowBox = true;

    return (
      <>
        <View style={{paddingLeft: 10, height: 40, width: '100%', backgroundColor: "white", justifyContent: "space-between", alignItems: "center", flexDirection: "row"}}>
          <TouchableOpacity activeOpacity={0.7} onPress={this.props.onClose} style={{height: '100%', width: 40, justifyContent: "center", flexDirection: "row", alignItems: "center"}}>
            <Icon size={25} name={"close"} color={"#000"} />
            </TouchableOpacity>
          <TitleText size={20} type={"med"} text={(this.props.selectedType === undefined || this.props.selectedType === 'group')?"New Group":"New Chat"} />
          {(this.props.selectedType === undefined || this.props.selectedType === 'group')?
          <TouchableOpacity activeOpacity={0.7} onPress={this.props.onSave} style={{height: '100%', width: 40, justifyContent: "center", flexDirection: "row", alignItems: "center"}}>
            <Icon size={25} name={"check"} color={"#000"} />
          </TouchableOpacity>
          :
          <View style={{height: '100%', width: 40, justifyContent: "center", flexDirection: "row", alignItems: "center"}}></View>}
        </View>
      </>
   );
 }
}

export default ChatTopNav;
