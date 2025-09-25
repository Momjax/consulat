-- Créez la base si besoin (exécuter dans phpMyAdmin):
-- CREATE DATABASE IF NOT EXISTS consulat CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE consulat;

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  last_name VARCHAR(100) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  birth_date DATE NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  service VARCHAR(50) NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  message TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Index utile pour rechercher les créneaux pris
-- Note: "IF NOT EXISTS" n'est pas supporté pour CREATE INDEX sur certaines versions MySQL
-- Si vous réimportez plusieurs fois, supprimez l'index avant ou ignorez l'erreur de duplication
CREATE INDEX idx_appointments_datetime ON appointments (appointment_date, appointment_time);


