const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Générer un token JWT
const generateToken = (id) => {
  return jwt.sign({ id: id.toString() }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc    Inscription d'un utilisateur
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà" });
    }

    // Créer l'utilisateur
    const user = await User.create({
      name,
      email,
      password,
    });

    // Générer le token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    res.status(500).json({
      message: "Erreur serveur lors de l'inscription",
      error: error.message,
    });
  }
};

// @desc    Connexion d'un utilisateur
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

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
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Erreur lors de la connexion:", error);
    res.status(500).json({
      message: "Erreur serveur lors de la connexion",
      error: error.message,
    });
  }
};

// @desc    Obtenir l'utilisateur connecté
// @route   GET /api/auth/me
// @access  Privé
exports.getMe = async (req, res) => {
  try {
    // L'utilisateur est déjà disponible dans req.user grâce au middleware d'authentification
    const user = await User.findById(req.user.id);

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Déboguer les données utilisateur
// @route   GET /api/auth/debug
// @access  Public
exports.debugUser = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    const formattedUsers = users.map((user) => ({
      id: user._id,
      idType: typeof user._id,
      idString: user._id.toString(),
      name: user.name,
      email: user.email,
    }));

    res.status(200).json({
      message: "Données utilisateur pour débogage",
      users: formattedUsers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

console.log("Exportation de authController"); // Log de débogage
