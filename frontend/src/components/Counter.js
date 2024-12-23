import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Keyboard,
} from 'react-native';

export default function Counter({ onCountChange }) {
    const [count, setCount] = useState(0);

    const increment = () => setCount((prevCount) => Math.min(prevCount + 1, 100)); // Limit to 999
    const decrement = () => setCount((prevCount) => Math.max(prevCount - 1, 0)); // No negative numbers
    const handleInputChange = (text) => {
        // Ensure only numeric input
        const numericValue = text.replace(/[^0-9]/g, '');
        onCountChange(numericValue);
        setCount(numericValue ? parseInt(numericValue, 10) : 0); // Default to 0 if empty
    };

    return (
        <View style={styles.counterContainer}>
            <TouchableOpacity style={styles.button} onPress={decrement}>
                <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TextInput
                style={styles.counterText}
                value={count.toString()} // Convert count to string for display
                maxLength={3}
                keyboardType="numeric" // Use numeric keyboard
                returnKeyType="done"
                onChangeText={handleInputChange} // Use onChangeText for updates
                onBlur={Keyboard.dismiss} // Hide keyboard on blur
            />
            <TouchableOpacity style={styles.button} onPress={increment}>
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    counterContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        width: 150,
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 15,
        shadowOffset: { width: 0, height: 2 },
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    button: {
        backgroundColor: "#4CAF50",
        height: 40,
        width: 40,
        borderRadius: 10,
        // padding: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    counterText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
        width: 30,
        borderWidth: 0,
        textAlign: "center",
    },
});

