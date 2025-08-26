// routes/taskRoutes.js
const express = require("express");
const { protect } = require("../middleware/auth");
const validateObjectId = require("../middleware/validateObjectId");

// Importation individuelle des fonctions du contrôleur
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

console.log("Fonctions importées:", {
  createTask: typeof createTask,
  getAllTasks: typeof getAllTasks,
  getTaskById: typeof getTaskById,
  updateTask: typeof updateTask,
  deleteTask: typeof deleteTask,
});

const router = express.Router();

// Appliquer le middleware d'authentification à toutes les routes
router.use(protect);

// Routes pour les tâches
router.route("/").post(createTask).get(getAllTasks);

// Routes pour les tâches spécifiques
router
  .route("/:id")
  .get(validateObjectId, getTaskById)
  .put(validateObjectId, updateTask)
  .delete(validateObjectId, deleteTask);

module.exports = router;
