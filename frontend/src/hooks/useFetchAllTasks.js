// hooks/useFetchTasks.js

import { useState, useEffect } from 'react';
import axios from 'axios';

export const useFetchAllTasks = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await axios.get("http://localhost:5000/task/getall");
      console.log(response.data);
      setTasks(response.data);
    };

    fetchTasks();
  }, []);

  return tasks;
};