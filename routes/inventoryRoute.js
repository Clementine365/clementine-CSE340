// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route for displaying vehicle details based on inventory_id
/* Route for displaying a specific vehicle's details */
router.get('/vehicle/:vehicleId', invController.viewVehicleDetail);
//router.get('/details/:id', invController.getVehicleDetails);
module.exports = router;
