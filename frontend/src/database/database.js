export const insertUserWorkout = async (data, db) => {
  try {
    const parsedDate = new Date();
    // Format the date as YYYY-MM-DD (SQLite uses this format for DATE)
    const date = parsedDate.toISOString().split("T")[0];
    const firstRow = await db.getFirstAsync(
      `SELECT * FROM user_workout WHERE DATE(date) = ? AND workoutName = ?`,
      [date, data.workoutName]
    );

    if (firstRow) {
      updateWorkout(data, db);
    } else {
      await db.runAsync(
        "INSERT INTO user_workout (name, type, gender, email, workoutName, workoutGIF, workoutDuration, targettedBodyPart, equipment, level, suitableFor, isCompleted, isSkipped, totalCalBurnt, calBurnPerRep, reps) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          data.name,
          data.type,
          data.gender,
          data.email,
          data.workoutName,
          data.workoutGIF,
          data.workoutDuration,
          data.targettedBodyPart,
          data.equipment,
          data.level,
          data.suitableFor,
          data.isCompleted,
          data.isSkipped,
          data.totalCalBurnt,
          data.calBurnPerRep,
          data.reps,
        ]
      );
      console.log("Workout data inserted successfully");
    }
  } catch (error) {
    console.log("Error inserting workout data", error);
  }
};

const updateWorkout = async (data, db) => {
  const query = `
    UPDATE user_workout 
    SET 
      name = ?, 
      type = ?, 
      gender = ?, 
      email = ?, 
      workoutGIF = ?, 
      workoutDuration = ?, 
      targettedBodyPart = ?, 
      equipment = ?, 
      level = ?, 
      suitableFor = ?, 
      isCompleted = ?, 
      isSkipped = ?, 
      totalCalBurnt = ?, 
      calBurnPerRep = ?, 
      reps = ?
    WHERE workoutName = ?
  `;

  const values = [
    data.name,
    data.type,
    data.gender,
    data.email,
    data.workoutGIF,
    data.workoutDuration,
    data.targettedBodyPart,
    data.equipment,
    data.level,
    data.suitableFor,
    data.isCompleted,
    data.isSkipped,
    data.totalCalBurnt,
    data.calBurnPerRep,
    data.reps,
    data.workoutName, // Condition to identify the record
  ];

  try {
    await db.runAsync(query, values);
    console.log(`Workout "${data.workoutName}" updated successfully!`);
  } catch (error) {
    console.error(`Error updating workout "${data.workoutName}":`, error);
  }
};

export const getWorkoutData = async (value, db) => {
  try {
    const parsedDate = new Date(value);
    // Format the date as YYYY-MM-DD (SQLite uses this format for DATE)
    const date = parsedDate.toISOString().split("T")[0];
    const allRows = await db.getAllAsync(
      `SELECT * FROM user_workout WHERE DATE(date) = ?`,
      [date]
    );

    for (const row of allRows) {
      console.log(row.id, row.name, row.reps);
    }

    return allRows;
  } catch (error) {
    console.log("Error on getting workouts data", error);
  }
};
