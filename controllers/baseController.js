const utilities = require("../utilities"); // Ensure you're importing utilities.js or wherever 'getNav' is defined
const baseController = {};

baseController.buildHome = async function(req, res) {
  try {
    const nav = await utilities.getNav(); // Fetch the nav data
    res.render("index", { title: "Home", nav }); // Pass nav data to the view
  } catch (error) {
    console.error('Error fetching nav:', error); // Log error if nav fetching fails
    res.status(500).send('Something went wrong while rendering the page.');
  }
};

module.exports = baseController;
