/**
 * Lógica específica para el Dashboard de Administrador
 */

// --- NAVEGACIÓN ENTRE SECCIONES ---
function showSection(id, el) {
    document.querySelectorAll('.section-view').forEach(d => d.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    el.classList.add('active');
}

// --- FILTRO EQUIPOS ---
function filtrarEquipos() {
    const filtro = document.getElementById('schoolFilter').value;
    const tarjetas = document.querySelectorAll('.team-card-interactive');
    let visibles = 0;
    
    tarjetas.forEach(card => {
        const escuela = card.getAttribute('data-escuela');
        if (filtro === 'all' || escuela === filtro) {
            card.style.display = 'block'; 
            visibles++;
        } else {
            card.style.display = 'none';
        }
    });
    
    document.getElementById('contadorEquipos').innerText = 'Mostrando ' + visibles + ' equipos';
}

// --- CARGA DINÁMICA DE JUECES ---
function cargarJuecesValidos(selectElement) {
    const cat = selectElement.value;
    const nombreCat = selectElement.options[selectElement.selectedIndex].getAttribute('data-nombre');
    const container = document.getElementById('listaJuecesCheckboxes');
    const areaJueces = document.getElementById('areaJueces');
    
    if(!cat) { areaJueces.style.display='none'; return; }
    
    fetch('../../controllers/api_jueces_validos.php?cat='+cat)
        .then(r => r.json())
        .then(d => {
            container.innerHTML = '';
            if(d.length === 0) {
                container.innerHTML = '<p style="color:red">No hay jueces disponibles.</p>';
            } else {
                let juecesCategoria = [];
                let juecesGenerales = [];
                d.forEach(j => {
                    if(j.etiqueta_extra && j.etiqueta_extra.includes('General')) {
                        juecesGenerales.push(j);
                    } else {
                        juecesCategoria.push(j);
                    }
                });

                if (juecesCategoria.length > 0) {
                    const headerHTML = `<div class="jueces-section-header"><i class="fas fa-star" style="color:#f1c40f;"></i> Jueces de ${nombreCat}</div>`;
                    let gridCat = document.createElement('div');
                    gridCat.style.display = 'grid'; gridCat.style.gridTemplateColumns = '1fr 1fr'; gridCat.style.gap = '10px'; gridCat.style.marginBottom = '20px';
                    
                    juecesCategoria.forEach(j => {
                        const asignadoText = (j.ya_asignado == 1) ? '<span style="color:orange; font-size:0.8rem;">(Ya Asignado)</span>' : '<span style="color:green; font-size:0.8rem;">(Disponible)</span>';
                        gridCat.innerHTML += `<div class="juez-item"><input type="checkbox" name="jueces[]" value="${j.idJuez}"> <strong>${j.nombre_completo}</strong> ${asignadoText}<br><small style="color:#666;">${j.nombreEscuela}</small></div>`;
                    });
                    container.innerHTML += headerHTML;
                    container.appendChild(gridCat);
                }

                if (juecesGenerales.length > 0) {
                    const headerHTML = `<div class="jueces-section-header"><i class="fas fa-users" style="color:#3498db;"></i> Jueces Generales / Disponibles</div>`;
                    let gridGen = document.createElement('div');
                    gridGen.style.display = 'grid'; gridGen.style.gridTemplateColumns = '1fr 1fr'; gridGen.style.gap = '10px';
                    juecesGenerales.forEach(j => {
                        const asignadoText = (j.ya_asignado == 1) ? '<span style="color:orange; font-size:0.8rem;">(Ya Asignado)</span>' : '<span style="color:green; font-size:0.8rem;">(Disponible)</span>';
                        gridGen.innerHTML += `<div class="juez-item"><input type="checkbox" name="jueces[]" value="${j.idJuez}"> <strong>${j.nombre_completo}</strong> <span style="font-size:0.75rem; color:#999;">(General)</span> ${asignadoText}<br><small style="color:#666;">${j.nombreEscuela}</small></div>`;
                    });
                    container.innerHTML += headerHTML;
                    container.appendChild(gridGen);
                }
            }
            areaJueces.style.display = 'block';
        })
        .catch(error => { console.error('Error cargando jueces:', error); container.innerHTML = '<p style="color:red">Error al cargar datos.</p>'; });
}

// --- MODAL EDITAR (ACTUALIZADO) ---
// Ahora recibe el rol actual como tercer argumento
function abrirModalEditar(id, nombre, rolActual) {
    document.getElementById('idUsuarioModal').value = id;
    document.getElementById('nombreUsuarioModal').innerText = nombre;
    
    // Normalizar el rol (ej: "Entrenador" -> "entrenador") para que coincida con el value del select
    let rolNormalizado = rolActual ? rolActual.toLowerCase() : 'asistente';
    
    // 1. Establecer valor en el select visual (bloqueado)
    document.getElementById('selectRolVisual').value = rolNormalizado;
    
    // 2. Establecer valor en el input oculto (para enviar al backend)
    document.getElementById('inputRolOculto').value = rolNormalizado;
    
    document.getElementById('modalEditarUsuario').style.display = 'flex';
}

function cerrarModal() { 
    document.getElementById('modalEditarUsuario').style.display = 'none'; 
}

window.onclick = function(e) { 
    if(e.target == document.getElementById('modalEditarUsuario')) {
        cerrarModal(); 
    }
}

// --- NOTIFICACIONES ---
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const msg = urlParams.get('msg');
    const error = urlParams.get('error');
    if(msg) {
        const ab = document.getElementById('alertBoxSuccess');
        if(ab) { document.getElementById('alertTextSuccess').innerText = msg; ab.style.display = 'block'; setTimeout(() => { ab.style.display = 'none'; }, 5000); window.history.replaceState({}, document.title, window.location.pathname); }
    }
    if(error) {
        const ab = document.getElementById('alertBoxError');
        if(ab) { document.getElementById('alertTextError').innerText = error; ab.style.display = 'block'; setTimeout(() => { ab.style.display = 'none'; }, 6000); window.history.replaceState({}, document.title, window.location.pathname); }
    }
});