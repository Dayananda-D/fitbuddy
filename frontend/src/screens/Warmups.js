import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';
import React from 'react';
const warmup1 = require('../../assets/workoutAnimations/warmup1.gif');
const duration = '2 Mins';
const workoutName = 'Standing Hamstrings and Back Stretch';
const instructions = [
    "Stand tall with your feet hip-width apart",
    "Inhale and raise your arms overhead with palms facing inward",
    "Exhale and bend forward at the waist, allowing gravity to pull you towards the ground",
    "Keep your knees slightly bent and hang your head and neck relaxed",
    "Slowly roll back up to standing position",
];

const InstructionText = ({ instructions, title }) => {
    return (
        <View>
            {title}
            {instructions.map((instruction, index) => (
                <View key={index} style={styles.bulletPointContainer}>
                    <Text style={styles.bulletPoint}>{index + 1}.</Text>
                    <Text style={styles.instructionTxt}>{instruction}</Text>
                </View>
            ))}
        </View>
    );
};

const Warmups = (navigation) => {
    return (
        <ImageBackground source={require('../../assets/images/background.png')} style={styles.container}>
            {/* Back Button*/}
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            {/* Gif Image*/}
            <View style={styles.gifContainer}>
                <View>
                    <ImageBackground source={warmup1} style={styles.gifPlayer}></ImageBackground>
                </View>

                <View style={styles.gifDesc}>
                    <Text style={{ fontWeight: "bold" }}>{workoutName}</Text>
                    <Text style={{ fontSize: 14, color: '#8860a2', }}>{duration}</Text>
                </View>
            </View>
            {/* Instructions*/}
            <View style={styles.instructionView}>
                <Text style={styles.instructionHeader}>Instructions</Text>
                <InstructionText instructions={instructions} />
            </View>
            <TouchableOpacity style={styles.startButton}>
                <Text style={styles.buttonText}>Complete</Text>
            </TouchableOpacity>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
    instructionTxt: {
        color: 'white'
    },
    instructionHeader: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: "bold",
        color: '#4CAF50',
        padding: 10
    },
    instructionView: {
        width: '100%',
        height: 300,
        padding: 20,
        overflow: 'scroll'
    },
    bulletPointContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 5,
    },
    bulletPoint: {
        color: "white",
        marginRight: 5,
    },
    startButton: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        width: 200,
        alignItems: "center",
        position: "absolute",
        bottom: 25,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    gifContainer: {
        marginHorizontal: 12,
        shadowOffset: { width: -5, height: 3 },
        shadowColor: 'grey',
        shadowOpacity: 0.5,
        shadowRadius: 3,
        backgroundColor: '#fff'
    },
    gifPlayer: {
        height: 300,
        width: 400
    },
    gifDesc: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 15
    }
});

export default Warmups