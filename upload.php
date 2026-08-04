<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_FILES['image'])) {
    $file = $_FILES['image'];
    
    // Cloudflare R2 S3-compatible details
    $r2Endpoint = "https://55e464ac4d3b4b7b828d60400d06e80a.r2.cloudflarestorage.com/rt-online-mart-images/";
    $publicUrl = "https://pub-04c5f3094f184e74bcbc91a01775e38c.r2.dev";
    
    $fileName = 'products/' . time() . '_' . basename($file['name']);
    $url = $r2Endpoint . $fileName;

    // Read file contents
    $fileData = file_get_contents($file['tmp_name']);

    // Setup cURL to upload via S3 API PUT request
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
    curl_setopt($ch, CURLOPT_POSTFIELDS, $fileData);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: ' . $file['type']
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode >= 200 && $httpCode < 300) {
        echo json_encode([
            'success' => true,
            'imageUrl' => $publicUrl . '/' . $fileName
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Failed to upload to R2 storage.'
        ]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Invalid request.']);
}
?>