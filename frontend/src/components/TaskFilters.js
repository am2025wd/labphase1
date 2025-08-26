import React from "react";

const TaskFilters = ({ filters, onFilterChange }) => {
  const handleSearchChange = (e) => {
    onFilterChange({ ...filters, search: e.target.value });
  };

  const handleStatusChange = (e) => {
    onFilterChange({ ...filters, status: e.target.value });
  };

  const handlePriorityChange = (e) => {
    onFilterChange({ ...filters, priority: e.target.value });
  };

  return (
    <div className="task-filters">
      <div className="filter-group">
        <label htmlFor="search">Rechercher:</label>
        <input
          type="text"
          id="search"
          value={filters.search || ""}
          onChange={handleSearchChange}
          placeholder="Rechercher une tâche..."
        />
      </div>

      <div className="filter-group">
        <label htmlFor="status">Statut:</label>
        <select
          id="status"
          value={filters.status || "all"}
          onChange={handleStatusChange}
        >
          <option value="all">Toutes</option>
          <option value="active">Actives</option>
          <option value="completed">Terminées</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="priority">Priorité:</label>
        <select
          id="priority"
          value={filters.priority || "all"}
          onChange={handlePriorityChange}
        >
          <option value="all">Toutes</option>
          <option value="low">Basse</option>
          <option value="medium">Moyenne</option>
          <option value="high">Haute</option>
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;
