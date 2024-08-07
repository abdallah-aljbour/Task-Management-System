const Pool = require("pg").Pool;

// Configure your database connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Task",
  password: "12345",
  port: 5432, // default PostgreSQL port
});
module.exports = pool;
