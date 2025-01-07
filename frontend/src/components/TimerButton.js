import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, StyleSheet } from "react-native";
import { Audio } from "expo-av";

const TimerButton = ({ duration, onComplete, isLast }) => {
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
    const [completed, setCompleted] = useState(false);
    const progress = useRef(new Animated.Value(0)).current;

    const startSound = useRef(null);
    const endCountdownSound = useRef(null);

    useEffect(() => {
        // Load audio files
        const loadSounds = async () => {
            startSound.current = new Audio.Sound();
            endCountdownSound.current = new Audio.Sound();
            await startSound.current.loadAsync(require("./assets/go_ahead.mp3"));
            await endCountdownSound.current.loadAsync(require("./assets/countdown.mp3"));
        };
        loadSounds();

        return () => {
            // Unload sounds when the component unmounts
            if (startSound.current) startSound.current.unloadAsync();
            if (endCountdownSound.current) endCountdownSound.current.unloadAsync();
        };
    }, []);

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

                if (seconds >= durationInSeconds - 5 && seconds < durationInSeconds) {
                    // Play countdown sound before timer ends
                    playEndCountdown();
                }

                if (seconds >= durationInSeconds) {
                    clearInterval(interval);
                    setIsRunning(false);
                    setCompleted(true);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const playStartSound = async () => {
        if (startSound.current) {
            await startSound.current.replayAsync();
        }
    };

    const playEndCountdown = async () => {
        if (endCountdownSound.current && isRunning) {
            await endCountdownSound.current.replayAsync();
        }
    };

    const startAnimation = () => {
        setIsRunning(true);
        Animated.timing(progress, {
            toValue: 1,
            duration: durationInMilliseconds,
            useNativeDriver: false,
        }).start();
    };

    const progressWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    const handleClick = () => {
        if (!isRunning && !completed) {
            playStartSound(); // Play start sound
            startAnimation();
        } else if (completed) {
            onComplete();
        }
    };

    return (
        <View style={styles.progressBarContainer}>
            <Animated.View
                style={[
                    styles.progressBar,
                    {
                        backgroundColor: completed ? "#4CAF50" : "#9bde9e",
                        width: progressWidth,
                    },
                ]}
            />
            <TouchableOpacity
                style={styles.progressButton}
                onPress={handleClick}
            >
                <Text style={[styles.buttonText, { color: completed ? "#fff" : "#525453" }]}>
                    {isRunning ? timer : completed ? (isLast ? "Complete" : "Next") : "Start"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    progressBarContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginVertical: 10,
    },
    progressBar: {
        height: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 10,
    },
    progressButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#e0e0e0",
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "bold",
    },
});

export default TimerButton;
