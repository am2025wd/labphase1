const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// @desc    Inscription d'un utilisateur
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  console.log("Tentative d'inscription avec les données:", req.body); //log ajoute
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("Erreurs de validation:", errors.array()); //log ajoute
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe déjà
    console.log("Vérification si l'utilisateur existe déjà..."); // log ajoute
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("L'utilisateur existe déjà"); // log ajoute
      return res.status(400).json({ message: "Cet utilisateur existe déjà" });
    }

    // Créer l'utilisateur
    console.log("Création de l'utilisateur..."); // log ajoute
    const user = await User.create({
      name,
      email,
      password,
    });
    console.log("Utilisateur créé avec succès:", user); // log ajoute
    // Générer le token
    const token = generateToken(user._id);
    console.log("Token généré"); // log ajoute
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error); // ajouter
    res.status(500).json({
      message: "Erreur serveur lors de l'inscription", // ajouter
      error: error.message,
    });
  }
};

// @desc    Connexion d'un utilisateur
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Vérifier le mot de passe
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    // Générer le token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};
