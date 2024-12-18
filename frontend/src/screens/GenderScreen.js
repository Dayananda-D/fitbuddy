import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from "react-native";

const GenderScreen = ({ navigation }) => {
    const [gender, setGender] = useState("");
    const UserData = {};

    const inputAccumulator = (value) => {
        setGender(value);
        UserData.gender = value,
            navigation.navigate("Goal", { UserData });
    };

    return (
        <ImageBackground
            source={require("../../assets/images/background.png")}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Text style={styles.title}>What's your gender?</Text>
                <View style={styles.genderImagesContainer}>
                    <TouchableOpacity
                        style={styles.genderImageWrapper}
                        onPress={() => inputAccumulator("Male")}
                    >
                        <Image
                            source={require("../../assets/images/male.jpg")}
                            style={styles.genderImage}
                        />
                        <Text style={styles.genderText}>Male</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.genderImageWrapper}
                        onPress={() => inputAccumulator("Female")}
                    >
                        <Image
                            source={require("../../assets/images/female.jpg")}
                            style={styles.genderImage}
                        />
                        <Text style={styles.genderText}>Female</Text>
                    </TouchableOpacity>
                </View>
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
    genderImagesContainer: {
        justifyContent: "space-between",
        alignItems: "center",
        width: "80%",
        marginTop: 20,
    },
    genderImageWrapper: {
        alignItems: "center",
        marginHorizontal: 10,
    },
    genderImage: {
        width: 200,
        height: 200,
        borderRadius: 75,
        borderWidth: 2,
        borderColor: "#4CAF50",
    },
    genderText: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: "bold",
        color: "#4CAF50",
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
});

export default GenderScreen;
