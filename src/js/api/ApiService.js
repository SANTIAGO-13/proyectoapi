class ApiServe {
    constructor() {
        this.myHeaders = new Headers();
        this.myHeaders.append("x-rapidapi-key", "6d519e9fb5e94284c0009d7339dd3a42");
        this.myHeaders.append("x-rapidapi-host", "v3.football.api-sports.io");

        this.requestOptions = {
            method: "GET",
            headers: this.myHeaders,
            redirect: "follow",
        };
    }

    fetchPais() {
        return fetch('http://localhost:3001/api/countries', this.requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((result) => result.response)
            .catch((error) => {
                console.error("Error fetching countries:", error);
                throw error;
            });
    }

    fetchMatches(liga) {
        return fetch(`http://localhost:3001/api/fixtures?league=${liga}&season=2023&live=all`, this.requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((result) => result.response)
            .catch((error) => {
                console.error("Error fetching live matches:", error);
                throw error;
            });
    }

    fetchLeagues() {
        return fetch('http://localhost:3001/api/leagues', this.requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((result) => result.response)
            .catch((error) => {
                console.error("Error fetching leagues:", error);
                throw error;
            });
    }

    fetchTeams(liga) {
        return fetch(`http://localhost:3001/api/teams?league=${liga}&season=2023`, this.requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((result) => result.response)
            .catch((error) => {
                console.error("Error fetching teams:", error);
                throw error;
            });
    }

    fetchTeamsByLeague(leagueId, season) {
        return fetch(`http://localhost:3001/api/teams?league=${leagueId}&season=${season}`, this.requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((result) => result.response)
            .catch((error) => {
                console.error("Error fetching teams:", error);
                throw error;
            });
    }

    fetchFinishedMatches(leagueId, season) {
        return fetch(`http://localhost:3001/api/fixtures?league=${leagueId}&season=${season}&status=finished`, this.requestOptions)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then((result) => result.response)
            .catch((error) => {
                console.error("Error fetching finished matches:", error);
                throw error;
            });
    }
}

export default ApiServe;









