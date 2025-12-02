// Elementos
const rolSelect = document.getElementById('rol');
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');

const loginContainer = document.getElementById('login-container');
const vistaEstudiante = document.getElementById('vista-estudiante');
const vistaAdmin = document.getElementById('vista-admin');

const formMateria = document.getElementById('form-materia');
const materiasAdmin = document.getElementById('materias-admin');
const materiasEstudiante = document.getElementById('materias-estudiante');
const promedioFinal = document.getElementById('promedioFinal');

// Materias almacenadas en localStorage
let materias = JSON.parse(localStorage.getItem('materias')) || [];

// Función para guardar en localStorage
function guardarMaterias() {
    localStorage.setItem('materias', JSON.stringify(materias));
}

// Login simulado
btnLogin.addEventListener('click', () => {
    const rol = rolSelect.value;
    loginContainer.style.display = 'none';
    if (rol === 'admin') vistaAdmin.style.display = 'flex';
    else vistaEstudiante.style.display = 'flex';
    renderAdmin();
    renderEstudiante();
});

// Logout
btnLogout.addEventListener('click', () => {
    loginContainer.style.display = 'block';
    vistaAdmin.style.display = 'none';
    vistaEstudiante.style.display = 'none';
});

// Agregar materia
formMateria.addEventListener('submit', e => {
    e.preventDefault();
    const nombre = document.getElementById('nombreMateria').value;
    const nota1 = parseInt(document.getElementById('nota1').value);
    const nota2 = parseInt(document.getElementById('nota2').value);
    const nota3 = parseInt(document.getElementById('nota3').value);
    const promedio = ((nota1+nota2+nota3)/3).toFixed(2);

    materias.push({nombre, notas: [nota1, nota2, nota3], promedio: parseFloat(promedio)});
    guardarMaterias();

    formMateria.reset();
    renderAdmin();
    renderEstudiante();
});

// Render administración
function renderAdmin() {
    materiasAdmin.innerHTML = '';
    materias.forEach((m, i) => {
        const div = document.createElement('div');
        div.className = 'materia-card';
        div.innerHTML = `
            <h3>${m.nombre}</h3>
            <p>Unidad 1: ${m.notas[0]}</p>
            <p>Unidad 2: ${m.notas[1]}</p>
            <p>Unidad 3: ${m.notas[2]}</p>
            <p class="promedio">${m.promedio}</p>
            <button onclick="editarMateria(${i})">Editar</button>
            <button onclick="eliminarMateria(${i})">Eliminar</button>
        `;
        materiasAdmin.appendChild(div);

        // Color promedio
        const promElem = div.querySelector('.promedio');
        if (m.promedio >= 90) promElem.classList.add('alto');
        else if (m.promedio >= 80) promElem.classList.add('medio');
        else promElem.classList.add('bajo');
    });
}

// Render estudiante
function renderEstudiante() {
    materiasEstudiante.innerHTML = '';
    let sumaProm = 0;
    materias.forEach(m => {
        const div = document.createElement('div');
        div.className = 'materia-card';
        div.innerHTML = `
            <h3>${m.nombre}</h3>
            <p>Unidad 1: ${m.notas[0]}</p>
            <p>Unidad 2: ${m.notas[1]}</p>
            <p>Unidad 3: ${m.notas[2]}</p>
            <p class="promedio">${m.promedio}</p>
        `;
        const promElem = div.querySelector('.promedio');
        if (m.promedio >= 90) promElem.classList.add('alto');
        else if (m.promedio >= 80) promElem.classList.add('medio');
        else promElem.classList.add('bajo');
        materiasEstudiante.appendChild(div);
        sumaProm += m.promedio;
    });

    if (materias.length > 0) {
        const promedioGen = (sumaProm / materias.length).toFixed(2);
        promedioFinal.textContent = `Promedio General: ${promedioGen}`;
        promedioFinal.className = 'promedio';
        if (promedioGen >= 90) promedioFinal.classList.add('alto');
        else if (promedioGen >= 80) promedioFinal.classList.add('medio');
        else promedioFinal.classList.add('bajo');
    } else promedioFinal.textContent = '';
}

// Editar materia
function editarMateria(i) {
    const m = materias[i];
    const nuevoNombre = prompt("Nombre de la materia:", m.nombre);
    if (!nuevoNombre) return;
    const n1 = prompt("Unidad 1:", m.notas[0]);
    const n2 = prompt("Unidad 2:", m.notas[1]);
    const n3 = prompt("Unidad 3:", m.notas[2]);
    if (!n1 || !n2 || !n3) return;

    const promedio = ((parseInt(n1)+parseInt(n2)+parseInt(n3))/3).toFixed(2);
    materias[i] = {nombre: nuevoNombre, notas: [parseInt(n1), parseInt(n2), parseInt(n3)], promedio: parseFloat(promedio)};
    guardarMaterias();
    renderAdmin();
    renderEstudiante();
}

// Eliminar materia
function eliminarMateria(i) {
    if(confirm("¿Deseas eliminar esta materia?")) {
        materias.splice(i,1);
        guardarMaterias();
        renderAdmin();
        renderEstudiante();
    }
}

// Inicializar vista estudiante si ya hay materias
renderEstudiante();