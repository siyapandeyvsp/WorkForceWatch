const express=require('express');
const Model=require('../models/companyModel');
const router = express.Router();

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
router.post('/authenticate',(req,res)=>{
    Model.findOne(req.body)
    .then((result) => {
       if(result){
    const {_id , name , email}=result;
  //  const payload={ _id,name,email };
    const payload={ _id,name,email,role };
    
    jwt.sign(
        payload,
        process.env.JWT_SECRET,
         {expiresIn:'2 Days'},
         (err,token)=>{
            if(err){
                console.log(err);
                res.status(500).json({message:'error generating jwt'});
            }else{
                res.status(200).json({token,role})
            }
         }
        
        )
    
       
     } else{
        res.status(401).json({message:'Invalid credentials'})
       } 
    }).catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
    
    });

module.exports=router