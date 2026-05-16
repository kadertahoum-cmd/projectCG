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

$orderCode = trim((string) ($input['id'] ?? ''));
$product = $input['product'] ?? [];
$payment = $input['payment'] ?? [];
$customer = $input['customer'] ?? [];

$productName = trim((string) ($product['name'] ?? ''));
$productPrice = (float) ($product['price'] ?? 0);
$paymentMethod = trim((string) ($payment['title'] ?? ''));
$customerName = trim((string) ($customer['name'] ?? ''));
$customerPhone = trim((string) ($customer['phone'] ?? ''));
$customerAddress = trim((string) ($customer['address'] ?? ''));

if (
    $orderCode === '' ||
    $productName === '' ||
    $productPrice <= 0 ||
    $paymentMethod === '' ||
    $customerName === '' ||
    $customerPhone === '' ||
    $customerAddress === ''
) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

try {
    $stmt = db()->prepare(
        'INSERT INTO orders (
            order_code,
            product_name,
            product_price,
            payment_method,
            customer_name,
            customer_phone,
            customer_address
        ) VALUES (
            :order_code,
            :product_name,
            :product_price,
            :payment_method,
            :customer_name,
            :customer_phone,
            :customer_address
        )'
    );

    $stmt->execute([
        'order_code' => $orderCode,
        'product_name' => $productName,
        'product_price' => $productPrice,
        'payment_method' => $paymentMethod,
        'customer_name' => $customerName,
        'customer_phone' => $customerPhone,
        'customer_address' => $customerAddress,
    ]);

    echo json_encode([
        'success' => true,
        'message' => 'Order saved',
        'order_id' => db()->lastInsertId(),
    ]);
} catch (Throwable $exception) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Could not save order',
    ]);
}
