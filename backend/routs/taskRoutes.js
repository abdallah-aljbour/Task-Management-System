const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");
const taskController = require("../controller/taskcontroller");

router.post("/creatTask", authenticate, taskController.createTask);
router.get("/getTask", authenticate, taskController.getUserTasks);
router.put("/updateTask/:id", authenticate, taskController.updateTask);
router.delete("/deleteTask/:id", authenticate, taskController.deleteTask);

module.exports = router;
