let apiUrl = 'https://dragonball-api.com/api/characters';
let currentPage = 1;
let totalPages = 1;

function obtenerPersonajes(url) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            let data = JSON.parse(xhr.responseText);
            let personajes = data.items || data;  // Simplificado para manejar ambas estructuras de respuesta
            mostrarPersonajes(personajes);
            totalPages = Math.ceil((data.meta ? data.meta.totalItems : personajes.length) / 10);
            mostrarPaginacion();
        } else {
            console.error('Error al obtener los personajes:', xhr.statusText);
        }
    };
    xhr.send();
}

function mostrarPersonajes(personajes) {
    let characterList = document.getElementById('characterList');
    characterList.innerHTML = '';

    for (let i = 0; i < personajes.length; i++) {
        let row = document.createElement('tr');
        row.innerHTML = `
            <td>${personajes[i].id}</td>
            <td><a href="#" onclick="mostrarDetallesPersonaje(${personajes[i].id})">${personajes[i].name}</a></td>
            <td>${personajes[i].race}</td>
            <td>${personajes[i].gender}</td>
        `;
        characterList.appendChild(row);
    }
}

function mostrarDetallesPersonaje(id) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl + '/' + id, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            let personaje = JSON.parse(xhr.responseText);
            let characterDetails = document.getElementById('characterDetails');
            characterDetails.innerHTML = `
                <h2>${personaje.name}</h2>
                <p><strong>Raza:</strong> ${personaje.race}</p>
                <p><strong>Género:</strong> ${personaje.gender}</p>
                <p><strong>Descripción:</strong> ${personaje.description}</p>
                <img src="${personaje.image}" alt="${personaje.name}">
            `;
        } else {
            console.error('Error al obtener los detalles del personaje:', xhr.statusText);
        }
    };
    xhr.send();
}

function buscarPersonajes() {
    let name = document.getElementById('buscarNombre').value;
    let race = document.getElementById('buscarRaza').value;
    let gender = document.getElementById('buscarGenero').value;

    let query = apiUrl + '?';
    if (name) query += 'name=' + name + '&';
    if (race) query += 'race=' + race + '&';
    if (gender) query += 'gender=' + gender + '&';

    currentPage = 1;
    query += 'page=' + currentPage;

    obtenerPersonajes(query);
}

function mostrarPaginacion() {
    let pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    let primera = document.createElement('button');
    primera.innerHTML = 'Primera';
    primera.onclick = function() { cambiarPagina(1); };
    pagination.appendChild(primera);

    for (let i = 1; i <= totalPages; i++) {
        let pagina = document.createElement('button');
        pagina.innerHTML = i;
        pagina.onclick = (function(page) {
            return function() { cambiarPagina(page); };
        })(i);
        if (i === currentPage) {
            pagina.style.fontWeight = 'bold';
        }
        pagination.appendChild(pagina);
    }

    let ultima = document.createElement('button');
    ultima.innerHTML = 'Última';
    ultima.onclick = function() { cambiarPagina(totalPages); };
    pagination.appendChild(ultima);
}

function cambiarPagina(page) {
    currentPage = page;
    let name = document.getElementById('buscarNombre').value;
    let race = document.getElementById('buscarRaza').value;
    let gender = document.getElementById('buscarGenero').value;

    let query = apiUrl + '?';
    if (name) query += 'name=' + name + '&';
    if (race) query += 'race=' + race + '&';
    if (gender) query += 'gender=' + gender + '&';

    query += 'page=' + currentPage;

    obtenerPersonajes(query);
}

// Carga inicial de personajes
obtenerPersonajes(apiUrl + '?page=' + currentPage);