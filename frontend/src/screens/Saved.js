import { View, Text, ImageBackground, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const workout = require('../data/workoutData.json');
const ActivitiesScreen = () => {
    const navigation = useNavigation();
    const [bookmarkedExercises, setBookmarkedExercises] = useState([]);

    useEffect(() => {
        const fetchBookmarkedExercises = async () => {
            try {
                const storedExercises = await AsyncStorage.getItem("bookmarkedExercises");
                if (storedExercises) {
                    setBookmarkedExercises(JSON.parse(storedExercises));
                }
            } catch (error) {
                console.error("Error fetching bookmarked exercises", error);
            }
        };
        fetchBookmarkedExercises();
    }, []);

    const toggleBookmark = async (title) => {
        const updatedBookmarks = bookmarkedExercises.includes(title)
            ? bookmarkedExercises.filter(exercise => exercise !== title)
            : [...bookmarkedExercises, title];

        setBookmarkedExercises(updatedBookmarks);

        try {
            await AsyncStorage.setItem("bookmarkedExercises", JSON.stringify(updatedBookmarks));
        } catch (error) {
            console.error("Error updating bookmarked exercises", error);
        }
    };

    const filteredExercises = [];
    for (const part in workout.exercises) {
        for (const level in workout.exercises[part]) {
            filteredExercises.push(
                ...workout.exercises[part][level].filter(exercise =>
                    bookmarkedExercises.includes(exercise.title)
                )
            );
        }
    }

    return (
        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.background}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Icon name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.maintext}>Your Saved Exercises</Text>

                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {filteredExercises.length > 0 ? (
                        filteredExercises.map((exercise, index) => (
                            <View key={index} style={styles.tile}>
                                <TouchableOpacity onPress={() => toggleBookmark(exercise.title)} style={styles.bookMarkIcon}>
                                    <Icon
                                        name={bookmarkedExercises.includes(exercise.title) ? "bookmark" : "bookmark-outline"}
                                        size={24}
                                        color="red"
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() =>
                                        navigation.navigate('Warmups', {
                                            currentExercise: exercise,
                                            currentIndex: index,
                                            isButtonRequired: true,
                                        })
                                    }
                                >
                                    <Image source={{ uri: exercise.image }} style={styles.image} />
                                    <View style={styles.infoContainer}>
                                        <Text style={styles.tileText}>{exercise.title}</Text>
                                        <Text style={styles.durationText}>Duration: {exercise.duration}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noExerciseText}>No Saved Exercises</Text>
                    )}
                </ScrollView>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
    bookMarkIcon: {
        left: 155
    },
    backButton: {
        position: 'absolute',
        left: 8,
        padding: 10,
        borderRadius: 5,
        zIndex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
        alignItems: 'center',
    },
    maintext: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 26,
        marginTop: 4,
    },
    noExerciseText: {
        color: '#fff',
        fontSize: 18,
    },
    tile: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        width: '90%',
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        flexDirection: 'column',
        alignItems: 'center',
    },
    tileText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginTop: 10,
    },
    durationText: {
        color: '#000',
        fontSize: 14,
        marginTop: 5,
    },
    image: {
        width: '100%',
        height: 80,
        borderRadius: 10,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginTop: 8,
    },
    tileText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
    },
    durationText: {
        color: '#000',
        fontSize: 14,
        textAlign: 'right',
        marginLeft: 10,
    },
});

export default ActivitiesScreen;
