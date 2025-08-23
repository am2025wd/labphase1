const Task = require("../models/taskModel");

// @desc    Créer une tâche
// @route   POST /api/tasks
// @access  Privé
exports.createTask = async (req, res) => {
  try {
    // Ajouter l'utilisateur connecté à la tâche
    req.body.user = req.user.id;

    const task = await Task.create(req.body);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Obtenir toutes les tâches de l'utilisateur
// @route   GET /api/tasks
// @access  Privé
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir une tâche par ID
// @route   GET /api/tasks/:id
// @access  Privé
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Vérifier si la tâche appartient à l'utilisateur
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Mettre à jour une tâche
// @route   PUT /api/tasks/:id
// @access  Privé
exports.updateTask = async (req, res) => {
  try {
    let task = await Task.findById(req.params.id);

    // Vérifier si la tâche appartient à l'utilisateur
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Supprimer une tâche
// @route   DELETE /api/tasks/:id
// @access  Privé
// controllers/taskController.js
// Correction de la methode de suppression
exports.deleteTask = async (req, res) => {
  try {
    console.log("Tentative de suppression de la tâche avec ID:", req.params.id);
    console.log(
      "Utilisateur connecté:",
      req.user ? req.user.id : "Non authentifié"
    );

    const task = await Task.findById(req.params.id);

    if (!task) {
      console.log("Tâche non trouvée dans la base de données");
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    console.log("Tâche trouvée:", task);
    console.log("Propriétaire de la tâche:", task.user);
    console.log("ID utilisateur connecté:", req.user.id);

    // Vérifier si la tâche appartient à l'utilisateur
    if (task.user.toString() !== req.user.id) {
      console.log("Tentative de suppression non autorisée");
      return res
        .status(403)
        .json({ message: "Non autorisé à supprimer cette tâche" });
    }

    // Utiliser deleteOne au lieu de remove (obsolète dans les versions récentes)
    await Task.deleteOne({ _id: req.params.id });
    console.log("Tâche supprimée avec succès");

    res.status(200).json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    console.error("Erreur lors de la suppression de la tâche:", error);
    res.status(500).json({
      message: "Erreur lors de la suppression de la tâche",
      error: error.message,
    });
  }
};
