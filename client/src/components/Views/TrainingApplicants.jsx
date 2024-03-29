import React, { useEffect, useState } from "react";
import TrainingApplicantsCSS from "./TrainingApplicants.module.css";
import Table from "./Table";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { useParams } from "react-router";

const TrainingApplicants = () => {
  const { trainingId } = useParams();
  const [training, setTraining] = useState({});
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/admin/training/${trainingId}`,
        {
          credentials: "include",
        }
      );

      // console.log(response);
      const result = await response.json();
      if (response.status == 200) {
        // console.log(result);
        setTraining(result);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <Navbar />
      <div className={TrainingApplicantsCSS.container}>
        <div className={TrainingApplicantsCSS.content}>
          <div className={TrainingApplicantsCSS.trainingDetails}>
            <h1 className={TrainingApplicantsCSS.trainingName}>
              {training.name}
            </h1>
            <div className={TrainingApplicantsCSS.description}>
              {/* <label htmlFor="description">Description: </label> */}
              <p id="description">{training.description}</p>
            </div>
            <div className={TrainingApplicantsCSS.slotsContainer}>
              <div className={TrainingApplicantsCSS.slotBox}>
                <label htmlFor="totalSlots">Total Slots:</label>
                <p id="totalSlots">{training.total_slots}</p>
              </div>
              <div className={TrainingApplicantsCSS.slotBox}>
                <label htmlFor="remainingSlots">Remaining Slots:</label>
                <p id="remainingSlots">{training.remaining_slots}</p>
              </div>
            </div>
          </div>
          <div className={TrainingApplicantsCSS.tables}>
            <Table tableName={"Applied Users"} trainingId={trainingId} />
            <Table tableName={"Interested Users"} trainingId={trainingId} />
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default TrainingApplicants;
