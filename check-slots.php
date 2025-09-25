<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

// Lire la date (YYYY-MM-DD)
$date = isset($_GET['date']) ? $_GET['date'] : '';
if (!$date || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
    echo json_encode(['success' => false, 'error' => 'Date invalide']);
    exit;
}

try {
    $pdo = get_pdo_connection();

    // Récupérer les heures déjà prises pour la date
    $stmt = $pdo->prepare('SELECT appointment_time FROM appointments WHERE appointment_date = ?');
    $stmt->execute([$date]);
    $takenTimes = $stmt->fetchAll(PDO::FETCH_COLUMN);

    // Générer tous les créneaux de 08:35 à 15:30 toutes les 5 minutes
    $allSlots = [];
    for ($hour = 8; $hour <= 15; $hour++) {
        for ($minute = 0; $minute < 60; $minute += 5) {
            if ($hour === 8 && $minute < 35) continue;
            if ($hour === 15 && $minute > 30) break;
            $value = sprintf('%02d:%02d:00', $hour, $minute);
            $text = sprintf('%02dh%02d', $hour, $minute);
            $allSlots[] = ['value' => substr($value, 0, 5), 'text' => $text, 'sql' => $value];
        }
    }

    // Filtrer les créneaux non pris (1 RDV par créneau)
    $available = array_values(array_filter($allSlots, function ($slot) use ($takenTimes) {
        return !in_array($slot['sql'], $takenTimes, true);
    }));

    // Nettoyer la sortie (retirer la clé interne 'sql')
    $availableSlots = array_map(function ($slot) {
        return ['value' => $slot['value'], 'text' => $slot['text']];
    }, $available);

    echo json_encode([
        'success' => true,
        'available_slots' => $availableSlots,
        'total_available' => count($availableSlots)
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erreur serveur']);
}


