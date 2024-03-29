import React from "react";
import styles from "./TrainingsTable.module.css";

const TrainingsTable = ({ fetchedData }) => {
  let data = fetchedData;

  const formatData = (data) => {
    if (data.length === 0) {
      return [
        {
          Name: "NA",
          Description: "NA",
          "Remaining Slots": "NA",
          "Started At": "NA",
          "Ends At": "NA",
        },
      ];
    }

    const currentTime = new Date();

    return data
      .filter((item) => {
        const endsAtTime = new Date(item.date_time_end);
        return endsAtTime > currentTime;
      })
      .map((item) => ({
        Name: item.name,
        Description: item.description,
        "Remaining Slots": item.remaining_slots,
        "Started At": formatDateTime(item.date_time_start),
        "Ends At": formatDateTime(item.date_time_end),
      }));
  };

  const formatDateTime = (dateTimeString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return new Date(dateTimeString)
      .toLocaleString("en-GB", options)
      .toUpperCase();
  };

  const tableData = formatData(data);

  return (
    <>
      <div className={styles.container}>
        <table className={styles.table}>
          <thead>
            <tr>
              {Object.keys(tableData[0]).map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData.map((item, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(item).map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TrainingsTable;
