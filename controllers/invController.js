const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

// controllers/inventory-controller.js
const inventoryModel = require('../models/inventory-model');
const utils = require('../utilities');

// Function to render the vehicle detail view
exports.vehicleDetail = (req, res) => {
    const vehicleId = req.params.id; // Get vehicle ID from the URL
    inventoryModel.getVehicleById(vehicleId, (err, vehicleData) => {
        if (err) {
            return res.status(500).send("Error retrieving vehicle data.");
        }

        // Use utility function to generate the HTML for the vehicle
        const vehicleHTML = utils.generateVehicleHTML(vehicleData);

        // Render the vehicle detail page with the generated HTML
        res.render('inventory/vehicle-detail', {
            title: `${vehicleData.make} ${vehicleData.model}`,
            vehicleHTML: vehicleHTML
        });
    });
};
module.exports = invCont