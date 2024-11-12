const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE).then(
    result=>{
        console.log("mongodb Atlas connection with pfServer");
    }
).catch(err=>{
    console.log("connection Failed!!");
    console.log(err);
})