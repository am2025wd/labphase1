const express = require("express");
const { protect } = require("../middleware/auth");
const {
  register,
  login,
  getMe,
  debugUser,
} = require("../controllers/authController");
const router = express.Router();

console.log("Chargement de authRoutes"); // Log de débogage

// Routes publiques
router.post("/register", register);
router.post("/login", login);
router.get("/debug", debugUser);

// Route protégée
router.get("/me", protect, getMe);

console.log("Exportation de authRoutes:", typeof router); // Log de débogage
module.exports = router;
