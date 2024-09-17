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
			.then((response) => {
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				return response.json();
			})
			.then((result) => {
				if (!result.response) {
					throw new Error("No response data");
				}
				return result.response;
			})
			.catch((error) => console.error("Fetch error:", error));
	}
}

export default ApiServe;
