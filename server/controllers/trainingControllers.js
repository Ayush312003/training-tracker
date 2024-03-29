const { client } = require("../config/database");

// Creates a new training with the provided details.
const createTraining = async (req, res) => {
  // Destructuring training details from request body
  const { name, description, totalSlots, dateTimeStart, dateTimeEnd } =
    req.body;

  // Check if all required fields are provided
  if (!name || !description || !totalSlots || !dateTimeStart || !dateTimeEnd)
    return res.json({ error: "All fields required" });

  try {
    // Insert the new training into the database
    const result = await client.query(
      "INSERT INTO trainings(name, description, remaining_slots, total_slots, date_time_start, date_time_end) values ($1, $2, $3, $3, $4, $5) RETURNING *",
      [name, description, totalSlots, dateTimeStart, dateTimeEnd]
    );

    // Return the newly created training data
    return res.status(201).json(result.rows[0]);
  } catch (error) {
    // Handle database errors
    return res.status(500).json({ error: error.message });
  }
};

// Retrieves all trainings from the database.
const getAllTrainings = async (req, res) => {
  try {
    // Query all trainings from the database
    const result = await client.query("SELECT * from trainings");

    // Return the array of trainings
    return res.status(200).json(result.rows);
  } catch (error) {
    // Handle database errors
    return res.status(500).json({ error: error.message });
  }
};

// Retrieves trainings associated with the authenticated user from the database.
const getUserTrainings = async (req, res) => {
  try {
    // Extract user ID from user data attached to the request object
    const userId = req.user.id;

    // Query trainings associated with the user from the database
    const result = await client.query(
      "SELECT trainings.* FROM training_applied JOIN trainings ON training_applied.training_id = trainings.id WHERE training_applied.user_id = $1",
      [userId]
    );

    // Return the array of user's trainings
    return res.status(200).json(result.rows);
  } catch (error) {
    // Handle database errors
    return res.status(500).json({ error: error.message });
  }
};

// Retrieves details of a specific training based on the provided training ID.
const getTrainingDetails = async (req, res) => {
  try {
    // Extract training ID from request parameters
    const trainingId = req.params.id;

    // Query the database for details of the specified training
    const result = await client.query("SELECT * from trainings where id = $1", [
      trainingId,
    ]);

    // Return details of the training
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    // Handle database errors
    return res.status(500).json({ error: error.message });
  }
};

// Edits details of a specific training based on the provided training ID.
const editTraining = async (req, res) => {
  try {
    // Extract training ID from request parameters
    const trainingId = req.params.id;

    // Destructure updated training details from request body
    const { name, description, totalSlots, dateTimeStart, dateTimeEnd } =
      req.body;

    // Check if all required fields are provided
    if (!name || !description || !totalSlots || !dateTimeStart || !dateTimeEnd)
      return res.json({ error: "All fields required" });

    // Query the database for the existing training details
    let result = await client.query("SELECT * FROM trainings where id = $1", [
      trainingId,
    ]);

    // Calculate remaining slots based on the difference between updated and original total slots
    const remainingSlot =
      result.rows[0].remaining_slots +
      (totalSlots - result.rows[0].total_slots);

    // Update the training details in the database
    result = await client.query(
      "UPDATE  trainings set name = $1, description = $2, remaining_slots = $3, total_slots = $4, date_time_start = $5, date_time_end = $6 where id = $7 RETURNING *",
      [
        name,
        description,
        remainingSlot,
        totalSlots,
        dateTimeStart,
        dateTimeEnd,
        trainingId,
      ]
    );

    // Return details of the updated training
    return res.status(200).json(result.rows[0]);
  } catch (error) {
    // Handle database errors
    return res.status(500).json({ error: error.message });
  }
};

// Deletes a specific training and its associated data from the database based on the provided training ID.
const deleteTraining = async (req, res) => {
  const trainingId = req.params.id;

  try {
    // Delete mappings from related tables (training_applied, training_interested)
    await client.query("DELETE FROM training_applied WHERE training_id = $1", [
      trainingId,
    ]);
    await client.query(
      "DELETE FROM training_interested WHERE training_id = $1",
      [trainingId]
    );

    // Delete the training from the main trainings table
    const result = await client.query(
      "DELETE FROM trainings WHERE id = $1 RETURNING *",
      [trainingId]
    );

    // Return the deleted training data
    return res.status(200).json(result);
  } catch (error) {
    // Handle database errors
    return res.status(500).json({ error: error.message });
  }
};

// Allows a user to apply to a specific training.
const applyToTraining = async (req, res) => {
  const userId = req.user.id;
  const trainingId = req.params.id;

  try {
    // Retrieve the remaining slots for the training
    const training = await client.query(
      "SELECT remaining_slots FROM trainings WHERE id = $1",
      [trainingId]
    );
    const remainingSlot = training.rows[0].remaining_slots;

    // Check if there are remaining slots available
    if (remainingSlot) {
      // Insert the user's application to the training
      const result = await client.query(
        "INSERT INTO training_applied (user_id, training_id) VALUES ($1, $2)",
        [userId, trainingId]
      );

      // Update the remaining slots for the training
      const updateTraining = await client.query(
        "UPDATE trainings SET remaining_slots = $1 WHERE id = $2",
        [remainingSlot - 1, trainingId]
      );

      // Return success message
      return res.status(200).json({ success: "Applied" });
    } else {
      // Return error message if no empty slots are available
      return res
        .status(202)
        .json({ errorCode: "23505", error: "No empty Slots" });
    }
  } catch (error) {
    // Return error message if an error occurs during the process
    return res
      .status(202)
      .json({ errorCode: error.code, error: error.message });
  }
};

// Marks a user as interested in a specific training.
const interestedForTraining = async (req, res) => {
  const userId = req.user.id;
  const trainingId = req.params.id;

  try {
    // Insert the user's interest in the training
    const result = await client.query(
      "INSERT INTO training_interested (user_id, training_id) VALUES ($1, $2)",
      [userId, trainingId]
    );

    // Return success message
    return res.status(200).json({ success: "Interested" });
  } catch (error) {
    // Return error message if an error occurs during the process
    return res
      .status(202)
      .json({ errorCode: error.code, error: error.message });
  }
};

// Retrieves a list of users who have applied for a specific training.
const getAppliedTraining = async (req, res) => {
  try {
    // Extract training ID from request parameters
    const trainingId = req.params.id;

    // Query the database to get users who have applied for the specified training
    const result = await client.query(
      "SELECT users.name FROM users JOIN training_applied AS t_a ON t_a.user_id = users.id JOIN trainings AS t ON t.id = t_a.training_id WHERE t.id = $1",
      [trainingId]
    );

    // Return the array of users who have applied for the training
    return res.status(200).json(result.rows);
  } catch (error) {
    // Handle database errors
    return res.status(500).json({ error: error.message });
  }
};

// Retrieves a list of users who are interested in a specific training.
const getInterestedTraining = async (req, res) => {
  try {
    // Extract training ID from request parameters
    const trainingId = req.params.id;

    // Query the database to get users who are interested in the specified training
    const result = await client.query(
      "SELECT users.name FROM users JOIN training_interested AS t_i ON t_i.user_id = users.id JOIN trainings AS t ON t.id = t_i.training_id WHERE t.id = $1",
      [trainingId]
    );

    // Return the array of users who are interested in the training
    return res.status(200).json(result.rows);
  } catch (error) {
    // Handle database errors
    return res.status(500).json({ error: error.message });
  }
};

// Retrieves IDs of all trainings from the database.
const getAllTrainingIds = async (req, res) => {
  try {
    // Query the database to get IDs of all trainings
    const { rows } = await client.query("SELECT id FROM trainings");
    const trainingIds = rows.map((training) => training.id);

    // Return the array of training IDs
    res.json(trainingIds);
  } catch (error) {
    // Handle database errors
    console.error("Error fetching training IDs:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Retrieves trainings that the authenticated user is not enrolled or interested in.
const getUserUnEnrolledTraining = async (req, res) => {
  try {
    // Extract user ID from request object
    const userId = req.user.id;

    // Query the database to get trainings that the user is not enrolled or interested in
    const result = await client.query(
      "SELECT t.* FROM trainings t LEFT JOIN training_applied ta ON t.id = ta.training_id AND ta.user_id = $1 LEFT JOIN training_interested ti ON t.id = ti.training_id AND ti.user_id = $1 WHERE ta.user_id IS NULL AND ti.user_id IS NULL;",
      [userId]
    );

    // Return the array of trainings
    return res.status(200).json(result.rows);
  } catch (error) {
    // Handle database errors
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

// Retrieves trainings that the authenticated user is interested in.
const getUserInterested = async (req, res) => {
  try {
    // Extract user ID from request object
    const userId = req.user.id;

    // Query the database to get trainings that the user is interested in
    const result = await client.query(
      "SELECT trainings.* FROM training_interested JOIN trainings ON training_interested.training_id = trainings.id WHERE training_interested.user_id = $1",
      [userId]
    );

    // Return the array of trainings
    return res.status(200).json(result.rows);
  } catch (error) {
    // Handle database errors
    return res.status(500).json({ error: error.message });
  }
};

// Retrieves the count of regular users (non-admins) from the database.
const getUsersCount = async (req, res) => {
  try {
    // Query the database to get the count of regular users
    const result = await client.query(
      "SELECT COUNT(*) FROM users WHERE isAdmin = false"
    );

    // Return the count of regular users
    return res.status(200).json(result.rows[0].count);
  } catch (error) {
    // Handle database errors
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTraining,
  getAllTrainings,
  editTraining,
  deleteTraining,
  applyToTraining,
  interestedForTraining,
  getAppliedTraining,
  getInterestedTraining,
  getTrainingDetails,
  getAllTrainingIds,
  getUserTrainings,
  getUserUnEnrolledTraining,
  getUserInterested,
  getUsersCount,
};
