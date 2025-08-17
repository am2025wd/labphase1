//PREMIERE PROPOSITION
// const express = require("express");
// const router = express.Router();
// const {
//   createTask,
//   getAllTasks,
//   getTaskById,
//   updateTask,
//   deleteTask,
// } = require("../controllers/taskController");

// // Routes pour les tâches
// router.post("/", createTask);
// router.get("/", getAllTasks);
// router.get("/:id", getTaskById);
// router.put("/:id", updateTask);
// router.delete("/:id", deleteTask);

// module.exports = router;

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
