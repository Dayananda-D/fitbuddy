import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Icon from "react-native-vector-icons/MaterialIcons"; // Icons library
import AsyncStorage from "@react-native-async-storage/async-storage";

const home = require("../../assets/images/Home.png");
const heart = require("../../assets/images/H.png");
const dumbbell = require("../../assets/images/dumbbell.png");
const profile = require("../../assets/images/User.png");

export default function ProfileScreen() {
  const navigation = useNavigation();
  const [profileImage, setProfileImage] = useState(null);
  const [token, setToken] = useState();
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
        const userData = await AsyncStorage.getItem("@MyApp_user");

        if (token) setToken(token);
        if (userData) setUserData(JSON.parse(userData));
        
      } catch (error) {
        console.error("Error fetching user details", error);
      }
    };

    fetchUserDetails();
  }, []);

  // Function to pick an image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const onLogout = async () => {
    try {
      await AsyncStorage.clear();
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error fetching user details", error);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      // style={styles.maincontainer}
      style={{ width: '100%', height: '100%' }}
    >
      <View style={styles.container}>
        {/* Profile Image */}
        <TouchableOpacity
          style={styles.profileImageContainer}
          onPress={pickImage}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Text style={styles.addPhotoText}>Add Photo</Text>
          )}
        </TouchableOpacity>

        {/* User Information */}
        <Text style={styles.userName}>Hi, {userData.name || "Jane"}</Text>
        <Text style={styles.userLevel}>{ userData.level || "Beginner"}</Text>

        {/* Menu Items */}
        {/* <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>My Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>Goal</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuText}>My Workout Tabs</Text>
        </TouchableOpacity>
      </View> */}
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icon name="settings" size={24} color="#fff" />
              <Text style={styles.menuText}>Settings</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icon name="person" size={24} color="#fff" />
              <Text style={styles.menuText}>My Profile</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icon name="bookmark" size={24} color="#fff" />
              <Text style={styles.menuText}>My Workouts</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.menuItemLeft}>
              <Icon name="stars" size={24} color="#fff" />
              <Text style={styles.menuText}>Goal</Text>
            </View>
            <Icon name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutMenuItem} onPress={onLogout}>
            <View style={styles.logout}>
              <Text style={styles.logoutText}>logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <BottomTab />
    </ImageBackground>
  );
}

const BottomTab = () => (
  <View
    style={{
      position: "absolute",
      bottom: 30,
      margin: 10,
      marginHorizontal: 25,
      borderRadius: 20,
      padding: 10,
      width: "90%",
      backgroundColor: "#EDEDED",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
    }}
  >
    <BottomButton image={home} navigate={"Dashboard"} />
    <BottomButton image={dumbbell} navigate={"WorkoutsTab"} />
    {/* <BottomButton
                image={plus}
                style={{
                    position: 'absolute',
                    left: '43%',
                    top: -25,
                    backgroundColor: '#fff',
                    padding: 8,
                    borderRadius: 20,
                }}
            />
            <BottomButton /> */}
    <BottomButton image={heart} />
    <BottomButton image={profile} navigate={"profile"} />
  </View>
);
const BottomButton = ({ image, style, imageStyle, navigate }) => {
  const navigation = useNavigation();
  return (
    <>
      <TouchableOpacity onPress={() => navigation.navigate(navigate)}>
        <View
          style={[
            {
              flex: 1,
              alignSelf: "center",
              alignItems: "center",
            },
            style,
          ]}
        >
          <Image
            source={image}
            style={[
              {
                height: image === dumbbell ? 25 : 20,
                width: image === dumbbell ? 25 : 20,
              },
              imageStyle,
            ]}
          />
        </View>
      </TouchableOpacity>
      {image === profile && (
        <View
          style={{
            width: "10%",
            position: "absolute",
            height: 3,
            backgroundColor: "#8860a2",
            bottom: 0,
            left: 32,
          }}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // maincontainer: {
  //   flex: 1,
  //   height: "100%",
  //   width: "100%",
  // },
  // image: { height: '100%', width: '100%' },
  container: {
    flex: 1,
    alignItems: "center",
    // backgroundColor: '#101030', // Dark background
    padding: 20,
    // marginTop:100,
    justifyContent: "center",
  },
  profileImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#2D2D50",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    overflow: "hidden",
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  addPhotoText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  userName: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  userLevel: {
    color: "#AAAAAA",
    fontSize: 16,
    marginBottom: 30,
  },
  //   menu: {
  //     width: '100%',
  //     marginTop: 20,
  //   },
  //   menuItem: {
  //     width:'100%',
  //     padding: 15,
  //     backgroundColor: '#2D2D50',
  //     marginVertical: 5,
  //     borderRadius: 10,
  //   },
  //   menuText: {
  //     color: '#FFFFFF',
  //     fontSize: 18,
  //     fontWeight: '500',
  //   },
  menu: {
    width: "100%",
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    // backgroundColor: '#fff',
    backgroundColor: "#2D2D50",
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  logout: {
    alignItems: "center",
    width: "100%",
  },
  logoutText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
    fontWeight: "bold",
  },
  logoutMenuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    // backgroundColor: '#fff',
    backgroundColor: "#b23b3b",
    marginVertical: 5,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
});
