<?php
// Test simple de connexion à la base MySQL via PDO
// Ouvrez ensuite http://localhost/consulat/test-db.php dans votre navigateur

require __DIR__ . '/db.php';

header('Content-Type: text/plain; charset=utf-8');

try {
    $pdo = get_pdo_connection();

    // Vérifier la version du serveur et un SELECT basique
    $version = $pdo->query('SELECT VERSION() AS v')->fetch()['v'] ?? 'inconnue';
    $ping = $pdo->query('SELECT 1 AS ok')->fetch()['ok'] ?? 0;

    echo "Connexion OK\n";
    echo "Base: consulat\n";
    echo "MySQL version: {$version}\n";
    echo "Test SELECT 1: " . ($ping == 1 ? 'OK' : 'KO') . "\n";
} catch (Throwable $e) {
    http_response_code(500);
    echo "ERREUR de connexion\n";
    echo "Message: " . $e->getMessage() . "\n";
    // Indices utiles
    echo "Vérifiez l'hôte, le port, l'utilisateur/mot de passe dans db.php\n";
}


