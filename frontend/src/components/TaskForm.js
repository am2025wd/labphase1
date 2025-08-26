// src/components/TaskForm.js
import React, { useState } from "react";
import { createTask } from "../services/api";

const TaskForm = ({ onTaskCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { title, description, dueDate, priority } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Données du formulaire:", formData);
      await createTask(formData);
      setFormData({
        title: "",
        description: "",
        dueDate: "",
        priority: "medium",
      });

      // Notifier le composant parent qu'une tâche a été créée
      if (onTaskCreated) {
        onTaskCreated();
      }
    } catch (err) {
      console.error("Erreur lors de la création:", err);
      setError(
        err.response?.data?.message || "Erreur lors de la création de la tâche"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <h2>Créer une nouvelle tâche</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={onSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title">Titre *</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={onChange}
            required
            placeholder="Entrez le titre de la tâche"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            name="description"
            value={description}
            onChange={onChange}
            required
            placeholder="Décrivez votre tâche"
            rows="3"
          ></textarea>
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Date limite</label>
          <input
            type="date"
            id="dueDate"
            name="dueDate"
            value={dueDate}
            onChange={onChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priorité</label>
          <select
            id="priority"
            name="priority"
            value={priority}
            onChange={onChange}
          >
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Haute</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Création en cours..." : "Ajouter la tâche"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
