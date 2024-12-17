import { useNavigation } from '@react-navigation/native';
import React from 'react';
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
const headerImage = require('../../assets/images/header.jpg');
const notification = require('../../assets/images/Notification.png');
const banner = require('../../assets/images/BG.png');
const fire = require('../../assets/images/fire.png');
const model = require('../../assets/images/model.png');
const warmup1 = require('../../assets/workoutAnimations/warmup1.gif');
const cycle = require('../../assets/images/cycle.png');
const yoga = require('../../assets/images/yoga.png');
const walk = require('../../assets/images/walk.png');
const next = require('../../assets/images/next.png');
const play = require('../../assets/images/play.png');
const star = require('../../assets/images/Star.png');
const book = require('../../assets/images/Book.png');
const home = require('../../assets/images/Home.png');
const heart = require('../../assets/images/H.png');
const dumbbell = require('../../assets/images/dumbbell.png');
const profile = require('../../assets/images/User.png');
const plus = require('../../assets/images/Plus.png');

const Dashboard = () => {
    return (
        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.container}
        >
            <SafeAreaView>
                <View style={styles.screen}>
                    <Header />
                    <Banner />
                </View>
                <View style={{ marginHorizontal: '3%', marginTop: 20 }}>
                    <Label>Your Activities</Label>
                    <View style={{ flexDirection: 'row' }}>
                        {data.map((item, index) => (
                            <Card data={item} index={index} />
                        ))}
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: 20
                        }}>
                        <Label>Today's Warm-up</Label>
                        {/* <Text
                            style={{
                                // fontFamily: 'Poppins-Regular',
                                opacity: 0.5,
                                fontSize: 12,
                                color: 'white'
                            }}>
                            View All
                        </Text> */}
                    </View>
                    <View style={{ flexDirection: 'row', overflow: 'scroll' }}>
                        {data.map((item, index) => (
                            <VideoPlay
                                index={index}
                            />
                        ))}
                    </View>
                </View>
            </SafeAreaView>
            <BottomTab />
        </ImageBackground>
    );
};

export default Dashboard;

const BottomTab = () => (
    <View
        style={{
            position: 'absolute',
            bottom: 10,
            margin: 10,
            marginHorizontal: 25,
            borderRadius: 20,
            padding: 10,
            width: '90%',
            backgroundColor: '#EDEDED',
            flexDirection: 'row',
            alignItems: 'center',
        }}>
        <BottomButton image={home} />
        <BottomButton image={dumbbell} />
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
        <BottomButton image={profile} />
    </View>
);
const BottomButton = ({ image, style, imageStyle }) => (
    <>
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
                        height: image === plus ? 40 : 20,
                        width: image === plus ? 40 : 20,
                    },
                    imageStyle,
                ]}
            />
        </View>
        {image === home && (
            <View
                style={{
                    width: '10%',
                    position: 'absolute',
                    height: 2,
                    backgroundColor: '#8860a2',
                    bottom: 0,
                    left: 25,
                }}
            />
        )}
    </>
);

const VideoPlay = () => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.navigate("Warmups")}>
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
                        source={warmup1}
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
                        Warm-up
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
                        <Image source={star} style={{ height: 10, width: 10 }} />
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
                        <TouchableOpacity onPress={() => navigation.navigate("Warmups")}>
                            <Image source={play} style={{ height: 10, width: 10 }} />
                        </TouchableOpacity>
                    </View>
                    <Text style={{
                        // fontFamily: 'Poppins-Regular' 
                    }}>
                        Standing Hamstrings and Back Stretch
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{
                            // fontFamily: 'Poppins-Regular',
                            fontSize: 12
                        }}>
                            <Image source={book} style={{ height: 25, width: 25 }} />
                            {'   Beginner'}
                        </Text>
                        <Text
                            style={{
                                // fontFamily: 'Poppins-Regular',
                                fontSize: 12,
                                color: '#8860a2',
                            }}>
                            2 Min
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
const Header = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                <ImageContainer image={headerImage} />
            </TouchableOpacity>
            <HeaderTitle />
            <ImageContainer image={notification} height={'50%'} width={'50%'} tintColor={'white'} />
        </View>
    );
}

const Banner = () => (
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
                <OfferText>Day - 1</OfferText>
                <OfferText>Legs workout</OfferText>
            </View>
        </ImageBackground>
        <Image source={model} style={styles.model} resizeMode="contain" />
    </>
);

const OfferText = ({ children }) => (
    <Text style={styles.offerText}>{children}</Text>
);

const ImageContainer = ({ image, height = '100%', width = '100%', tintColor }) => (
    <View style={styles.imageContainer}>
        <Image source={image} style={[{ height, width, tintColor }]} />
    </View>
);
const HeaderTitle = () => (
    <View style={styles.title}>
        <Text style={styles.bigTitle}>Hi, Jane</Text>
        <Text style={styles.smallTitle}>Beginer</Text>
    </View>
);

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
    screen: { margin: '3%' },
    offer: {
        color: 'white',
        // fontFamily: 'Poppins-Regular', 
        fontSize: 10
    },
    offerText: {
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