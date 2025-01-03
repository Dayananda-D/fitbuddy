import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";

const WelcomeScreen = ({ navigation }) => {
    return (
        <ImageBackground
            source={require("../../assets/images/welcomeScreen.jpg")}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Welcome to FitBuddy!</Text>
                <Text style={styles.description}>
                    Elevate Your Fitness with a Cutting Edge to Fuel Your Motivation & Crush your goal
                </Text>
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => navigation.navigate("Login")}
                >
                    <Text style={styles.buttonText}>Get Started!</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        // flex: 1,
        height: '100%',
        width: '100%',
        resizeMode: "cover",
    },
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginTop: 100,
        textAlign: "center",
    },
    description: {
        color: "#9e9e9e",
        textAlign: "center",
        fontSize: 16,
        fontWeight: "600",
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

export default WelcomeScreen;
