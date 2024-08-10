const pool = require("../config/db");

//creatTask

exports.createTask = async (req, res) => {
  try {
    const { task_name, task_description } = req.body;
    const userId = req.user.id;
    const result = await pool.query(
      "INSERT INTO TASKS (title, description, user_id) VALUES ($1, $2, $3) RETURNING *",
      [task_name, task_description, userId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//Get Task Depending User Id

exports.getUserTasks = async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from authenticated request
    const result = await pool.query("SELECT * FROM TASKS WHERE user_id = $1", [
      userId,
    ]);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//update Task

exports.updateTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id); // Get task ID from URL parameters
    const { task_name, task_description } = req.body; // Get updated task data from request body
    const userId = req.user.id; // Get user ID from authenticated request

    // Check if task exists and belongs to the user
    const checkResult = await pool.query(
      "SELECT * FROM TASKS WHERE id = $1 AND user_id = $2",
      [taskId, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        error:
          "Task not found or you don't have permission to update this task",
      });
    }

    // Update the task deppending in id task and uuid(user_id)
    const result = await pool.query(
      "UPDATE TASKS SET title = $1, description = $2 WHERE id = $3 RETURNING *",
      [task_name, task_description, taskId]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//delete Task deppending in id task and uuid(user_id)

exports.deleteTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const userId = req.user.id;

    // Check if the task exists and belongs to the user
    const checkResult = await pool.query(
      "SELECT * FROM TASKS WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL",
      [taskId, userId]
    );

    if (checkResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Task not found or no permission to delete" });
    }

    // Soft delete the task
    await pool.query("UPDATE TASKS SET deleted_at = NOW() WHERE id = $1", [
      taskId,
    ]);

    res.status(204).send(); // No content response
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({ error: error.message });
  }
};
