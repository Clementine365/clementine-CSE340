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
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += '<li>';
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        " details'>" +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid += "<span>$" + new Intl.NumberFormat("en-US").format(vehicle.inv_price) + "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

// Utility function to format numbers with commas
const formatNumber = (num) => {
  return num.toLocaleString();
};

// Function to wrap the vehicle data in HTML
exports.wrapVehicleDetailsInHtml = (vehicleData) => {
  const priceFormatted = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicleData.price);
  const mileageFormatted = new Intl.NumberFormat('en-US').format(vehicleData.mileage);

  return `
    <div class="vehicle-detail">
      <h1>${vehicleData.make} ${vehicleData.model}</h1>
      <img src="${vehicleData.image_url}" alt="${vehicleData.make} ${vehicleData.model}" class="vehicle-image" />
      <div class="vehicle-info">
        <p><strong>Make:</strong> ${vehicleData.make}</p>
        <p><strong>Model:</strong> ${vehicleData.model}</p>
        <p><strong>Year:</strong> ${vehicleData.year}</p>
        <p><strong>Price:</strong> ${priceFormatted}</p>
        <p><strong>Mileage:</strong> ${mileageFormatted} miles</p>
        <p><strong>Description:</strong> ${vehicleData.description}</p>
      </div>
    </div>
  `;
};

/*function formatVehicleDetails(vehicle) {
  // Format price with currency
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(vehicle.price);

  // Format mileage with commas
  const formattedMileage = new Intl.NumberFormat("en-US").format(vehicle.mileage);

  // Format the full size image URL
  const fullImageUrl = vehicle.image_url; // assuming the image is stored with a URL or path

  // Return formatted vehicle data
  return {
    make: vehicle.make,
    model: vehicle.model,
    year: vehicle.year,
    price: formattedPrice,
    mileage: formattedMileage,
    imageUrl: fullImageUrl,
    description: vehicle.description, // Assuming there's a description column in your DB
  };
};*/

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = 
  Util // Export the whole Util object
   // Export function directly
;
