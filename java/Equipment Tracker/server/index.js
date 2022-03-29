const express = require("express");
const mysql = require("mysql");
const port = 4800 || process.env.PORT;
const app = express();
const Server = require("http").createServer(app);
const path = require("path");
const Auth= require("./routes/Auth");
const Admin = require("./routes/Admin");
const Client = require("./routes/Client");
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
app.use("/admin",Admin);
app.use("/client",Client);
// end of middleware

app.get("/" , (req , res)=>{
    res.send("Welcome to our java app\nThis is the server side\nBuilt with love by\n1.Ezra kipyegon C026-01-0739/2020\n2.Sally Muthoni C026-01-0688/202\n3.John Mwangi C026-01-0682/2020\n4.Emmanuel Nakitare C026-01-0737/2020");
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