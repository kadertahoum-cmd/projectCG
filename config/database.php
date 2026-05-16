<?php

declare(strict_types=1);

const DB_HOST = 'localhost';
const DB_NAME = 'laroseeternelle';
const DB_USER = 'root';
const DB_PASS = '';
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'Rose2026@Secure';

function db(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4';

    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

function require_admin(): void
{
    $user = $_SERVER['PHP_AUTH_USER'] ?? '';
    $pass = $_SERVER['PHP_AUTH_PW'] ?? '';

    if ($user === ADMIN_USER && $pass === ADMIN_PASS) {
        return;
    }

    header('WWW-Authenticate: Basic realm="La Rose Eternelle Admin"');
    http_response_code(401);
    echo 'Authentication required';
    exit;
}
