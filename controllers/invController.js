// controllers/inventory-controller.js
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
    console.error("Error fetching inventory data:", error);
    next(error);
  }
};


// Controller function to retrieve a specific vehicle's details
exports.getVehicleDetails = async (req, res) => {
  try {
    const inventoryId = req.params.id; // Get the inventory_id from the URL parameters
    const vehicleData = await inventoryModel.getVehicleById(inventoryId); // Get vehicle data from the model

    if (!vehicleData) {
      return res.status(404).send('Vehicle not found');
    }

    // Wrap the vehicle data in HTML and render the view
    const vehicleHtml = utilities.wrapVehicleDetailsInHtml(vehicleData);

    // Render the vehicle details view with the HTML content
    res.render('inventory/vehicleDetails', {
      title: `${vehicleData.make} ${vehicleData.model}`, // Set title to make and model
      vehicleHtml: vehicleHtml // Pass the vehicle details HTML to the view
    });
  } catch (error) {
    console.error('Error retrieving vehicle details:', error);
    res.status(500).send('Internal Server Error');
  }
};



module.exports = invCont;
