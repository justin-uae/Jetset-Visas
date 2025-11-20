<?php
/**
 * Contact Form Handler for cPanel
 * Handles form submission with Google reCAPTCHA verification
 * Sends email to info@jetsetvisas.ae
 */

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);
ini_set('error_log', __DIR__ . '/contact_errors.log');

// Set headers for JSON response and CORS
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed'
    ]);
    exit();
}

// Configuration
define('RECIPIENT_EMAIL', 'info@jetsetvisas.ae');
define('RECAPTCHA_SECRET_KEY', 'hh');
define('FROM_EMAIL', 'noreply@jetsetvisas.ae');
define('FROM_NAME', 'JetSet Visas Contact Form');

/**
 * Verify Google reCAPTCHA
 */
function verifyRecaptcha($token) {
    if (empty($token)) {
        return false;
    }

    $url = 'https://www.google.com/recaptcha/api/siteverify';
    $data = [
        'secret' => RECAPTCHA_SECRET_KEY,
        'response' => $token,
        'remoteip' => $_SERVER['REMOTE_ADDR']
    ];

    $options = [
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/x-www-form-urlencoded',
            'content' => http_build_query($data)
        ]
    ];

    $context = stream_context_create($options);
    $response = file_get_contents($url, false, $context);
    
    if ($response === false) {
        error_log('reCAPTCHA verification failed: Unable to connect to Google');
        return false;
    }

    $result = json_decode($response, true);
    
    if ($result['success']) {
        return true;
    } else {
        error_log('reCAPTCHA verification failed: ' . json_encode($result));
        return false;
    }
}

/**
 * Sanitize input data
 */
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Validate email format
 */
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

/**
 * Send email using PHP mail function
 */
function sendEmail($name, $email, $subject, $message) {
    // Email to admin
    $to = RECIPIENT_EMAIL;
    $emailSubject = "Contact Form: " . $subject;
    
    // Email body
    $emailBody = "You have received a new message from the contact form on JetSet Visas.\n\n";
    $emailBody .= "Name: " . $name . "\n";
    $emailBody .= "Email: " . $email . "\n";
    $emailBody .= "Subject: " . $subject . "\n\n";
    $emailBody .= "Message:\n" . $message . "\n\n";
    $emailBody .= "---\n";
    $emailBody .= "This email was sent from the contact form on " . $_SERVER['HTTP_HOST'] . "\n";
    $emailBody .= "IP Address: " . $_SERVER['REMOTE_ADDR'] . "\n";
    $emailBody .= "Date: " . date('Y-m-d H:i:s') . "\n";
    
    // Email headers
    $headers = [];
    $headers[] = "From: " . FROM_NAME . " <" . FROM_EMAIL . ">";
    $headers[] = "Reply-To: " . $name . " <" . $email . ">";
    $headers[] = "X-Mailer: PHP/" . phpversion();
    $headers[] = "MIME-Version: 1.0";
    $headers[] = "Content-Type: text/plain; charset=UTF-8";
    
    $headersString = implode("\r\n", $headers);
    
    // Send email
    $sent = mail($to, $emailSubject, $emailBody, $headersString);
    
    if (!$sent) {
        error_log('Failed to send email to: ' . $to);
    }
    
    return $sent;
}

try {
    // Get POST data
    $rawData = file_get_contents('php://input');
    $data = json_decode($rawData, true);
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('Invalid JSON data');
    }
    
    // Extract and sanitize form data
    $name = isset($data['name']) ? sanitizeInput($data['name']) : '';
    $email = isset($data['email']) ? sanitizeInput($data['email']) : '';
    $subject = isset($data['subject']) ? sanitizeInput($data['subject']) : '';
    $message = isset($data['message']) ? sanitizeInput($data['message']) : '';
    $recaptchaToken = isset($data['recaptchaToken']) ? $data['recaptchaToken'] : '';
    
    // Validation
    $errors = [];
    
    if (empty($name)) {
        $errors[] = 'Name is required';
    }
    
    if (empty($email)) {
        $errors[] = 'Email is required';
    } elseif (!validateEmail($email)) {
        $errors[] = 'Invalid email format';
    }
    
    if (empty($subject)) {
        $errors[] = 'Subject is required';
    }
    
    if (empty($message)) {
        $errors[] = 'Message is required';
    } elseif (strlen($message) < 10) {
        $errors[] = 'Message must be at least 10 characters';
    }
    
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => implode(', ', $errors)
        ]);
        exit();
    }
    
    // Verify reCAPTCHA
    if (!verifyRecaptcha($recaptchaToken)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'reCAPTCHA verification failed. Please try again.'
        ]);
        exit();
    }
    
    // Send email
    $emailSent = sendEmail($name, $email, $subject, $message);
    
    if ($emailSent) {
        http_response_code(200);
        echo json_encode([
            'success' => true,
            'message' => 'Your message has been sent successfully!'
        ]);
        
        // Log successful submission
        error_log("Contact form submitted successfully from: $email");
    } else {
        throw new Exception('Failed to send email. Please try again later.');
    } 
    
} catch (Exception $e) {
    error_log('Contact form error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while processing your request. Please try again later.'
    ]);
}
?>