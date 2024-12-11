import React, { useRef } from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import Swiper from 'react-native-swiper';

const AnimatedBtn=Animatable. createAnimatableComponent (TouchableOpacity)
const HomeScreen = () => {
  const swiperRef = useRef(null); // Create a ref to control Swiper

  const goToNextSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(1); // Move to the next slide
    }
  };
  const goToPrevSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(-1); // Move to the next slide
    }
  };

  return (
    <Swiper
      ref={swiperRef}
      loop={false}
      scrollEnabled={false}
      showsPagination={false} // Hide indicators
      
    >
      {/* Welcome Screen */}
      <ImageBackground
        source={require('./../../assets/images/welcomeScreen.jpg')}
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <Animatable.Text style={styles.title} animation={'slideInUp'}>Welcome to FitLife!</Animatable.Text>
          <Animatable.Text style={{ width:'80%',color:'#9e9e9e',fontSize:16,marginTop: 50,fontWeight:'600'}} animation={'slideInUp'}>Elevate Your Fitness with a Cutting Edge to Fuel Your Motivation & Crush your goal</Animatable.Text>
          <AnimatedBtn style={styles.startButton} onPress={goToNextSlide} animation={'slideInUp'}>
            <Text style={styles.buttonText}>Get Started!</Text>
          </AnimatedBtn>
        </View>
      </ImageBackground>

      {/* Gender Selection Screen */}
      <View style={styles.genderContainer}>
        <Text style={styles.title}>What's your gender?</Text>
        <View style={styles.genderImagesContainer}>
          {/* Male Image */}
          <TouchableOpacity
            style={styles.genderImageWrapper}
            onPress={goToNextSlide}
          >
            <Image
              source={require('./../../assets/images/male.jpg')}
              style={styles.genderImage}
            />
            <Text style={styles.genderText}>Male</Text>
          </TouchableOpacity>

          {/* Female Image */}
          <TouchableOpacity
            style={styles.genderImageWrapper}
            onPress={goToNextSlide}
          >
            <Image
              source={require('./../../assets/images/female.jpg')}
              style={styles.genderImage}
            />
            <Text style={styles.genderText}>Female</Text>
          </TouchableOpacity>
        </View>
        {/* Next Screen (Example) */}
        <TouchableOpacity style={styles.backButton} onPress={goToPrevSlide}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>

      {/* Goal Selection Screen */}
      <ImageBackground
        source={require('./../../assets/images/goal.jpeg')}
        style={styles.backgroundImage}
      >
      <View style={styles.slide}>
        <Text style={styles.title}>What’s Your Goal?</Text>
        <TouchableOpacity style={styles.goalButton} onPress={goToNextSlide}>
          <Image source={require('./../../assets/images/weight-loss.png')} style={styles.goalImage}/>
          <Text style={styles.buttonText}>Lose Weight</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.goalButton} onPress={goToNextSlide}>
          <Image source={require('./../../assets/images/muscular.jpg')} style={styles.goalImage}/>
          <Text style={styles.buttonText}>Build Muscle</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.goalButton} onPress={goToNextSlide}>
          <Image source={require('./../../assets/images/fit.jpg')} style={styles.goalImage}/>
          <Text style={styles.buttonText}>Keep Fit</Text>
        </TouchableOpacity>
        {/* Next Screen (Example) */}
        <TouchableOpacity style={styles.backButton} onPress={goToPrevSlide}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
      </ImageBackground>

      {/* Body Parts Selection Screen */}
      <View style={styles.slide}>
        <Text style={styles.title}>Select Body Parts for Workout</Text>
        <TouchableOpacity style={styles.button} onPress={goToNextSlide}>
          <Text style={styles.buttonText}>Arms</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToNextSlide}>
          <Text style={styles.buttonText}>Legs</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={goToNextSlide}>
          <Text style={styles.buttonText}>Core</Text>
        </TouchableOpacity>
        {/* Next Screen (Example) */}
        <TouchableOpacity style={styles.backButton} onPress={goToPrevSlide}>
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      </View>
    </Swiper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    height: 'auto',
    width: 'auto',
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  genderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  genderImagesContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '80%',
    marginTop: 20,
  },
  genderImageWrapper: {
    alignItems: 'center',
    marginHorizontal: 10,
    padding:20
  },
  genderImage: {
    width: 200,
    height: 200,
    borderRadius: 75, // Circular image
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  genderText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    width: 200,
    alignItems: 'center',
    alignSelf: 'center',
  },
  goalButton:{
    backgroundColor: '#000',
    // padding: 20,
    marginBottom: 50,
    borderRadius:15,
    // justifyContent: 'space-around',
    borderWidth:2,
    borderColor:'#4CAF50',
    // width: 200,
    alignItems: 'center',
    // alignSelf: 'center',
  },
  startButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: 200,
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 60,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loseWeight:{
    backgroundImage:'../../assets/images/weight-loss.png'
  },
  startBtn: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 60,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  goalImage:{
    width: 200,
    height: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius:15,
  }
});
