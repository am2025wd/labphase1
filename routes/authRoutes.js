const express = require("express");
const { check } = require("express-validator");
const { register, login } = require("../controllers/authController");
const router = express.Router();

// Routes d'authentification
router.post(
  "/register",
  [
    check("name", "Le nom est requis").not().isEmpty(),
    check("email", "Veuillez inclure un email valide").isEmail(),
    check(
      "password",
      "Veuillez entrer un mot de passe de 6 caractères ou plus"
    ).isLength({ min: 6 }),
  ],
  register
);

router.post(
  "/login",
  [
    check("email", "Veuillez inclure un email valide").isEmail(),
    check("password", "Le mot de passe est requis").exists(),
  ],
  login
);

module.exports = router;
