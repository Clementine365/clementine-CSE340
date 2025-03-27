const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */

async function getClassifications() {
  try {
    const result = await pool.query('SELECT * FROM public.classification ORDER BY classification_name');
    console.log("Executed query result:", result);  // Log the full result to inspect the structure
    return result;
  } catch (error) {
    console.error("Error fetching classifications:", error);
    throw error;
  }
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  // Validate the classification_id before using it
  if (!classification_id || isNaN(classification_id)) {
    throw new Error("Invalid classification_id: Must be a valid number.");
  }

  try {
    const data = await pool.query(
      `SELECT *
       FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    );
    
    // Check if data exists, if not, return empty array or handle gracefully
    return data.rows || [];
  } catch (error) {
    console.error("Error in getInventoryByClassificationId: " + error);
    throw error;
  }
}

/* ***************************
 *  Get vehicle details by vehicleId
 * ************************** */
async function getVehicleDetailsById(vehicleId) {
  if (!vehicleId || isNaN(vehicleId)) {
    throw new Error("Invalid vehicleId: Must be a valid number.");
  }

  try {
    const result = await pool.query(
      `SELECT * 
       FROM public.inventory AS i 
       WHERE i.vehicle_id = $1`, 
      [vehicleId]
    );

    // If no vehicle found, return null
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error in getVehicleDetailsById: " + error);
    throw error;
  }
}





module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleDetailsById,
};
