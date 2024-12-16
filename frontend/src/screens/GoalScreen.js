import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from "react-native";

const GoalScreen = ({ navigation }) => {
    return (
        <ImageBackground
            source={require("../../assets/images/background.png")}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Text style={styles.title}>What’s Your Goal?</Text>
                <TouchableOpacity
                    style={styles.goalButton}
                    onPress={() => navigation.navigate("Workout")}
                >
                    <Image
                        source={require("../../assets/images/weight-loss.png")}
                        style={styles.goalImage}
                    />
                    <Text style={styles.goalText}>Lose Weight</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.goalButton}
                    onPress={() => navigation.navigate("Workout")}
                >
                    <Image
                        source={require("../../assets/images/muscular.jpg")}
                        style={styles.goalImage}
                    />
                    <Text style={styles.goalText}>Build Muscle</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.goalButton}
                    onPress={() => navigation.navigate("Workout")}
                >
                    <Image
                        source={require("../../assets/images/fit.jpg")}
                        style={styles.goalImage}
                    />
                    <Text style={styles.goalText}>Keep Fit</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Back</Text>
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
    goalButton: {
        backgroundColor: "#000",
        marginBottom: 20,
        borderRadius: 15,
        borderWidth: 2,
        borderColor: "#4CAF50",
        alignItems: "center",
        width: "50%",
    },
    goalImage: {
        width: "100%",
        height: 100,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
    },
    goalText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        padding: 10,
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
});

export default GoalScreen;
