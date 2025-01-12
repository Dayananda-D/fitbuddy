import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from "react-native";

const GenderScreen = ({ navigation, route }) => {
    const { UserData } = route.params;
    const [gender, setGender] = useState("");

    const inputAccumulator = (value) => {
        setGender(value);
        navigation.navigate("Goal", { UserData: {...UserData, gender: value}  });
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
                        <Image style={styles.genderImage} />
                        <Image source={require("../../assets/images/male.png")} style={{ width: 200, height: 190, position: 'absolute' }} />
                        <Text style={styles.genderText}>Male</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.genderImageWrapper}
                        onPress={() => inputAccumulator("Female")}
                    >
                        <Image style={styles.genderImage} />
                        <Image source={require("../../assets/images/female.png")} style={{ width: 200, height: 190, position: 'absolute' }} />
                        <Text style={styles.genderText}>Female</Text>
                    </TouchableOpacity>
                </View>
                {/* <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backButtonText}>Back</Text>
                </TouchableOpacity> */}
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
        backgroundColor: "#000"
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
