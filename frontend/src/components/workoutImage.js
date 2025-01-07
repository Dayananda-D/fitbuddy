import React from "react";
import { Image } from "react-native";

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
};

const getImageSource = (gender, selectedWorkout) => {
  const defaultImage = require("../../assets/images/model.png"); // Fallback image
  return images[gender]?.[selectedWorkout] || defaultImage;
};

const WorkoutImage = ({ userGender, userSelectedWorkout, style }) => {
  const imageSource = getImageSource(userGender, userSelectedWorkout);

  return <Image source={imageSource} style={style} resizeMode="contain" />;
};

export default WorkoutImage;
