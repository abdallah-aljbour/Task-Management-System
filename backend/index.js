const express = require("express");
const app = express();
const cors = require("cors");
const taskController = require("./controllers/taskController");
const bodyParser = require("body-parser");
//middleware

app.use(cors());
app.use(express.json());

//routes
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/tasks", taskController.showTasks);
app.post("/tasks", taskController.createTask);
app.use("/authentication", require("./routes/jwtAuth"));

app.use("/dashboard", require("./routes/dashboard"));

app.listen(5000, () => {
  console.log(`Server is starting on port 5000`);
});
