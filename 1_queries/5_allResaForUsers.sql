---Show all reservations for a user.

---Select all columns from the reservations table, all columns from the properties table, and the average rating of the property.
---The reservations will be for a single user, so use 1 for the user_id.
---Order the results from the earliest start_date to the most recent start_date.
---These will end up being filtered by either "Upcoming Reservations" or "Past Reservations", so only get reservations where the end_date is in the past.
---Use now()::date to get today's date.
---Limit the results to 10.

SELECT reservations.*, properties.*, avg(property_reviews.rating)as average_rating
FROM reservations
JOIN properties ON properties.id = reservations.property_id
JOIN property_reviews ON property_reviews.property_id = properties.id
WHERE reservations.guest_id = 1
AND reservations.end_date <= NOW()::date
GROUP BY reservations.id, properties.id
ORDER BY start_date
LIMIT 10;