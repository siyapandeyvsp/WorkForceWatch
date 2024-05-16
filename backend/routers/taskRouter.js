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

router.get('/getbyuser', verifyToken, (req, res) => {
  Model.find({assignedBy: req.user._id})
  .then((result) => {
    res.status(200).json(result);
  }).catch((err) => {
    console.log(err);
    res.status(500).json(err);
  });
})



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
module.exports = router;
