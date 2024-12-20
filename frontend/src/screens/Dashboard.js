import { useNavigation } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import {
    Button,
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { useFormState } from 'react-dom';
const { base_url } = require("../../config");
import LoadingScreen from './LoadingScreen';

const headerImage = require('../../assets/images/header.jpg');
const notification = require('../../assets/images/Notification.png');
const banner = require('../../assets/images/bg.png');
const fire = require('../../assets/images/fire.png');
const model = require('../../assets/images/model.png');
const cycle = require('../../assets/images/cycle.png');
const yoga = require('../../assets/images/yoga.png');
const walk = require('../../assets/images/walk.png');
const next = require('../../assets/images/next.png');
const play = require('../../assets/images/play.png');
const disapprove = require('../../assets/images/disapprove.png');
const verify = require('../../assets/images/verify.png');
const book = require('../../assets/images/Book.png');
const home = require('../../assets/images/Home.png');
const heart = require('../../assets/images/H.png');
const dumbbell = require('../../assets/images/dumbbell.png');
const profile = require('../../assets/images/User.png');
const workout = require('../data/workoutData.json');
const category = 'chest';
const level = 'advanced';

const Dashboard = ({ route }) => {
    const UserData = route?.params?.UserData || {};
    const [warmupCompleted, setWarmupCompleted] = useState(Array(workout.exercises[category].warmup.length).fill(false));
    const [workoutCompleted, setWorkoutCompleted] = useState(Array(workout.exercises[category][level].length).fill(false));
    const [userData, setUserData] = useState({});
    const [token, setToken] = useState();
    const [loading, setLoading] = useState(true);

    const onWarmupComplete = (index) => {
        const updatedWarmupCompleted = [...warmupCompleted];
        updatedWarmupCompleted[index] = true;
        setWarmupCompleted(updatedWarmupCompleted);
    };

    const onWorkoutComplete = (index) => {
        const updatedWorkoutCompleted = [...workoutCompleted];
        updatedWorkoutCompleted[index] = true;
        setWorkoutCompleted(updatedWorkoutCompleted);
    };

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = await AsyncStorage.getItem("auth_token");
                const data = await AsyncStorage.getItem("@MyApp_user");
                const decodedToken = jwtDecode(token);

                if (data) {
                    setToken(token);
                    setUserData(JSON.parse(data));
                    return;
                }

                if (token && decodedToken.email) {
                    setToken(token);
                    await fetch(`${base_url}/user/${decodedToken.email}`, {
                        method: "GET",
                        headers: {
                            accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }

                            return response.json();
                        })
                        .then(async (data) => {
                            await AsyncStorage.setItem("@MyApp_user", JSON.stringify(data));
                            setUserData(data);
                            console.log(data);
                        })
                        .catch(async (error) => {
                            await AsyncStorage.clear();
                            navigation.navigate("Login");
                            console.error("Error:", error);
                        });
                }
            } catch (error) {
                console.error("Error fetching user details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    if (loading) {
        // Display a loading indicator while fetching user details
        return <LoadingScreen message="Loading your activities..." />;
    }

    return (

        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.container}
        >
            {/* <SafeAreaView> */}
            <ScrollView>
                <View style={styles.screen}>
                    <Header data={userData} />
                    <Banner data={userData} />
                </View>
                <View style={{ marginHorizontal: '3%', marginTop: 20 }}>
                    <Label>Your Activities</Label>
                    <View style={{ flexDirection: 'row' }}>
                        {data.map((item, index) => (
                            <Card data={item} index={index} key={index} />
                        ))}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                        <Label>Today's Warm-up</Label>
                        {/* <Text style={{ opacity: 0.5, fontSize: 12, color: 'white' }}> View All</Text> */}
                    </View>
                    <ScrollView horizontal={true}>
                        <View style={{ flexDirection: 'row', overflow: 'scroll' }}>
                            {workout.exercises[category].warmup.map((item, index) => (
                                <VideoPlayWarmup
                                    index={index}
                                    key={index}
                                    data={workout}
                                    warmupCompleted={warmupCompleted}
                                    onWarmupComplete={onWarmupComplete}
                                />
                            ))}
                        </View>
                    </ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                        <Label>Today's Workout</Label>
                        {/* <Text style={{ opacity: 0.5, fontSize: 12, color: 'white' }}> View All</Text> */}
                    </View>
                    <ScrollView horizontal={true}>
                        <View style={{ paddingBottom: 80, flexDirection: 'row', overflow: 'scroll' }}>
                            {workout.exercises[category][level].map((item, index) => (
                                <VideoPlay
                                    index={index}
                                    key={index}
                                    data={workout}
                                    workoutCompleted={workoutCompleted}
                                    warmupCompleted={warmupCompleted}
                                    onWorkoutComplete={onWorkoutComplete}
                                />
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
            {/* </SafeAreaView> */}
            <BottomTab />
        </ImageBackground>
    );
};

export default Dashboard;

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
        <BottomButton image={heart} navigate={"Reports"} />
        <BottomButton image={profile} navigate={"ProfileScreen"}/>
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
                        left: 32,
                    }}
                />
            )}
        </>
    )
};

const VideoPlay = (data) => {
    const navigation = useNavigation();
    const currentIndex = data.index;
    const isLastExercise = currentIndex === data.data.exercises[category][level].length - 1;
    const lastIndex = data.data.exercises[category][level].length - 1;
    const allExercises = data.data.exercises[category][level];
    const warmupCompleted = data.warmupCompleted;
    const workoutCompleted = data.workoutCompleted;
    const currentExercise = data.data.exercises[category][level][currentIndex];
    const onWorkoutComplete = data.onWorkoutComplete;

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Warmups", { allExercises: allExercises, currentExercise: currentExercise, isLastExercise: isLastExercise, currentIndex: currentIndex, onWorkoutComplete: onWorkoutComplete })} disabled={!warmupCompleted[lastIndex]}>
            {!warmupCompleted[lastIndex] && (
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
            <View
                style={{
                    borderRadius: 15,
                    marginHorizontal: 12,
                    shadowOffset: { width: -5, height: 3 },
                    shadowColor: 'grey',
                    shadowOpacity: 0.5,
                    shadowRadius: 3,
                    backgroundColor: '#fff',
                }}>
                <View style={{ borderRadius: 10, overflow: 'hidden' }}>
                    <ImageBackground
                        source={{ uri: currentExercise.image }}
                        style={{
                            height: 150,
                            width: 300,
                        }}>
                        <LinearGradient
                            locations={[0, 1.0]}
                            colors={['rgba(0,0,0,0.00)', 'rgba(0,0,0,0.60)']}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                            }}
                        ></LinearGradient>
                    </ImageBackground>
                    <Text
                        style={{
                            position: 'absolute',
                            bottom: 5,
                            left: 10,
                            // fontFamily: 'Poppins-Regular',
                            color: '#fff',
                        }}>
                        {currentExercise.type}
                    </Text>
                    <View
                        style={{
                            position: 'absolute',
                            backgroundColor: '#fff',
                            padding: 5,
                            right: 10,
                            top: 10,
                            borderRadius: 5,
                        }}>
                        <Image source={workoutCompleted[currentIndex] ? verify : disapprove} style={{ height: 15, width: 15 }} />
                    </View>
                </View>
                <View
                    style={{
                        backgroundColor: 'white',
                        padding: 10,
                        borderRadius: 15,
                    }}>
                    <View
                        style={{
                            position: 'absolute',
                            backgroundColor: '#8860a2',
                            padding: 10,
                            right: 25,
                            top: -15,
                            borderRadius: 15,
                            zIndex: 3,
                        }}>
                        <TouchableOpacity onPress={() => navigation.navigate("Warmups", { allExercises: allExercises, currentExercise: currentExercise, isLastExercise: isLastExercise, currentIndex: currentIndex, onWorkoutComplete: onWorkoutComplete })}>
                            <Image source={play} style={{ height: 10, width: 10 }} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{
                        // fontFamily: 'Poppins-Regular' 
                    }}>
                        {currentExercise.title}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{
                            // fontFamily: 'Poppins-Regular',
                            fontSize: 12
                        }}>
                            <Image source={book} style={{ height: 25, width: 25 }} />
                            {'    ' + currentExercise.type}
                        </Text>
                        <Text
                            style={{
                                // fontFamily: 'Poppins-Regular',
                                fontSize: 12,
                                color: '#8860a2',
                            }}>
                            {currentExercise.duration}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
};

const VideoPlayWarmup = (data) => {
    const navigation = useNavigation();
    const currentIndex = data.index;
    const isLastExercise = currentIndex === data.data.exercises[category].warmup.length - 1;
    const allExercises = data.data.exercises[category].warmup;
    const warmupCompleted = data.warmupCompleted;
    const exerciseComplete = data.workoutCompleted;
    const currentExercise = data.data.exercises[category].warmup[currentIndex];
    const onWarmupComplete = data.onWarmupComplete;

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Warmups", { allExercises: allExercises, currentExercise: currentExercise, isLastExercise: isLastExercise, currentIndex: currentIndex, onWarmupComplete: onWarmupComplete })}>
            <View
                style={{
                    borderRadius: 15,
                    marginHorizontal: 12,
                    shadowOffset: { width: -5, height: 3 },
                    shadowColor: 'grey',
                    shadowOpacity: 0.5,
                    shadowRadius: 3,
                    backgroundColor: '#fff',
                }}>
                <View style={{ borderRadius: 10, overflow: 'hidden' }}>
                    <ImageBackground
                        source={{ uri: currentExercise.image }}
                        style={{
                            height: 150,
                            width: 300,
                        }}>
                        <LinearGradient
                            locations={[0, 1.0]}
                            colors={['rgba(0,0,0,0.00)', 'rgba(0,0,0,0.60)']}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                            }}
                        ></LinearGradient>
                    </ImageBackground>
                    <Text
                        style={{
                            position: 'absolute',
                            bottom: 5,
                            left: 10,
                            // fontFamily: 'Poppins-Regular',
                            color: '#fff',
                        }}>
                        {currentExercise.type}
                    </Text>
                    <View
                        style={{
                            position: 'absolute',
                            backgroundColor: '#fff',
                            padding: 5,
                            right: 10,
                            top: 10,
                            borderRadius: 5,
                        }}>
                        <Image source={warmupCompleted[currentIndex] ? verify : disapprove} style={{ height: 15, width: 15 }} />
                    </View>
                </View>
                <View
                    style={{
                        backgroundColor: 'white',
                        padding: 10,
                        borderRadius: 15,
                    }}>
                    <View
                        style={{
                            position: 'absolute',
                            backgroundColor: '#8860a2',
                            padding: 10,
                            right: 25,
                            top: -15,
                            borderRadius: 15,
                            zIndex: 3,
                        }}>
                        <TouchableOpacity onPress={() => navigation.navigate("Warmups", { allExercises: allExercises, currentExercise: currentExercise, isLastExercise: isLastExercise, currentIndex: currentIndex, onWarmupComplete: onWarmupComplete })}>
                            <Image source={play} style={{ height: 10, width: 10 }} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{
                        // fontFamily: 'Poppins-Regular' 
                    }}>
                        {currentExercise.title}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{
                            // fontFamily: 'Poppins-Regular',
                            fontSize: 12
                        }}>
                            <Image source={book} style={{ height: 25, width: 25 }} />
                            {'    ' + currentExercise.type}
                        </Text>
                        <Text
                            style={{
                                // fontFamily: 'Poppins-Regular',
                                fontSize: 12,
                                color: '#8860a2',
                            }}>
                            {currentExercise.duration}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
};
const Card = ({ data, index }) => {
    return (
        <View
            style={{
                flex: 1,
                height: 150,
                padding: 10,
                alignSelf: 'center',
                backgroundColor: data.color,
                justifyContent: 'space-between',
                marginHorizontal: 8,
                borderRadius: 10,
                shadowColor: 'lightgrey',
                shadowOffset: { width: -5, height: 5 },
                shadowOpacity: 0.5,
                shadowRadius: 2,
            }}>
            <Image source={data.image} style={{ height: 25, width: 25 }} />
            <View style={{ alignSelf: 'center', margin: 5 }}>
                <Progress.Circle
                    size={50}
                    progress={data.status / 100}
                    indeterminate={false}
                    animated={true}
                    showsText={true}
                    unfilledColor="#ededed"
                    borderColor="#ededed"
                    color={data.darkColor}
                    strokeCap="round"
                    thickness={5}
                    style={{
                        shadowColor: 'grey',
                        shadowOffset: { width: 2, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 1,
                    }}
                    textStyle={{
                        fontSize: 16,
                        // fontFamily: 'Poppins-Bold',
                        fontWeight: 'bold',
                    }}
                />
            </View>
            <View>
                <Text style={{
                    fontSize: 10,
                    // fontFamily: 'Poppins-Light' 
                }}>
                    {'Day     1'}
                </Text>
                <Text style={{
                    fontSize: 10,
                    // fontFamily: 'Poppins-Light' 
                }}>
                    {'Time   20 min'}
                </Text>
            </View>
            <View
                style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <Text style={{
                    // fontFamily: 'Poppins-Regular' 
                }}>{data.name}</Text>
                <View
                    style={{
                        backgroundColor: data.lightColor,
                        padding: 2,
                        borderRadius: 10,
                    }}>
                    <Image
                        source={next}
                        style={{
                            height: 12,
                            width: 12,
                            resizeMode: 'contain',
                        }}
                    />
                </View>
            </View>
        </View>
    );
};
const Header = ({ data }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            {/* <TouchableOpacity onPress={() => navigation.navigate("SignUp")}> */}
            <ImageContainer image={headerImage} />
            {/* </TouchableOpacity> */}
            <HeaderTitle data={data} />
            <ImageContainer image={notification} height={'50%'} width={'50%'} />
        </View>
    );
}

const Banner = ({ data }) => (
    <>
        <ImageBackground style={styles.banner} source={banner}>
            <View style={styles.bannerContainer}>
                <View style={styles.rowLabel}>
                    <Text style={styles.offer}>Start Your work out now</Text>
                    <View style={styles.fireContainer}>
                        <Image
                            source={fire}
                            resizeMode="contain"
                            style={styles.fireImage}
                        />
                    </View>
                </View>
                <BannerText>Day - 1</BannerText>
                <BannerText>{data.selectedBodyParts + "  workout"}</BannerText>
            </View>
        </ImageBackground>
        <Image source={model} style={styles.model} resizeMode="contain" />
    </>
);

const BannerText = ({ children }) => (
    <Text style={styles.bannerText}>{children}</Text>
);

const ImageContainer = ({ image, height = '100%', width = '100%', tintColor }) => (
    <View style={styles.imageContainer}>
        <Image source={image} style={[{ height, width, tintColor }]} />
    </View>
);

const HeaderTitle = ({ data }) => {
    return (
        <View style={styles.title}>
            <Text style={styles.bigTitle}>Hi, {data.name}</Text>
            <Text style={styles.smallTitle}>{data.level}</Text>
        </View>
    );
};

const Label = ({ children }) => <Text style={styles.label}>{children}</Text>;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: { paddingHorizontal: 10, flex: 1, justifyContent: 'center' },
    bigTitle: {
        fontSize: 16,
        color: 'white'
        // fontFamily: 'Poppins-Medium' 
    },
    smallTitle: {
        fontSize: 10,
        color: 'white',
        //  fontFamily: 'Poppins-Regular', 
        opacity: 0.6
    },
    image: { height: '100%', width: '100%' },
    fireImage: { height: 15, width: 15, alignSelf: 'center', margin: 5 },
    banner: {
        marginTop: 20,
        padding: 30,
        resizeMode: 'contain',
        borderRadius: 20,
        overflow: 'hidden',
        flexDirection: 'row',
    },
    bannerContainer: { flex: 1 },
    label: {
        // fontFamily: 'Poppins-Medium',
        color: 'white',
        fontSize: 20, marginVertical: 10
    },
    model: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        zIndex: 10,
        height: '75%',
        width: '50%',
        transform: [{ rotateY: '180deg' }],
    },
    imageContainer: {
        height: 50,
        width: 50,
        borderRadius: 25,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    screen: { marginTop: 50 },
    offer: {
        color: 'white',
        // fontFamily: 'Poppins-Regular', 
        fontSize: 10
    },
    bannerText: {
        color: 'white', fontSize: 16,
        //  fontFamily: 'Poppins-Regular' 
    },

    rowLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fireContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const data = [
    {
        name: 'Cycling',
        status: 85,
        image: cycle,
        lightColor: '#f8e4d9',
        color: '#fcf1ea',
        darkColor: '#fac5a4',
    },
    {
        name: 'Walking',
        status: 25,
        image: walk,
        lightColor: '#d7f0f7',
        color: '#e8f7fc',
        darkColor: '#aceafc',
    },
    {
        name: 'Yoga',
        status: 85,
        image: yoga,
        lightColor: '#dad5fe',
        color: '#e7e3ff',
        darkColor: '#8860a2',
    },
];