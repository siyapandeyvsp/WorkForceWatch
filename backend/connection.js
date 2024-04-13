
//
const mongoose = require('mongoose');

//this is the connection string to the database
//add the password and the database name after the / and before the ?retryWrites
const url='mongodb+srv://siyapandeyvsp:siyapandeyvsp@cluster0.wuq14bn.mongodb.net/workforcewatchdb?retryWrites=true&w=majority&appName=Cluster0'

//asynch functions - return Promise
mongoose.connect(url)
//thenc is short for then catch
//used for promise and async
.then((result) => {
    // connection result 
    console.log('connected to the database');
}).catch((err) => {
    //connection error
    console.log('error connecting to the database');
});

module.exports=mongoose;