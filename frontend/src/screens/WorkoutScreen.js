import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import SVGComponent from "../components/svgComponent";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { base_url } = require("../../config");

const WorkoutScreen = ({ navigation, route }) => {
    const { UserData } = route.params;
    const [selectedIds, setSelectedIds] = useState([]);
    const [userEmail, setUserEmail] = useState();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const email = await AsyncStorage.getItem('email');

                if (email) setUserEmail(email);
            } catch (error) {
                console.error('Error fetching user details', error);
            }
        };

        fetchUserDetails();
    }, []);

    const handleSelectionChange = (ids) => {
        setSelectedIds(ids);
    };

    const inputAccumulator = () => {
        const updatedUserData = {
            ...UserData,
            selectedBodyParts: selectedIds
        };
        if (userEmail) {
            fetch(`${base_url}/user/${userEmail}`, {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedUserData),
            })
              .then((response) => {
                if (!response.ok) {
                  // Handle HTTP errors
                  throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); // Parse JSON response
              })
              .then(async (data) => {
                console.log("Response:", data); // Handle successful response
                await AsyncStorage.setItem('selectedBodyPartsAdded', JSON.stringify(true));
                navigation.navigate("Dashboard", { UserData: updatedUserData });
              })
              .catch((error) => {
                console.error("Error updating user:", error); // Handle errors
              });
        } else {
            navigation.navigate("Login");
        }
    };
    return (
        <ImageBackground
            source={require("../../assets/images/background.png")}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Text style={styles.title}>What do you want to workout?</Text>
                <SVGComponent onSelectionChange={handleSelectionChange} />
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => inputAccumulator()}
                >
                    <Text style={styles.buttonText}>Let’s Begin</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 20,
        textAlign: "center",
    },
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        backgroundColor: "#000",
        padding: 10,
        borderRadius: 5,
    },
    backButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    startButton: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        width: 200,
        alignItems: "center",
        position: "absolute",
        bottom: 60,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default WorkoutScreen;
