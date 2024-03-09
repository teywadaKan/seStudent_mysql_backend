const mysql = require('mysql');
const express = require('express');
const { error } = require('console');

const route = express.Router();

const pool = mysql.createConnection({
    host : "202.28.34.197",
    user : "web65_64011212232",
    password : "64011212232@csmsu",
    database: "web65_64011212232"
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
            "SELECT student.std_id, student.nickname,prefix_name.prefix,student.name,DATE_FORMAT(student.birthdate, '%Y-%m-%d') AS birthdate,TIMESTAMPDIFF(YEAR, student.birthdate, CURDATE()) AS age "
            +"FROM student,prefix_name "
            +"WHERE student.prefix = prefix_name.pid;"
            ,(error, results, fields)=>{
                if (error) {
                    console.error('Error executing query:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                const formatRows = results.map(row =>{
                    return{
                        "student_id": Number(row.std_id),
                        "prefix_name":row.prefix,
                        "name": row.name,
                        "nickname": row.nickname,
                        "birthdate": row.birthdate,
                        "age": Number(row.age)
        
                    }
                });
                res.status(200).json(formatRows);
                // console.log('Query results:', results);
                // console.log('Field metadata:', fields);
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
            "INSERT INTO student (sid,std_id, nickname, prefix, name, birthdate) VALUES (NULL,?,?,?,?,?)",
            [std_id,nickname,sprefix,name,birthday],
            (error,results,fields)=>{
                if(error){
                    return;
                }
                res.status(200).send({message:"insert complete"});
            }
            );
        
    } catch (error) {
        console.error(e);
        res.status(500).json({ e: 'Internal Server Error' });
    }
})

route.post("/deleteStudent",async(req, res)=>{
    const {std_id} = req.body;
    try {
        pool.query(
            "DELETE FROM student where std_id = ?",
            [std_id],
            (error,results,fields)=>{
                if(error){
                    console.error('Error executing query:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                res.status(200).send({message:"delete complete"});
            });
    } catch (error) {
        console.error(e);
        res.status(500).json({ e: 'Internal Server Error' });
    }
})

route.post("/searchStudent",async(req, res)=>{
    const { std_id, name, nickname, prefix_name, birthdate } = req.body;
    try {
        pool.query(
            "SELECT student.std_id, student.nickname,prefix_name.prefix,student.name,DATE_FORMAT(student.birthdate, '%Y-%m-%d') AS birthdate,TIMESTAMPDIFF(YEAR, student.birthdate, CURDATE()) AS age"
            +" FROM student,prefix_name" 
            +" WHERE student.prefix = prefix_name.pid"
            +" AND (student.std_id LIKE ? OR student.`name` LIKE ?" 
            +" OR student.nickname LIKE ? OR prefix_name.prefix LIKE ?" 
            +" OR birthdate LIKE ?)",
            ['%' + std_id + '%', '%' + name + '%', '%' + nickname + '%', '%' + prefix_name + '%', '%' + birthdate + '%'],
            (error,results,fields)=>{
                if(error){
                    console.error('Error executing query:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                const formatRows = results.map(row =>{
                    return{
                        "student_id": Number(row.std_id),
                        "prefix_name":row.prefix,
                        "name": row.name,
                        "nickname": row.nickname,
                        "birthdate": row.birthdate,
                        "age": Number(row.age)
        
                    }
                });
                res.status(200).json(formatRows);

            })
    } catch (error) {
        console.error(e);
        res.status(500).json({ e: 'Internal Server Error' });
    }
})

route.post("/updateStudent", async (req, res) => {
    const { std_id, name, nickname, prefix_name, birthdate } = req.body;
    try {
        pool.query(
            "UPDATE student " +
            "SET name = ?, nickname = ?, prefix = ?, birthdate = ? " +
            "WHERE std_id = ?",
            [name, nickname, prefix_name, birthdate, std_id],
            (error, results, fields) => {
                if (error) {
                    console.error('Error executing query:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                    return;
                }
                res.status(200).json({ message: 'Student updated successfully' });
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = route;