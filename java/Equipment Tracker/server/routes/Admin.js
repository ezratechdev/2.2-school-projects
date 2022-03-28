const Admin = require("express").Router();
const Protect = require("../middleware/Protector");
// const ResponseFunction = require("../components/Response");
const connector = require("mysql").createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "GIS",
});
const uuid = require("uuid").v4;


// to do 

// protected routes
//  // changes made from the iap backend server // //
// removed the protect middle ware
// removed the user check obj

// get all equipments
Admin.post("/getallpost", (req , res)=>{
    res.status(307).redirect("/getall")
});

// 
Admin.post("/getall", (req, res) => {


    const getEquipments = "SELECT * FROM equipments";
    connector.query(getEquipments, (error, result, fields) => {
        if (error) {
            res.json({
                error: true,
                message: `An error occurred while fetching all equipments\n${error}`,
            })
        }
        // console.log(result);
        res.json({
            error: false,
            message: `Equipments data obtained`,
            equipments: result,
        })
    });

});

// get single

Admin.get("/getsingle/:id", (req, res) => {
    const { id } = req.params;

    if (!id) {
        res.json({
            error: true,
            message: `Equipment id was not passed`,
            status: 404,
        })
    }

    const getEquipments = "SELECT * FROM equipments WHERE equipments.equipmentID='" + id + "'";
    connector.query(getEquipments, (error, result, fields) => {
        if (error) {
            res.json({
                error: true,
                message: `An error occurred while fetching all equipments\n${error}`,
            })
        }
        // console.log(result);
        res.json({
            error: false,
            message: `Equipments data obtained`,
            equipments: result,
        })
    });

});
// 

// create an equipment
Admin.post("/create", (req, res) => {
    const { name, description } = req.body;
    if (!(name && description)) {
        res.json({

            error: true,
            message: `Some or all details were not sent`,

        })
    }
    // generate id
    const equipmentID = uuid();
    // push data to database
    const insertQuerry = "INSERT INTO equipments (name , description , equipmentID , state , taken , requested ,whohas ) VALUES ('" + name + "' ,'" + description + "' ,'" + equipmentID + "' , 'present' , 'false' ,'false' ,'')";
    connector.query(insertQuerry, (error) => {
        if (error) {
            res.json({

                error: true,
                message: `Unable to create equipment on database\n${error}`,

            })
        } res.json({

            error: false,
            message: `Equipment with id of ${equipmentID} has been created`,
            id: equipmentID,
        })
    })

});

// delete equipment

Admin.post("/delete", (req, res) => {
    const { id } = req.body;
    if (!id) {
        res.json({

            error: true,
            message: `Equipment id was not found`

        })
    }
    const deleteQuerry = "UPDATE equipments SET state='deleted' WHERE equipmentID='" + id + "'";
    const restoreQuerry = "UPDATE equipments SET state='present' WHERE equipmentID='" + id + "'";
    const getQuerry = "SELECT * FROM equipments WHERE equipments.equipmentID='" + id + "'";
    connector.query(getQuerry, (error, result, fields) => {
        if (error) {
            res.json({
                error: true,
                message: `Unable to fetch equipment to delete`,
                status: 404,
            })
        }
        const { state } = result[0];

        // toggle state
        connector.query(`${state == "present" ? deleteQuerry : restoreQuerry}`, error => {
            if (error) {
                res.json({

                    error: true,
                    message: `Unable to ${state == "present" ? "delete" : "restore"} the equipment\n${error}`,

                });
            }
            res.json({
                error: false,
                message: `Equipment with id ${id} has been ${state == "present" ? "deleted" : "restored"}`,
            })
        });
    })

});




// update equipment details
Admin.post("/update", (req, res) => {
    const { name, description , id } = req.body;
    if (!(name && description) && !id) {
        res.json({
            error: true,
            message: `Id , name or description not passed.Try again and fill all fields`,
        })
    }
    const updateQuerry = "UPDATE equipments SET name='" + name + "' , description='" + description + "' WHERE equipmentID='" + id + "'";
    connector.query(updateQuerry, error => {
        if (error) {
            res.json({
                error: true,
                status: 500,
                message: `Unable to update equipment\n${error}`,
            })
        }
        res.json({
            error: false,
            message: `Equipment with id ${id} has been updated`,
            status: 200,
        })
    });
});

// approve equipment 
Admin.post("/approve", (req, res) => {
    const { id } = req.body;
    if (!(id)) {
        res.json({
            error: true,
            message: `Equipment id not passed`,
            status: 404,
        });
    }
    const approveQuerry = "UPDATE equipments SET taken='true' where (equipments.equipmentID='"+id+"') AND (equipments.taken='false') AND (equipments.state='present') AND (equipments.requested='true')";
    connector.query(approveQuerry, (error) => {
        if (error) {
            res.json({
                error: true,
                message: `Unable to approve equipment transfer\n${error}`,
                status: 500,
            });
        }
        res.json({
            error: false,
            message: `Equipment has been assigned to a student`,
            id,
        })
    });
})


// approve equipment 
Admin.post("/return", (req, res) => {
    const { id } = req.body;
    if (!(id)) {
        res.json({
            error: true,
            message: `Equipment id not passed`,
            status: 404,
        });
    }
    const approveQuerry = "UPDATE equipments SET taken='false' , whohas='' , requested='false'  where (equipments.equipmentID='"+id+"') AND (equipments.taken='true') AND (equipments.state='present') AND (equipments.requested='true')";
    connector.query(approveQuerry, (error) => {
        if (error) {
            res.json({
                error: true,
                message: `Unable to approve equipment return\n${error}`,
                status: 500,
            });
        }
        res.json({
            error: false,
            message: `Equipment has been relinquished from student and is now back in the inventory`,
            id,
        })
    });
});

Admin.post("/permanentRemove" ,(req , res)=>{
    const { id } = req.body;
    if(!id){
        res.json({
            error:true,
            message:`Did not find the id`,
        })
    }

    const deleteMe = "DELETE FROM equipments WHERE equipments.equipmentID ='"+id+"'";
    connector.query(deleteMe,error =>{
        if(error){
            res.json({
                error:true,
                message:`Unable to delete due to server error\n${error}`,
                status:500,
            })
        }
        res.json({
            error:false,
            message:`The equipment has been deleted`,
            status:200,
        })
    })
})

module.exports = Admin;