import React, { useState } from "react";
import { toast } from "react-toastify";
import styles from "./Admin.module.css";
const Modal = ({ handleClose, show, fetchData, children }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dateTimeStart, setDateStart] = useState(new Date());
  const [dateTimeEnd, setDateEnd] = useState(new Date());
  const [totalSlots, settotalSlots] = useState("");

  const handleInputChange = (event, setInputValue) => {
    setInputValue(event.target.value);
  };

  const handleInputFocus = () => {
    // Set the scroll position to the top when the input is focused
    if (inputRef.current) {
      inputRef.current.scrollTop = 0;
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setDateStart(new Date());
    setDateEnd(new Date());
    settotalSlots("");
  };
  const showToast = (message) => {
    if (message.success) toast.success(message.success);
    else if (message.error) toast.error(message.error);
  };
  const handleSubmit = async () => {
    try {
      if (name.trim() === "") {
        showToast({ error: "Some Important Field(s) may be empty!" });
      } else if (
        new Date(dateTimeStart) < new Date() ||
        new Date(dateTimeEnd) < new Date(dateTimeStart) ||
        new Date(dateTimeEnd) < new Date()
      ) {
        showToast({ error: "Training date cannot be in the past" });
      } else {
        const response = await fetch(
          "http://localhost:5000/admin/createTraining",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
              name,
              description,
              totalSlots,
              dateTimeStart,
              dateTimeEnd,
            }),
          }
        );
        const result = await response.json();
        if (response.status === 201) {
          fetchData();
          showToast({ success: "Data Inserted" });
          resetForm();
          handleClose();
        } else {
          showToast({ error: result.error });
        }
      }
    } catch (error) {
      showToast({ error: error.message });
      console.error("Error inserting data:", error);
    }
  };

  const showStyle = show ? { display: "block" } : { display: "none" };
  return (
    <div className={styles.modal} style={showStyle}>
      <section className={styles.modal_main}>
        {children}
        <h1 className={styles.formTitle1}>Create</h1>
        <h1 className={styles.formTitle2}>Training</h1>
        <div className={styles.inputDiv}>
          <div>
            <input
              type="text"
              id="name"
              value={name}
              placeholder="Enter the Training Name"
              onChange={(e) => handleInputChange(e, setName)}
            />
          </div>
          <div className={styles.dateDiv}>
            <input
              type="datetime-local"
              id="date"
              value={dateTimeStart}
              className={styles.dateStart}
              onChange={(e) => handleInputChange(e, setDateStart)}
            />
          </div>
          <h1 className={styles.dateDiv}>&gt;</h1>
          <div className={styles.dateDiv}>
            <input
              type="datetime-local"
              id="date"
              value={dateTimeEnd}
              className={styles.dateEnd}
              onChange={(e) => handleInputChange(e, setDateEnd)}
            />
          </div>
          <div>
            <input
              type="number"
              id="totalSlots"
              value={totalSlots}
              placeholder="Total Candidates"
              onChange={(e) => handleInputChange(e, settotalSlots)}
            />
          </div>
          <div>
            <input
              type="text"
              id="description"
              className={styles.description}
              value={description}
              placeholder="Write the Descriptions..."
              onChange={(e) => handleInputChange(e, setDescription)}
            />
          </div>

          <br />
        </div>

        {/* Submit button */}
        <div className={styles.inputButton}>
          <button className={styles.formCloseButton} onClick={handleClose}>
            Close
          </button>
          <button className={styles.formSubmitButton} onClick={handleSubmit}>
            Submit
          </button>
        </div>
      </section>
    </div>
  );
};

export default Modal;
