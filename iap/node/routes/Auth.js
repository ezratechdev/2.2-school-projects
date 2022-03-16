const Auth = require("express").Router();
const expressAsynchHandler = require("express-async-handler");
const bcrpt = require("bcryptjs");
const conn = require("mysql").createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"GIS",
});

const {ResponseFunction}  = require("../components/Response");

// post requests
Auth.post("/signup",expressAsynchHandler(async(req , res)=>{
    const { identity , email , password , previledge , username } = req.body;
    // check for details
    if(!(identity && email && password && previledge && username)){
        res.json({
            ...ResponseFunction({
                error:true,
                message:"Username , email or password was not passed",
            }),
        })
    }

    // create a user and push the user to database
    const salt = await bcrpt.genSalt(10);
    const hashedPassword = await bcrpt.hash(password,salt);

    const createUserStatement = `INSERT INTO users (username ,identity , email , previledge , password) VALUES('${username}', '${identity}', '${email}', '${previledge}', '${hashedPassword}')`;
    // const createUserStatement = "INSERT INTO text (username) values ('"+email+"')";

    conn.query(createUserStatement ,error=>{
        if(error) {
            // res.json({
            //     ...ResponseFunction({
            //         error:true,
            //         message:"Could not insert new user to database",
            //     })
            // })
            console.log("waah!! \n" , error);
            res.send("sasa utado");
        } else
        res.json({
            ...ResponseFunction({
                error:false,
                message:`User with email ${email} has been created`,
            })
        })
    })

}))




module.exports = Auth;