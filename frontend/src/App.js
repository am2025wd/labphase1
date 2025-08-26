// src/App.js
import React, { useState, useEffect } from "react";
import {
  // BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { login, register, getMe } from "./services/api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Fonction pour rafraîchir les tâches après création/modification/suppression
  const [refreshTasks, setRefreshTasks] = useState(0);
  const refetchTasks = () => {
    setRefreshTasks((prev) => prev + 1);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await getMe();
          setUser(response.user);
        } catch (error) {
          console.error("Token invalide:", error);
          localStorage.removeItem("token");
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");

    try {
      let response;
      if (showLogin) {
        response = await login({
          email: formData.email,
          password: formData.password,
        });
      } else {
        response = await register(formData);
      }

      console.log("Réponse d'authentification:", response);

      // Stocker le token dans le localStorage
      localStorage.setItem("token", response.token);

      // Stocker les informations de l'utilisateur
      setUser(response.user);
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      setAuthError(
        error.response?.data?.message ||
          error.message ||
          "Erreur d'authentification"
      );
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleAuthMode = () => {
    setShowLogin(!showLogin);
    setAuthError("");
  };

  if (loading) {
    return <div className="loading">Chargement...</div>;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Gestionnaire de Tâches</h1>
        {user && (
          <div className="user-info">
            <span>Bonjour, {user.name}</span>
            <button onClick={handleLogout} className="btn btn-logout">
              Déconnexion
            </button>
          </div>
        )}
      </header>

      <main className="app-main">
        {!user ? (
          <div className="auth-container">
            <h2>{showLogin ? "Connexion" : "Inscription"}</h2>
            {authError && <div className="error-message">{authError}</div>}

            <form onSubmit={handleAuth} className="auth-form">
              {!showLogin && (
                <div className="form-group">
                  <label htmlFor="name">Nom</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Mot de passe</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  minLength="6"
                />
              </div>

              <button type="submit" className="btn btn-primary">
                {showLogin ? "Se connecter" : "S'inscrire"}
              </button>
            </form>

            <div className="auth-toggle">
              <button onClick={toggleAuthMode} className="btn-link">
                {showLogin
                  ? "Pas encore de compte ? Inscrivez-vous"
                  : "Déjà un compte ? Connectez-vous"}
              </button>
            </div>
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <TaskForm onTaskCreated={refetchTasks} />
                  <TaskList refreshTrigger={refreshTasks} />
                </>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;
