const boxTeams = document.getElementById('league-box');
const matchDetailsContainer = document.getElementById('match-details');
const summaryInfoContainer = document.getElementById('summary-info');
const statisticsInfoContainer = document.getElementById('statistics-info');
const lineupInfoContainer = document.getElementById('lineup-info');
const btnResumen = document.getElementById('btn-resumen');
const btnEstadisticas = document.getElementById('btn-estadisticas');
const btnAlineaciones = document.getElementById('btn-alineaciones');
const btnClasificacion = document.getElementById('btn-clasificacion'); // Nuevo botón para clasificación

const KEY = "26839ee7235647220b4d994b6ccc65cef5ad80f21c63a52cadf74b96e0e292bc";
const LEAGUES = {
    esp: { id: 6, index: 1 },
};

const API_URL = "https://apiv3.apifootball.com/";

async function fetchAPI(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

function createHtml(urlImg, textPais, textLiga) {
    return `<div class="box">
                <div class="liga-info">
                    <img class="img-pais-liga" src="${urlImg}" alt="${textLiga}" />
                    <div class="liga-details">
                        <span class="country-name">${textPais}</span>
                        <h1 class="title-liga">${textLiga}</h1>
                    </div>
                </div>
                <p class="jornada">Jornada 5</p>
            </div>`;
}

function createMatchDetails(match, leagueLogo) {
    return `<div class="match-details">
                <h2>Detalles del Partido</h2>
                <div class="match-info">
                    <img src="${match.team_home_badge}" alt="${match.match_hometeam_name}" class="team-badge" />
                    <span>${match.match_hometeam_name} ${match.match_hometeam_ft_score} - ${match.match_awayteam_ft_score} ${match.match_awayteam_name}</span>
                    <img src="${match.team_away_badge}" alt="${match.match_awayteam_name}" class="team-badge" />
                </div>
                <p>Fecha: ${match.match_date}</p>
                <p class="match-time">Hora: ${match.match_time}</p>
                <p>Árbitro: ${match.match_referee}</p>
                <p>Estadio: ${match.match_stadium}</p>
                <p>Temporada: ${match.league_year}</p>
                <p>Estado: ${match.match_status}</p>
                <img src="${leagueLogo}" alt="Logo de la Liga" class="league-logo" />
            </div>`;
}

function createSummary(match) {
    let summaryHtml = `<h3>Resumen del Partido</h3>`;
    const firstHalfGoals = match.goalscorer.filter(g => g.score_info_time === "1st Half");
    const secondHalfGoals = match.goalscorer.filter(g => g.score_info_time === "2nd Half");

    summaryHtml += `<h4>Primer Tiempo</h4>`;
    firstHalfGoals.forEach(goal => {
        summaryHtml += `<p>${goal.away_scorer} ${goal.score} ${goal.time}' ${goal.away_assist ? `(${goal.away_assist})` : ''}</p>`;
    });

    summaryHtml += `<h4>Segundo Tiempo</h4>`;
    secondHalfGoals.forEach(goal => {
        summaryHtml += `<p>${goal.away_scorer} ${goal.score} ${goal.time}' ${goal.away_assist ? `(${goal.away_assist})` : ''}</p>`;
    });

    summaryHtml += `<h4>Tarjetas</h4>`;
    match.cards.forEach(card => {
        if (card.home_fault) {
            summaryHtml += `<p>${card.home_fault} (Amarilla) ${card.time}'</p>`;
        }
        if (card.away_fault) {
            summaryHtml += `<p>${card.away_fault} (Amarilla) ${card.time}'</p>`;
        }
    });

    summaryHtml += `<h4>Sustituciones</h4>`;
    match.substitutions.home.forEach(sub => {
        summaryHtml += `<p>${sub.substitution} ${sub.time}'</p>`;
    });
    match.substitutions.away.forEach(sub => {
        summaryHtml += `<p>${sub.substitution} ${sub.time}'</p>`;
    });

    return summaryHtml;
}

function createStatistics(statistics) {
    let statsHtml = `<h3>Estadísticas del Partido</h3>`;
    statistics.forEach(stat => {
        statsHtml += `<p>${stat.type}: ${stat.home} - ${stat.away}</p>`;
    });
    return statsHtml;
}

function createLineup(lineup) {
    let lineupHtml = `<h3>Alineaciones</h3>`;

    // Alineación local
    lineupHtml += `<h4>Entrenador: ${lineup.home.coach[0].lineup_player} (ID: ${lineup.home.coach[0].player_key})</h4>`;
    lineupHtml += `<h4>Alineación Inicial (Local)</h4><ul>`;
    lineup.home.starting_lineups.forEach(player => {
        lineupHtml += `<li>${player.lineup_number}. ${player.lineup_player} - Posición: ${player.lineup_position} (ID: ${player.player_key})</li>`;
    });
    lineupHtml += `</ul><h4>Suplentes (Local)</h4><ul>`;
    lineup.home.substitutes.forEach(player => {
        lineupHtml += `<li>${player.lineup_number}. ${player.lineup_player} (ID: ${player.player_key})</li>`;
    });
    lineupHtml += `</ul>`;

    // Alineación visitante
    lineupHtml += `<h4>Entrenador: ${lineup.away.coach[0].lineup_player} (ID: ${lineup.away.coach[0].player_key})</h4>`;
    lineupHtml += `<h4>Alineación Inicial (Visitante)</h4><ul>`;
    lineup.away.starting_lineups.forEach(player => {
        lineupHtml += `<li>${player.lineup_number}. ${player.lineup_player} - Posición: ${player.lineup_position} (ID: ${player.player_key})</li>`;
    });
    lineupHtml += `</ul><h4>Suplentes (Visitante)</h4><ul>`;
    lineup.away.substitutes.forEach(player => {
        lineupHtml += `<li>${player.lineup_number}. ${player.lineup_player} (ID: ${player.player_key})</li>`;
    });
    lineupHtml += `</ul>`;

    return lineupHtml;
}

function createStandings(standings) {
    let standingsHtml = `<h3>Clasificación de La Liga</h3><table><tr><th>Equipo</th><th>Posición</th><th>Partidos Jugados</th><th>Victorias</th><th>Empates</th><th>Derrotas</th><th>GF</th><th>GA</th><th>PTS</th></tr>`;
    
    standings.forEach(team => {
        standingsHtml += `<tr>
            <td><img src="${team.team_badge}" alt="${team.team_name}" class="team-badge" /> ${team.team_name}</td>
            <td>${team.overall_league_position}</td>
            <td>${team.overall_league_payed}</td>
            <td>${team.overall_league_W}</td>
            <td>${team.overall_league_D}</td>
            <td>${team.overall_league_L}</td>
            <td>${team.overall_league_GF}</td>
            <td>${team.overall_league_GA}</td>
            <td>${team.overall_league_PTS}</td>
        </tr>`;
    });

    standingsHtml += `</table>`;
    return standingsHtml;
}

async function loadLeagueData() {
    const leagueData = await fetchAPI(`${API_URL}?action=get_leagues&country_id=${LEAGUES.esp.id}&APIkey=${KEY}`);
    const leagueInfo = leagueData[LEAGUES.esp.index];

    // Actualizar el contenido del cuadro
    const leagueHtml = createHtml(leagueInfo.country_logo, leagueInfo.country_name, leagueInfo.league_name);
    boxTeams.innerHTML = leagueHtml;

    // Cargar detalles del partido
    const matchData = await fetchAPI(`https://apiv3.apifootball.com/?action=get_events&from=2024-09-15&to=2024-09-15&league_id=302&APIkey=${KEY}`);
    
    // Filtrar el partido específico
    const match = matchData.find(m => m.match_id === "383952");

    // Mostrar detalles del partido
    if (match) {
        matchDetailsContainer.innerHTML = createMatchDetails(match, leagueInfo.league_logo); // Pasar logo de la liga
        
        // Manejar el clic en el botón Resumen
        btnResumen.onclick = () => {
            summaryInfoContainer.innerHTML = createSummary(match);
            statisticsInfoContainer.innerHTML = ''; // Limpiar estadísticas
            lineupInfoContainer.innerHTML = ''; // Limpiar alineaciones
        };

        // Manejar el clic en el botón Estadísticas
        btnEstadisticas.onclick = () => {
            const statistics = [
                { type: "Corners", home: "1", away: "6" },
                { type: "Throw In", home: "0", away: "0" },
                { type: "Free Kick", home: "0", away: "0" },
                { type: "Goal Kick", home: "0", away: "0" },
                { type: "Penalty", home: "0", away: "0" },
                { type: "Substitution", home: "5", away: "5" },
                { type: "Attacks", home: "68", away: "97" },
                { type: "Dangerous Attacks", home: "33", away: "55" },
                { type: "On Target", home: "4", away: "9" },
                { type: "Off Target", home: "5", away: "11" },
                { type: "Shots Total", home: "9", away: "20" },
                { type: "Shots On Goal", home: "4", away: "9" },
                { type: "Shots Off Goal", home: "3", away: "9" },
                { type: "Shots Blocked", home: "2", away: "2" },
                { type: "Shots Inside Box", home: "7", away: "13" },
                { type: "Shots Outside Box", home: "2", away: "7" },
                { type: "Fouls", home: "13", away: "4" },
                { type: "Offsides", home: "7", away: "0" },
                { type: "Ball Possession", home: "45%", away: "55%" },
                { type: "Yellow Cards", home: "3", away: "2" },
                { type: "Red Cards", home: "0", away: "1" },
                { type: "Saves", home: "5", away: "3" },
                { type: "Passes Total", home: "392", away: "476" },
                { type: "Passes Accurate", home: "344", away: "414" }
            ];
            statisticsInfoContainer.innerHTML = createStatistics(statistics);
            summaryInfoContainer.innerHTML = ''; // Limpiar resumen
            lineupInfoContainer.innerHTML = ''; // Limpiar alineaciones
        };

        // Manejar el clic en el botón Alineaciones
        btnAlineaciones.onclick = async () => {
            const lineupData = await fetchAPI(`https://apiv3.apifootball.com/?action=get_lineups&match_id=383952&APIkey=${KEY}`);
            
            console.log(lineupData); // Ver respuesta de la API
            
            if (lineupData && lineupData["383952"] && lineupData["383952"].lineup) {
                const lineup = lineupData["383952"].lineup; // Accediendo a la propiedad 'lineup'
                lineupInfoContainer.innerHTML = createLineup(lineup);
            } else {
                lineupInfoContainer.innerHTML = `<p>No se encontraron alineaciones. Respuesta de la API: ${JSON.stringify(lineupData)}</p>`;
            }
            summaryInfoContainer.innerHTML = ''; // Limpiar resumen
            statisticsInfoContainer.innerHTML = ''; // Limpiar estadísticas
        };

        // Manejar el clic en el botón Clasificación
        btnClasificacion.onclick = async () => {
            const standingsData = await fetchAPI(`https://apiv3.apifootball.com/?action=get_standings&league_id=302&APIkey=${KEY}`);
            if (standingsData && standingsData.length > 0) {
                summaryInfoContainer.innerHTML = createStandings(standingsData);
                statisticsInfoContainer.innerHTML = ''; // Limpiar estadísticas
                lineupInfoContainer.innerHTML = ''; // Limpiar alineaciones
            } else {
                summaryInfoContainer.innerHTML = `<p>No se encontraron datos de clasificación.</p>`;
            }
        };
    } else {
        matchDetailsContainer.innerHTML = `<p>No se encontraron detalles del partido.</p>`;
    }
}

// Cargar datos al iniciar
loadLeagueData();




















