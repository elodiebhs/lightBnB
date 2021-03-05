const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Pool } = require('pg');
const { password } = require('pg/lib/defaults');

//Connect to the lightBnB database
const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});
/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {

  //Accepts an email address and will return a promise.
  //The promise should resolve with the user that has that email address, or null if that user does not exist.
  return pool
    .query("SELECT * FROM users WHERE email= $1", [email])
    .then((data) => (data.rows[0]))
    .catch((err) => {
      return null;
    });
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  //Will do the same as getUserWithEmail, but using the user's id instead of email.
  return pool
    .query('SELECT * FROM users WHERE id = $1', [id])
    .then((data) => (data.rows[0]))
    .catch((err) => {
      return null;
    });
};

exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  return pool
    .query("INSERT INTO users (name, email, password) VALUES ($1, $2, $3);", [
      user.name,
      user.email,
      user.password,
    ])
    .catch((err) => console.log(err));
};

exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(`
  SELECT reservations.*, properties.*, avg(property_reviews.rating)as average_rating
  FROM reservations
  JOIN properties ON properties.id = reservations.property_id
  JOIN property_reviews ON property_reviews.property_id = properties.id
  WHERE reservations.guest_id = $1
  AND reservations.end_date <= NOW()::date
  GROUP BY reservations.id, properties.id
  ORDER BY start_date
  LIMIT $2;

  `, [guest_id,limit])
    .then(res => res.rows);
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

//query
const getAllProperties = function(options, limit = 10) {

  const queryParams = [];

  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  LEFT JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE 1 = 1
  `;
  // console.log("test1",options);
  // console.log("test1",queryParams);

  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `AND city LIKE $${queryParams.length} `;
  }

  //if an owner_id is passed in, only return properties belonging to that owner.
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `AND owner_id = $${queryParams.length} `;
    //console.log("test", queryString)
  }

  //if a minimum_price_per_night and a maximum_price_per_night, only return properties within that price range.
  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    queryString += `AND cost_per_night >= $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    queryString += `AND cost_per_night <= $${queryParams.length} `;
  }

  queryString += `GROUP BY properties.id\n`;

  //if a minimum_rating is passed in, only return properties with a rating equal to or higher than that

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING AVG(property_reviews.rating) >= $${queryParams.length} `;
  }
  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  return pool.query(queryString, queryParams)
    .then(res => res.rows);
};
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  return pool
    .query("INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms) VALUES ($1, $2, $3, $4 ,$5, $6, $7, $8, $9, $10, $11, $12, $13, $14)RETURNING *;", [
      property.owner_id,
      property.title,
      property.descrition,
      property.thumbnail_photo_url,
      property.cover_photo_url,
      property.cost_per_night,
      property.street,
      property.city,
      property.province,
      property.post_code,
      property.country,
      (property.parking_spaces === "" ? 0 : property.parking_spaces) ,
      (property.number_of_bathrooms === "" ? 0 : property.number_of_bathrooms),
      (property.number_of_bedrooms === "" ? 0 : property.number_of_bedrooms)
    ])
    .then(res => res.rows);
};
exports.addProperty = addProperty;
