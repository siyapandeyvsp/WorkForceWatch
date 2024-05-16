import axios from "axios";

const { createContext, useEffect, useContext, useState } = require("react");

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  const fetchTasks = async () => {
    const response = await axios.get("http://localhost:5000/task/getall");
    console.log(response.data);
    setTasks(response.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <TaskContext.Provider value={{ tasks, setTasks, fetchTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

const useTaskContext = () => useContext(TaskContext);
export default useTaskContext;
