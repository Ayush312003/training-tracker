import React, { useEffect, useState } from "react";
import CardCSS from "./Card.module.css";
import ConfirmationModal from "./ConfirmationModal";
import {
  FaRegClock,
  FaCalendarDays,
  FaCheckToSlot,
  FaHand,
} from "react-icons/fa6";
import { toast } from "react-toastify";

const Card = ({
  trainingData,
  fetchAppliedTrainings,
  fetchUnEnrolledTraining,
  fetchInterestedTraining,
}) => {
  const [isJoined, setJoined] = useState(false);
  const [isInterested, setInterested] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showInterestModal, setShowInterestModal] = useState(false);

  const imgSrc = `./src/assets/cardImgs/img${trainingData.id % 10}.jpg`;
  const joinText = `Do you want join ${trainingData.name}?`;
  const interestText = `Do you want show your interest in ${trainingData.name}?`;

  const showToast = (message) => {
    console.log(message.error);
    if (message.success) toast.success(message.success);
    else if (message.error) toast.error(message.error);
  };

  // need this to remove seconds from the time
  const formatTime = (timeString) => {
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    return new Date(timeString).toLocaleTimeString("en-US", options);
  };

  const handleJoinClick = () => {
    setShowJoinModal(true);
  };

  const handleJoinCancel = () => {
    setShowJoinModal(false);
  };

  const handleJoin = async () => {
    const options = {
      headers: {
        Accept: "application/json",
      },
      method: "POST",
      credentials: "include",
    };
    const response = await fetch(
      `http://localhost:5000/user/trainings/${trainingData.id}/apply`,
      options
    );
    const data = await response.json();
    if (response.status == 200) {
      // alert(data.success);
      showToast({ success: data.success });
      setJoined(true);
      fetchAppliedTrainings();
      fetchUnEnrolledTraining();
      fetchInterestedTraining();
    } else {
      showToast({ error: data.error });
    }
  };

  const handleInterestClick = () => {
    setShowInterestModal(true);
  };

  const handleInterestCancel = () => {
    setShowInterestModal(false);
  };

  const handleInterest = async () => {
    const options = {
      headers: {
        Accept: "application/json",
      },
      method: "POST",
      credentials: "include",
    };
    const response = await fetch(
      `http://localhost:5000/user/trainings/${trainingData.id}/interested`,
      options
    );
    const data = await response.json();
    if (response.status == 200) {
      console.log(data);
      showToast({ success: data.success });
      setInterested(true);
      fetchAppliedTrainings();
      fetchUnEnrolledTraining();
      fetchInterestedTraining();
    } else {
      showToast({ error: data.error });
    }
  };

  return (
    <>
      <div className={CardCSS.container}>
        <img src={imgSrc} alt="card img" />
        <div className={CardCSS.title}>{trainingData.name}</div>
        <div className={CardCSS.description}>{trainingData.description}</div>
        <div
          style={{
            padding: "1px 8px",
            borderBottom: ".5px dashed grey",
          }}
        ></div>
        <div className={CardCSS.infoContainer}>
          <div className={CardCSS.info}>
            <FaRegClock />
            <p>{formatTime(trainingData.date_time_start)}</p>
          </div>
          <div className={CardCSS.info}>
            <FaCalendarDays />
            <p>
              {new Date(trainingData.date_time_start).toLocaleDateString(
                "en-GB"
              )}
            </p>
          </div>
        </div>
        <div className={CardCSS.infoContainer}>
          <div className={CardCSS.info}>
            <FaCheckToSlot />
            <p>{`${trainingData.remaining_slots} left`}</p>
          </div>
          <div className={CardCSS.info}>
            <FaHand />
            <p>Total {trainingData.total_slots}</p>
          </div>
        </div>
        <div className={CardCSS.buttons}>
          {trainingData.remaining_slots > 0 ? (
            <>
              <button
                onClick={handleJoinClick}
                disabled={isJoined || isInterested}
                className={
                  isJoined || isInterested ? CardCSS.disabledButton : ""
                }
              >
                Join now
              </button>
              <ConfirmationModal
                isOpen={showJoinModal}
                text={joinText}
                onConfirm={handleJoin}
                onCancel={handleJoinCancel}
              />
            </>
          ) : (
            <>
              <button
                onClick={handleInterestClick}
                disabled={isJoined || isInterested}
                className={
                  isJoined || isInterested ? CardCSS.disabledButton : ""
                }
              >
                Interested
              </button>
              <ConfirmationModal
                isOpen={showInterestModal}
                text={interestText}
                onConfirm={handleInterest}
                onCancel={handleInterestCancel}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Card;
