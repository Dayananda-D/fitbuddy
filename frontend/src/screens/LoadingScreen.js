import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const LoadingScreen = ({ message = "Loading..." }) => {
  const fitnessQuotes = [
    "Push yourself, because no one else is going to do it for you.",
    "Success starts with self-discipline.",
    "It’s not about having time. It’s about making time.",
    "You don’t have to be extreme, just consistent.",
    "The only bad workout is the one that didn’t happen.",
    "Your body can stand almost anything. It’s your mind you have to convince.",
    "Train insane or remain the same.",
    "Sweat is fat crying.",
    "Strength doesn’t come from what you can do. It comes from overcoming the things you once thought you couldn’t.",
    "Don’t wish for it. Work for it.",
    "The pain you feel today will be the strength you feel tomorrow.",
    "Fitness is not about being better than someone else. It’s about being better than you used to be.",
    "The difference between wanting and achieving is discipline.",
    "Fitness is like a relationship. You can’t cheat and expect it to work.",
    "Your health is an investment, not an expense.",
    "It’s a slow process, but quitting won’t speed it up.",
    "A one-hour workout is 4% of your day. No excuses.",
    "Take care of your body. It’s the only place you have to live.",
    "You are one workout away from a good mood.",
    "Fall in love with taking care of yourself."
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % fitnessQuotes.length);
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ffffff" />
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.quote}>{fitnessQuotes[currentQuoteIndex]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Match your app's background
    padding: 20,
  },
  message: {
    marginBottom: 20,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quote: {
    marginTop: 10,
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 15,
  },
});

export default LoadingScreen;
