import React, {Component} from 'react';
import { ImageBackground, View, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import FAIcon from 'react-native-vector-icons/FontAwesome';

import { imageURL } from '../utilities/Connector';
import global from '../utilities/global';


import TitleText from '../elements/TitleText';

class ChatTopNav extends Component {

  render() {
    console.disableYellowBox = true;
    return (
      <View style={{flexDirection: "column", alignItems: "center", width: 100}}>
      <TouchableOpacity activeOpacity={0.9} onPress={this.props.onClick}
       style={{height: 70, width: 70, borderRadius: 40, marginRight: 15, marginLeft: 15, backgroundColor: "white", shadowColor: '#000',
       shadowOffset: { width: 1, height: 1 },
       shadowOpacity: 0.2,
       shadowRadius: 1,
       elevation: 2,}}>
        <ImageBackground
          source={(this.props.home)?global.homeicon:(this.props.image == imageURL + "undefined")?global.main.groupicon:{uri: this.props.image}}
          style={{width: '100%', height: '100%', overflow: "hidden", borderRadius: 40}}>
          {(this.props.selected)?
          <View style={{position: "absolute", backgroundColor: "rgba(0,0,0,0.4)", height: '100%', width: '100%', justifyContent: "center", alignItems: "center"}}>
            <FAIcon name={"check"} type={"med"} size={25} color={"white"} />
          </View>
          :
          (this.props.shared)?
          <View style={{position: "absolute", backgroundColor: "rgba(0,255,0,0.4)", height: '100%', width: '100%', justifyContent: "center", alignItems: "center"}}>
            <TitleText numberOfLines={1} type={"bold"} color={"white"} size={15} text={"Shared"} />
          </View>
          :
          <View></View>}
        </ImageBackground>
      </TouchableOpacity>
      <View style={{}}>
        <TitleText numberOfLines={1} size={14} text={this.props.name} />
      </View>
      </View>
   );
 }
}

export default ChatTopNav;
