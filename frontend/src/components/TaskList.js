import React from "react";
import useTasks from "../hooks/useTasks";
import TaskItem from "./TaskItem";

const TaskList = () => {
  const { tasks, loading, error, refetch } = useTasks();

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
        <h3>Vous n'avez aucune tâche</h3>
        <p>Commencez par créer votre première tâche !</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      <h2>Vos tâches</h2>
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
