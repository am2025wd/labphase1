const express = require("express");

const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

// Middlewares
app.use(cors({ origin: "https://taskmanager-frontend-rtuc.onrender.com" }));
app.use(express.json());

// Routes API
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

app.get("/", (req, resp) => {
  resp.send("Hello api");
});
// Servir les fichiers statiques en production

const PORT = process.env.PORT || 10000; // Render utilise le port 10000

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
  console.log();
});
