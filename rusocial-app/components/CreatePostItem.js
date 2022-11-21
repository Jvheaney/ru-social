import React, {Component} from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';

import TitleText from '../elements/TitleText';
import Icon from 'react-native-vector-icons/SimpleLineIcons';

class ChatTopNav extends Component {

  render() {
    console.disableYellowBox = true;

    return (
      <>
        <View style={{height: 100, justifyContent: "center", padding: 10}}>
          <View style={{height: 60, borderRadius: 20}}>
            <View style={{height: 60, width: '100%', borderRadius: 20, backgroundColor: "#6970ff", position: "absolute", bottom: 0, justifyContent: "space-between", alignItems: "center", flexDirection: "row"}}>
              <View style={{paddingLeft: 10, height: 60, width: 60, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.makePost((this.props.sendToGroupID)?{"open": "images", "sendToGroupID": this.props.sendToGroupID}:{"open": "images"})} style={{width: 40, height: 30, justifyContent: "center", alignItems: "center"}}>
                  <Icon name={"picture"} size={25} color={"white"} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity activeOpacity={0.8} onPress={() => Actions.makePost((this.props.sendToGroupID)?{"sendToGroupID": this.props.sendToGroupID}:{})} style={{height: 30, paddingRight: 20, paddingLeft:50, flexDirection: "row", justifyContent: "center", alignItems: "center"}}>
                <TitleText size={22} color={"white"} text={"Say something"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </>
   );
 }
}

export default ChatTopNav;
