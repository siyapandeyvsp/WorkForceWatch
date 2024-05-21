const express = require("express");
const router = express.Router();
const Model = require("../models/workSessionModel");
const verifyToken = require("./verifyToken");

router.post("/add", verifyToken, (req, res) => {
  req.body.employeeId = req.user._id;

  // Calculate the duration
  const checkInTime = new Date(req.body.checkInTime);
  const checkOutTime = new Date(req.body.checkOutTime);
  req.body.duration = checkOutTime - checkInTime;

  new Model(req.body)
    .save()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/getall", (req, res) => {
  Model.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/getbyemployee/:id", (req, res) => {
  Model.find({employeeId: req.params.id})
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/delete/:id", (req, res) => {
  Model.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/update/:id", (req, res) => {
  console.log(req.body);
  Model.findByIdAndUpdate(req.params.id, req.body, {new: true})
    .then((result) => {
      res.status(200).json(result);
      console.log(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
module.exports = router;
