<?php
/**
 * PrintMedia Admin API
 * PHP Backend for Hostinger Shared Hosting (if Node.js is not available)
 * 
 * This provides a simple REST API for the admin panel
 * Upload this to: /api/ folder on your Hostinger hosting
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration - UPDATE THESE VALUES
define('DB_HOST', 'localhost');
define('DB_NAME', 'u123456789_printmedia');
define('DB_USER', 'u123456789_admin');
define('DB_PASS', 'your-secure-password');

// Admin credentials - UPDATE THESE VALUES
define('ADMIN_EMAIL', 'admin@printmedia.fi');
define('ADMIN_PASSWORD_HASH', password_hash('your-admin-password', PASSWORD_DEFAULT));

// JWT Secret - CHANGE THIS
define('JWT_SECRET', 'your-super-secret-jwt-key-change-this');

// Connect to database
function getDB() {
    try {
        $pdo = new PDO(
            "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
            DB_USER,
            DB_PASS,
            [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
            ]
        );
        return $pdo;
    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['error' => 'Database connection failed']);
        exit();
    }
}

// Simple JWT functions
function createToken($userId, $email) {
    $header = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
    $payload = base64_encode(json_encode([
        'sub' => $userId,
        'email' => $email,
        'exp' => time() + (30 * 24 * 60 * 60) // 30 days
    ]));
    $signature = base64_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    return "$header.$payload.$signature";
}

function verifyToken($token) {
    $parts = explode('.', $token);
    if (count($parts) !== 3) return false;
    
    [$header, $payload, $signature] = $parts;
    $expectedSignature = base64_encode(hash_hmac('sha256', "$header.$payload", JWT_SECRET, true));
    
    if ($signature !== $expectedSignature) return false;
    
    $data = json_decode(base64_decode($payload), true);
    if ($data['exp'] < time()) return false;
    
    return $data;
}

function requireAuth() {
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? '';
    
    if (!preg_match('/Bearer\s+(.+)/', $authHeader, $matches)) {
        http_response_code(401);
        echo json_encode(['error' => 'Unauthorized']);
        exit();
    }
    
    $token = verifyToken($matches[1]);
    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid token']);
        exit();
    }
    
    return $token;
}

// Get request path
$requestUri = $_SERVER['REQUEST_URI'];
$path = parse_url($requestUri, PHP_URL_PATH);
$path = preg_replace('/^\/api/', '', $path);
$method = $_SERVER['REQUEST_METHOD'];

// Route handling
switch (true) {
    // Authentication
    case $path === '/auth/login' && $method === 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';
        
        $db = getDB();
        $stmt = $db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['password'])) {
            $token = createToken($user['id'], $user['email']);
            echo json_encode([
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'email' => $user['email'],
                    'name' => $user['name']
                ]
            ]);
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Invalid credentials']);
        }
        break;
    
    // Get pages
    case $path === '/pages' && $method === 'GET':
        $db = getDB();
        $stmt = $db->query("SELECT * FROM pages ORDER BY created_at DESC");
        echo json_encode($stmt->fetchAll());
        break;
    
    // Get single page
    case preg_match('/^\/pages\/(.+)$/', $path, $matches) && $method === 'GET':
        $db = getDB();
        $stmt = $db->prepare("SELECT * FROM pages WHERE slug = ?");
        $stmt->execute([$matches[1]]);
        $page = $stmt->fetch();
        
        if ($page) {
            echo json_encode($page);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'Page not found']);
        }
        break;
    
    // Save page
    case $path === '/pages' && $method === 'POST':
        requireAuth();
        $input = json_decode(file_get_contents('php://input'), true);
        
        $db = getDB();
        $stmt = $db->prepare("
            INSERT INTO pages (id, slug, title, meta_title, meta_desc, content, is_published, created_at, updated_at)
            VALUES (UUID(), ?, ?, ?, ?, ?, ?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE
            title = VALUES(title),
            meta_title = VALUES(meta_title),
            meta_desc = VALUES(meta_desc),
            content = VALUES(content),
            is_published = VALUES(is_published),
            updated_at = NOW()
        ");
        
        $stmt->execute([
            $input['slug'],
            $input['title'],
            $input['metaTitle'] ?? null,
            $input['metaDesc'] ?? null,
            $input['content'],
            $input['isPublished'] ?? true
        ]);
        
        echo json_encode(['success' => true]);
        break;
    
    // Get products
    case $path === '/products' && $method === 'GET':
        $db = getDB();
        $stmt = $db->query("
            SELECT p.*, c.name as category_name 
            FROM products p 
            LEFT JOIN categories c ON p.category_id = c.id 
            ORDER BY p.`order` ASC
        ");
        echo json_encode($stmt->fetchAll());
        break;
    
    // Save product
    case $path === '/products' && $method === 'POST':
        requireAuth();
        $input = json_decode(file_get_contents('php://input'), true);
        
        $db = getDB();
        $stmt = $db->prepare("
            INSERT INTO products (id, slug, name, description, features, specs, category_id, product_number, is_published, `order`, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            description = VALUES(description),
            features = VALUES(features),
            specs = VALUES(specs),
            category_id = VALUES(category_id),
            product_number = VALUES(product_number),
            is_published = VALUES(is_published),
            `order` = VALUES(`order`),
            updated_at = NOW()
        ");
        
        $id = $input['id'] ?? uniqid('prod_', true);
        $stmt->execute([
            $id,
            $input['slug'],
            $input['name'],
            $input['description'] ?? null,
            json_encode($input['features'] ?? []),
            json_encode($input['specs'] ?? []),
            $input['categoryId'] ?? null,
            $input['productNumber'] ?? null,
            $input['isPublished'] ?? true,
            $input['order'] ?? 0
        ]);
        
        echo json_encode(['success' => true, 'id' => $id]);
        break;
    
    // Get settings
    case $path === '/settings' && $method === 'GET':
        $db = getDB();
        $stmt = $db->query("SELECT * FROM settings");
        $settings = [];
        foreach ($stmt->fetchAll() as $row) {
            $settings[$row['key']] = $row['type'] === 'json' 
                ? json_decode($row['value'], true) 
                : $row['value'];
        }
        echo json_encode($settings);
        break;
    
    // Save setting
    case $path === '/settings' && $method === 'POST':
        requireAuth();
        $input = json_decode(file_get_contents('php://input'), true);
        
        $db = getDB();
        $stmt = $db->prepare("
            INSERT INTO settings (`key`, `value`, `type`, `group`, updated_at)
            VALUES (?, ?, ?, ?, NOW())
            ON DUPLICATE KEY UPDATE
            `value` = VALUES(`value`),
            updated_at = NOW()
        ");
        
        $value = is_array($input['value']) ? json_encode($input['value']) : $input['value'];
        $type = is_array($input['value']) ? 'json' : 'text';
        
        $stmt->execute([
            $input['key'],
            $value,
            $type,
            $input['group'] ?? 'general'
        ]);
        
        echo json_encode(['success' => true]);
        break;
    
    // File upload
    case $path === '/upload' && $method === 'POST':
        requireAuth();
        
        if (!isset($_FILES['file'])) {
            http_response_code(400);
            echo json_encode(['error' => 'No file uploaded']);
            break;
        }
        
        $file = $_FILES['file'];
        $folder = $_POST['folder'] ?? 'uploads';
        
        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp', 'application/pdf'];
        if (!in_array($file['type'], $allowedTypes)) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid file type']);
            break;
        }
        
        $uploadDir = "../public/$folder/";
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }
        
        $timestamp = time();
        $safeName = preg_replace('/[^a-zA-Z0-9.-]/', '', $file['name']);
        $fileName = "{$timestamp}-{$safeName}";
        $filePath = $uploadDir . $fileName;
        
        if (move_uploaded_file($file['tmp_name'], $filePath)) {
            // Save to database
            $db = getDB();
            $stmt = $db->prepare("
                INSERT INTO media (id, filename, url, mime_type, size, folder, created_at)
                VALUES (UUID(), ?, ?, ?, ?, ?, NOW())
            ");
            $stmt->execute([
                $fileName,
                "/$folder/$fileName",
                $file['type'],
                $file['size'],
                $folder
            ]);
            
            echo json_encode([
                'success' => true,
                'url' => "/$folder/$fileName",
                'fileName' => $fileName
            ]);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'Upload failed']);
        }
        break;
    
    // Get media files
    case $path === '/media' && $method === 'GET':
        $db = getDB();
        $folder = $_GET['folder'] ?? null;
        
        if ($folder) {
            $stmt = $db->prepare("SELECT * FROM media WHERE folder = ? ORDER BY created_at DESC");
            $stmt->execute([$folder]);
        } else {
            $stmt = $db->query("SELECT * FROM media ORDER BY created_at DESC");
        }
        
        echo json_encode($stmt->fetchAll());
        break;
    
    // Delete media
    case preg_match('/^\/media\/(.+)$/', $path, $matches) && $method === 'DELETE':
        requireAuth();
        $db = getDB();
        
        $stmt = $db->prepare("SELECT * FROM media WHERE id = ?");
        $stmt->execute([$matches[1]]);
        $media = $stmt->fetch();
        
        if ($media) {
            $filePath = "../public" . $media['url'];
            if (file_exists($filePath)) {
                unlink($filePath);
            }
            
            $stmt = $db->prepare("DELETE FROM media WHERE id = ?");
            $stmt->execute([$matches[1]]);
            
            echo json_encode(['success' => true]);
        } else {
            http_response_code(404);
            echo json_encode(['error' => 'File not found']);
        }
        break;
    
    // Get navigation
    case $path === '/navigation' && $method === 'GET':
        $db = getDB();
        $location = $_GET['location'] ?? 'main';
        
        $stmt = $db->prepare("SELECT * FROM navigation WHERE location = ?");
        $stmt->execute([$location]);
        $nav = $stmt->fetch();
        
        if ($nav) {
            echo json_encode(json_decode($nav['items'], true));
        } else {
            echo json_encode([]);
        }
        break;
    
    // Save navigation
    case $path === '/navigation' && $method === 'POST':
        requireAuth();
        $input = json_decode(file_get_contents('php://input'), true);
        
        $db = getDB();
        $stmt = $db->prepare("
            INSERT INTO navigation (id, location, items, updated_at)
            VALUES (UUID(), ?, ?, NOW())
            ON DUPLICATE KEY UPDATE
            items = VALUES(items),
            updated_at = NOW()
        ");
        
        $stmt->execute([
            $input['location'],
            json_encode($input['items'])
        ]);
        
        echo json_encode(['success' => true]);
        break;
    
    // Default 404
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Not found', 'path' => $path]);
        break;
}
