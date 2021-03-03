---Get the average duration of all reservations.

SELECT avg(end_date - start_date) as average_assistance_request_duration
FROM reservations;