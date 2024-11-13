<?php
// Habilitar la visualización de errores para detectar problemas
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Configuración de conexión a la base de datos
$servername = "localhost";
$username = "root";
$password = "josematias1010";
$dbname = "Local";

// Crear conexión
$conn = new mysqli($servername, $username, $password, $dbname);

// Verificar la conexión
if ($conn->connect_error) {
    die(json_encode(["mensaje" => "Conexión fallida: " . $conn->connect_error]));
}

// Recibir datos de la solicitud POST y decodificar el JSON
$data = json_decode(file_get_contents("php://input"), true);

// Validar que se recibieron datos
if (!isset($data['productos']) || !isset($data['total'])) {
    echo json_encode(["mensaje" => "Datos de pedido incompletos"]);
    $conn->close();
    exit();
}

// Convertir productos a JSON y capturar el total
$productos = json_encode($data['productos']);
$total = $data['total'];

// Preparar la consulta SQL para insertar el pedido
$sql = "INSERT INTO pedidos (productos, total) VALUES (?, ?)";
$stmt = $conn->prepare($sql);
if (!$stmt) {
    echo json_encode(["mensaje" => "Error en la preparación de la consulta", "error" => $conn->error]);
    $conn->close();
    exit();
}

// Vincular parámetros y ejecutar la consulta
$stmt->bind_param("sd", $productos, $total);
if ($stmt->execute()) {
    echo json_encode(["mensaje" => "Pedido guardado con éxito"]);
} else {
    echo json_encode(["mensaje" => "Error al guardar el pedido", "error" => $stmt->error]);
}

// Cerrar la declaración y la conexión
$stmt->close();
$conn->close();
?>


