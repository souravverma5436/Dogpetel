<?php
// Database setup API endpoint
// Visit this URL once to set up the database: /api/setup.php

require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../setup-database.php';

$result = setupDatabase();

http_response_code($result['success'] ? 200 : 500);
echo json_encode($result, JSON_PRETTY_PRINT);
