const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function () {
  try {
    // Get classifications from the database
    let data = await invModel.getClassifications();
    console.log("Navigation data:", data);  // Log the data structure
    
    // Check if data is an array and not empty
    if (!data || !Array.isArray(data.rows) || data.rows.length === 0) {
      console.error("Navigation data is not available or not in expected format");
      return "<ul><li>No navigation data available</li></ul>";  // Return a simple error message
    }

    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';

    // Loop through the classifications and create links
    data.rows.forEach((row) => {
      list += "<li>";
      list += `<a href="/inv/type/${row.classification_id}" title="See our inventory of ${row.classification_name} vehicles">`;
      list += `${row.classification_name}</a>`;
      list += "</li>";
    });

    list += "</ul>";
    return list;
  } catch (error) {
    console.error("Error fetching navigation:", error);
    return "<ul><li>Error fetching navigation</li></ul>";  // Return error HTML if something goes wrong
  }
};


/* **************************************
 * Build the classification view HTML here 
 * ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
};

// Utility function to format numbers with commas
const formatNumber = (num) => {
  return num.toLocaleString();
};

// Function to generate the HTML for vehicle details
Util.generateVehicleHTML = (vehicleData) => {
  try {
    // Ensure vehicleData is defined and has the necessary properties
    if (!vehicleData || !vehicleData.inv_make || !vehicleData.inv_model || !vehicleData.inv_image_url) {
      return "<p>Error: Missing vehicle data.</p>"; // Error handling for missing data
    }

    // Handle missing or invalid image URL
    const imageUrl = vehicleData.inv_image_url ? vehicleData.inv_image_url : '/images/default.jpg';

    // Format price and mileage
    const price = `$${formatNumber(vehicleData.inv_price)}`;
    const mileage = formatNumber(vehicleData.inv_mileage);

    // Construct the HTML content for the vehicle
    return `
      <div class="vehicle-detail">
          <div class="vehicle-image">
              <img src="${imageUrl}" alt="${vehicleData.inv_make} ${vehicleData.inv_model}">
          </div>
          <div class="vehicle-info">
              <h2>${vehicleData.inv_make} ${vehicleData.inv_model}</h2>
              <p><strong>Year:</strong> ${vehicleData.inv_year}</p>
              <p><strong>Price:</strong> ${price}</p>
              <p><strong>Mileage:</strong> ${mileage} miles</p>
              <p><strong>Description:</strong> ${vehicleData.inv_description}</p>
          </div>
      </div>
    `;
  } catch (error) {
    console.error("Error generating vehicle HTML:", error);
    return "<p>Error displaying vehicle details</p>"; // Return fallback HTML in case of an error
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;









