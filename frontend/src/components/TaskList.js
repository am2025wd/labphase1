// src/components/TaskList.js
import React, { useState } from "react";
import useTasks from "../hooks/useTasks";
import TaskItem from "./TaskItem";
import TaskFilters from "./TaskFilters";
import TaskSort from "./TaskSort";

const TaskList = ({ refreshTrigger }) => {
  // État pour les filtres
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    priority: "all",
  });

  // État pour les options de tri
  const [sortOptions, setSortOptions] = useState({
    sortBy: "createdAt",
    order: "desc",
  });

  // Utiliser le hook avec les filtres et options de tri
  const { tasks, loading, error, refetch } = useTasks(
    filters,
    sortOptions,
    refreshTrigger
  );

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (newSortOptions) => {
    setSortOptions(newSortOptions);
  };

  if (loading) {
    return <div className="loading">Chargement des tâches...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
        <button onClick={refetch} className="btn btn-secondary">
          Réessayer
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="empty-state">
        <h3>Aucune tâche trouvée</h3>
        <p>Essayez de modifier vos filtres ou créez une nouvelle tâche !</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <h2>Vos tâches</h2>

      <div className="task-controls">
        <TaskFilters filters={filters} onFilterChange={handleFilterChange} />
        <TaskSort sortOptions={sortOptions} onSortChange={handleSortChange} />
      </div>

      <div className="task-count">
        {tasks.length} tâche{tasks.length > 1 ? "s" : ""}
      </div>

      <div className="tasks-container">
        {tasks.map((task) => (
          <TaskItem key={task._id} task={task} onUpdate={refetch} />
        ))}
      </div>
    </div>
  );
};

export default TaskList;
