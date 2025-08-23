const express = require("express");
const { protect } = require("../middleware/auth");
const {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");
const router = express.Router();

// Appliquer le middleware d'authentification à toutes les routes
router.use(protect);

router.route("/").post(createTask).get(getAllTasks);

router.route("/:id").get(getTaskById).put(updateTask).delete(deleteTask);

module.exports = router;
