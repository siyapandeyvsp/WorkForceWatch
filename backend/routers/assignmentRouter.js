const express = require("express");
const Model = require("../models/assignmentModel");
const verifyToken = require("./verifyToken");
const router = express.Router();

router.post("/add", verifyToken, (req, res) => {
  console.log(req.body);
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
    Model.findByIdAndUpdate(req.params.id, req.body) 
    .then((result) => {
      res.status(200).json(result);
      console.log(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
        });
}
);

router.get('/getbyemployee/:id', (req, res) => {
  Model.find({assignedTo: req.params.id}).populate('task')
  .then((result) => {
    res.status(200).json(result);
  }).catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;
