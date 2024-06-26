const Auth = require("express").Router();
const expressAsynchHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const uuid = require("uuid").v4;
const conn = require("mysql").createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"GIS",
});

const {ResponseFunction}  = require("../components/Response");
const Protect = require("../middleware/Protector");

// json web token generator 
const generateJWT = ({id , operation})=>{
    return jwt.sign({ id , operation} , "secretsignkey" ,{expiresIn:'30d'});
}

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
    // 

    // create a unique user id
    const userID = uuid();

    const createUserStatement = `INSERT INTO users (username ,identity , email , previledge , password , userID) VALUES('${username}', '${identity}', '${email.toLowerCase()}', '${previledge}', '${password}' , '${userID}')`;

    conn.query(createUserStatement ,error=>{
        if(error) {
            res.json({
                ...ResponseFunction({
                    error:true,
                    message:"Could not insert new user to database",
                })
            });
        } else
        res.json({
            ...ResponseFunction({
                error:false,
                message:`User with email ${email} has been created`,
                token:generateJWT({ id :userID ,operation :"auth"}),
            })
        })
    })

}));

Auth.post("/login" , expressAsynchHandler(async (req , res)=>{
    const { email , password } = req.body;
    if(!(email && password)){
        res.json({
            ...ResponseFunction({
                error:true,
                message:`Email or password not passed`,
            }),
        })
    }
    const loginQuerry = "Select * FROM users WHERE users.password='"+password+"' AND users.email='"+email+"'";
    conn.query(loginQuerry,(error , result , fields)=>{
        if(error){
            res.json({
                ...ResponseFunction({
                    error:true,
                    message:`An error occured\n${error}`,
                }),
            })
        }
        if(!(typeof result == "undefined")){
            const { userID , email , previledge} = result[0];
            const gainedPassword = result[0].password;
            if(password == gainedPassword){
                res.json({
                    ...ResponseFunction({
                        error:false,
                        message:`Login successful for user with email ${email}`,
                        token:generateJWT({id:userID , operation:"auth"}),
                    }),
                    previledge,
                })
            }else{
                res.json({
                    ...ResponseFunction({
                        error:true,
                        message:`Login failed.Wrong password.Try again , ${gainedPassword} , ${password}`,
                    })
                })
            }
        } else res.json({
            error:true,
            message:`Invalid length of result`,
        });
    });
}));

Auth.post("/getpage" , Protect , (req ,res)=>{
    if(req.user){
       const{ previledge  } = req.user[0];
       res.json({
           error:false,
           message:`User was found , redirect to :${previledge == "student" ? "client page" :"admin page"}`,
           page:`${previledge == "student" ? 'client' : 'admin'}`,
       });
    }else res.json({
        ...ResponseFunction({
            error:true,
            message:`Unable to authorize user as user was not found , try again`,
        }),
    });
} )


Auth.post("/resetpassword" , (req , res)=>{
    const { email , password , newPassword } = req.body;
    if((typeof email == "undefined" || typeof password == "undefined" || typeof newPassword == "undefined")) {
        res.json({
            error:true,
            message:`${((typeof email == "undefined")) ? ((typeof password == "undefined")) ? "email and password" : "email" : "password"} not passed`
        })
    }
    const updateQuerry = "UPDATE users set password='"+newPassword+"' WHERE email='"+email+"' AND password='"+password+"'";
    conn.query(updateQuerry,(error)=>{
        if(error){
            res.json({
                error:true.valueOf,
                message:`Faced an error updating the user's password\n${error}`,
                status:500,
            })
        }
        res.json({
            error:false,
            message:`User password updated successfully`,
            status:200,
        })
    });
})


module.exports = Auth;