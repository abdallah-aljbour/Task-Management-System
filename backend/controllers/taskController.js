const taskModel = require("../models/taskModel");

const createTask = async (req, res) => {
  const { user_id, title, description } = req.body;
  try {
    const newTask = await taskModel.createTask(user_id, title, description);
    res.redirect("/tasks");
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
};

const showTasks = async (req, res) => {
  // Implement a method to show tasks if needed
  res.render("index");
};

module.exports = {
  createTask,
  showTasks,
};
