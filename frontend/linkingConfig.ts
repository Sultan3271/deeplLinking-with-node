import { Linking } from "react-native";

const config = {
  screens: {
      Home: 'home',
      Events: 'event/:eventId',
      RallyRaceDetail: 'rally/:rallyId', 
    //   Signup: 'signup',
      Signup: 'refer/:referralCode',
    },
 };

export const linking = {
  prefixes: ["appname://", "https://domain.com","https://domain.com"],
  config,
  async getInitialURL() {
   const url = await Linking.getInitialURL()
   if (typeof url === "string") {
    console.log(url,"incoming link");
    
    return url
   }
  },
 }