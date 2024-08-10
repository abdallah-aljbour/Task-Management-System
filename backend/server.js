const express = require("express");
require("dotenv").config();
const cors = require("cors");
const userRoutes = require("./routs/userRoutes");
const taskRoutes = require("./routs/taskRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

//Task Routes
app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 4024;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
