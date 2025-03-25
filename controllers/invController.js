// controllers/inventory-controller.js
const inventoryModel = require('../models/inventory-model');
const utils = require('../utilities');

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

// Function to render the vehicle detail view
// Vehicle detail view
invCont.vehicleDetail = async function (req, res, next) {
  const vehicleId = req.params.id; // Get vehicle ID from the URL
  try {
      const vehicleData = await inventoryModel.getVehicleById(vehicleId); // Fetch vehicle data

      if (!vehicleData) {
          console.error(`Vehicle with ID ${vehicleId} not found.`);
          return res.status(404).send("Vehicle not found.");
      }

      // Generate vehicle HTML with relevant data
      const vehicleHTML = utils.generateVehicleHTML(vehicleData);

      // Render the vehicle detail page
      res.render('inventory/vehicle-detail', {
          title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
          vehicleHTML: vehicleHTML
      });
  } catch (error) {
      console.error("Error fetching vehicle details:", error);
      next(error); // Pass the error to the next middleware for handling
  }
};


module.exports = invCont;
