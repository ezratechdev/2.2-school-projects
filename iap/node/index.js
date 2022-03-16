const express = require("express");
const mysql = require("mysql");
const port = 5000 || process.env.PORT;
const app = express();
const Server = require("http").createServer(app);
const path = require("path");
const Auth= require("./routes/Auth");
const {ResponseFunction} = require("./components/Response");
// create a connection to the database
const connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"GIS",
});

// middleware
app.use(express.json());
app.use(express.static(path.join(__dirname+"/public")));
app.use(express.urlencoded({extended:true}));
// custom paths
app.use("/auth",Auth);

app.get("/" , (req , res)=>{
    const INSERT = "INSERT INTO text (text) values ('hi')";
    // connection.query(INSERT,error=>{
    //     if(error) throw new Error(`Unable to insert record : error \n${error}`);
    //     else console.log("Record inserted");
    // });
    res.sendFile("index.html");
})


// default response for unknown paths
app.use((req , res)=>{
    res.json({
        ...ResponseFunction({
            error:true,
            message:`Route not found`,
        })
    })
})

connection.connect(error =>{
    if(error) throw new Error(`Faced an error connecting to sql : ${error}`);
    // if connection to database is made then start listening to port
    console.log("Connection to database made");
    Server.listen(port , error => error ? console.log(`Error faced ${error}`) : console.log(`Server runnig on port ${port}`));
})



// 