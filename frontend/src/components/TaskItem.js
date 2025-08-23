import React, { useState } from "react";
import { updateTask, deleteTask } from "../services/api";

const TaskItem = ({ task, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description,
    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
    priority: task.priority || "medium",
    completed: task.completed,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleToggleComplete = async () => {
    setLoading(true);
    try {
      await updateTask(task._id, { ...task, completed: !task.completed });
      onUpdate();
    } catch (err) {
      setError("Erreur lors de la mise à jour de la tâche");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) {
      setLoading(true);
      try {
        await deleteTask(task._id);
        onUpdate();
      } catch (err) {
        setError("Erreur lors de la suppression de la tâche");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEdit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateTask(task._id, editData);
      setIsEditing(false);
      onUpdate();
    } catch (err) {
      setError("Erreur lors de la mise à jour de la tâche");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Pas de date limite";
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "high":
        return "priority-high";
      case "medium":
        return "priority-medium";
      case "low":
        return "priority-low";
      default:
        return "";
    }
  };

  return (
    <div
      className={`task-item ${
        task.completed ? "completed" : ""
      } ${getPriorityClass(task.priority)}`}
    >
      {error && <div className="error-message">{error}</div>}

      {isEditing ? (
        <form onSubmit={handleEdit} className="task-edit-form">
          <input
            type="text"
            name="title"
            value={editData.title}
            onChange={(e) =>
              setEditData({ ...editData, title: e.target.value })
            }
            required
          />
          <textarea
            name="description"
            value={editData.description}
            onChange={(e) =>
              setEditData({ ...editData, description: e.target.value })
            }
            required
          />
          <div className="form-row">
            <input
              type="date"
              name="dueDate"
              value={editData.dueDate}
              onChange={(e) =>
                setEditData({ ...editData, dueDate: e.target.value })
              }
            />
            <select
              name="priority"
              value={editData.priority}
              onChange={(e) =>
                setEditData({ ...editData, priority: e.target.value })
              }
            >
              <option value="low">Basse</option>
              <option value="medium">Moyenne</option>
              <option value="high">Haute</option>
            </select>
          </div>
          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Enregistrer"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsEditing(false)}
            >
              Annuler
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className="task-header">
            <h3 className={task.completed ? "completed-text" : ""}>
              {task.title}
            </h3>
            <div className="task-priority">{task.priority || "Moyenne"}</div>
          </div>

          <p className="task-description">{task.description}</p>

          <div className="task-meta">
            <div className="task-due-date">
              <i className="far fa-calendar"></i> {formatDate(task.dueDate)}
            </div>
            <div className="task-status">
              {task.completed ? (
                <span className="status-completed">Terminée</span>
              ) : (
                <span className="status-pending">En cours</span>
              )}
            </div>
          </div>

          <div className="task-actions">
            <button
              onClick={handleToggleComplete}
              className={`btn ${
                task.completed ? "btn-secondary" : "btn-success"
              }`}
              disabled={loading}
            >
              {task.completed
                ? "Marquer comme non terminée"
                : "Marquer comme terminée"}
            </button>
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-info"
              disabled={loading}
            >
              Modifier
            </button>
            <button
              onClick={handleDelete}
              className="btn btn-danger"
              disabled={loading}
            >
              Supprimer
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskItem;
