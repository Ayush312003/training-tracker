const express = require("express");
const router = express.Router();
const {
  createTraining,
  getAllTrainings,
  getTrainingDetails,
  editTraining,
  deleteTraining,
  getAppliedTraining,
  getInterestedTraining,
  getUsersCount,
} = require("../controllers/trainingControllers");

router.post("/createTraining", createTraining);
router.get("/trainings", getAllTrainings);
router.get("/training/:id", getTrainingDetails);
router.get("/trainings/:id/applicants", getAppliedTraining);
router.get("/trainings/:id/interested", getInterestedTraining);
router.put("/trainings/:id", editTraining);
router.delete("/trainings/:id", deleteTraining);
router.get("/usercount", getUsersCount);
module.exports = router;
