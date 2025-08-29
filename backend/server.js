const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes API
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tasks", require("./routes/taskRoutes"));

// Servir les fichiers statiques en production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "public")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "public", "index.html"));
  });
}

const PORT = process.env.PORT || 10000; // Render utilise le port 10000

app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
