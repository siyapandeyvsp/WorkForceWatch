const express = require("express");
const Model = require("../models/formModel");
const router = express.Router();

router.post("/create", (req, res) => {
  console.log(req.body);
  new Model(req.body)
    .save()
    .then((result) => {
      res.status(200).json({ status: 200, message: "Form created successfully", result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: 500, message: "Failed to create form", error: err });
    });
});

router.get("/get", (req, res) => {
  Model.find()
    .then((result) => {
      res.status(200).json({ status: 200, message: "Forms fetched successfully", result });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ status: 500, message: "Failed to fetch forms", error: err });
    });
});

router.put("/update/:id", (req, res) => {
  Model.findByIdAndUpdate(req.params.id, req.body)
    .then((result) => {
      res.status(200).json({ status: 200, message: "Form updated successfully", result });
      console.log(result);
    }).catch((err) => {
      console.log(err);
      res.status(500).json({ status: 500, message: "Failed to update form", error: err });
    });
});

module.exports = router;