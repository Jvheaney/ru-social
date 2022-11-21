import React, {Component} from "react"
import { StyleSheet, Text, View, Dimensions, TextInput } from "react-native"

import Container from '../elements/Container';
import Left from '../elements/Left';
import Right from '../elements/Right';

class Instagram extends Component {


  _goToNextScreen = () => {
    //Switch
    this.props.pass.setState({screen: 1})
  }

  state = {

  }

  render() {
    console.disableYellowBox = true;

    return (
      <Container>
					<View style={{height: 'auto', width: '100%', justifyContent: "center", alignItems: "center"}}>
						<View style={{height: 'auto', width: '100%', maxWidth: 510, padding: 10}}>
							<View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center"}}>
                <View>
                  <Text style={{fontWeight: "bold", fontSize: 25, fontFamily: "Questrial", marginBottom: 5}}>Welcome!</Text>
                  <Text style={{fontWeight: "medium", fontSize: 20, fontFamily: "Questrial", marginTop: 5, marginBottom: 5}}>How to Play 🕵️</Text>
                  <Text style={{marginTop: 15, fontSize: 16, fontFamily: "Questrial", color: "#3c3c3c"}}>On the next screen you will be given the opportunity to ask up to 5 questions that were filled out by users over the last 5 days.</Text>
                  <Text style={{marginTop: 15, fontSize: 16, fontFamily: "Questrial", color: "#3c3c3c"}}>There will be 3 contestants. 2 are Artificial Intelligence, and 1 is a human. Your job is to answer questions and decide who the real human is.</Text>
                  <Text style={{marginTop: 15, fontSize: 16, fontFamily: "Questrial", color: "#3c3c3c"}}>If you're correct, you get their Instagram! If you're wrong, well, I guess that sucks for you :)</Text>
                  <Text style={{marginTop: 25, fontSize: 16, fontFamily: "Questrial", color: "#3c3c3c"}}>Select questions from the selection below. You can decide to make your guess at any time by clicking the heart icon at the top right.</Text>
                  <Text style={{marginTop: 10, fontSize: 18, fontFamily: "Questrial", color: "black"}}>Good luck!</Text>
                </View>
							</View>
						</View>
					</View>
          <View style={{height: 'auto', width: '90%', maxWidth: 500, marginTop: 50, flexDirection: "row", justifyContent: "center", justifyContent: "space-between"}}>
            <View style={{height: 60, width: 60}}></View>
            <Right func={() => this._goToNextScreen()} />
          </View>
				</Container>
   );
 }
}

export default Instagram;
