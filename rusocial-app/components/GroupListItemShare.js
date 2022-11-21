import React, {Component} from 'react';
import { View, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';

import TitleText from '../elements/TitleText';

import EvilIcons from 'react-native-vector-icons/EvilIcons';

import { imageURL } from '../utilities/Connector';
import global from '../utilities/global';

let screenWidth = Dimensions.get('window').width;

class GroupListItem extends Component {

  _openCircleGroup = (id) => {
    Actions.group({"id":id, "circleName":this.props.circleName});
  }

  render() {
    console.disableYellowBox = true;

    return (
      <>
      <TouchableOpacity activeOpacity={0.7} onPress={() => {(!this.props.selectable)?this._openCircleGroup(this.props.circleid):this.props.pass._toggleCircle(this.props.circleid)}} style={{flexDirection: "row", alignItems: "center", height: 70, width: screenWidth-16, borderRadius: 35, margin: 8, backgroundColor: "white",
}}>
        <View style={{height: 60, width: 70, justifyContent: "center", alignItems: "center"}}>
          <View style={{height: 60, width: 60, borderRadius: 30, backgroundColor: "#FF00FF", justifyContent: "center", alignItems: "center"}}>
            <Image
              style={{height: 58, width: 58, borderRadius: 29}}
              source={(this.props.image === undefined)?global.main.groupicon:{uri: imageURL + this.props.image}} />
          </View>
        </View>
      <View style={{paddingLeft: 5, width: screenWidth-145}}>
        <TitleText numberOfLines={1} type={"med"} size={18} text={this.props.circleName} />
        {(this.props.reach && this.props.shared)?<TitleText numberOfLines={1} type={"med"} color={"green"} size={12} text={"SHARED"} />:<View></View>}
      </View>
      <View style={{justifyContent: "center", alignItems: "center", position: "absolute", right: 0, height: 60, width: 50}}>
      {(this.props.reach)?
        <TouchableOpacity activeOpacity={0.7} onPress={this.props.func} style={{height: 25, width: 55, backgroundColor: "red", justifyContent: "center", alignItems: "center", borderRadius: 5}}>
          <TitleText numberOfLines={1} color={"white"} size={12} text={"Remove"} />
        </TouchableOpacity>
      :
      (this.props.circleNotifs > 0)?
        <View style={{height: 20, width: 20, backgroundColor: "red", borderRadius: 10, justifyContent: "center", alignItems: "center"}}>
          <TitleText color={"white"} size={12} text={this.props.circleNotifs} />
        </View>
        :
        (this.props.selectable && this.props.selected)?
        <EvilIcons name="minus" size={44} color={"black"} />
        :
        (this.props.selectable)?
        <EvilIcons name="plus" size={44} color={"black"} />
        :
        <EvilIcons name="chevron-right" size={44} color={"black"} />
      }
      </View>
    </TouchableOpacity>
      </>
   );
 }
}

export default GroupListItem;
