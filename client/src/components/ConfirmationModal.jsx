import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import ConfirmationModalCSS from "./ConfirmationModal.module.css";

// isOpen => takes a boolean to either show or close the modal
// text => text to show in the modal, make sure not to have very long words
// onCancel => function to run when clicking Cancel, must include logic to close the modal
// onConfirm => fuction to run when clicking Confirm, Confirm also runs onCancel to close the modal

const ConfirmationModal = ({ isOpen, text, onConfirm, onCancel }) => {
  const modalRoot = document.getElementById("confirmation-modal-root");
  const modalContainer = useRef(document.createElement("div"));

  useEffect(() => {
    modalRoot.appendChild(modalContainer.current);

    return () => {
      modalRoot.removeChild(modalContainer.current);
    };
  }, [modalRoot]);

  const handleConfirm = () => {
    onConfirm();
    onCancel();
  };

  const handleCancel = () => {
    onCancel();
  };

  return isOpen
    ? ReactDOM.createPortal(
        <div className={ConfirmationModalCSS.wrapper}>
          <div className={ConfirmationModalCSS.backdrop}></div>
          <div className={ConfirmationModalCSS.container}>
            <div className={ConfirmationModalCSS.text}>{text}</div>
            <div className={ConfirmationModalCSS.buttons}>
              <button onClick={handleConfirm}>Confirm</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>,
        modalContainer.current
      )
    : null;
};

export default ConfirmationModal;
