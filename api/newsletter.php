<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/database.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

$input = json_decode((string) file_get_contents('php://input'), true);

if (!is_array($input)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit;
}

$email = strtolower(trim((string) ($input['email'] ?? '')));

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Email invalide']);
    exit;
}

try {
    $stmt = db()->prepare(
        'INSERT INTO newsletter_subscribers (email)
         VALUES (:email)
         ON DUPLICATE KEY UPDATE status = "active"'
    );

    $stmt->execute(['email' => $email]);

    echo json_encode([
        'success' => true,
        'message' => 'Inscription confirmee',
    ]);
} catch (Throwable $exception) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Could not save newsletter subscription',
    ]);
}
