const express = require("express");
const Model = require("../models/formModel");
const router = express.Router();

router.post("/create", (req, res) => {
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

router.get("/get", (req, res) => {
    Model.find()
        .then((result) => {
        res.status(200).json(result);
        })
        .catch((err) => {
        console.log(err);
        res.status(500).json(err);
        });
    }
);

router.put("/update/:id", (req, res) => {
    Model.findByIdAndUpdate
    (req.params.id, req.body)
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
