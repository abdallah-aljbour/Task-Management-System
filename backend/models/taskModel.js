const pool = require("../config/db");

const createTask = async (userId, title, description, createdAt) => {
  const result = await pool.query(
    "INSERT INTO public.tasks (user_id, title, description, created_at) VALUES ($1, $2, $3, $4) RETURNING *",
    [userId, title, description, createdAt]
  );
  return result.rows[0];
};

module.exports = {
  createTask,
};
