import React, { useState, useEffect } from "react";
import { Image, ImageBackground, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Asset } from "expo-asset";

const images = {
  Male: {
    chest: require("../../assets/workoutBodyPart/male/Chest.png"),
    abdominals: require("../../assets/workoutBodyPart/male/Abdominals.png"),
    calves: require("../../assets/workoutBodyPart/male/Calves.png"),
    shoulders: require("../../assets/workoutBodyPart/male/Shoulders.png"),
    quads: require("../../assets/workoutBodyPart/male/Quads.png"),
    obliques: require("../../assets/workoutBodyPart/male/Obliques.png"),
    traps: require("../../assets/workoutBodyPart/male/Traps.png"),
    forearms: require("../../assets/workoutBodyPart/male/Forearms.png"),
    biceps: require("../../assets/workoutBodyPart/male/Biceps.png"),
  },
  Female: {
    chest: require("../../assets/workoutBodyPart/female/chest.png"),
    abdominals: require("../../assets/workoutBodyPart/female/Abdominals.png"),
    calves: require("../../assets/workoutBodyPart/female/Calves.png"),
    frontShoulders: require("../../assets/workoutBodyPart/female/frontShoulders.png"),
    quads: require("../../assets/workoutBodyPart/female/Quads.png"),
    obliques: require("../../assets/workoutBodyPart/female/Obliques.png"),
    traps: require("../../assets/workoutBodyPart/female/Traps.png"),
    forearms: require("../../assets/workoutBodyPart/female/Forearms.png"),
    biceps: require("../../assets/workoutBodyPart/female/Biceps.png"),
  },
  exercise: {
    "no-image": require("../../assets/workoutImages/no-image.jpg"),
    "cow-stretch": require("../../assets/workoutImages/cow-stretch.gif"),
    "dead-bug": require("../../assets/workoutImages/dead-bug.gif"),
    "front-plank-male": require("../../assets/workoutImages/front-plank-male.gif"),
    "crunch-hands-overhead": require("../../assets/workoutImages/crunch-hands-overhead.gif"),
    "bicycles-crunches": require("../../assets/workoutImages/bicycles-crunches.gif"),
    "mountain-climber": require("../../assets/workoutImages/mountain-climber.gif"),
    "crunch-straight-leg-up": require("../../assets/workoutImages/crunch-straight-leg-up.gif"),
    "leg-raise-dragon-flag": require("../../assets/workoutImages/leg-raise-dragon-flag.gif"),
    "cat-cow-stretch": require("../../assets/workoutImages/cat-cow-stretch.gif"),
    "push-up-wall": require("../../assets/workoutImages/push-up-wall.gif"),
    "roll-pec-foam-rolling": require("../../assets/workoutImages/roll-pec-foam-rolling.gif"),
    "seal-push-up": require("../../assets/workoutImages/seal-push-up.gif"),
    "kneeling-push-up-male": require("../../assets/workoutImages/kneeling-push-up-male.gif"),
    "push-up": require("../../assets/workoutImages/push-up.gif"),
    "incline-push-up-with-chair": require("../../assets/workoutImages/incline-push-up-with-chair.gif"),
    "decline-push-up-with-chair-male": require("../../assets/workoutImages/decline-push-up-with-chair-male.gif"),
    "spider-crawl-push-up": require("../../assets/workoutImages/spider-crawl-push-up.gif"),
    "clock-push-up": require("../../assets/workoutImages/clock-push-up.gif"),
    "clap-push-up": require("../../assets/workoutImages/clap-push-up.gif"),
    "archer-push-up": require("../../assets/workoutImages/archer-push-up.gif"),
    "single-arm-push-up-on-knees": require("../../assets/workoutImages/single-arm-push-up-on-knees.gif"),
    "high-knee-skips-male": require("../../assets/workoutImages/high-knee-skips-male.gif"),
    "high-knee-to-butt-kick": require("../../assets/workoutImages/high-knee-to-butt-kick.gif"),
    "place-jog-male": require("../../assets/workoutImages/place-jog-male.gif"),
    "side-lunges-bodyweight": require("../../assets/workoutImages/side-lunges-bodyweight.gif"),
    "bodyweight-squats": require("../../assets/workoutImages/bodyweight-squats.gif"),
    "bodyweight-wall-squat": require("../../assets/workoutImages/bodyweight-wall-squat.gif"),
    "sumo-squat-male": require("../../assets/workoutImages/sumo-squat-male.gif"),
    "jump-squats-bodyweight": require("../../assets/workoutImages/jump-squats-bodyweight.gif"),
    "bodyweight-pulse-squat-male": require("../../assets/workoutImages/bodyweight-pulse-squat-male.gif"),
    "bulgarian-split-squat-with-chair": require("../../assets/workoutImages/bulgarian-split-squat-with-chair.gif"),
    "bodyweight-paused-goblet-squat-male": require("../../assets/workoutImages/bodyweight-paused-goblet-squat-male.gif"),
    "single-leg-squat-pistol": require("../../assets/workoutImages/single-leg-squat-pistol.gif"),
    "cossack-squat": require("../../assets/workoutImages/cossack-squat.gif"),
    "arm-circles": require("../../assets/workoutImages/arm-circles.gif"),
    "chest-and-front-of-shoulder-stretch": require("../../assets/workoutImages/chest-and-front-of-shoulder-stretch.gif"),
    "dumbbell-one-arm-front-raise": require("../../assets/workoutImages/dumbbell-one-arm-front-raise.gif"),
    "mid-air-lateral-raises-with-switching-palms": require("../../assets/workoutImages/mid-air-lateral-raises-with-switching-palms.gif"),
    "pike-push-up": require("../../assets/workoutImages/pike-push-up.gif"),
    "forearms-to-wide-grip-wall-push-up-male": require("../../assets/workoutImages/forearms-to-wide-grip-wall-push-up-male.gif"),
    "handstand-against-the-wall": require("../../assets/workoutImages/handstand-against-the-wall.gif"),
  },
};

const getImageSource = async (gender, selectedWorkout, defaultImage) => {
  const image = images[gender]?.[selectedWorkout];

  if (image) {
    await Asset.loadAsync(image); // Lazy load the image
    return image;
  }
  return defaultImage;
};

export const WorkoutImage = ({ userGender, userSelectedWorkout, style }) => {
  const defaultImage = require("../../assets/images/model.png"); // Fallback image
  const [imageSource, setImageSource] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      const source = await getImageSource(
        userGender,
        userSelectedWorkout,
        defaultImage
      );
      setImageSource(source);
    };
    loadImage();
  }, [userGender, userSelectedWorkout]);

  if (!imageSource) {
    return <ActivityIndicator size="large" color="#0000ff" style={style} />;
  }

  return <Image source={imageSource} style={style} resizeMode="contain" />;
};

export const ExerciseDashboardCard = ({ imageName }) => {
  const defaultImage = require("../../assets/workoutImages/no-image.jpg"); // Fallback image
  const [imageSource, setImageSource] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      const source = await getImageSource("exercise", imageName, defaultImage);
      setImageSource(source);
    };
    loadImage();
  }, [imageName]);

  if (!imageSource) {
    return <ActivityIndicator size="large" color="#0000ff"style={{
      height: 150,
      width: 300,
    }} />;
  }

  return (
    <ImageBackground
      source={imageSource}
      style={{
        height: 150,
        width: 300,
      }}
    >
      <LinearGradient
        locations={[0, 1.0]}
        colors={["rgba(0,0,0,0.00)", "rgba(0,0,0,0.60)"]}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      ></LinearGradient>
    </ImageBackground>
  );
};

export const ExerciseImage = ({ imageName, style }) => {
  const defaultImage = require("../../assets/workoutImages/no-image.jpg"); // Fallback image
  const [imageSource, setImageSource] = useState(null);

  useEffect(() => {
    const loadImage = async () => {
      const source = await getImageSource("exercise", imageName, defaultImage);
      setImageSource(source);
    };
    loadImage();
  }, [imageName]);

  if (!imageSource) {
    return <ActivityIndicator size="large" color="#0000ff" style={style} />;
  }

  return <ImageBackground source={imageSource} style={style}></ImageBackground>;
};
