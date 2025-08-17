// PREMIERE PROPOSITION
// const Task = require("../models/taskModel");

// // Créer une tâche
// exports.createTask = async (req, res) => {
//   try {
//     // Ajouter l'utilisateur connecté à la tâche
//     req.body.user = req.user.id;

//     const { title, description } = req.body;
//     const task = new Task({ title, description });
//     await task.save();
//     res.status(201).json(task);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Obtenir toutes les tâches
// exports.getAllTasks = async (req, res) => {
//   try {
//     const tasks = await Task.find();
//     res.status(200).json(tasks);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Obtenir une tâche par ID
// exports.getTaskById = async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) {
//       return res.status(404).json({ message: "Tâche non trouvée" });
//     }
//     res.status(200).json(task);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Mettre à jour une tâche
// exports.updateTask = async (req, res) => {
//   try {
//     const { title, description, completed } = req.body;
//     const task = await Task.findByIdAndUpdate(
//       req.params.id,
//       { title, description, completed },
//       { new: true }
//     );
//     if (!task) {
//       return res.status(404).json({ message: "Tâche non trouvée" });
//     }
//     res.status(200).json(task);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Supprimer une tâche
// exports.deleteTask = async (req, res) => {
//   try {
//     const task = await Task.findByIdAndDelete(req.params.id);
//     if (!task) {
//       return res.status(404).json({ message: "Tâche non trouvée" });
//     }
//     res.status(200).json({ message: "Tâche supprimée avec succès" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

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
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    // Vérifier si la tâche appartient à l'utilisateur
    if (task.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Non autorisé" });
    }

    await task.remove();
    res.status(200).json({ message: "Tâche supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
