import { useState, useEffect } from "react";
import { getTasks } from "../services/api";

const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);

    try {
      const tasksData = await getTasks();
      setTasks(tasksData);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Erreur lors de la récupération des tâches"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
  };
};

export default useTasks;
