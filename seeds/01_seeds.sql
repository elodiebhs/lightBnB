INSERT INTO users(name, email, password)
VALUES
('elodie bouthors', 'elodiebouthoes@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('edy ali', 'edyali@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('oly brood', 'oly@example.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');


INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES
  (1, 'My room', 'description', 'http://example.com/my_room.bmp', 'http://example.com/my_room.bmp', 25, 1, 1, 1, 'Canada', '651 Nami road', 'nanaimo', 'BC', 'H0H0H0', true),
  (2, 'My Bathroom', 'description', 'http://example.com/my_bathroom.bmp', 'http://example.com/my_bathroom.bmp', 50, 1, 2, 1, 'Canada', '652 Nami road', 'nanaimo', 'BC', 'H0H0H0', true),
  (2, 'Living Room', 'decription', 'http://example.com/description.bmp', 'http://example.com/description.bmp', 40, 3, 1, 0, 'Canada', '652 Nami road', 'nanaimo', 'BC', 'H0H0H0', true);


INSERT INTO reservations (guest_id, property_id, start_date, end_date)
VALUES
  (3, 2, '2020-11-03', '2020-11-10'),
  (2, 2, '2021-02-05', '2021-02-06'),
  (2, 1, '2021-01-01', '2021-02-01');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, message, rating)
VALUES
  (2, 1, 1, 'message', 4),
  (3, 2, 2, 'message', 2),
  (1, 3, 3, 'message', 1);


