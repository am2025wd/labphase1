import React from "react";

const TaskSort = ({ sortOptions, onSortChange }) => {
  const handleSortChange = (e) => {
    const [sortBy, order] = e.target.value.split("-");
    onSortChange({ sortBy, order });
  };

  return (
    <div className="task-sort">
      <label htmlFor="sort">Trier par:</label>
      <select
        id="sort"
        value={`${sortOptions.sortBy}-${sortOptions.order}`}
        onChange={handleSortChange}
      >
        <option value="createdAt-desc">Date de création (récent)</option>
        <option value="createdAt-asc">Date de création (ancien)</option>
        <option value="dueDate-asc">Date d'échéance (proche)</option>
        <option value="dueDate-desc">Date d'échéance (loin)</option>
        <option value="priority-asc">Priorité (basse à haute)</option>
        <option value="priority-desc">Priorité (haute à basse)</option>
      </select>
    </div>
  );
};

export default TaskSort;
