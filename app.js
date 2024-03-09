const express = require("express");
const bodyParser = require('body-parser')

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));

const studentRoute = require('./route/student.js');
app.use("/student",studentRoute);


app.get("/hello",(req, res)=>{
    res.send("hello SE");
})

app.listen(8080,()=>{
    console.log("Server is running on port 8080");
})