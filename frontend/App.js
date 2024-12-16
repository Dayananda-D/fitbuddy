// import { NavigationContainer } from '@react-navigation/native';
// import React from 'react';
// import {
//   Image,
//   ImageBackground,
//   SafeAreaView,
//   ScrollView,
//   StyleSheet,
//   Text,
//   View,
// } from 'react-native';
// // import LinearGradient from 'react-native-linear-gradient';
// import * as Progress from 'react-native-progress';
// import Dashboard from './src/darshboard';
// import onboard from './src/onboard';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// const headerImage = require('./assets/images/header.jpg');
// const notification = require('./assets/images/Notification.png');
// const banner = require('./assets/images/BG.png');
// const fire = require('./assets/images/fire.png');
// const model = require('./assets/images/model.png');
// const couple = require('./assets/images/couple.jpg');
// const cycle = require('./assets/images/cycle.png');
// const yoga = require('./assets/images/yoga.png');
// const walk = require('./assets/images/walk.png');
// const next = require('./assets/images/next.png');
// const play = require('./assets/images/play.png');
// const star = require('./assets/images/Star.png');
// const book = require('./assets/images/Book.png');
// const home = require('./assets/images/Home.png');
// const heart = require('./assets/images/H.png');
// const calendar = require('./assets/images/Calender.png');
// const profile = require('./assets/images/User.png');
// const plus = require('./assets/images/Plus.png');


// const Stack = createNativeStackNavigator();

// function RootStack() {
//   return (
//     <Stack.Navigator initialRouteName="onBoardScreen">
//       <Stack.Screen name="onBoardScreen" component={onboard} />
//       <Stack.Screen name="Home" component={Dashboard} />
//     </Stack.Navigator>
//   );
// }
// const App = () => {
//   return (
//     // <>
//     //   <ImageBackground
//     //     source={require('./assets/images/background.png')}
//     //     style={styles.container}
//     //   >
//     //     <SafeAreaView style={styles.container}>
//     //       <View style={styles.screen}>
//     //         <Header />
//     //         <Banner />
//     //       </View>
//     //       <View style={{ marginHorizontal: '3%' }}>
//     //         <Label>Your Activities</Label>
//     //         <View style={{ flexDirection: 'row' }}>
//     //           {data.map((item, index) => (
//     //             <Card data={item} index={index} />
//     //           ))}
//     //         </View>
//     //         <View
//     //           style={{
//     //             flexDirection: 'row',
//     //             justifyContent: 'space-between',
//     //             alignItems: 'center',
//     //           }}>
//     //           <Label>Fitness Video</Label>
//     //           <Text
//     //             style={{
//     //               // fontFamily: 'Poppins-Regular',
//     //               opacity: 0.5,
//     //               fontSize: 12,
//     //             }}>
//     //             View All
//     //           </Text>
//     //         </View>
//     //         <View style={{ flexDirection: 'row' }}>
//     //           {data.map((item, index) => (
//     //             <VideoPlay index={index} />
//     //           ))}
//     //         </View>
//     //       </View>
//     //     </SafeAreaView>
//     //     <BottomTab />
//     //   </ImageBackground>
//     // </>
//     <NavigationContainer>
//       <RootStack />
//     </NavigationContainer>
//   );
// };

// export default App;

// const BottomTab = () => (
//   <View
//     style={{
//       position: 'absolute',
//       bottom: 10,
//       margin: 10,
//       marginHorizontal: 25,
//       borderRadius: 20,
//       padding: 10,
//       width: '90%',
//       backgroundColor: '#EDEDED',
//       flexDirection: 'row',
//       alignItems: 'center',
//     }}>
//     <BottomButton image={home} />
//     <BottomButton image={heart} />
//     <BottomButton
//       image={plus}
//       style={{
//         position: 'absolute',
//         left: '43%',
//         top: -25,
//         backgroundColor: '#fff',
//         padding: 8,
//         borderRadius: 20,
//       }}
//     />
//     <BottomButton />
//     <BottomButton image={calendar} />
//     <BottomButton image={profile} />
//   </View>
// );
// const BottomButton = ({ image, style, imageStyle }) => (
//   <>
//     <View
//       style={[
//         {
//           flex: 1,
//           alignSelf: 'center',
//           alignItems: 'center',
//         },
//         style,
//       ]}>
//       <Image
//         source={image}
//         style={[
//           {
//             height: image === plus ? 40 : 20,
//             width: image === plus ? 40 : 20,
//           },
//           imageStyle,
//         ]}
//       />
//     </View>
//     {image === home && (
//       <View
//         style={{
//           width: '10%',
//           position: 'absolute',
//           height: 2,
//           backgroundColor: '#8860a2',
//           bottom: 0,
//           left: 25,
//         }}
//       />
//     )}
//   </>
// );

// const VideoPlay = () => (
//   <View
//     style={{
//       borderRadius: 15,
//       marginHorizontal: 12,
//       shadowOffset: { width: -5, height: 3 },
//       shadowColor: 'grey',
//       shadowOpacity: 0.5,
//       shadowRadius: 3,
//       backgroundColor: '#fff',
//     }}>
//     <View style={{ borderRadius: 10, overflow: 'hidden' }}>
//       <ImageBackground
//         source={couple}
//         style={{
//           height: 150,
//           width: 300,
//         }}>
//         {/* <LinearGradient
//           locations={[0, 1.0]}
//           colors={['rgba(0,0,0,0.00)', 'rgba(0,0,0,0.60)']}
//           style={{
//             position: 'absolute',
//             width: '100%',
//             height: '100%',
//           }}
//         ></LinearGradient> */}
//       </ImageBackground>
//       <Text
//         style={{
//           position: 'absolute',
//           bottom: 5,
//           left: 10,
//           // fontFamily: 'Poppins-Regular',
//           color: '#fff',
//         }}>
//         Transformation
//       </Text>
//       <View
//         style={{
//           position: 'absolute',
//           backgroundColor: '#fff',
//           padding: 5,
//           right: 10,
//           top: 10,
//           borderRadius: 5,
//         }}>
//         <Image source={star} style={{ height: 10, width: 10 }} />
//       </View>
//     </View>
//     <View
//       style={{
//         backgroundColor: 'white',
//         padding: 10,
//         borderRadius: 15,
//       }}>
//       <View
//         style={{
//           position: 'absolute',
//           backgroundColor: '#8860a2',
//           padding: 10,
//           right: 25,
//           top: -15,
//           borderRadius: 15,
//           zIndex: 3,
//         }}>
//         <Image source={play} style={{ height: 10, width: 10 }} />
//       </View>
//       <Text style={{
//         // fontFamily: 'Poppins-Regular' 
//       }}>
//         2 Hour Bulking Trainer
//       </Text>
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
//         <Text style={{
//           // fontFamily: 'Poppins-Regular',
//           fontSize: 12
//         }}>
//           <Image source={book} style={{ height: 15, width: 15 }} />
//           {'   Beginner'}
//         </Text>
//         <Text
//           style={{
//             // fontFamily: 'Poppins-Regular',
//             fontSize: 12,
//             color: '#8860a2',
//           }}>
//           45 Min
//         </Text>
//       </View>
//     </View>
//   </View>
// );

// const Card = ({ data, index }) => {
//   return (
//     <View
//       style={{
//         flex: 1,
//         height: index === 1 ? 180 : 150,
//         padding: 10,
//         alignSelf: 'center',
//         backgroundColor: data.color,
//         justifyContent: 'space-between',
//         marginHorizontal: 8,
//         borderRadius: 10,
//         shadowColor: 'lightgrey',
//         shadowOffset: { width: -5, height: 5 },
//         shadowOpacity: 0.5,
//         shadowRadius: 2,
//       }}>
//       <Image source={data.image} style={{ height: 25, width: 25 }} />
//       <View style={{ alignSelf: 'center', margin: 5 }}>
//         <Progress.Circle
//           size={50}
//           progress={data.status / 100}
//           showsText
//           unfilledColor="#ededed"
//           borderColor="#ededed"
//           color={data.darkColor}
//           direction="counter-clockwise"
//           fill="white"
//           strokeCap="round"
//           thickness={5}
//           style={{
//             shadowColor: 'grey',
//             shadowOffset: { width: 2, height: 2 },
//             shadowOpacity: 0.1,
//             shadowRadius: 1,
//           }}
//           textStyle={{
//             fontSize: 16,
//             // fontFamily: 'Poppins-Bold',
//             fontWeight: 'bold',
//           }}
//         />
//       </View>
//       <View>
//         <Text style={{
//           fontSize: 10,
//           // fontFamily: 'Poppins-Light' 
//         }}>
//           {'Day     1'}
//         </Text>
//         <Text style={{
//           fontSize: 10,
//           // fontFamily: 'Poppins-Light' 
//         }}>
//           {'Time   20 min'}
//         </Text>
//       </View>
//       <View
//         style={{
//           flexDirection: 'row',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//         }}>
//         <Text style={{
//           // fontFamily: 'Poppins-Regular' 
//         }}>{data.name}</Text>
//         <View
//           style={{
//             backgroundColor: data.lightColor,
//             padding: 2,
//             borderRadius: 10,
//           }}>
//           <Image
//             source={next}
//             style={{
//               height: 12,
//               width: 12,
//               resizeMode: 'contain',
//             }}
//           />
//         </View>
//       </View>
//     </View>
//   );
// };
// const Header = () => (
//   <View style={styles.header}>
//     <ImageContainer image={headerImage} />
//     <HeaderTitle />
//     <ImageContainer image={notification} height={'50%'} width={'50%'} />
//   </View>
// );
// const Banner = () => (
//   <>
//     <ImageBackground style={styles.banner} source={banner}>
//       <View style={styles.bannerContainer}>
//         <View style={styles.rowLabel}>
//           <Text style={styles.offer}>Start Your work out now</Text>
//           <View style={styles.fireContainer}>
//             <Image
//               source={fire}
//               resizeMode="contain"
//               style={styles.fireImage}
//             />
//           </View>
//         </View>
//         <OfferText>Day1</OfferText>
//         <OfferText>Legs workout</OfferText>
//       </View>
//     </ImageBackground>
//     <Image source={model} style={styles.model} resizeMode="contain" />
//   </>
// );

// const OfferText = ({ children }) => (
//   <Text style={styles.offerText}>{children}</Text>
// );

// const ImageContainer = ({ image, height = '100%', width = '100%' }) => (
//   <View style={styles.imageContainer}>
//     <Image source={image} style={[{ height, width }]} />
//   </View>
// );
// const HeaderTitle = () => (
//   <View style={styles.title}>
//     <Text style={styles.bigTitle}>Hi, XYZ</Text>
//     <Text style={styles.smallTitle}>Banglore</Text>
//   </View>
// );

// const Label = ({ children }) => <Text style={styles.label}>{children}</Text>;
// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   header: {
//     paddingHorizontal: 5,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   title: { paddingHorizontal: 10, flex: 1, justifyContent: 'center' },
//   bigTitle: {
//     fontSize: 16,
//     // fontFamily: 'Poppins-Medium' 
//   },
//   smallTitle: {
//     fontSize: 10,
//     //  fontFamily: 'Poppins-Regular', 
//     opacity: 0.6
//   },
//   image: { height: '100%', width: '100%' },
//   fireImage: { height: 15, width: 15, alignSelf: 'center', margin: 5 },
//   banner: {
//     marginTop: 20,
//     padding: 30,
//     resizeMode: 'contain',
//     borderRadius: 20,
//     overflow: 'hidden',
//     flexDirection: 'row',
//   },
//   bannerContainer: { flex: 1 },
//   label: {
//     // fontFamily: 'Poppins-Medium',
//     fontSize: 20, marginVertical: 10
//   },
//   model: {
//     position: 'absolute',
//     right: 0,
//     bottom: 0,
//     zIndex: 10,
//     height: '75%',
//     width: '50%',
//     transform: [{ rotateY: '180deg' }],
//   },
//   imageContainer: {
//     height: 50,
//     width: 50,
//     borderRadius: 25,
//     overflow: 'hidden',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   screen: { margin: '3%' },
//   offer: {
//     color: 'white',
//     // fontFamily: 'Poppins-Regular', 
//     fontSize: 10
//   },
//   offerText: {
//     color: 'white', fontSize: 16,
//     //  fontFamily: 'Poppins-Regular' 
//   },

//   rowLabel: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   fireContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// const data = [
//   {
//     name: 'Cycling',
//     status: 85,
//     image: cycle,
//     lightColor: '#f8e4d9',
//     color: '#fcf1ea',
//     darkColor: '#fac5a4',
//   },
//   {
//     name: 'Walking',
//     status: 25,
//     image: walk,
//     lightColor: '#d7f0f7',
//     color: '#e8f7fc',
//     darkColor: '#aceafc',
//   },
//   {
//     name: 'Yoga',
//     status: 85,
//     image: yoga,
//     lightColor: '#dad5fe',
//     color: '#e7e3ff',
//     darkColor: '#8860a2',
//   },
// ];

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./src/screens/welcomeScreen";
import GenderScreen from "./src/screens/GenderScreen";
import GoalScreen from "./src/screens/GoalScreen";
import WorkoutScreen from "./src/screens/WorkoutScreen";
import Dashboard from "./src/screens/Dashboard";
import Warmups from "./src/screens/Warmups";
import Login from "./src/screens/LoginScreen";
import SignUp from "./src/screens/SignupScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerShown: false, // Hide the header for a fullscreen experience
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Gender" component={GenderScreen} />
        <Stack.Screen name="Goal" component={GoalScreen} />
        <Stack.Screen name="Workout" component={WorkoutScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Warmups" component={Warmups} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Login" component={Login} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
