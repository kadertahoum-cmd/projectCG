<?php
declare(strict_types=1);

require_once __DIR__ . '/../config/database.php';
require_admin();

$orders = db()
    ->query('SELECT * FROM orders ORDER BY created_at DESC LIMIT 100')
    ->fetchAll();

$messages = db()
    ->query('SELECT * FROM contact_messages ORDER BY created_at DESC LIMIT 100')
    ->fetchAll();

$subscribers = db()
    ->query('SELECT * FROM newsletter_subscribers ORDER BY created_at DESC LIMIT 200')
    ->fetchAll();

function e(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES, 'UTF-8');
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin | La Rose Eternelle</title>
  <style>
    body {
      margin: 0;
      padding: 32px;
      font-family: Arial, sans-serif;
      background: #f6f4ef;
      color: #1f1f1f;
    }

    h1,
    h2 {
      color: #24402b;
    }

    section {
      margin: 28px 0;
      padding: 24px;
      border-radius: 14px;
      background: #fff;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      min-width: 900px;
    }

    th,
    td {
      padding: 12px;
      border-bottom: 1px solid #e5e5e5;
      text-align: left;
      vertical-align: top;
    }

    th {
      color: #3f6548;
      background: #eef3ed;
    }

    .empty {
      color: #777;
    }
  </style>
</head>
<body>
  <h1>La Rose Eternelle - Admin</h1>

  <section>
    <h2>Commandes</h2>

    <?php if ($orders === []): ?>
      <p class="empty">Aucune commande pour le moment.</p>
    <?php else: ?>
      <table>
        <thead>
          <tr>
            <th>Code</th>
            <th>Produit</th>
            <th>Prix</th>
            <th>Paiement</th>
            <th>Client</th>
            <th>Telephone</th>
            <th>Adresse</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($orders as $order): ?>
            <tr>
              <td><?= e($order['order_code']) ?></td>
              <td><?= e($order['product_name']) ?></td>
              <td><?= e((string) $order['product_price']) ?> DH</td>
              <td><?= e($order['payment_method']) ?></td>
              <td><?= e($order['customer_name']) ?></td>
              <td><?= e($order['customer_phone']) ?></td>
              <td><?= e($order['customer_address']) ?></td>
              <td><?= e($order['created_at']) ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>
  </section>

  <section>
    <h2>Messages contact</h2>

    <?php if ($messages === []): ?>
      <p class="empty">Aucun message pour le moment.</p>
    <?php else: ?>
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Telephone</th>
            <th>Sujet</th>
            <th>Message</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($messages as $message): ?>
            <tr>
              <td><?= e($message['name']) ?></td>
              <td><?= e($message['phone']) ?></td>
              <td><?= e($message['subject']) ?></td>
              <td><?= e($message['message']) ?></td>
              <td><?= e($message['created_at']) ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>
  </section>

  <section>
    <h2>Newsletter</h2>

    <?php if ($subscribers === []): ?>
      <p class="empty">Aucun abonne pour le moment.</p>
    <?php else: ?>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          <?php foreach ($subscribers as $subscriber): ?>
            <tr>
              <td><?= e($subscriber['email']) ?></td>
              <td><?= e($subscriber['status']) ?></td>
              <td><?= e($subscriber['created_at']) ?></td>
            </tr>
          <?php endforeach; ?>
        </tbody>
      </table>
    <?php endif; ?>
  </section>
</body>
</html>
