<?php
// controllers/tabla_integrantes.php
require_once '../models/ModeloEntrenador.php';

if(isset($_GET['idEquipo'])) {
    $idEquipo = $_GET['idEquipo'];
    
    // Llamamos al método que ya existe en tu ModeloEntrenador
    $integrantes = ModeloEntrenador::obtenerIntegrantes($idEquipo);
    
    // --- GENERACIÓN DE HTML (Filas de la tabla) ---
    if (empty($integrantes)) {
        echo '<tr><td colspan="4" style="text-align:center; padding:15px; color:#777;">Este equipo aún no tiene integrantes registrados.</td></tr>';
    } else {
        foreach ($integrantes as $alumno) {
            echo '<tr style="border-bottom: 1px solid #eee;">';
            echo '<td style="padding:10px;"><strong>' . htmlspecialchars($alumno['numControl']) . '</strong></td>';
            echo '<td style="padding:10px;">' . htmlspecialchars($alumno['nombre_completo']) . '</td>';
            echo '<td style="padding:10px;">' . htmlspecialchars($alumno['edad']) . ' años</td>';
            echo '<td style="padding:10px; font-size:0.85rem; color:#555;">' . htmlspecialchars($alumno['nombreEscuela']) . '</td>';
            echo '</tr>';
        }
    }
}
?>