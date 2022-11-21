import React from 'react';
import { TextInput, Alert, TouchableOpacity, Dimensions, AppRegistry, StyleSheet, Text, View, Image } from 'react-native';

import Question from './components/Question';
import MultiQuestion from './components/MultiQuestion';
import Header from './components/Header';
import ErrorPic from './assets/Errr.png'
import ThankPic from './assets/Thank.png'


let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;



class App extends React.Component {

  constructor(props) {
    super(props);
  }

  goBack = () => {
    //save cookie
    document.cookie =  "submitted=ig; path=/";
    //move on to qa
    this.setState({
      page: "ig"
    });
  }

  submitIG = () => {
    var self = this;
    if (this.state.igHandle.trim().length > 0) {

    var formData = new FormData;
    formData.append("handle", this.state.igHandle);
    formData.append("tokPass", window.tokPass);

    fetch("https://rumine.ca/vday/submitIG.php", {
      method: "POST",
      body: formData
    })
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      if(data == "success"){
        //save cookie
        document.cookie =  "submitted=qa; path=/";
        //move on to qa
        self.setState({
          page: "qa"
        });
      }
      else{
        document.cookie =  "submitted=errorig; path=/";
        //move on to error
        self.setState({
          page: "error"
        });
      }
    });
    }
    else{
      alert("Please type in a valid Instagram username.");
    }
  }

  sendData = () => {
    var self = this;
    if (!this.state.pickedOptions.includes(undefined)) {
    var data = {
      "answers": JSON.stringify(this.state.pickedOptions),
    }

    var formData = new FormData;
    formData.append("answers", JSON.stringify(this.state.pickedOptions));
    formData.append("tokPass", window.tokPass);

    fetch("https://rumine.ca/vday/submit.php", {
      method: "POST",
      body: formData
    })
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      if(data == "success"){
        //save cookie
        document.cookie =  "submitted=thanks; path=/";
        //move on to thanks
        self.setState({
          page: "thanks"
        });
      }
      else{
        document.cookie =  "submitted=errorqa; path=/";
        //move on to error
        self.setState({
          page: "error"
        });
      }
    });
    }
    else{
      alert("Please make sure you have answered all the questions!");
    }
  }

  handleInput = (handle) => {
    this.setState({
      igHandle: handle
    });
  }

  checkCookie = () => {
    var nameEQ = "submitted=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0){
        var value = c.substring(nameEQ.length,c.length);
        document.cookie =  "submitted=" + value.replace("error","") + "; path=/";
      }
    }
    return (<View></View>);
  }

  decidePage = (page) => {
    var nameEQ = "submitted=";
    var ca = document.cookie.split(';');
    var failover = false;
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0){
        var value = c.substring(nameEQ.length,c.length);
        if(value == page){
          return true;
        }
        else if(value == "errorig" || value == "errorqa"){
          failover = true;
        }
        else{
          return false;
        }
      }
      else if (page == "ig" && failover == false && i == ca.length-1){
        return true;
      }
      else if(i == ca.length-1){
        return false;
      }
    }
  }

  otherClick = () => {
    this.setState({
      otherOpacity: 100,
      otherHeight: 'auto'
    })
  }

  state = {
    pickedOptions: Array(17),
    page: "iguser",
    igHandle: "",
    otherOpacity: 0,
    otherHeight: 0
  }

  render() {
    return (
      <View>
      {(this.decidePage("qa"))?
      <View style={styles.box}>
          <Question topPass={this} qnum={"A"} question={"Tell us a bit about yourself. I most closely identify as:"} answers={[{qnum: 15, anum: 0, answer: "Male"}, {qnum: 15, anum: 1, answer: "Female"}, {qnum: 15, anum: 2, answer: "Non-Binary"}, {qnum: 15, anum: 3, answer: "Transgender"}, {qnum: 15, anum: 4, answer: "Transgender Male"}, {qnum: 15, anum: 5, answer: "Transgender Female"}, {qnum: 15, anum: 6, answer: "Other"}]} />
          <View style={{opacity: this.state.otherOpacity, height: this.state.otherHeight}}>
            <Text style={{paddingBottom: 10, textAlign: "center", fontSize: 16, fontFamily: "Roboto", fontWeight: "bold"}}>We are sorry we couldn't represent you better!</Text>
            <Text style={{textAlign: "center", fontSize: 16, fontFamily: "Roboto"}}>Please send us an email at ru.mine2020@gmail.com to offer your input and help us better represent our community.</Text>
          </View>
          <MultiQuestion topPass={this} qnum={"B"} question={"I am interested in (select all that apply):"} answers={[{qnum: 16, anum: 0, answer: "Male"}, {qnum: 16, anum: 1, answer: "Female"}, {qnum: 16, anum: 2, answer: "Non-Binary"}, {qnum: 16, anum: 3, answer: "Transgender"}, {qnum: 16, anum: 4, answer: "Other"}]} />
          <Question topPass={this} qnum={1} question={"The breakfast of champions is:"} answers={[{qnum: 0, anum: 0, answer: "Pancakes/Waffles"}, {qnum: 0, anum: 1, answer: "Eggs"}, {qnum: 0, anum: 2, answer: "Just a Coffee"}, {qnum: 0, anum: 3, answer: "Pizza from Last Night"}, {qnum: 0, anum: 4, answer: "Skipping Breakfast"}]} />
          <Question topPass={this} qnum={2} question={"The best SLC floor is:"} answers={[{qnum: 1, anum: 0, answer: "The Lobby"}, {qnum: 1, anum: 1, answer: "SLC 2"}, {qnum: 1, anum: 2, answer: "SLC 3"}, {qnum: 1, anum: 3, answer: "SLC 4"}, {qnum: 1, anum: 4, answer: "SLC 5"}, {qnum: 1, anum: 5, answer: "SLC 6"}, {qnum: 1, anum: 6, answer: "SLC 7"}, {qnum: 1, anum: 7, answer: "SLC 8"}]} />
          <Question topPass={this} qnum={3} question={"Would you take the SLC elevator up 1 floor?"} answers={[{qnum: 2, anum: 0, answer: "Yes"}, {qnum: 2, anum: 1, answer: "No"}]} />
          <Question topPass={this} qnum={4} question={"The best lecture seating is:"} answers={[{qnum: 3, anum: 0, answer: "Front"}, {qnum: 3, anum: 1, answer: "Middle"}, {qnum: 3, anum: 2, answer: "Back"}, {qnum: 3, anum: 3, answer: "Y'all go to lectures?"}]} />
          <Question topPass={this} qnum={5} question={"Your assignment is due tomorrow at midnight, but The Bachelor is on tonight at 8."} answers={[{qnum: 4, anum: 0, answer: "Who cares"}, {qnum: 4, anum: 1, answer: "Assignment has to wait"}]} />
          <Question topPass={this} qnum={6} question={"The best time to hit the gym is:"} answers={[{qnum: 5, anum: 0, answer: "Never"}, {qnum: 5, anum: 1, answer: "Morning"}, {qnum: 5, anum: 2, answer: "Middle of the day"}, {qnum: 5, anum: 3, answer: "Late night"}]} />
          <Question topPass={this} qnum={7} question={"If I was in Toy Story, I'd be:"} answers={[{qnum: 6, anum: 0, answer: "Sheriff Woody"}, {qnum: 6, anum: 1, answer: "Buzz Lightyear"}, {qnum: 6, anum: 2, answer: "Jessie"}, {qnum: 6, anum: 3, answer: "The Aliens"}, {qnum: 6, anum: 4, answer: "Mr/Mrs. Potatohead"}, {qnum: 6, anum: 5, answer: "Slinky Dog"}, {qnum: 6, anum: 6, answer: "Rex"}]} />
          <Question topPass={this} qnum={8} question={"Tik Tok."} answers={[{qnum: 7, anum: 0, answer: "Necessary"}, {qnum: 7, anum: 1, answer: "It can go"}, {qnum: 7, anum: 2, answer: "NEEDS TO GO"}]} />
          <Question topPass={this} qnum={9} question={"I take notes with:"} answers={[{qnum: 8, anum: 0, answer: "A computer"}, {qnum: 8, anum: 1, answer: "Pen and paper"}, {qnum: 8, anum: 2, answer: "Both"}, {qnum: 8, anum: 3, answer: "Notes..?"}]} />
          <Question topPass={this} qnum={10} question={"Time for Netflix, I'm picking:"} answers={[{qnum: 9, anum: 0, answer: "Friends"}, {qnum: 9, anum: 1, answer: "The Office"}, {qnum: 9, anum: 2, answer: "How I Met Your Mother"}, {qnum: 9, anum: 3, answer: "Maybe something by Marvel"}, {qnum: 9, anum: 4, answer: "None of these"}]} />
          <Question topPass={this} qnum={11} question={"You had a first date and had a great time, what are you doing now?"} answers={[{qnum: 10, anum: 0, answer: "Netflix and Chill"}, {qnum: 10, anum: 1, answer: "Disney Plus and Thrust"}, {qnum: 10, anum: 2, answer: "\"I had a great time, talk soon!\""}, {qnum: 10, anum: 3, answer: "Planning the next date"}]} />
          <Question topPass={this} qnum={12} question={"Best artist out of these:"} answers={[{qnum: 11, anum: 0, answer: "Drake"}, {qnum: 11, anum: 1, answer: "Kanye West"}, {qnum: 11, anum: 2, answer: "Beyonce"}, {qnum: 11, anum: 3, answer: "Lady Gaga"}, {qnum: 11, anum: 4, answer: "Green Day"}, {qnum: 11, anum: 5, answer: "Ariana Grande"}, {qnum: 11, anum: 6, answer: "Wolfgang Mozart"}]} />
          <Question topPass={this} qnum={13} question={"Would you skip a lecture in DSQ to go see Frozen 2?"} answers={[{qnum: 12, anum: 0, answer: "Yes"}, {qnum: 12, anum: 1, answer: "Depends, who with?"}, {qnum: 12, anum: 2, answer: "No"}]} />
          <Question topPass={this} qnum={14} question={"Best coffee is:"} answers={[{qnum: 13, anum: 0, answer: "Tim Hortons"}, {qnum: 13, anum: 1, answer: "McCafe"}, {qnum: 13, anum: 2, answer: "Starbucks"}, {qnum: 13, anum: 3, answer: "Balzac's"}, {qnum: 13, anum: 4, answer: "Tea"}, {qnum: 13, anum: 5, answer: "No coffee for me!"}]} />
          <Question topPass={this} qnum={15} question={"The perfect vacation is:"} answers={[{qnum: 14, anum: 0, answer: "Relaxing on a beach somewhere"}, {qnum: 14, anum: 1, answer: "Exploring cities"}, {qnum: 14, anum: 2, answer: "Checking out nature"}, {qnum: 14, anum: 3, answer: "What is a vacation?"}]} />
          <View style={{height: 200, width: '100%', justifyContent: "center", alignItems: "center", flexDirection: "row"}}>
          <View style={{paddingRight: 5}}>
            <TouchableOpacity activeOpacity={0.6} onClick={() => this.goBack()} style={{justifyContent: "center", alignItems: "center", height: 60, width: 150, borderRadius: 5, backgroundColor: "#ff6781"}}>
              <Text style={{fontSize: 16, color: "white"}}>Back</Text>
            </TouchableOpacity>
          </View>
          <View style={{paddingLeft: 5}}>
            <TouchableOpacity activeOpacity={0.6} onClick={() => this.sendData()} style={{justifyContent: "center", alignItems: "center", height: 60, width: 150, borderRadius: 5, backgroundColor: "#ff6781"}}>

              <Text style={{fontSize: 16, color: "white"}}>Submit</Text>
            </TouchableOpacity>
          </View>
          </View>
      </View>
      :
      (this.decidePage("ig"))?
      <View style={styles.box, {height: 'auto', minHeight: screenHeight-300}}>
      <View style={{paddingTop: 75, paddingBottom: 50, paddingLeft: 5, paddingRight: 5, height: 'auto', width: '100%', flexDirection: 'column', justifyContent: "center", alignItems: "center"}}>
        <Text style={{textAlign: "center", fontSize: 25, fontFamily: "RaleWay", fontWeight: "bold"}}>To get started, type your instagram handle below:</Text>
        <View style={{paddingTop: 20, paddingBottom: 20, flexDirection: "row",}}>
        <Text style={{fontSize: 30, backgroundColor: "#f9c6cf", borderTopLeftRadius: 5, borderBottomLeftRadius: 5}}>@</Text>
          <TextInput
            style={{fontSize: 25,
              fontFamily: "RaleWay",
              backgroundColor: "#f9c6cf",
              borderTopRightRadius: 5,
              borderBottomRightRadius: 5,
              borderColor: "white"
            }}
            maxLength={30}
            onChangeText={(handle) => this.handleInput(handle)}
            onSubmitEditing={() => this.submitIG()}
          >
          </TextInput>
        </View>
        <Text style={{textAlign: "center", fontSize: 18, fontFamily: "RaleWay"}}>This will be given to your matches.</Text>
      </View>
      <View style={{height: 200, width: '100%', justifyContent: "center", alignItems: "center"}}>
        <TouchableOpacity activeOpacity={0.6} onClick={() => this.submitIG()} style={{justifyContent: "center", alignItems: "center", height: 60, width: 150, borderRadius: 5, backgroundColor: "#ff6781"}}>
          <Text style={{fontSize: 16, color: "white"}}>Continue</Text>
        </TouchableOpacity>
      </View>
      </View>
      :
      (this.decidePage("thanks"))?
      <View style={styles.box, {height: 'auto', minHeight: screenHeight-300}}>
      <View style={{paddingTop: 75, paddingBottom: 50, paddingLeft: 5, paddingRight: 5, height: 'auto', width: '100%', flexDirection: 'column', justifyContent: "center", alignItems: "center"}}>
        <Text style={{textAlign: "center", fontSize: 40, fontFamily: "Roboto", fontWeight: "bold"}}>Alright, we got what we needed!</Text>
        <Text style={{textAlign: "center", fontSize: 20, fontFamily: "Roboto"}}>We'll send it off to our match making penguins to work their magic.</Text>
        <View style={{marginTop: 10, paddingBottom: 10, paddingLeft: 5, paddingRight: 5, height: 'auto', minHeight: 200, width: '100%', flexDirection: 'column', justifyContent: "center", alignItems: "center"}}>

        <Image resizeMode="contain" style={styles.canvas} source={ThankPic}/>
        </View>



        <Text style={{marginTop: 10, textAlign: "center", fontSize: 30, fontFamily: "Roboto", fontWeight: "bold"}}>Come back on February 12th to see your matches!</Text>
      </View>
      </View>
      :
      <View style={styles.box, {height: 'auto', minHeight: screenHeight-300}}>
      {this.checkCookie()}
      <View style={{paddingTop: 75, paddingBottom: 50, paddingLeft: 5, paddingRight: 5, height: 'auto', width: '100%', flexDirection: 'column', justifyContent: "center", alignItems: "center"}}>
        <Text style={{textAlign: "center", fontSize: 30, fontFamily: "Roboto", fontWeight: "bold"}}>Hmmm... It seems there was an error.</Text>
        <Text style={{textAlign: "center", fontSize: 25, fontFamily: "Roboto"}}>We've dispatched our IT penguins to take a look at it.</Text>
        <View style={{marginTop: 30, paddingBottom: 10, paddingLeft: 5, paddingRight: 5, height: 'auto', minHeight: 200, width: '100%', flexDirection: 'column', justifyContent: "center", alignItems: "center"}}>

        <Image resizeMode="contain" style={styles.canvas} source={ErrorPic}/>
         </View>
        <Text style={{ textAlign: "center", fontSize: 30, fontFamily: "Roboto", fontWeight: "medium"}}>Refresh the page in a few minutes or let us know it's broken at @ru_minee on Instagram.</Text>
      </View>
      </View>
      }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  box: { flex: 1, padding: 5 },
  text: { fontWeight: 'bold'},

  canvas: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },

});



export default App;
