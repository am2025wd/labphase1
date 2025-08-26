// controllers/taskController.js
const Task = require("../models/taskModel");

console.log("Chargement de taskController.js");

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
    // Récupérer les paramètres de requête
    const { status, priority, search, sortBy, order } = req.query;

    // Construire l'objet de filtre
    const filter = { user: req.user.id };

    // Filtrer par statut
    if (status === "completed") {
      filter.completed = true;
    } else if (status === "active") {
      filter.completed = false;
    }

    // Filtrer par priorité
    if (priority && priority !== "all") {
      filter.priority = priority;
    }

    // Filtrer par recherche
    if (search && search.trim() !== "") {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Construire l'objet de tri
    let sort = {};
    if (sortBy) {
      const sortOrder = order === "desc" ? -1 : 1;
      sort[sortBy] = sortOrder;
    } else {
      sort.createdAt = -1;
    }

    console.log("Filtre appliqué:", JSON.stringify(filter, null, 2));
    console.log("Tri appliqué:", sort);

    const tasks = await Task.find(filter).sort(sort);
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Erreur lors de la récupération des tâches:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Obtenir une tâche par ID
// @route   GET /api/tasks/:id
// @access  Privé
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

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

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    // Vérifier si la tâche appartient à l'utilisateur
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    // Créer un objet de mise à jour
    const updateFields = {};
    if (req.body.title) updateFields.title = req.body.title;
    if (req.body.description) updateFields.description = req.body.description;
    if (req.body.completed !== undefined)
      updateFields.completed = req.body.completed;
    if (req.body.priority) updateFields.priority = req.body.priority;
    if (req.body.dueDate) updateFields.dueDate = req.body.dueDate;

    task = await Task.findByIdAndUpdate(req.params.id, updateFields, {
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
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Tâche non trouvée" });
    }

    // Vérifier si la tâche appartient à l'utilisateur
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

console.log("Exportation de taskController.js");
