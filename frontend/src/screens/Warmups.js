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

const Warmups = ({ navigation, route }) => {
    const { workOutData } = route.params;

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
                <View>
                    <ImageBackground
                        source={{ uri: workOutData.image }}
                        style={styles.gifPlayer}
                    ></ImageBackground>
                </View>

                <View style={styles.gifDesc}>
                    <Text style={{ fontWeight: "bold" }}>{workOutData.title}</Text>
                    <Text style={{ fontSize: 14, color: "#8860a2" }}>
                        {workOutData.duration}
                    </Text>
                </View>
            </View>

            {/* Instructions */}
            <View style={styles.instructionView}>
                <Text style={styles.instructionHeader}>Instructions</Text>
                <InstructionText instructions={workOutData.instruction} />
            </View>

            {/* Animated Progress Bar */}
            <TimerButton duration={workOutData.duration} />
        </ImageBackground>
    );
};

const TimerButton = ({ duration }) => {
    const numericDuration = parseInt(duration.match(/\d+/)[0]);
    let durationInSeconds;

    if (duration.toLowerCase().includes("min")) {
        durationInSeconds = numericDuration * 60;
    } else if (duration.toLowerCase().includes("sec")) {
        durationInSeconds = numericDuration;
    }

    const durationInMilliseconds = durationInSeconds * 1000;
    const [timer, setTimer] = useState("00:00");
    const [isRunning, setIsRunning] = useState(false);
    const [completed, setCompleted] = useState(false); // Track if progress is complete
    const progress = useRef(new Animated.Value(0)).current;

    // Timer Logic
    useEffect(() => {
        let interval;
        if (isRunning) {
            let seconds = 0;
            interval = setInterval(() => {
                seconds++;
                const minutes = Math.floor(seconds / 60);
                const secs = seconds % 60;
                setTimer(
                    `${minutes.toString().padStart(2, "0")}:${secs
                        .toString()
                        .padStart(2, "0")}`
                );

                if (seconds >= durationInSeconds) {
                    clearInterval(interval); // Stop after 2 minutes
                    setIsRunning(false);
                    setCompleted(true); // Mark progress as completed
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    // Start Progress Animation
    const startAnimation = () => {
        setIsRunning(true);
        Animated.timing(progress, {
            toValue: 1,
            duration: durationInMilliseconds, // 2 minutes in milliseconds
            useNativeDriver: false,
        }).start();
    };

    // Interpolated Width for Progress Bar
    const progressWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"], // Gradual width change
    });

    const handleClick = () => {
        if (!isRunning && !completed) {
            startAnimation(); // Start only if not running and not completed
        } else if (completed) {
            navigation.goBack(); // Navigate to Dashboard
        }
    }
    return (
        <View style={styles.progressBarContainer}>
            <Animated.View
                style={[
                    styles.progressBar,
                    {
                        backgroundColor: completed ? "#4CAF50" : "#9bde9e", // Change to green at the end
                        width: progressWidth, // Progress updates dynamically
                    },
                ]}
            />
            <TouchableOpacity
                style={styles.progressButton}
                onPress={() => handleClick()} // Prevent multiple presses
            >
                <Text style={[styles.buttonText, { color: completed ? "#fff" : "#525453" }]}>{isRunning ? timer : completed ? "Next" : "Start"}</Text>
            </TouchableOpacity>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
    progressBarContainer: {
        width: "50%",
        height: 50,
        position: "absolute",
        bottom: 25,
        backgroundColor: "#e0e0e0",
        borderRadius: 10,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        position: "absolute",
    },
    progressButton: {
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default Warmups;
