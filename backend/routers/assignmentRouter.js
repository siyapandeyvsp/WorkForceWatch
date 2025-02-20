const express = require("express");
const Model = require("../models/assignmentModel");
const verifyToken = require("./verifyToken");
const router = express.Router();

router.post("/add", verifyToken, (req, res) => {
  console.log(req.body);
  new Model(req.body)
    .save()
    .then((result) => {
      res.status(200).json({ message: "Assignment added successfully", result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to add assignment", error: err });
    });
});

router.get("/getall", (req, res) => {
  Model.find()
    .then((result) => {
      res.status(200).json({ message: "Assignments fetched successfully", result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to fetch assignments", error: err });
    });
});

router.delete("/delete/:id", (req, res) => {
  Model.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(200).json({ message: "Assignment deleted successfully", result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to delete assignment", error: err });
    });
});

router.put("/update/:id", (req, res) => {
  Model.findByIdAndUpdate(req.params.id, req.body)
    .then((result) => {
      res.status(200).json({ message: "Assignment updated successfully", result });
      console.log(result);
    }).catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to update assignment", error: err });
    });
});

router.get('/getbyemployee/:id', (req, res) => {
  Model.find({ assignedTo: req.params.id })
    .populate({
      path: 'task',
      populate: {
        path: 'assignedBy',
        model: 'UserCollection',
        select: 'email name avatar companyId role createdAt' // Explicitly specify the fields to be selected
      }
    })
    .then((result) => {
      console.log("assignmentRouter getbyemployee", result);
      res.status(200).json({ message: "Assignments fetched successfully", result });
    }).catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Failed to fetch assignments", error: err });
    });
});

module.exports = router;
