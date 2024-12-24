import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity, ScrollView } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
const home = require('../../assets/images/Home.png');
const heart = require('../../assets/images/H.png');
const dumbbell = require('../../assets/images/dumbbell.png');
const profile = require('../../assets/images/User.png');
const workout = require('../data/workoutData.json');
const verify = require('../../assets/images/verify.png');
const disapprove = require('../../assets/images/disapprove.png');
const category = 'chest';
const level = 'advanced';
let allWarmupsCompleted = true;

const WarmupTab = () => {
    const [warmupCompleted, setWarmupCompleted] = useState(Array(workout.exercises[category].warmup.length).fill(false));
    const [index, setIndex] = useState(0);
    const navigation = useNavigation();
    const navigateWarmup = (item, index) => {
        navigation.navigate("Warmups", {
            allExercises: workout.exercises[category].warmup,
            currentExercise: item,
            currentIndex: index,
            isLastExercise: index === workout.exercises[category].warmup.length - 1,
            onWarmupComplete: handleWarmupComplete
        });
        if (index == workout.exercises[category].warmup.length - 1) {
            allWarmupsCompleted = true;
        }

    };
    const handleWarmupComplete = (index) => {
        const updatedWarmupCompleted = [...warmupCompleted];
        updatedWarmupCompleted[index] = true;
        setWarmupCompleted(updatedWarmupCompleted);
        setIndex(index);
    };
    return (
        <ScrollView>
            {workout.exercises[category].warmup.map((item, index) => (
                <View style={styles.scene} key={index}>
                    {/* <Text style={styles.header}>Warm-up Exercises</Text> */}
                    <View style={styles.card}>
                        <View style={{}}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                            />
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.time}>Duration: {item.duration}</Text>
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                backgroundColor: '#fff',
                                padding: 5,
                                right: 10,
                                top: 10,
                                borderRadius: 5,
                            }}>
                            <Image source={warmupCompleted[index] ? verify : disapprove} style={{ height: 20, width: 20 }} />
                        </View>
                        <View style={{ justifyContent: 'space-around' }}>
                            <TouchableOpacity style={styles.startButton} onPress={() => navigateWarmup(item, index)}>
                                <Text style={styles.buttonText}>Start</Text>
                            </TouchableOpacity>
                            <Text style={{}}>Calorie Burn/Rep: {item.caloriesBurnedPerRepMen}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    )
};

const WorkoutTab = () => {
    const [workoutCompleted, setWorkoutCompleted] = useState(Array(workout.exercises[category][level].length).fill(false));
    const [index, setIndex] = useState(0);
    const navigation = useNavigation();
    const navigateWorkout = (item, index) => {
        navigation.navigate("Workouts", {
            allExercises: workout.exercises[category][level],
            currentExercise: item,
            currentIndex: index,
            isLastExercise: index === workout.exercises[category][level].length - 1,
            onWorkoutComplete: handleWorkoutComplete,
        });

    };
    const handleWorkoutComplete = (index) => {
        const updatedWorkoutCompleted = [...workoutCompleted];
        updatedWorkoutCompleted[index] = true;
        setWorkoutCompleted(updatedWorkoutCompleted);
        setIndex(index);
    };
    return (
        <ScrollView>
            {workout.exercises[category][level].map((item, index) => (
                <View style={styles.scene} key={index}>
                    {!allWarmupsCompleted && (
                        <View
                            style={{
                                position: 'absolute',
                                width: '93%',
                                height: '100%',
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 2,
                                marginLeft: 12,
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}
                            >
                                Complete the warmups to unlock workout
                            </Text>
                        </View>
                    )}
                    {/* <Text style={styles.header}>Workout Exercises</Text> */}
                    <View style={styles.card}>
                        <View style={{}}>
                            <Image
                                source={{ uri: item.image }}
                                style={styles.image}
                            />
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.time}>Duration: {item.duration}</Text>
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                backgroundColor: '#fff',
                                padding: 5,
                                right: 10,
                                top: 10,
                                borderRadius: 5,
                            }}>
                            <Image source={workoutCompleted[index] ? verify : disapprove} style={{ height: 20, width: 20 }} />
                        </View>
                        <View style={{ justifyContent: 'space-around' }}>
                            <TouchableOpacity style={styles.startButton} onPress={() => navigateWorkout(item, index)}>
                                <Text style={styles.buttonText}>Start</Text>
                            </TouchableOpacity>
                            <Text style={{}}>Calorie Burn/Rep: {item.caloriesBurnedPerRepMen}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    )
};

const initialLayout = { width: Dimensions.get("window").width };

const WorkoutTabs = () => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: "warmup", title: "Warm-Up" },
        { key: "workouts", title: "Workouts" },
    ]);

    const renderScene = SceneMap({
        warmup: WarmupTab,
        workouts: WorkoutTab,
    });

    return (
        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.container}
        >
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                initialLayout={initialLayout}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: "#4CAF50" }}
                        style={{ backgroundColor: "#6c5c80", borderRadius: 10, marginTop: 50, width: "95%", alignSelf: 'center' }}
                        labelStyle={{ color: "black", fontWeight: "bold" }}
                    />
                )}
            />
        </ImageBackground>
    );
}

export default WorkoutTabs;

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        alignItems: "center",
        // paddingTop: 20,
    },
    container: {
        flex: 1,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        flexDirection: 'row',
        width: "90%",
        padding: 15,
        marginVertical: 10,
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    image: {
        width: 160,
        height: 80,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#4CAF50",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    time: {
        fontSize: 14,
        color: "#777",
        marginTop: 5,
    },
    startButton: {
        backgroundColor: "#4CAF50",
        padding: 5,
        borderRadius: 10,
        width: 100,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
