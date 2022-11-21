import React from "react"
import { StyleSheet, Text, View, Dimensions, TextInput } from "react-native"

import Instructions from './scenes/Instructions';
import Game from './scenes/Game';
import Results from './scenes/Results';

class App extends React.Component {

	pickedContestant = "";

	state = {
		screen: 0
	}

	submitAnswers = async () => {

		var response = "fail";

      var details = {
				"tokPass": window.tokPass,
        "ighandle": this.ighandle,
				"gender": this.gender,
				"int_m": this.int_m,
				"int_f": this.int_f,
				"int_nb": this.int_nb,
				"int_t": this.int_t,
				"int_o": this.int_o,
				"answer1": this.answer1,
				"answer2": this.answer2,
				"answer3": this.answer3,
				"answer4": this.answer4,
				"answer5": this.answer5,
				"answer6": this.answer6,
				"answer7": this.answer7,
				"answer8": this.answer8,
				"answer9": this.answer9,
				"answer10": this.answer10,
        };

        var formBody = [];
        for (var property in details) {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(details[property]);
          formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
      const resp = await fetch('https://rumine.dating/vday/addAnswers.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody,
      }).then((response) => response.json())
        .then((responseJson) => {
					if(responseJson = "success"){
						response = "success";
					}
					else{
						response = "fail";
					}
      })
      .catch((error) => {
        alert("We're sorry, there seems to be an error. Please let us know on Instagram, @ru_minee.")
      });

			return response;
	}



	render() {
		return (
			<>
				{(this.state.screen == 0)?
					<Instructions pass={this} />
				:(this.state.screen == 1)?
					<Game pass={this} />
				:
					<Results pass={this} />
				}
			</>
		)
	}
}

const styles = StyleSheet.create({
	text: {
		fontWeight: "bold",
		fontSize: 30
	}
})

export default App
