import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Image,
    TouchableOpacity,
    Animated,
} from "react-native";
import Counter from "../components/Counter";

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

const Workouts = ({ navigation, route }) => {
    const { allExercises, currentExercise, currentIndex, isLastExercise, onWarmupComplete, onWorkoutComplete } = route.params;

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(currentIndex);
    const [currentExerciseData, setCurrentExerciseData] = useState(currentExercise);
    const [isLast, setIsLast] = useState(isLastExercise);

    const moveToNextExercise = () => {
        if (currentExerciseIndex < allExercises.length - 1) {
            const nextIndex = currentExerciseIndex + 1;
            setCurrentExerciseIndex(nextIndex);
            setCurrentExerciseData(allExercises[nextIndex]);
            setIsLast(nextIndex === allExercises.length - 1);
            onWarmupComplete ? onWarmupComplete(currentExerciseIndex) : onWorkoutComplete(currentExerciseIndex);
        } else {
            onWarmupComplete ? onWarmupComplete(currentExerciseIndex) : onWorkoutComplete(currentExerciseIndex);
            navigation.goBack();
        }
    };
    const handleCountChange = (newCount) => {
        console.log("Current Count:", newCount); // Handle count changes as needed
    };

    return (
        <ImageBackground
            source={require("../../assets/images/background.png")}
            style={styles.container}
        >
            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            {/* Gif Image */}
            <View style={styles.gifContainer}>
                <ImageBackground
                    source={{ uri: currentExerciseData.image }}
                    style={styles.gifPlayer}
                ></ImageBackground>
                <View style={styles.gifDesc}>
                    <Text style={{ fontWeight: "bold" }}>{currentExerciseData.title}</Text>
                    <Text style={{ fontSize: 14, color: "#8860a2" }}>
                        {currentExerciseData.duration}
                    </Text>
                </View>
            </View>

            {/* Instructions */}
            <View style={styles.instructionView}>
                <Text style={styles.instructionHeader}>Instructions</Text>
                <InstructionText instructions={currentExerciseData.instruction} />
            </View>

            {/* Counter */}
            <Counter onCountChange={handleCountChange} />

            {/* Next Button */}
            <TouchableOpacity
                style={styles.nextButton}
                onPress={moveToNextExercise}
            >
                <Text style={styles.nextButtonText}>{isLast ? "Complete" : "Next"}</Text>
            </TouchableOpacity>

        </ImageBackground>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    backButton: {
        position: "absolute",
        top: 40,
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
        color: "white",
    },
    instructionHeader: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: "#4CAF50",
        padding: 10,
    },
    instructionView: {
        width: "100%",
        height: 300,
        padding: 20,
        overflow: "scroll",
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
    gifContainer: {
        marginHorizontal: 12,
        shadowOffset: { width: -5, height: 3 },
        shadowColor: "grey",
        shadowOpacity: 0.5,
        shadowRadius: 3,
        backgroundColor: "#fff",
    },
    gifPlayer: {
        height: 300,
        width: 400,
    },
    gifDesc: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 15,
    },
    nextButton: {
        position: "absolute",
        bottom: 80,
        right: 5,
        alignItems: "flex-end",
        backgroundColor: "#4CAF50",
        padding: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
});

export default Workouts;