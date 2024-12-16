import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import SVGComponent from "../components/svgComponent"; // Import your SVG component here

const WorkoutScreen = ({ navigation }) => {

    return (
        <ImageBackground
            source={require("../../assets/images/background.png")}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Text style={styles.title}>What do you want to workout?</Text>
                <SVGComponent width={"60%"} height={"70%"} /> {/* Add your SVGComponent here */}
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => navigation.navigate("Dashboard")} // Move to Dashboard
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
        top: 30,
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
