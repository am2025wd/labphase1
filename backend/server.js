const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/database");
const taskRoutes = require("./routes/taskRoutes");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

// Connexion à la base de données
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
// Gestion des erreurs 404 last-ajout
app.use((req, res) => {
  res.status(404).json({ message: "Route non trouvée" });
});
// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Une erreur est survenue sur le serveur" });
});

// Démarrage du serveur
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});

// Gestion des rejets de promesses non gérés
process.on("unhandledRejection", (err) => {
  console.error("Rejet de promesse non géré:", err);
  // Fermer le serveur et sortir du processus
  server.close(() => {
    process.exit(1);
  });
});

// Gestion des exceptions non interceptées
process.on("uncaughtException", (err) => {
  console.error("Exception non interceptée:", err);
  // Fermer le serveur et sortir du processus
  server.close(() => {
    process.exit(1);
  });
});
