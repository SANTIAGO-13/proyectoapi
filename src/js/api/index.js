import ApiServe from './ApiService.js';

const api = new ApiServe();

const API_KEY = '6d519e9fb5e94284c0009d7339dd3a42';
const API_HOST = 'v3.football.api-sports.io';

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector('.live-button').addEventListener('click', renderLiveMatches);
    document.querySelector('.finished-button').addEventListener('click', renderFinishedMatches);
    loadMatches();
    fetchUpcomingMatches();
});

function loadMatches() {
    const leagues = ['spain', 'england', 'germany', 'france', 'italy'];

    leagues.forEach((league) => {
        const leagueId = getLeagueId(league);

        if (leagueId) {
            api.fetchMatches(leagueId).then((matches) => {
                renderMatches(matches, `${league}-matches`);
            }).catch((error) => console.error(`Error fetching ${league} matches:`, error));
        }
    });
}

function renderLiveMatches() {
    const leagues = ['spain', 'england', 'germany', 'france', 'italy'];

    leagues.forEach((league) => {
        const leagueId = getLeagueId(league);

        if (leagueId) {
            api.fetchMatches(leagueId).then((matches) => {
                const liveMatches = matches.filter(match => match.status === 'live');
                renderMatches(liveMatches, `${league}-matches`);
            }).catch((error) => console.error(`Error fetching live matches for ${league}:`, error));
        }
    });
}

function renderFinishedMatches() {
    const leagues = ['spain', 'england', 'germany', 'france', 'italy'];

    leagues.forEach((league) => {
        const leagueId = getLeagueId(league);

        if (leagueId) {
            api.fetchFinishedMatches(leagueId, 2023).then((matches) => {
                renderMatches(matches, `${league}-matches`);
            }).catch((error) => console.error(`Error fetching finished matches for ${league}:`, error));
        }
    });
}

function getLeagueId(league) {
    const leagueIds = {
        spain: 140,
        england: 39,
        germany: 78,
        france: 61,
        italy: 135
    };

    return leagueIds[league] || null;
}

function renderMatches(matches, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
    }

    container.innerHTML = '';

    matches.forEach(match => {
        const matchElement = document.createElement('div');
        matchElement.className = 'match';
        matchElement.innerHTML = `
            <div class="match-info">
                <span class="team">${match.teams.home.name}</span> vs
                <span class="team">${match.teams.away.name}</span>
                <span class="score">${match.score.fullTime.home} - ${match.score.fullTime.away}</span>
                <span class="status">${new Date(match.fixture.date).toLocaleString()}</span>
            </div>
        `;
        container.appendChild(matchElement);
    });
}

function fetchUpcomingMatches() {
    const leagues = ['spain', 'england', 'germany', 'france', 'italy'];
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    leagues.forEach((league) => {
        const leagueId = getLeagueId(league);
        if (leagueId) {
            fetch(`http://localhost:3001/api/fixtures?league=${leagueId}&season=2024&date=${tomorrow.toISOString().split('T')[0]}`, {
                method: 'GET',
                headers: {
                    'x-rapidapi-host': API_HOST,
                    'x-rapidapi-key': API_KEY
                }
            })
            .then(response => response.json())
            .then(data => {
                displayUpcomingMatches(data);
            })
            .catch(err => {
                console.error('Error al obtener los próximos partidos:', err);
            });
        }
    });
}

function displayUpcomingMatches(data) {
    const upcomingMatchesContainer = document.getElementById('upcoming-matches');
    if (!upcomingMatchesContainer) {
        console.error('Container for upcoming matches not found');
        return;
    }

    upcomingMatchesContainer.innerHTML = '';

    data.response.forEach(match => {
        const matchElement = document.createElement('div');
        matchElement.className = 'match';
        matchElement.innerHTML = `
            <div class="match-info">
                <span class="team">${match.teams.home.name}</span> vs
                <span class="team">${match.teams.away.name}</span>
                <span class="status">${new Date(match.fixture.date).toLocaleString()}</span>
            </div>
        `;
        upcomingMatchesContainer.appendChild(matchElement);
    });
}












