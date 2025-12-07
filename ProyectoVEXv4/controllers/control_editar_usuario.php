<?php
session_start();
require_once '../models/ModeloAdmin.php';

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $idUsuario = $_POST['idUsuario'];
    $nuevoRol  = $_POST['nuevoRol'];
    $escuela   = $_POST['escuelaModal'];
    
    // CORRECCIÓN IMPORTANTE:
    // Convertir cadena vacía "" a NULL para evitar error de Llave Foránea en SQL
    $categoria = !empty($_POST['categoriaModal']) ? $_POST['categoriaModal'] : null;

    if ($nuevoRol == 'juez') {
        ModeloAdmin::quitarRolEntrenador($idUsuario);
        // Pasamos la categoría (ahora puede ser NULL o un ID válido)
        ModeloAdmin::asignarRolJuez($idUsuario, $escuela, 'Licenciatura', $categoria);
    }
    
    elseif ($nuevoRol == 'entrenador') {
        ModeloAdmin::quitarRolJuez($idUsuario);
        ModeloAdmin::asignarRolEntrenador($idUsuario, $escuela);
    }
    
    elseif ($nuevoRol == 'ambos') {
        ModeloAdmin::asignarRolEntrenador($idUsuario, $escuela);
        ModeloAdmin::asignarRolJuez($idUsuario, $escuela, 'Licenciatura', $categoria);
    }

    $mensaje = "Rol actualizado correctamente a: " . ucfirst($nuevoRol);
    header("Location: ../views/dashboards/adminDashboard.php?msg=" . urlencode($mensaje));
    exit;
}
?>