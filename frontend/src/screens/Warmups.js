import { View, Text, StyleSheet, ImageBackground, Image, TouchableOpacity } from 'react-native';
import React from 'react';
const play = require('../../assets/images/play.png');
const star = require('../../assets/images/Star.png');
const book = require('../../assets/images/Book.png');
const warmup1 = require('../../assets/workoutAnimations/warmup1.gif');

const instructions = [
    "Stand tall with your feet hip-width apart",
    "Inhale and raise your arms overhead with palms facing inward",
    "Exhale and bend forward at the waist, allowing gravity to pull you towards the ground",
    "Keep your knees slightly bent and hang your head and neck relaxed",
    "Slowly roll back up to standing position",
];

const InstructionText = ({ index, instruction }) => {

    return (
        <View style={styles.bulletPointContainer}>
            <Text style={styles.bulletPoint}>{index}.</Text>
            <Text style={styles.instructionTxt}>{instruction}</Text>
        </View>
    );
};

const Warmups = (navigation) => {
    return (
        <ImageBackground source={require('../../assets/images/background.png')} style={styles.container}>
            {/* Back Button*/}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.navigation.goBack()}
            >
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            {/* Gif Image*/}
            <View style={{ marginHorizontal: 12, shadowOffset: { width: -5, height: 3 }, shadowColor: 'grey', shadowOpacity: 0.5, shadowRadius: 3, backgroundColor: '#fff' }}>

                <View style={{ borderRadius: 10, overflow: 'hidden' }}>
                    <ImageBackground source={warmup1} style={{ height: 300, width: 400 }}></ImageBackground>
                    <Text style={{ position: 'absolute', bottom: 5, left: 10, color: '#fff' }}>Transformation</Text>
                </View>

                <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 15 }}>
                    <Text style={{ fontWeight: "bold" }}>Standing Hamstrings and Back Stretch</Text>
                    <Text style={{ fontSize: 14, color: '#8860a2', }}> 2 Min </Text>
                </View>
            </View>
            {/* Instructions*/}
            <View style={styles.instructionView}>
                <Text style={styles.instructionHeader}>Instructions</Text>
                <InstructionText index={'1'} instruction={'Stand tall with your feet hip-width apart'} />
                <InstructionText index={'2'} instruction={'Inhale and raise your arms overhead with palms facing inward'} />
                <InstructionText index={'3'} instruction={'Exhale and bend forward at the waist, allowing gravity to pull you towards the ground'} />
                <InstructionText index={'4'} instruction={'Keep your knees slightly bent and hang your head and neck relaxed'} />
                <InstructionText index={'5'} instruction={'Slowly roll back up to standing position'} />
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
        padding: 20,
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
});

export default Warmups