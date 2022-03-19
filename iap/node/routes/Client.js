const Client = require("express").Router();
const connector = require("mysql").createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"GIS",
});
const Protector = require("../middleware/Protector");


// get all equipments that are not taken
Client.get("/getavailable" , Protector , (req , res)=>{
    // authorize user
    if(!req.user){
        res.json({
            error:true,
            message:`No authorized user was found`,
            status:404,
        })
    }
    const { previledge } = req.user;
    if(previledge == "admin"){
        res.json({
            error:true,
            message:`You are currently and admin kindly downgrade to client to access this`,
        })
    }
    // end of auth
    const getAvailableQuerry = "SELECT * FROM equipments where NOT (LENGTH(equipments.whohas) > 0)"
    connector.query(getAvailableQuerry, (error , results , fields)=>{
        if(error){
            res.json({
                error:true,
                message:`Faced an error fetching\n${error}`,
                status:404,
            })
        }
        res.json({
            error:false,
            message:`Got equipments`,
            equipments:results,
        })
    })
});
// request for an equipment
Client.get("/borrow/:equipmentID" , Protect , (req , res)=>{
    // authorize user
    if(!req.user){
        res.json({
            error:true,
            message:`No authorized user was found`,
            status:404,
        })
    }
    const { previledge } = req.user;
    if(previledge == "admin"){
        res.json({
            error:true,
            message:`You are currently and admin kindly downgrade to client to access this`,
        })
    }
    // end of auth
    const { equipmentID } = req.params;
    if(!equipmentID){
        res.json({
            error:false,
            message:`Equipment id was not was not passed`,
        })
    }

    const checkQuerry = "SELECT state, taken , requested , whohas FROM equipments where equipments.equipmentID='"+equipmentID+"'"
    connector.query(checkQuerry , (error , results , fields)=>{
        if(error){
            res.json({
                error:true,
                message:`Faced an sql error\${error}`,
                status:404,
            });
        }
        const { state , taken , requested , whohas } = results[0];
        if(!(state == "present") && !(requested == "false") && !whohas.length == 0){
            res.json({
                error:true,
                message:`Equipment has already been booked`,
            })
        }
    });
})
// return an equipments


module.exports = Client;