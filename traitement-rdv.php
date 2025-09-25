<?php
require_once __DIR__ . '/db.php';

// Configuration e-mail (à adapter)
$MAIL_FROM = 'no-reply@consulat-algerie-nice.org';
$MAIL_FROM_NAME = 'Consulat d\'Algérie à Nice';

function send_confirmation_email($toEmail, $data, $fromEmail, $fromName) {
	// Sujet encodé UTF-8
	$subject = 'Confirmation de rendez-vous - Consulat d\'Algérie à Nice';
	$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

	$lines = [
		'Bonjour ' . $data['firstName'] . ' ' . $data['lastName'] . ',',
		'',
		'Votre rendez-vous a été confirmé :',
		'- Service : ' . $data['serviceLabel'],
		'- Date : ' . $data['date'],
		'- Heure : ' . $data['time'],
		'',
		'Adresse : 20 Bis, Avenue Mont Rabeau, 06200 Nice, France',
		'Téléphone : +33 4 93 97 71 00',
		'',
		'En cas d\'empêchement, merci d\'annuler votre rendez-vous.',
		'',
		'Ceci est un message automatique, merci de ne pas répondre.'
	];
	$body = implode("\r\n", $lines);

	$headers = [];
	$headers[] = 'MIME-Version: 1.0';
	$headers[] = 'Content-Type: text/plain; charset=utf-8';
	$headers[] = 'From: ' . '=?UTF-8?B?' . base64_encode($fromName) . '?=' . ' <' . $fromEmail . '>';
	$headers[] = 'Reply-To: ' . $fromEmail;
	$headers[] = 'X-Mailer: PHP/' . phpversion();

	// Envoi (nécessite la configuration mail() / SMTP sur l\'environnement)
	return @mail($toEmail, $encodedSubject, $body, implode("\r\n", $headers));
}

function sanitize($value) {
    return trim((string)$value);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: rdv.html');
    exit;
}

$lastName = sanitize($_POST['lastName'] ?? '');
$firstName = sanitize($_POST['firstName'] ?? '');
$birthDate = sanitize($_POST['birthDate'] ?? '');
$email = sanitize($_POST['email'] ?? '');
$phone = sanitize($_POST['phone'] ?? '');
$service = sanitize($_POST['service'] ?? '');
$appointmentDate = sanitize($_POST['appointmentDate'] ?? '');
$appointmentTime = sanitize($_POST['appointmentTime'] ?? ''); // format HH:MM
$message = sanitize($_POST['message'] ?? '');

// Validations simples
$errors = [];
if ($lastName === '' || $firstName === '' || $birthDate === '' || $email === '' || $phone === '' || $service === '' || $appointmentDate === '' || $appointmentTime === '') {
    $errors[] = 'Veuillez remplir tous les champs obligatoires.';
}
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $birthDate)) $errors[] = 'Date de naissance invalide';
if (!preg_match('/^\S+@\S+\.\S+$/', $email)) $errors[] = 'Email invalide';
if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $appointmentDate)) $errors[] = 'Date de rendez-vous invalide';
if (!preg_match('/^\d{2}:\d{2}$/', $appointmentTime)) $errors[] = 'Heure de rendez-vous invalide';

// La date de rdv doit être aujourd'hui ou dans le futur
$today = new DateTime('today');
$rdvDate = DateTime::createFromFormat('Y-m-d', $appointmentDate);
if ($rdvDate && $rdvDate < $today) $errors[] = 'La date de rendez-vous doit être ultérieure.';

if ($errors) {
    echo '<!DOCTYPE html><html lang="fr"><meta charset="utf-8"><body>';
    echo '<p>' . implode('<br>', array_map('htmlspecialchars', $errors)) . '</p>';
    echo '<p><a href="rdv.html">Retour</a></p>';
    echo '</body></html>';
    exit;
}

try {
    $pdo = get_pdo_connection();
    $pdo->beginTransaction();

    // Vérifier si le créneau est toujours disponible (verrouillage simple)
    $sqlCheck = 'SELECT COUNT(*) FROM appointments WHERE appointment_date = ? AND appointment_time = ? FOR UPDATE';
    $stmt = $pdo->prepare($sqlCheck);
    $stmt->execute([$appointmentDate, $appointmentTime . ':00']);
    $count = (int)$stmt->fetchColumn();
    if ($count > 0) {
        $pdo->rollBack();
        echo '<!DOCTYPE html><html lang="fr"><meta charset="utf-8"><body>';
        echo '<p>Ce créneau vient d\'être réservé par quelqu\'un d\'autre. Merci de choisir un autre créneau.</p>';
        echo '<p><a href="rdv.html">Retour</a></p>';
        echo '</body></html>';
        exit;
    }

    // Insérer le RDV
    $insert = $pdo->prepare('INSERT INTO appointments (last_name, first_name, birth_date, email, phone, service, appointment_date, appointment_time, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
    $insert->execute([
        $lastName,
        $firstName,
        $birthDate,
        $email,
        $phone,
        $service,
        $appointmentDate,
        $appointmentTime . ':00',
        $message !== '' ? $message : null,
    ]);

    $pdo->commit();

	// Envoyer un email de confirmation (meilleure fiabilité avec un SMTP/PHPMailer)
	$serviceLabels = [
		'ccr' => 'C.C.R (Changement de Résidence)',
		'passeport' => 'Passeport',
		'cni' => 'Carte Nationale d\'Identité',
		'visa' => 'Demande de Visa',
	];
	$serviceLabel = $serviceLabels[$service] ?? $service;
	$emailSent = send_confirmation_email($email, [
		'firstName' => $firstName,
		'lastName' => $lastName,
		'date' => $appointmentDate,
		'time' => $appointmentTime,
		'serviceLabel' => $serviceLabel,
	], $MAIL_FROM, $MAIL_FROM_NAME);

	echo '<!DOCTYPE html><html lang="fr"><meta charset="utf-8"><body>';
	echo '<h2>Rendez-vous confirmé</h2>';
	echo '<p>Merci ' . htmlspecialchars($firstName) . ' ' . htmlspecialchars($lastName) . '.</p>';
	echo '<p>Date: ' . htmlspecialchars($appointmentDate) . ' à ' . htmlspecialchars($appointmentTime) . '</p>';
	if ($emailSent) {
		echo '<p>Un email de confirmation a été envoyé à ' . htmlspecialchars($email) . '.</p>';
	} else {
		echo '<p>Note: l\'envoi de l\'email n\'a pas pu être effectué sur ce serveur. Votre rendez-vous reste enregistré.</p>';
	}
	echo '<p><a href="rdv.html">Retour à la page Rendez-vous</a></p>';
	echo '</body></html>';
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo '<!DOCTYPE html><html lang="fr"><meta charset="utf-8"><body>';
    echo '<p>Erreur serveur. Réessayez plus tard.</p>';
    echo '<p><a href="rdv.html">Retour</a></p>';
    echo '</body></html>';
}


