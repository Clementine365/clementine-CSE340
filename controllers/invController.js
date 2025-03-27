const inventoryModel = require("../models/inventory-model");
const utils = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  try {
    const data = await inventoryModel.getInventoryByClassificationId(classification_id);
    const grid = await utils.buildClassificationGrid(data);
    const nav = await utils.getNav();
    const className = data.length > 0 ? data[0].classification_name : "Unknown classification";
    
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    console.error("Error fetching inventory data for classificationId:", classification_id, error);
    next(error); // Let the error handler deal with the error
  }
};

/* View Vehicle Detail
 * ************************** */
invCont.viewVehicleDetail = async function (req, res) {
  const vehicleId = req.params.vehicleId;

  try {
    // Fetch vehicle details from the database
    const vehicleDetails = await inventoryModel.getVehicleDetailsById(vehicleId);

    if (!vehicleDetails) {
      return res.status(404).send("Vehicle not found");
    }

    // Format the vehicle data for the view
    const formattedVehicleDetails = utils.formatVehicleDetails(vehicleDetails);

    // Render the view and pass the formatted vehicle details
    res.render('inventory/vehicleDetail', { vehicle: formattedVehicleDetails });

  } catch (error) {
    console.error("Error fetching vehicle details for vehicleId:", vehicleId, error);
    res.status(500).send("Internal server error");
  }
};

module.exports = invCont;
