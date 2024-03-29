import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import styles from "./Admin.module.css";
const MyCalendar = () => {
  const [date, setDate] = useState(new Date());

  return (
    <div className={styles.calenderContainer}>
      <Calendar
        onChange={setDate}
        value={date}
        tileClassName={({ date, view }) =>
          view === "month" && date.toDateString() === new Date().toDateString()
            ? "highlight-today"
            : null
        }
        tileSize={{ width: 30, height: 30 }}
      />
    </div>
  );
};

export default MyCalendar;
