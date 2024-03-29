const express = require("express");
const {
  getAllTrainings,
  getTrainingDetails,
  applyToTraining,
  interestedForTraining,
  getAllTrainingIds,
  getUserTrainings,
  getUserUnEnrolledTraining,
  getUserInterested,
} = require("../controllers/trainingControllers");
const router = express.Router();

router.get("/trainings", getAllTrainings);
router.get("/trainings/:id", getTrainingDetails);
router.post("/trainings/:id/apply", applyToTraining);
router.post("/trainings/:id/interested", interestedForTraining);
router.get("/getAllTrainingIds", getAllTrainingIds);
router.get("/getUserApplied", getUserTrainings);
router.get("/getUserUnEnrolledTraining", getUserUnEnrolledTraining);
router.get("/getUserInterested", getUserInterested);

// get applied training
// get all interested training
module.exports = router;
