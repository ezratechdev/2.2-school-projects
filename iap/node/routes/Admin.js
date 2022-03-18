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
// enable account deletion


// protected routes

// get all equipments
Admin.get("/", Protect, (req, res) => {
    if (!req.user) res.json({

        error: true,
        message: `User not found`,

        status: 404,
    });
    // gain previledge
    const { previledge } = req.user;
    if (previledge == "student") {
        res.json({

            error: true,
            message: `You are not authorized to perform this operation`,

        });
    }

    const getEquipments = "SELECT * FROM equipments";
    connector.query(getEquipments,(error , result , fields)=>{
        if(error){
            res.json({
                error:true,
                message:`An error occurred while fetching all equipments\n${error}`,
            })
        }
        res.json({
            error:false,
            message:`Equipments data obtained`,
            equipments:result,
        })
    });

})

// create an equipment
Admin.post("/create", Protect, (req, res) => {
    if (!req.user) res.json({

        error: true,
        message: `User not found`,

        status: 404,
    });
    // gain previledge
    const { previledge } = req.user;
    if (previledge == "student") {
        res.json({

            error: true,
            message: `You are not authorized to perform this operation`,

        })
    }
    // add image later using multer
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

Admin.get("/delete/:id", Protect, (req, res) => {
    if (!req.user) res.json({

        error: true,
        message: `User not found`,

        status: 404,
    });
    // gain previledge
    const { previledge } = req.user;
    if (previledge == "student") {
        res.json({

            error: true,
            message: `You are not authorized to perform this operation`,

        })
    }
    const { id } = req.params;
    if (!id) {
        res.json({

            error: true,
            message: `Equipment id was not found`

        })
    }
    const deleteQuerry = "UPDATE equipments SET state='deleted' WHERE equipmentID='" + id + "'";
    connector.query(deleteQuerry, error => {
        if (error) {
            res.json({

                error: true,
                message: `Unable to delete the equipment\n${error}`,

            });
        }
        res.json({
            error: false,
            message: `Equipment with id ${id} has been deleted`,
        })
    })
});


// update equipment details
Admin.put("/update/:id", Protect, (req, res) => {
    if (!req.user) res.json({

        error: true,
        message: `User not found`,

        status: 404,
    });
    // gain previledge
    const { previledge } = req.user;
    if (previledge == "student") {
        res.json({

            error: true,
            message: `You are not authorized to perform this operation`,

        })
    }
    const { name, description } = req.body;
    const { id } = req.params;
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
        req.json({
            error: false,
            message: `Equipment with id ${id} has been updated`,
            status: 200,
        })
    });
});

// approve equipment 
Admin.get("/approve/:id",Protect,(req ,res)=>{
    if (!req.user) res.json({

        error: true,
        message: `User not found`,

        status: 404,
    });
    // gain previledge
    const { previledge } = req.user;
    if (previledge == "student") {
        res.json({

            error: true,
            message: `You are not authorized to perform this operation`,

        });
    }
    const { id  } = req.params;
    if(!(id)){
        res.json({
            error:true,
            message:`Equipment id and user id not passed`,
            status:404,
        });
    }
    const checkQuerry = "SELECT state ,requested , taken , whohas from equipments WHERE equipments.equipmentID='"+id+"'";
    connector.query(checkQuerry,(error , results , fields)=>{
        if(error){
            res.json({
                error:true,
                message:`Unable to get and verify equipment\n${error}`,
                equipmentID:id,
                userID,
            });
            // ensure equipment is not already reserved
            const { state , requested , taken , whohas } = results[0];
            if(!(state == 'present' && requested == 'false' && taken == 'false') || !whohas.length > 0){
                res.json({
                    error:true,
                    message:`Equipment is already taken and cannot approved as taken as it is already under reservation\nContact admin for further aid`,
                    status:404,
                })
            }else{
                // 
                const approveQuerry = "UPDATE equipments SET state='taken' , requested='true', taken='true' where equipments.equipmentID='"+id+"'";
                connector.query(approveQuerry,(error)=>{
                    if(error){
                        res.json({
                            error:true,
                            message:`Unable to approve equipment transfer\n${error}`,
                            status:500,
                        });
                    }
                    res.json({
                        error:false,
                        message:`Equipment currently under user with id of ${userID}`,
                        userID,
                        id,
                    })
                });
            }
        }
    });
    // 
});


module.exports = Admin;