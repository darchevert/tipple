import React, { useState } from "react";
import {
   StyleSheet,
   Text,
   View,
   Button,
   FlatList,
   Modal,
   TouchableWithoutFeedback,
   Keyboard,
   Alert
} from "react-native";
import * as Font from "expo-font";
import { AppLoading } from "expo";
import { SimpleAnimation } from 'react-native-simple-animations';
import { Audio } from 'expo-av';

import PlayerItem from "./components/PlayerItem";
import PlayerInput from "./components/PlayerInput";

const fetchFonts = () => {
   return Font.loadAsync({
      bloomer: require("./assets/fonts/Bloomer.otf"),
      "open-sans": require("./assets/fonts/OpenSans-Regular.ttf"),
      "open-sans-bold": require("./assets/fonts/OpenSans-Bold.ttf"),
      "open-sans-bold-italic": require("./assets/fonts/OpenSans-BoldItalic.ttf"),
      kaushan: require("./assets/fonts/KaushanScript-Regular.otf"),
      wachaka: require("./assets/fonts/WaChaKa.ttf")
   });
};

const sounds = {
   start: require('./assets/luxe.mp3'),
   punch: require('./assets/sfb.mp3'),
   bidon: require('./assets/bidon.mp3'),
}

export default function App() {
   const [coursePlayers, setCoursePlayers] = useState([]);
   const [isPicoloMode, setIsPicoloMode] = useState(false);
   const [isJamaisMode, setIsJamaisMode] = useState(false);
   const [text, setText] = useState([]);
   const [isDisabled, setIsDisabled] = useState(true);
   const [isDataLoaded, setDataLoaded] = useState(false);

   if (!isDataLoaded) {
      return (
         Alert.alert("Attention", "L'abus d'alcool est dangereux pour la santé. En poursuivant, vous confirmez être responsable des éventuelles conséquences que pourrait engendrer l'utilisation de Tipple.", [
            { text: "J'ai compris!", style: "default" }
         ]),
         (
            <AppLoading
               startAsync={fetchFonts}
               onFinish={() => setDataLoaded(true)}
               onError={err => console.log(err)}
            />
         )
      );
   }

   handlePlaySound = async son => {
      const soundObject = new Audio.Sound();
      try {
         let source = sounds[son]
         // let source = require('./assets/note1.wav')
         await soundObject.loadAsync(source)
         await soundObject
            .playAsync()
            .then(async playbackStatus => {
               setTimeout(() => {
                  soundObject.unloadAsync()
               }, playbackStatus.playableDurationMillis)
            })
            .catch(error => {
               console.log(error)
            })
      } catch (error) {
         console.log(error)
      }
   }

   const addPlayerHandler = playerTitle => {
      setCoursePlayers(currentPlayers => [
         ...currentPlayers,
         { id: Math.random().toString(), value: playerTitle }
      ]);
      coursePlayers.length + 1 > 1 ? setIsDisabled(false) : setIsDisabled(true);
   };

   const removePlayerHandler = playerId => {
      setCoursePlayers(currentPlayers => {
         return currentPlayers.filter(player => player.id !== playerId);
      });
      coursePlayers.length - 1 > 1 ? setIsDisabled(false) : setIsDisabled(true);
   };

   const form1 = coursePlayers;
   const textInputComponents1 = form1.map(item => <Text>{item["value"]}</Text>);
   const randomIndex1 = Math.floor(Math.random() * textInputComponents1.length);
   const randomElement1 = textInputComponents1[randomIndex1];

   const form2 = [
      "doit boire",
      "doit distribuer"
   ];

   const textInputComponents2 = form2.map(type2 => <Text>{type2}</Text>);
   const randomIndex2 = Math.floor(Math.random() * textInputComponents2.length);
   const randomElement2 = textInputComponents2[randomIndex2];

   const form3 = [
      "1 gorgée",
      "2 gorgées",
      "3 gorgées",
      "4 gorgées",
      "5 gorgées"
   ];

   const replayButton = () => {
      setText(randomElement1, randomElement2, randomElement3);
      this.handlePlaySound('start');
   }

   const picoloButton = () => {
      setIsPicoloMode(true);
   }

   const jamaisButton = () => {
      setIsJamaisMode(true);
   }

   const addDelPlayerButton = () => {
      setIsPicoloMode(false);
      setIsJamaisMode(false);
      this.handlePlaySound('bidon');
   }

   const textInputComponents3 = form3.map(type3 => <Text>{type3}</Text>);
   const randomIndex3 = Math.floor(Math.random() * textInputComponents3.length);
   const randomElement3 = textInputComponents3[randomIndex3];

   return (
      <TouchableWithoutFeedback
         onPress={() => {
            Keyboard.dismiss();
         }}
      >
         <View style={styles.screen}>
            <Text style={styles.gameTitle}> TIPPLE </Text>
            <PlayerInput onAddPlayer={addPlayerHandler} />
            <FlatList
               keyExtractor={(item, index) => item.id}
               data={coursePlayers}
               renderItem={itemData => (
                  <PlayerItem
                     id={itemData.item.id}
                     onDelete={removePlayerHandler}
                     title={itemData.item.value}
                  />
               )}
            />
            <View style={styles.buttonLine}>
               <Button
                  title="  Picolo!  "
                  disabled={isDisabled}
                  color="#3E92CC"
                  onPress={() => {
                     picoloButton();
                  }}
               />
               <Button
                  title="  J'ai jamais!  "
                  disabled={isDisabled}
                  color="#3E92CC"
                  onPress={() => {
                     jamaisButton();
                  }}
               />
            </View>
            <Modal visible={isPicoloMode} animationType="slide">
               <View style={styles.picoloScreen}>
                  <Text style={styles.gameTitle}> TIPPLE </Text>
                  <Text style={styles.gameSubtitle}> Picolo </Text>
                  <View style={styles.gameText}>
                     <SimpleAnimation delay={500} duration={600} staticType='bounce' animateOnUpdate={true}>
                        <Text style={styles.modalText}>{randomElement1}</Text>
                     </SimpleAnimation>
                     <SimpleAnimation delay={1500} duration={600} staticType='bounce' animateOnUpdate={true}>
                        <Text style={styles.modalText}>{randomElement2}</Text>
                     </SimpleAnimation>
                     <SimpleAnimation delay={2500} duration={600} staticType='bounce' animateOnUpdate={true}>
                        <Text style={styles.modalText}>{randomElement3}</Text>
                     </SimpleAnimation>
                  </View>
               </View>
               <View style={styles.gameButtonReplay}>
                  <Button
                     title="REJOUER"
                     color="#3E92CC"
                     onPress={() => {
                        replayButton();
                     }}
                  />

               </View>
               <View style={styles.gameButtonsAddDelPlayers}>
                  <Button
                     title="AJOUTER / SUPPRIMER DES JOUEURS"
                     onPress={() => {
                        addDelPlayerButton();
                     }}
                     color="#3E92CC"
                  />
               </View>
            </Modal>
            <Modal visible={isJamaisMode} animationType="slide">
               <View style={styles.jamaisScreen}>
                  <Text style={styles.gameTitle}> TIPPLE </Text>
                  <Text style={styles.gameSubtitle}> J'ai jamais </Text>
                  <View style={styles.gameText}>
                     <SimpleAnimation delay={500} duration={600} staticType='bounce' animateOnUpdate={true}>
                        <Text style={styles.modalText}>{randomElement1}</Text>
                     </SimpleAnimation>
                     <SimpleAnimation delay={1500} duration={600} staticType='bounce' animateOnUpdate={true}>
                        <Text style={styles.modalText}>{randomElement2}</Text>
                     </SimpleAnimation>
                     <SimpleAnimation delay={2500} duration={600} staticType='bounce' animateOnUpdate={true}>
                        <Text style={styles.modalText}>{randomElement3}</Text>
                     </SimpleAnimation>
                  </View>
               </View>
               <View style={styles.gameButtonReplay}>
                  <Button
                     title="REJOUER"
                     color="#3E92CC"
                     onPress={() => {
                        replayButton();
                     }}
                  />
               </View>
               <View style={styles.gameButtonsAddDelPlayers}>
                  <Button
                     title="AJOUTER / SUPPRIMER DES JOUEURS"
                     onPress={() => {
                        addDelPlayerButton();
                     }}
                     color="#3E92CC"
                  />
               </View>
            </Modal>
         </View >
      </TouchableWithoutFeedback >
   );
}

const styles = StyleSheet.create({
   screen: {
      flex: 1,
      padding: 50,
      backgroundColor: "#0A2463",
      alignItems: "center",
      justifyContent: "space-between"
   },
   picoloScreen: {
      flex: 1,
      padding: 50,
      backgroundColor: "#154D63",
      alignItems: "center",
      justifyContent: "space-between"
   },
   jamaisScreen: {
      flex: 1,
      padding: 50,
      backgroundColor: "#F5BB4F",
      alignItems: "center",
      justifyContent: "space-between"
   },
   gameTitle: {
      color: "#FFFAFF",
      fontSize: 40,
      padding: 30,
      fontFamily: "kaushan"
   },
   gameSubtitle: {
      color: "#FFFAFF",
      fontSize: 30,
      padding: 30,
      fontFamily: "kaushan"
   },
   gameButtonReplay: {
      padding: 40,
      paddingBottom: 40,
      paddingLeft: 140,
      paddingRight: 140,
      backgroundColor: "#0A2463"
   },
   gameButtonsAddDelPlayers: {
      padding: 40,
      paddingBottom: 40,
      paddingLeft: 70,
      paddingRight: 70,
      backgroundColor: "#0A2463"
   },
   modalText: {
      color: "#FFFAFF",
      fontSize: 20,
      padding: 30,
      fontFamily: "open-sans-bold-italic"
   },
   gameText: {
      flex: 2,
      alignItems: "center",
      justifyContent: "center"
   },
   buttonLine: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center"
   },
});
