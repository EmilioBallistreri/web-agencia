<?php
/**
 * Head Brand Partner - Procesador de Formulario de Contacto
 * Compatible 100% con servidores DonWeb (Ferozo / cPanel / Apache / LiteSpeed)
 * Envía las consultas a: cuentas@headbrandpartner.com.ar
 */

// Encabezado de respuesta JSON
header('Content-Type: application/json; charset=UTF-8');

// 1. Permitir únicamente solicitudes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido. Solo se aceptan solicitudes POST.'
    ]);
    exit;
}

// 2. Honeypot anti-spam (si el campo invisible tiene valor, es un bot)
if (!empty($_POST['_gotcha'])) {
    echo json_encode([
        'success' => true,
        'message' => 'Consulta procesada correctamente.'
    ]);
    exit;
}

// 3. Capturar y sanitizar datos recibidos
$name    = isset($_POST['name']) ? trim(strip_tags($_POST['name'])) : '';
$company = isset($_POST['company']) ? trim(strip_tags($_POST['company'])) : '';
$email   = isset($_POST['email']) ? trim(filter_var($_POST['email'], FILTER_SANITIZE_EMAIL)) : '';
$phone   = isset($_POST['phone']) ? trim(strip_tags($_POST['phone'])) : '';
$service = isset($_POST['service']) ? trim(strip_tags($_POST['service'])) : '';
$message = isset($_POST['message']) ? trim(strip_tags($_POST['message'])) : '';

// 4. Validar campos obligatorios
if (empty($name) || empty($company) || empty($email) || empty($phone) || empty($service) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Por favor, completá todos los campos obligatorios (*).'
    ]);
    exit;
}

// 5. Validar formato de correo electrónico
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'El correo electrónico ingresado no tiene un formato válido.'
    ]);
    exit;
}

// 6. Prevenir inyecciones en los encabezados
$name    = str_replace(["\r", "\n"], '', $name);
$company = str_replace(["\r", "\n"], '', $company);
$service = str_replace(["\r", "\n"], '', $service);

// 7. Configuración del destinatario y asunto
$to      = 'cuentas@headbrandpartner.com.ar';
$subject = 'Nueva Consulta Web: ' . $name . ' (' . $company . ') - ' . $service;

// 8. Construcción del diseño HTML del correo
$date = date('d/m/Y H:i');
$cleanPhoneDigits = preg_replace('/[^0-9]/', '', $phone);

$emailBody = '
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background-color: #0b0f19; margin: 0; padding: 25px; color: #1e293b; }
    .card { max-width: 620px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 30px rgba(0,0,0,0.25); border: 1px solid #e2e8f0; }
    .header { background: #07090e; color: #ffffff; padding: 28px 32px; border-bottom: 3px solid #F5BD02; }
    .header h1 { margin: 0; font-size: 21px; color: #ffffff; letter-spacing: -0.3px; }
    .header p { margin: 6px 0 0; color: #94a3b8; font-size: 13px; }
    .content { padding: 30px 32px; }
    .field-row { margin-bottom: 18px; padding-bottom: 14px; border-bottom: 1px solid #f1f5f9; }
    .field-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
    .label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.6px; margin-bottom: 4px; }
    .value { font-size: 15px; color: #0f172a; line-height: 1.5; }
    .tag { display: inline-block; background: #FEF3C7; color: #92400E; padding: 4px 10px; border-radius: 6px; font-weight: 700; font-size: 13px; }
    .message-box { background: #f8fafc; border-left: 4px solid #F5BD02; padding: 16px; border-radius: 0 8px 8px 0; font-size: 14px; line-height: 1.6; color: #334155; }
    .cta-actions { margin-top: 25px; padding-top: 20px; border-top: 1px dashed #cbd5e1; display: flex; gap: 10px; }
    .btn-action { display: inline-block; padding: 10px 18px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600; }
    .btn-mail { background: #07090e; color: #ffffff !important; }
    .btn-wa { background: #25D366; color: #ffffff !important; }
    .footer { background: #f8fafc; padding: 16px 32px; text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>Nueva Consulta Web &bull; Head Brand Partner</h1>
      <p>Recibida el ' . $date . ' hs.</p>
    </div>
    <div class="content">
      <div class="field-row">
        <div class="label">Nombre y Apellido</div>
        <div class="value"><strong>' . htmlspecialchars($name, ENT_QUOTES, 'UTF-8') . '</strong></div>
      </div>
      <div class="field-row">
        <div class="label">Empresa / Marca</div>
        <div class="value">' . htmlspecialchars($company, ENT_QUOTES, 'UTF-8') . '</div>
      </div>
      <div class="field-row">
        <div class="label">Correo Electrónico</div>
        <div class="value"><a href="mailto:' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '">' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '</a></div>
      </div>
      <div class="field-row">
        <div class="label">Teléfono / WhatsApp</div>
        <div class="value">' . htmlspecialchars($phone, ENT_QUOTES, 'UTF-8') . '</div>
      </div>
      <div class="field-row">
        <div class="label">Servicio Solicitado</div>
        <div class="value"><span class="tag">' . htmlspecialchars($service, ENT_QUOTES, 'UTF-8') . '</span></div>
      </div>
      <div class="field-row">
        <div class="label">Mensaje / Objetivo</div>
        <div class="message-box">' . nl2br(htmlspecialchars($message, ENT_QUOTES, 'UTF-8')) . '</div>
      </div>

      <div class="cta-actions">
        <a href="mailto:' . htmlspecialchars($email, ENT_QUOTES, 'UTF-8') . '" class="btn-action btn-mail">Responder por Email</a>
        ' . (!empty($cleanPhoneDigits) ? '<a href="https://wa.me/' . $cleanPhoneDigits . '" class="btn-action btn-wa">Contactar por WhatsApp</a>' : '') . '
      </div>
    </div>
    <div class="footer">
      Enviado automáticamente desde el formulario web de <a href="https://headbrandpartner.com.ar" style="color:#64748b;">headbrandpartner.com.ar</a>
    </div>
  </div>
</body>
</html>';

// 9. Encabezados de correo para DonWeb
$headers   = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=UTF-8';
$headers[] = 'From: Web Head Brand Partner <cuentas@headbrandpartner.com.ar>';
$headers[] = 'Reply-To: ' . $name . ' <' . $email . '>';
$headers[] = 'X-Mailer: PHP/' . phpversion();

// Codificar asunto en UTF-8 para evitar problemas con acentos y caracteres especiales
$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

// 10. Despachar a través de la función mail() nativa de DonWeb
$mailSuccess = @mail($to, $encodedSubject, $emailBody, implode("\r\n", $headers));

if ($mailSuccess) {
    echo json_encode([
        'success' => true,
        'message' => '¡Excelente, ' . $name . '! Hemos recibido tu consulta sobre "' . $service . '". Nos pondremos en contacto contigo a la brevedad.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Hubo un error al procesar el envío en el servidor. Por favor, escribinos directamente por WhatsApp.'
    ]);
}
