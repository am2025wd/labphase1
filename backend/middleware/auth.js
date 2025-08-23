const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  // Vérifier si le token est dans l'en-tête Authorization
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Vérifier si le token existe
  if (!token) {
    return res.status(401).json({ message: "Non autorisé, token manquant" });
  }

  try {
    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ajouter l'utilisateur à l'objet req
    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    return res.status(401).json({ message: "Non autorisé, token invalide" });
  }
};

module.exports = { protect };
