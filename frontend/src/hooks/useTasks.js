// src/hooks/useTasks.js
import { useState, useEffect, useCallback, useMemo } from "react";
import { getTasks } from "../services/api";

const useTasks = (filters = {}, sortOptions = {}, refreshTrigger = 0) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mémoriser les paramètres de requête pour éviter de les reconstruire inutilement
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();

    // Ajouter les filtres
    if (filters.search) params.append("search", filters.search);
    if (filters.status && filters.status !== "all")
      params.append("status", filters.status);
    if (filters.priority && filters.priority !== "all")
      params.append("priority", filters.priority);

    // Ajouter les options de tri
    if (sortOptions.sortBy) params.append("sortBy", sortOptions.sortBy);
    if (sortOptions.order) params.append("order", sortOptions.order);

    return params.toString();
  }, [filters, sortOptions]);

  // Utiliser useCallback pour mémoriser la fonction fetchTasks
  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Construire l'URL complète avec /tasks
      const url = `/tasks${queryParams ? `?${queryParams}` : ""}`;
      console.log("URL de la requête:", url); // Log pour débogage

      const tasksData = await getTasks(url);
      setTasks(tasksData);
    } catch (err) {
      console.error("Erreur lors de la récupération des tâches:", err);
      setError(
        err.response?.data?.message ||
          "Erreur lors de la récupération des tâches"
      );
    } finally {
      setLoading(false);
    }
  }, [queryParams]); // Dépendance unique : queryParams

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks, refreshTrigger]); // Ajout de refreshTrigger comme dépendance

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
  };
};

export default useTasks;
