<?php
// Connexion PDO à MySQL (MAMP)
// Ajustez si besoin : port, utilisateur, mot de passe
// Par défaut MAMP: user "root", mot de passe "root". Port souvent 3306 (Windows) ou 8889 (macOS).

$DB_HOST = '127.0.0.1';
$DB_PORT = '3306';
$DB_NAME = 'consulat';
$DB_USER = 'root';
$DB_PASS = 'root';

function get_pdo_connection(): PDO {
    global $DB_HOST, $DB_PORT, $DB_NAME, $DB_USER, $DB_PASS;
    $dsn = "mysql:host={$DB_HOST};port={$DB_PORT};dbname={$DB_NAME};charset=utf8mb4";
    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];
    return new PDO($dsn, $DB_USER, $DB_PASS, $options);
}

?>


