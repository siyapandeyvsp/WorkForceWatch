const express=require('express');
const Model=require('../models/employeeModel');
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();
router.post('/add',(req,res)=>{
    console.log(req.body);
    new Model(req.body)
    .save()
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/getall',(req,res)=>{
    Model.find()
    .then((result) => {
        res.status(200).json(result)
    }).catch((err) => {
        console.log(err)
        res.status(500).json(err)
    });
});

router.delete('/delete/:id',(req,res)=>{
Model.findByIdAndDelete(req.params.id)
.then((result) => {
    res.status(200).json(result);
}).catch((err) => {
    console.log(err);
    res.status(500).json(err)
});
});
router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});


router.post("/authenticate", (req, res) => {
    Model.findOne(req.body)
      .then((result) => {
        if (result) {
          const { _id, name, email, role, avatar } = result;
          const payload = { _id, name, email, role };
  
          jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: "2 Days" },
            (err, token) => {
              if (err) {
                console.log(err);
                res.status(500).json({ message: "error generating jwt" });
              } else {
                res.status(200).json({ token, role , name, _id, email,avatar });
              }
            }
          );
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  });

  router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});  
module.exports=router