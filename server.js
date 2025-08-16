const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/database");
const taskRoutes = require("./routes/taskRoutes");
const { ClientSession } = require("mongodb");
require("dotenv").config();

// Initialiser l'application Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connecter à la base de données
connectDB();
ClientSession;
// Routes
app.use("/api/tasks", taskRoutes);

// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
