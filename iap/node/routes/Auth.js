const Auth = require("express").Router();
const expressAsynchHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const uuid = require("uuid").v4;
const conn = require("../components/connector");

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
                    message:`Invalid details sent.User does not exist\n${error}`,
                }),
            })
        }
        if(typeof result != "undefined" && result.length > 0){
            // const usersData = {
            //     ...
            // };
            console.log(result,result.length);
            const { userID , email} = result[0];
            const gainedPassword = result[0].password;
            if(password == gainedPassword){
                res.json({
                    ...ResponseFunction({
                        error:false,
                        message:`Login successful for user with email ${email}`,
                        token:generateJWT({id:userID , operation:"auth"}),
                    })
                })
            }else{
                res.json({
                    ...ResponseFunction({
                        error:true,
                        message:`Login failed.Wrong password.Try again , ${gainedPassword} , ${password}`,
                    })
                })
            }
        } else res.send(result+"invalid credentials");
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

Auth.post("/reset" , Protect , (req , res)=>{
    const { password , userID , email } = req.user[0];
    const {oldPass , newPass } = req.body;
    if(!(oldPass && newPass)){
        res.json({
            error:true,
            message:`Old or new password was not passed`,
        });
    }
    console.log("end point hit");
    if(password == oldPass){
        const updateQuerry = "UPDATE users SET users.password='"+newPass+"' WHERE users.userID='"+userID+"'";
        conn.query(updateQuerry ,(error)=>{
            if(error){
                res.json({
                    error:true,
                    message:`Faced some error from the server\n${error}`,
                    status:500,
                })
            }
            res.json({
                error:false,
                message:`Password for ${email} has been updated succesfully`,
                status:200,
            })
        })
    }else{
        res.json({
            error:true,
            message:`Your current password is incorrect`
        })
    }
});


module.exports = Auth;