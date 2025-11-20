CREATE DATABASE todolist_db;
USE todolist_db;
CREATE TABLE todos (
 id INT AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(255) NOT NULL,
 priority INT NOT NULL DEFAULT 1,
 done BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT INTO todos (name, priority, done) VALUES
('Buy groceries', 2, FALSE),
('Finish project report', 1, FALSE),
('Call Alice', 3, TRUE),
('Schedule dentist appointment', 2, FALSE),
('Plan weekend trip', 1, FALSE),
('Read a book', 3, TRUE),
('Clean the house', 2, FALSE),
('Exercise', 1, TRUE),
('Pay bills', 2, FALSE),
('Organize workspace', 3, FALSE),
('Attend team meeting', 1, FALSE),
('Update resume', 2, TRUE);