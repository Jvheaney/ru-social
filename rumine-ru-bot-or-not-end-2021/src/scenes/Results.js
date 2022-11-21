import React, {Component} from "react"
import { StyleSheet, Text, View, ScrollView, Dimensions, TextInput, TouchableOpacity } from "react-native"

import Container from '../elements/Container';
import Left from '../elements/Left';
import Right from '../elements/Right';

class Instagram extends Component {

  state = {
    screen: 0,
    instagramHandle: ""
  }

  componentDidMount() {
    this.fetchContestant();
    console.log(this.props.pass.pickedContestant);
  }

  fetchContestant = async () => {
    //check if correct
    var pass = this;
    return await fetch('https://rumine.dating/vday/getResult.php?c=' + this.props.pass.pickedContestant, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      },
    }).then((response) => response.json())
      .then((responseJson) => {
        if(responseJson == "bot"){
          setTimeout(() => {
            pass.setState({
              screen: 1
            })
          }, 1000)
        }
        else{
          console.log(responseJson);
          setTimeout(() => {
            pass.setState({
              screen: 2,
              instagramHandle: responseJson
            })
          }, 1000)
        }
    })
    .catch((error) => {
      console.log(error);
      alert("We're sorry, there seems to be an error. Please let us know on Instagram, @ru_minee.")
    });
  }

  refreshPage = () => {
    window.location.reload();
  }

  _openInstagram = () => {
    window.open("https://instagram.com/" + this.state.instagramHandle,'_blank');
  }


  render() {
    console.disableYellowBox = true;

    return (
      <Container>
					<View style={{height: 'auto', width: '100%', justifyContent: "center", alignItems: "center"}}>
						<View style={{height: 'auto', width: '100%', maxWidth: 510, padding: 10}}>
              {(this.state.screen == 0)?
							<View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center"}}>
                  <Text style={{fontSize: 80, fontFamily: "Questrial", marginBottom: 5}}>🥁</Text>
                  <Text style={{fontSize: 20, fontFamily: "Questrial", marginTop: 10}}>drumroll...</Text>
							</View>
              :(this.state.screen == 1)?
              <View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center"}}>
                <View style={{justifyContent: "center", alignItems: "center"}}>
                  <Text style={{fontSize: 18, fontFamily: "Questrial", marginBottom: 5}}>You picked...</Text>
                  <Text style={{fontWeight: "bold", fontSize: 35, fontFamily: "Questrial", marginTop: 5, marginBottom: 5}}>A BOT!</Text>
                  <Text style={{fontSize: 90, fontFamily: "Questrial", color: "#3c3c3c"}}>🤖</Text>
                  <Text style={{marginTop: 15, marginBottom: 15, fontSize: 20, textAlign: "center", fontFamily: "Questrial", color: "#3c3c3c"}}>We hope you like the cold embrace of robot arms!</Text>
                </View>
                <Left func={() => this.refreshPage()} />
              </View>
              :
              <View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center"}}>
                <View style={{justifyContent: "center", alignItems: "center"}}>
                  <Text style={{fontSize: 18, fontFamily: "Questrial", marginBottom: 5}}>You picked...</Text>
                  <TouchableOpacity activeOpacity={0.6} onPress={() => this._openInstagram()}><Text style={{fontWeight: "bold", fontSize: 35, fontFamily: "Questrial", marginTop: 5, marginBottom: 5}}>@{this.state.instagramHandle}</Text></TouchableOpacity>
                  <Text style={{fontSize: 90, fontFamily: "Questrial", color: "#3c3c3c"}}>😆</Text>
                  <Text style={{marginTop: 15, marginBottom: 15, fontSize: 20, textAlign: "center", fontFamily: "Questrial", color: "#3c3c3c"}}>Happy DMing!</Text>
                </View>
                <Left func={() => this.refreshPage()} />
              </View>
            }
						</View>
					</View>
				</Container>
   );
 }
}

export default Instagram;
