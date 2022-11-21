import React, {Component} from "react"
import { StyleSheet, Text, View, Dimensions, TextInput, TouchableOpacity } from "react-native"

import Container from '../elements/Container';

class Home extends Component {

  state = {
    screen: "home",
    used: 0
  }

  render() {
    console.disableYellowBox = true;

    return (
      <Container>
					<View style={{height: 'auto', width: '100%', justifyContent: "center", alignItems: "center"}}>
						<View style={{height: 'auto', width: '100%', maxWidth: 510, padding: 10}}>
							<View style={{height: 'auto', width: '100%', alignItems: "center", justifyContent: "center"}}>
                <View>
                  <Text style={{fontWeight: "regular", fontSize: 60, fontFamily: "Questrial", color: "black", textAlign: "center"}}>🎃</Text>
                  <Text style={{fontWeight: "regular", fontSize: 40, fontFamily: "Questrial", color: "black", textAlign: "center"}}>Thanks!</Text>
                  <Text style={{marginTop: 15, fontSize: 20, fontFamily: "Questrial", color: "black", textAlign: "center"}}>We got your artwork! 🎉🎉</Text>
                  <Text style={{marginTop: 15, fontSize: 20, fontFamily: "Questrial", color: "black", textAlign: "center"}}>May the odds be ever in your favor.</Text>
                  <Text style={{marginTop: 15, fontSize: 16, fontFamily: "Questrial", color: "black", textAlign: "center"}}>We'll be in touch!</Text>
                </View>
							</View>
						</View>
					</View>
				</Container>
   );
 }
}

export default Home;
