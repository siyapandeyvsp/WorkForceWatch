const express = require("express");
const Model = require("../models/taskModel");
const verifyToken = require("./verifyToken");
const router = express.Router();

router.post("/add", verifyToken, (req, res) => {
  req.body.assignedBy = req.user._id;
  console.log(req.body);
  new Model(req.body)
    .save()
    .then((result) => {
      res.status(200).json({ message: "Task added successfully", result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to add task", error: err });
    });
});

router.get("/getall", (req, res) => {
  console.log("GET /getall API hit");
  Model.find()
    .populate('assignedBy', 'email name avatar companyId role createdAt')
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Tasks fetched successfully", data:result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to fetch tasks", error: err });
    });
});

router.get('/getbyuser', verifyToken, (req, res) => {
  Model.find({ assignedBy: req.user._id })
    .then((result) => {
      res.status(200).json({ message: "Tasks fetched successfully", result });
    }).catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to fetch tasks", error: err });
    });
});

router.delete("/delete/:id", (req, res) => {
  Model.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(200).json({ message: "Task deleted successfully", result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to delete task", error: err });
    });
});

router.put("/update/:id", (req, res) => {
  Model.findByIdAndUpdate(req.params.id, req.body)
    .then((result) => {
      res.status(200).json({ message: "Task updated successfully", result });
      console.log(result);
    }).catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to update task", error: err });
    });
});

router.get("/getbyemployee/:id", (req, res) => {
  Model.find({ employeeId: req.params.id })
    .then((result) => {
      console.log("taskRouter getbyemployee", result);
      res.status(200).json({ message: "Tasks fetched successfully", result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to fetch tasks", error: err });
    });
});

router.put("/start/:id", (req, res) => {
  Model.findByIdAndUpdate(req.params.id, { startTime: new Date() }, { new: true })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Task started successfully", result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to start task", error: err });
    });
});

router.put("/stop/:id", (req, res) => {
  Model.findById(req.params.id)
    .then((task) => {
      if (!task) return res.status(404).json({ message: "Task not found" });
      task.endTime = new Date();
      task.duration = task.endTime - task.startTime;
      return task.save();
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({ message: "Task stopped successfully", result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to stop task", error: err });
    });
});

module.exports = router;
