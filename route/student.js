const mysql = require('mysql');
const express = require('express');
const { error } = require('console');

const route = express.Router();

const pool = mysql.createConnection({
    host:"127.0.0.1",
    user:"root",
    password:"1234",
    database:"studentinfo"
})


pool.connect(function(err, connection) {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    
    console.log('Connected to database successfully!');
});

route.get("/getAllStudent",async(req, res)=>{
    try {
        pool.query(
            "SELECT student.std_id, student.nickname,prefixname.prefix_name,student.name,TIMESTAMPDIFF(YEAR, student.birthday, CURDATE()) AS age "
            +"FROM student,prefixname "
            +"WHERE student.sprefix = prefixname.pid;"
            ,(error, results, fields)=>{
                if (error) {
                    console.error('Error executing query:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                const formatRows = results.map(row =>{
                    return{
                        "student_id": Number(row.std_id),
                        "prefix_name":row.prefix_name,
                        "name": row.name,
                        "nickname": row.nickname,
                        "age": Number(row.age)
        
                    }
                });
                res.status(200).json(formatRows);
                console.log('Query results:', results);
                console.log('Field metadata:', fields);
            });
    } catch (e) {
        console.error(e);
        res.status(500).json({ e: 'Internal Server Error' });
    }
})

route.get("/testStd",(req, res)=>{
    res.send("this api is in student.js");
})


route.post("/saveStudent",async(req, res)=>{
    const {std_id,sprefix,name,nickname,birthday} = req.body;
    // let conn;
    try {
        // conn = await pool.connect();
        pool.query(
            "INSERT INTO student (sid,std_id, nickname, sprefix, name, birthday) VALUES (NULL,?,?,?,?,?)",
            [std_id,nickname,sprefix,name,birthday],
            (error,results,fields)=>{
                if(error){
                    return;
                }
                res.status(200).send("insert complete");
            }
            );
        
    } catch (error) {
        
    }
})



module.exports = route;