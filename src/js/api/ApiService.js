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
		return fetch(`https://v3.football.api-sports.io/countries`, {
			headers: this.myHeaders,
		})
			.then((response) => response.json())
			.then((result) => result.response)
			.catch((error) => console.error("Fetch error:", error));
	}

	fetchMatches(liga) {
		return fetch(`https://v3.football.api-sports.io/fixtures?league=${liga}&season=2023&live=all`, this.requestOptions)
			.then((response) => response.json())
			.then((result) => result.response)
			.catch((error) => console.error("Error fetching matches:", error));
	}
}

export default ApiServe;

