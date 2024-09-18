import ApiServe from './ApiService.js';

const api = new ApiServe();

function renderMatches(matches, containerId) {
	const container = document.getElementById(containerId);
	container.innerHTML = ''; // Limpiar contenido existente

	matches.forEach((match) => {
		const matchElement = document.createElement('div');
		matchElement.classList.add('match');

		matchElement.innerHTML = `
            <div class="time">${match.fixture.status.elapsed}'</div>
            <div class="teams">${match.teams.home.name} <br> ${match.teams.away.name}</div>
            <div class="score">${match.goals.home} <br> ${match.goals.away}</div>
        `;

		container.appendChild(matchElement);
	});
}

function loadMatches() {
	// Cargar partidos en directo de España (ID de La Liga = 140)
	api.fetchMatches(140).then((matches) => {
		renderMatches(matches, 'spain-matches');
	});

	// Cargar partidos en directo de Inglaterra (ID de Premier League = 39)
	api.fetchMatches(39).then((matches) => {
		renderMatches(matches, 'england-matches');
	});

	// Cargar partidos en directo de Alemania (ID de Bundesliga = 78)
	api.fetchMatches(78).then((matches) => {
		renderMatches(matches, 'germany-matches');
	});

	// Cargar partidos en directo de Francia (ID de Ligue 1 = 61)
	api.fetchMatches(61).then((matches) => {
		renderMatches(matches, 'france-matches');
	});

	// Cargar partidos en directo de Italia (ID de Serie A = 135)
	api.fetchMatches(135).then((matches) => {
		renderMatches(matches, 'italy-matches');
	});
}

// Llamar a la función al cargar la página
loadMatches();

