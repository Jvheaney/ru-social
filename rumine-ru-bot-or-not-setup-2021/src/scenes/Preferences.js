import React, {Component} from "react"
import { StyleSheet, Text, View, Dimensions, TextInput, ScrollView, TouchableOpacity } from "react-native"

import Container from '../elements/Container';
import Left from '../elements/Left';
import Right from '../elements/Right';

class Preferences extends Component {

  state = {
    clicked: [this.props.pass.int_m, this.props.pass.int_f, this.props.pass.int_nb, this.props.pass.int_t, this.props.pass.int_o],
    clickedIdentify: [(this.props.pass.gender==0),(this.props.pass.gender==1),(this.props.pass.gender==2),(this.props.pass.gender==3),(this.props.pass.gender==4),(this.props.pass.gender==5),(this.props.pass.gender==6)],
  }

  _handleSelected = (num) => {
    if(this.state.clicked[num]){
      var clickedArr = this.state.clicked;
      clickedArr[num] = false;
      this.setState({
        clicked : clickedArr
      })
    }
    else{
      var clickedArr = this.state.clicked;
      clickedArr[num] = true;
      this.setState({
        clicked: clickedArr
      })
    }
  }

  _handleGenderSelected = (num) => {
      var clickedArr = [false, false, false, false, false, false, false];
      clickedArr[num] = true;
      this.setState({
        clickedIdentify : clickedArr
      })
  }

  _goToNextScreen = () => {
    //Check that preference is selected
    if(this.state.clicked.indexOf(true) == -1){
      alert("You must pick at least one interest.");
      return;
    }

    //Check that gender is selected
    if(this.state.clickedIdentify.indexOf(true) == -1){
      alert("You must pick a gender to identify with.");
      return;
    }

    //Save to parent
    this.props.pass.int_m = this.state.clicked[0];
    this.props.pass.int_f = this.state.clicked[1];
    this.props.pass.int_nb = this.state.clicked[2];
    this.props.pass.int_t = this.state.clicked[3];
    this.props.pass.int_o = this.state.clicked[4];
    this.props.pass.gender = this.state.clickedIdentify.indexOf(true);

    //Go to next screen
    this.props.pass.setState({screen: 2})
  }

  render() {
    console.disableYellowBox = true;

    return (
      <Container>
        <View style={{height: 'auto', width: 100, marginTop: 30, marginBottom: 30, flexDirection: "row", justifyContent: "center"}}>
          <View style={{marginRight: 5, height: 15, width: 15, backgroundColor: "gray", borderRadius: 10}}></View>
          <View style={{marginRight: 5, height: 15, width: 15, backgroundColor: "black", borderRadius: 10}}></View>
          <View style={{height: 15, width: 15, backgroundColor: "gray", borderRadius: 10}}></View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false} style={{width: '100%'}}>
        <View style={{height: 'auto', width: 'auto', justifyContent: "center", alignItems: "center", marginBottom: 50}}>
          <View style={{height: 'auto', width: '100%', maxWidth: 510, padding: 10}}>
            <Text style={{fontWeight: "bold", fontSize: 25, fontFamily: "Questrial"}}>Help us match you properly 💌</Text>
            <View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center", flexDirection: "row"}}>
              <View style={{marginTop: 30, width: '100%', backgroundColor: "white", height: 'auto', paddingLeft: '100%'*0.05}}>
                <Text style={{marginTop: 10, marginBottom: 5, fontSize: 18, textAlign: "left", color: "black", fontWeight: "medium", fontFamily: "Questrial"}}>I am interested in (select all that apply):</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleSelected(0)} style={{height: 'auto', width: '100%'*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{fontSize: 15, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Questrial"}}>Male</Text>
                  </View>
                  {(this.state.clicked[0])?<Text style={{color: "#ff5b99", fontSize: 20}}>&#10003;</Text>:<View></View>}
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleSelected(1)}  style={{height: 'auto', width: '100%'*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{fontSize: 15, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Questrial"}}>Female</Text>
                  </View>
                  {(this.state.clicked[1])?<Text style={{color: "#ff5b99", fontSize: 20}}>&#10003;</Text>:<View></View>}
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleSelected(2)}  style={{height: 'auto', width: '100%'*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{fontSize: 15, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Questrial"}}>Non-Binary</Text>
                  </View>
                  {(this.state.clicked[2])?<Text style={{color: "#ff5b99", fontSize: 20}}>&#10003;</Text>:<View></View>}
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleSelected(3)}  style={{height: 'auto', width: '100%'*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{fontSize: 15, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Questrial"}}>Transgender</Text>
                  </View>
                  {(this.state.clicked[3])?<Text style={{color: "#ff5b99", fontSize: 20}}>&#10003;</Text>:<View></View>}
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleSelected(4)}  style={{height: 'auto', width: '100%'*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{fontSize: 15, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Questrial"}}>Other</Text>
                  </View>
                  {(this.state.clicked[4])?<Text style={{color: "#ff5b99", fontSize: 20}}>&#10003;</Text>:<View></View>}
                </TouchableOpacity>
              </View>
            </View>

            <View style={{marginTop: 30, width: '100%', backgroundColor: "white", height: 'auto', paddingLeft: '100%'*0.05}}>
                <Text style={{marginTop: 10, marginBottom: 5, fontSize: 18, textAlign: "left", color: "black", fontFamily: "Questrial"}}>I identify as:</Text>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleGenderSelected(0)} style={{height: 'auto', width: '100%'*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{fontSize: 15, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Questrial"}}>Male</Text>
                  </View>
                  {(this.state.clickedIdentify[0])?<Text style={{color: "#ff5b99", fontSize: 20}}>&#10003;</Text>:<View></View>}
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleGenderSelected(1)}  style={{height: 'auto', width: '100%'*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{fontSize: 15, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Questrial"}}>Female</Text>
                  </View>
                  {(this.state.clickedIdentify[1])?<Text style={{color: "#ff5b99", fontSize: 20}}>&#10003;</Text>:<View></View>}
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleGenderSelected(2)}  style={{height: 'auto', width: '100%'*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{fontSize: 15, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Questrial"}}>Non-Binary</Text>
                  </View>
                  {(this.state.clickedIdentify[2])?<Text style={{color: "#ff5b99", fontSize: 20}}>&#10003;</Text>:<View></View>}
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleGenderSelected(3)}  style={{height: 'auto', width: '100%'*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{fontSize: 15, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Questrial"}}>Transgender</Text>
                  </View>
                  {(this.state.clickedIdentify[3])?<Text style={{color: "#ff5b99", fontSize: 20}}>&#10003;</Text>:<View></View>}
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleGenderSelected(4)}  style={{height: 'auto', width: '100%'*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{fontSize: 15, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Questrial"}}>Transgender Male</Text>
                  </View>
                  {(this.state.clickedIdentify[4])?<Text style={{color: "#ff5b99", fontSize: 20}}>&#10003;</Text>:<View></View>}
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleGenderSelected(5)}  style={{height: 'auto', width: '100%'*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{fontSize: 15, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Questrial"}}>Transgender Female</Text>
                  </View>
                  {(this.state.clickedIdentify[5])?<Text style={{color: "#ff5b99", fontSize: 20}}>&#10003;</Text>:<View></View>}
                </TouchableOpacity>
                <TouchableOpacity activeOpacity={0.7} onPress={() => this._handleGenderSelected(6)}  style={{height: 'auto', width: '100%'*0.9, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                  <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{fontSize: 15, paddingTop: 10, paddingBottom: 10, color: "black", fontFamily: "Questrial"}}>Other</Text>
                  </View>
                  {(this.state.clickedIdentify[6])?<Text style={{color: "#ff5b99", fontSize: 20}}>&#10003;</Text>:<View></View>}
                </TouchableOpacity>
              </View>

            <View style={{height: 'auto', width: '100%', marginTop: 50, flexDirection: "row", justifyContent: "center", justifyContent: "space-between"}}>
              <Left func={() => this.props.pass.setState({screen: 0})} />
              <Right func={() => this._goToNextScreen()} />
            </View>
          </View>
        </View>
      </ScrollView>
				</Container>
   );
 }
}

export default Preferences;
