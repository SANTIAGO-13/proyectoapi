const apiUrl = 'http://localhost:3001/api/clasificacion';
const historyList = document.getElementById('history-list');

document.addEventListener('DOMContentLoaded', loadData);

async function loadData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Error en la solicitud');

        const data = await response.json();
        const dataList = document.getElementById('data-list');
        dataList.innerHTML = '';

        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.nombreEquipo}</td>
                <td>${item.posicion}</td>
                <td>${item.partidosJugados}</td>
                <td>${item.victorias}</td>
                <td>${item.empates}</td>
                <td>${item.derrotas}</td>
                <td>${item.golesAFavor}</td>
                <td>${item.golesEnContra}</td>
                <td>${item.puntos}</td>
                <td><img src="${item.escudoEquipo}" alt="Escudo" width="50"></td>
                <td>
                    <button onclick="selectItem(${item.id})">Seleccionar</button>
                </td>
            `;
            dataList.appendChild(row);
        });
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
}

let selectedId = null;

function selectItem(id) {
    selectedId = id;
    alert(`Seleccionaste el ID: ${id}`);
}

function addHistory(action, item) {
    const historyList = document.getElementById('history-list');
    const historyRow = document.createElement('tr');
    historyRow.innerHTML = `
        <td>${action}</td>
        <td>${item.id || ''}</td>
        <td>${item.nombreEquipo || ''}</td>
        <td>${item.posicion || ''}</td>
        <td>${item.partidosJugados || ''}</td>
        <td>${item.victorias || ''}</td>
        <td>${item.empates || ''}</td>
        <td>${item.derrotas || ''}</td>
        <td>${item.golesAFavor || ''}</td>
        <td>${item.golesEnContra || ''}</td>
        <td>${item.puntos || ''}</td>
        <td>${item.escudoEquipo || ''}</td>
    `;
    historyList.appendChild(historyRow);
}

document.getElementById('add-button').addEventListener('click', async () => {
    const nombreEquipo = prompt("Ingrese el nombre del equipo:");
    const posicion = prompt("Ingrese la posición:");
    const partidosJugados = prompt("Ingrese los partidos jugados:");
    const victorias = prompt("Ingrese las victorias:");
    const empates = prompt("Ingrese los empates:");
    const derrotas = prompt("Ingrese las derrotas:");
    const golesAFavor = prompt("Ingrese los goles a favor:");
    const golesEnContra = prompt("Ingrese los goles en contra:");
    const puntos = prompt("Ingrese los puntos:");
    const escudoEquipo = prompt("Ingrese la URL del escudo:");

    if (nombreEquipo) {
        const nuevoDato = {
            nombreEquipo,
            posicion,
            partidosJugados,
            victorias,
            empates,
            derrotas,
            golesAFavor,
            golesEnContra,
            puntos,
            escudoEquipo
        };

        try {
            await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoDato)
            });
            loadData(); // Recargar datos después de agregar
            addHistory('Agregado', nuevoDato);
        } catch (error) {
            console.error('Error al agregar el dato:', error);
        }
    }
});

document.getElementById('edit-button').addEventListener('click', async () => {
    if (!selectedId) {
        alert("Por favor, selecciona un equipo para editar.");
        return;
    }

    const nombreEquipo = prompt("Ingrese el nuevo nombre del equipo:");
    const posicion = prompt("Ingrese la nueva posición:");
    const partidosJugados = prompt("Ingrese los nuevos partidos jugados:");
    const victorias = prompt("Ingrese las nuevas victorias:");
    const empates = prompt("Ingrese los nuevos empates:");
    const derrotas = prompt("Ingrese las nuevas derrotas:");
    const golesAFavor = prompt("Ingrese los nuevos goles a favor:");
    const golesEnContra = prompt("Ingrese los nuevos goles en contra:");
    const puntos = prompt("Ingrese los nuevos puntos:");
    const escudoEquipo = prompt("Ingrese la nueva URL del escudo:");

    const updatedData = {
        nombreEquipo,
        posicion,
        partidosJugados,
        victorias,
        empates,
        derrotas,
        golesAFavor,
        golesEnContra,
        puntos,
        escudoEquipo
    };

    try {
        await fetch(`${apiUrl}/${selectedId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedData)
        });
        loadData(); // Recargar datos después de editar
        addHistory('Modificado', { id: selectedId, ...updatedData });
    } catch (error) {
        console.error('Error al editar el dato:', error);
    }
});

document.getElementById('delete-button').addEventListener('click', async () => {
    if (!selectedId) {
        alert("Por favor, selecciona un equipo para eliminar.");
        return;
    }

    if (confirm("¿Estás seguro de que deseas eliminar este equipo?")) {
        try {
            const response = await fetch(`${apiUrl}/${selectedId}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                loadData(); // Recargar datos después de eliminar
                addHistory('Eliminado', { id: selectedId });
                selectedId = null; // Resetear selección
            } else {
                console.error('Error al eliminar el dato:', response.statusText);
            }
        } catch (error) {
            console.error('Error al eliminar el dato:', error);
        }
    }
});



