import React, { useEffect, useRef } from 'react';
import { Animated, FlatList, Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import Swiper from 'react-native-swiper';
import SVGComponent from './svgComponent';

const AnimatedBtn = Animatable.createAnimatableComponent(TouchableOpacity)
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

  const headerHieght = useSharedValue(0);

  const headerStyle = useAnimatedStyle(() => {
    return {
      height: headerHieght.value,
    };
  });

  useEffect(() => {
    headerHieght.value = withTiming(350, { duration: 1500 });
  }, []);


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
          <Animatable.Text style={{ color: '#9e9e9e', textAlign: 'center', fontSize: 16, paddingTop: 100, fontWeight: '600' }}>Elevate Your Fitness with a Cutting Edge to Fuel Your Motivation & Crush your goal</Animatable.Text>
          <AnimatedBtn style={styles.startButton} onPress={goToNextSlide} animation={'slideInUp'}>
            <Text style={styles.buttonText}>Get Started!</Text>
          </AnimatedBtn>
        </View>
      </ImageBackground>

      {/* Gender Selection Screen */}
      <ImageBackground
        source={require('./../../assets/images/bg.png')}
        style={styles.backgroundImage}
      >
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
      </ImageBackground>

      {/* Goal Selection Screen */}
      <ImageBackground
        source={require('./../../assets/images/bg.png')}
        style={styles.backgroundImage}
      >
        <View style={styles.container}>
          <Text style={styles.title}>What’s Your Goal?</Text>
          <TouchableOpacity style={styles.goalButton} onPress={goToNextSlide}>
            <Image source={require('./../../assets/images/weight-loss.png')} style={styles.goalImage} />
            <Text style={styles.buttonText}>Lose Weight</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goalButton} onPress={goToNextSlide}>
            <Image source={require('./../../assets/images/muscular.jpg')} style={styles.goalImage} />
            <Text style={styles.buttonText}>Build Muscle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.goalButton} onPress={goToNextSlide}>
            <Image source={require('./../../assets/images/fit.jpg')} style={styles.goalImage} />
            <Text style={styles.buttonText}>Keep Fit</Text>
          </TouchableOpacity>
          {/* Next Screen (Example) */}
          <TouchableOpacity style={styles.backButton} onPress={goToPrevSlide}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Injury Body Parts Selection Screen */}
      <ImageBackground source={require('./../../assets/images/bg.png')} style={styles.backgroundImage}>
        <View style={styles.container}>
          <Text style={styles.title}>What do you want to workout ?</Text>
          <SVGComponent width={'60%'} height={'70%'} />
          <TouchableOpacity style={styles.backButton} onPress={goToPrevSlide}>
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.startButton} onPress={goToNextSlide}>
            <Text style={styles.buttonText}>Let's Begin</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>


      {/* DashBoard*/}
      <ImageBackground
        source={require('./../../assets/images/bg.png')}
        style={styles.backgroundImage}
      >
        <Animated.View style={[{ width: '100%', height: 350, backgroundColor: '#43527a', borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }, headerStyle]}>
        </Animated.View>
        <View style={{ width: '100%', height: '100%', position: 'absolute' }}>
          <View style={{ width: '100%', alignContent: 'center', marginTop: 70, justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={goToPrevSlide}>
              <Image source={require('../../assets/images/menu.png')} style={{ width: 24, height: 24, tintColor: 'white' }} />
            </TouchableOpacity>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: '500' }}> Fit Buddy</Text>
            <Image source={require('../../assets/images/male.jpg')} style={{ width: 50, height: 50, borderRadius: 25 }} />
          </View>
          <Text style={{ color: 'white', fontSize: 18, alignSelf: 'center', marginTop: 49 }}>Here is your warm ups</Text>
          {/* <Text style={{ color: 'white', fontSize: 30, alignSelf: 'center', marginTop: 10 }}>Hii</Text> */}
          <View style={{ width: '100%', height: 100, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-around', }}>
            <TouchableOpacity style={{ backgroundColor: '#000', padding: 10, borderRadius: 10 }}>
              <Text style={styles.backButtonText}>Arms</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.backButtonText}>Chest</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.backButtonText}>Abdominal</Text>
            </TouchableOpacity>
            <TouchableOpacity >
              <Text style={styles.backButtonText}>Biceps</Text>
            </TouchableOpacity>
            <TouchableOpacity >
              <Text style={styles.backButtonText}>legs</Text>
            </TouchableOpacity>
          </View>
          <FlatList data={[1, 1, 1, 1, 1, 1, 1, 1, 1]} renderItem={({ item }) => {
            return (
              <Animated.View style={{ width: '90%', height: 100, marginTop: 20, backgroundColor: '#f2f2f2', alignSelf: 'center', borderRadius: 20 }}>
                <View style={{ width: '90%', marginTop: 20, justifyContent: 'space-between', alignSelf: 'center', flexDirection: 'row' }}>
                  <Image source={require('../../assets/images/treadmill.jpg')} style={{ width: 50, height: 50 }} />
                  <Text style={{ color: '#9e9e9e' }}>Start Now</Text>
                </View>
              </Animated.View>
            )
          }} />
        </View>
      </ImageBackground>
    </Swiper>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  genderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    padding: 20
  },
  genderImage: {
    width: 200,
    height: 200,
    borderRadius: 75,
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
    alignSelf: 'center',
    textAlign: 'center'
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
  goalButton: {
    backgroundColor: '#000',
    marginBottom: 50,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#4CAF50',
    alignItems: 'center'
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
    top: 30,
    left: 20,
    backgroundColor: '#000',
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  goalImage: {
    width: 200,
    height: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  }
});
