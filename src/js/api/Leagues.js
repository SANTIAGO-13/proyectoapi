const boxTeams = document.querySelector('.box-teams');
const KEY = "2fbd26f676351d37145a6afe9dedf6564028f6533e7f74d782210df9770ae4be";
const fetchFinishedButton = document.getElementById('fetch-finished');
const liveButton = document.querySelector('.live-button');

const LEAGUES = {
    esp: { id: 135, index: 3, video: "https://www.youtube.com/embed/EZcv3RTUu9U?si=AaX7br7WZai6IIKa" },
    por: { id: 115, index: 3, video: "https://www.youtube.com/embed/sAxOxd7oLLI?si=fMBArq5YEm0kSPaH" },
    ita: { id: 68, index: 15, video: "https://www.youtube.com/embed/OjAvJ8bq3x4?si=WUfIMWH6_C_0wgsb" },
};
const EVENTS = {
    esp: 302,
    ita: 207,
    por: 266,
};
const API_URL = "https://apiv2.apifootball.com/";
const API_EVENTS_URL = "https://apiv3.apifootball.com/";

async function fetchAPI(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

function createHtml(urlImg, textPais, textLiga, urlVideo = "") {
    const videoFrame = urlVideo ? `<iframe width="560" height="315" src=${urlVideo} frameborder="0" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>` : "";
    return `<div class="box">
                <div class="liga-info">
                    <img class="img-pais-liga" src=${urlImg} alt=${textLiga} />
                    <div class="liga-details">
                        <span class="country-name">${textPais}</span>
                        <h1 class="title-liga">${textLiga}</h1>
                    </div>
                </div>
                ${videoFrame}
            </div>`;
}

function createMatchHtml(homeTeam, awayTeam, homeScore, awayScore, link) {
    return `<div class="match-box">
                <a class="link" href=${link}>detalles</a>
                <div class="match-team">
                    <p class="team-name">${homeTeam}</p>
                    <p class="score">${homeScore}</p>
                </div>
                <div class="match-team">
                    <p class="team-name">${awayTeam}</p>
                    <p class="score">${awayScore}</p>
                </div>
            </div>`;
}

async function showLeagues(live = false) {
    boxTeams.innerHTML = '';
    
    for (const league in LEAGUES) {
        const { id, index, video } = LEAGUES[league];
        const leagueData = await fetchAPI(`${API_URL}?action=get_leagues&country_id=${id}&APIkey=${KEY}`);
        
        const leagueHtml = createHtml(
            leagueData[index].country_logo,
            leagueData[index].country_name,
            leagueData[index].league_name,
            live && video ? video : ""
        );
        boxTeams.innerHTML += leagueHtml;
        
        if (!live) await showMatches(league, EVENTS[league]);
    }
}

async function showMatches(league, leagueId) {
    const matches = await fetchAPI(`${API_EVENTS_URL}?action=get_events&league_id=${leagueId}&APIkey=${KEY}&from=2024-09-15&to=2024-09-15`);
    
    if (matches && matches.length > 0) {
        matches.forEach(match => {
            const matchHtml = createMatchHtml(match.match_hometeam_name, match.match_awayteam_name, match.match_hometeam_score, match.match_awayteam_score, "../pages/analisticas.html");
            boxTeams.innerHTML += matchHtml;
        });
    } else {
        boxTeams.innerHTML += `<p>No hay partidos finalizados para la liga seleccionada.</p>`;
    }
}

// Event listeners
fetchFinishedButton.addEventListener('click', () => showLeagues());
liveButton.addEventListener('click', () => showLeagues(true));

// Cargar ligas en directo al iniciar
showLeagues(true);


























// Clasificaciones 
/*
const clasificacionEspañola = GetApis(
    `https://apiv2.apifootball.com/?action=get_standings&league_id=468&APIkey=${KEY}`
);

const boxTeamLeague = (urlImg, titleTeams, ptsT) => `
    <img src=${urlImg} alt=${titleTeams}/>
    <p>${titleTeams}</p>
    <p>${ptsT}</p>
`;

clasificacionEspañola.then((liga) => {
    liga.sort((a, b) => b.overall_league_PTS - a.overall_league_PTS);
    liga.map((liga) => {
        equiposLeagues.innerHTML += boxTeamLeague(
            liga.team_badge,
            liga.team_name,
            liga.overall_league_PTS < 0 ? 0 : liga.overall_league_PTS
        );
    });
});
*/

