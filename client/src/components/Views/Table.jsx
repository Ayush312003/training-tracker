import React, { useEffect, useState } from "react";
import TableCSS from "./Table.module.css";
import Cookies from "js-cookie";

const Table = ({ tableName, trainingId }) => {
  const [userData, setUserData] = useState([]);
  const storedToken = Cookies.get("token");
  useEffect(() => {
    if (storedToken) {
      // set options
      const options = {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
      };

      if (tableName == "Applied Users") {
        fetch(
          `http://localhost:5000/admin/trainings/${trainingId}/applicants`,
          options
        )
          .then((response) => {
            if (response.status == 200) {
              return response.json();
            }
          })
          .then((data) => {
            setUserData(data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      } else {
        fetch(
          `http://localhost:5000/admin/trainings/${trainingId}/interested`,
          options
        )
          .then((response) => {
            if (response.status == 200) {
              return response.json();
            }
          })
          .then((data) => {
            setUserData(data);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }
    }
  }, [storedToken]);

  return (
    <>
      <div className={TableCSS.wrapper}>
        <div className={TableCSS.container}>
          <div className={TableCSS.header}>
            <h1>{tableName}</h1>
          </div>
          <div className={TableCSS.items}>
            {userData.map((user, index) => (
              <div key={index} className={TableCSS.item}>
                {user.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Table;
