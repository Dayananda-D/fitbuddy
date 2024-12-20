import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground, TouchableOpacity, ScrollView } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
const home = require('../../assets/images/Home.png');
const heart = require('../../assets/images/H.png');
const dumbbell = require('../../assets/images/dumbbell.png');
const profile = require('../../assets/images/User.png');
const workout = require('../data/workoutData.json');
const category = 'chest';
const level = 'advanced';

const WarmupTab = () => (
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
                    <View style={{ justifyContent: 'space-around' }}>
                        <TouchableOpacity style={styles.startButton}>
                            <Text style={styles.buttonText}>Start</Text>
                        </TouchableOpacity>
                        <Text style={{}}>Calorie Burn/Rep: {item.caloriesBurnedPerRepMen}</Text>
                    </View>
                </View>
            </View>
        ))}
    </ScrollView>
);

const WorkoutTab = () => (
    <ScrollView>
        {workout.exercises[category][level].map((item, index) => (
            <View style={styles.scene} key={index}>
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
                    <View style={{ justifyContent: 'space-around' }}>
                        <TouchableOpacity style={styles.startButton}>
                            <Text style={styles.buttonText}>Start</Text>
                        </TouchableOpacity>
                        <Text style={{}}>Calorie Burn/Rep: {item.caloriesBurnedPerRepMen}</Text>
                    </View>
                </View>
            </View>
        ))}
    </ScrollView>
);

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
            <BottomTab />
        </ImageBackground>
    );
}

export default WorkoutTabs;
const BottomTab = () => (
    <View
        style={{
            position: 'absolute',
            bottom: 30,
            margin: 10,
            marginHorizontal: 25,
            borderRadius: 20,
            padding: 10,
            width: '90%',
            backgroundColor: '#EDEDED',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around'
        }}>
        <BottomButton image={home} navigate={"Dashboard"} />
        <BottomButton image={dumbbell} navigate={"WorkoutsTab"} />
        {/* <BottomButton
            image={plus}
            style={{
                position: 'absolute',
                left: '43%',
                top: -25,
                backgroundColor: '#fff',
                padding: 8,
                borderRadius: 20,
            }}
        />
        <BottomButton /> */}
        <BottomButton image={heart} />
        <BottomButton image={profile} navigate={"ProfileScreen"} />
    </View>
);
const BottomButton = ({ image, style, imageStyle, navigate }) => {
    const navigation = useNavigation();
    return (
        <>
            <TouchableOpacity onPress={() => navigation.navigate(navigate)}>
                <View
                    style={[
                        {
                            flex: 1,
                            alignSelf: 'center',
                            alignItems: 'center',
                        },
                        style,
                    ]}>
                    <Image
                        source={image}
                        style={[
                            {
                                height: image === dumbbell ? 25 : 20,
                                width: image === dumbbell ? 25 : 20,
                            },
                            imageStyle,
                        ]}
                    />
                </View>
            </TouchableOpacity>
            {image === home && (
                <View
                    style={{
                        width: '10%',
                        position: 'absolute',
                        height: 3,
                        backgroundColor: '#8860a2',
                        bottom: 0,
                        left: 118,
                    }}
                />
            )}
        </>
    )
};

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
