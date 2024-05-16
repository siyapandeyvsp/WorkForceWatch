import axios from "axios";

const { createContext, useEffect, useContext, useState } = require("react");

const WorkSessionContext = createContext();

export const WorkSessionProvider = ({ children }) => {
  const [currentWorkSession, setCurrentWorkSession] = useState(null);
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(sessionStorage.getItem("user"))
  );

  const createNewWorkession = () => {
    fetch("http://localhost:5000/worksession/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId: currentUser._id
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentWorkSession(data);
      });
  };

  const checkOut = () => {
    fetch(`http://localhost:5000/worksession/update/${currentWorkSession._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        checkOutTime: new Date(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setCurrentWorkSession(null);
      });
  }

  return (
    <WorkSessionContext.Provider value={{}}>
      {children}
    </WorkSessionContext.Provider>
  );
};

const useWorkSessionContext = () => useContext(WorkSessionContext);
export default useWorkSessionContext;
