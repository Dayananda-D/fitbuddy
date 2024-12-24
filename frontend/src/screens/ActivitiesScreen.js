import { View, Text, ImageBackground, TouchableOpacity, style, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const ActivitiesScreen = () => {
    const navigation = useNavigation();
    return (
        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <Text style={styles.maintext}>Good things take time, and we're crafting something amazing for you!</Text>
                <ImageBackground style={styles.workinProgressImage} source={require('../../assets/images/workInProgress.png')}></ImageBackground>
            </View>
            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    backButton: {
        position: "absolute",
        top: 50,
        left: 20,
        backgroundColor: "#000",
        padding: 10,
        borderRadius: 5,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    workinProgressImage: {
        marginTop: 50,
        height: 150,
        width: '100%',
    },
    maintext: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
        fontSize: 26
    },
    backButtonText: {
        color: "#fff",
        fontSize: 16,
    },
})

export default ActivitiesScreen