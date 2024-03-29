// TrainingProgramList.jsx
import React, { useState } from "react";
import styles from "./Admin.module.css";
import { toast } from "react-toastify";
import EditModal from "./EditModal";
import { Link, Navigate } from "react-router-dom";
import ConfirmationModal from "../ConfirmationModal";

const TrainingProgramList = ({ trainings, fetchData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [training, setTraining] = useState({});

  const onConfirm = async () => {
    deleteTrainingFromDb();
  };

  const deleteTrainingFromDb = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/admin/trainings/${training.id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const result = await response.json();
      if (response.status == 200) {
        showToast({ success: "Deleted" });
        fetchData();
      }
      showToast({ error: result.error });
    } catch (error) {
      showToast({ error: error.message });
    }
  };
  const onCancel = () => {
    setIsOpen(false);
  };
  const showToast = (message) => {
    if (message.success) toast.success(message.success);
    else if (message.error) toast.error(message.error);
  };

  const handleViewClick = (training) => {
    <Navigate to={`/training/${training.id}`} />;
  };

  const handleDeleteClick = async (training) => {
    setIsOpen(true);
    setTraining(training);
  };

  const [show, setShow] = useState(false);
  const [trainingToEdit, setTrainingToEdit] = useState({});

  const handleEditClick = (training) => {
    setShow(true);
    setTrainingToEdit(training);
  };

  const closeModal = () => {
    setShow(false);
  };

  const trainingStartsInFuture = (training) => {
    const startsAtTime = new Date(training.date_time_start);
    const currentTime = new Date();
    return startsAtTime > currentTime;
  };

  return (
    <div className={styles.trainingContainer}>
      {trainings
        .filter((training) => {
          const endsAtTime = new Date(training.date_time_end);
          const currentTime = new Date();
          return endsAtTime > currentTime;
        })
        .map((training, index) => (
          <div key={index} className={styles.program_item}>
            <div className={styles.t_name}>
              <p>{training.name}</p>
            </div>
            <div className={styles.trainingButtonDiv}>
              <Link to={`/admin/training/${training.id}`}>
                <button
                  className={styles.viewButton}
                  onClick={() => handleViewClick(training)}
                >
                  View
                </button>
              </Link>
              <button
                className={
                  trainingStartsInFuture(training)
                    ? styles.editButton
                    : styles.editButtonDisabled
                }
                onClick={() => handleEditClick(training)}
              >
                Edit
              </button>
              {new Date(training.date_time_end) > new Date() && (
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteClick(training)}
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      {show && (
        <EditModal
          show={show}
          fetchData={fetchData}
          training={trainingToEdit}
          closeModal={closeModal}
        />
      )}
      <ConfirmationModal
        text={`Are you sure you want to delete ${training.name} ?`}
        isOpen={isOpen}
        onCancel={onCancel}
        onConfirm={onConfirm}
      />
    </div>
  );
};

export default TrainingProgramList;
