class CountryView {
    constructor(boxSelector) {
        this.box = document.querySelector(boxSelector);
        this.teamRow = document.querySelector(boxSelector); // Cambiar 'caja' a 'boxSelector'
        this.matchesContainer = document.createElement('div'); // Asegúrate de tener un contenedor para los partidos
    }

    defineMatch(equipo1, equipo2) {
        return `${equipo1.name} vs ${equipo2.name}`;
    }

    viewContries(country) {
        let countriesHtml = "";
        country.forEach((view) => {
            const { imgCreate, pCreate } = view.render();
            countriesHtml += pCreate + imgCreate;
        });

        this.box.innerHTML = countriesHtml;
    }

    generateMatches(teams) {
        let matchesHTML = '';
        for (let i = 0; i < teams.length - 1; i += 2) {
            if (teams[i + 1]) {
                const match = this.defineMatch(teams[i], teams[i + 1]);
                matchesHTML += `<div class="match">${match}</div>`; // Asegúrate de usar comillas
            }
        }
        this.matchesContainer.innerHTML = matchesHTML;
        this.box.appendChild(this.matchesContainer); // Agrega el contenedor de partidos al DOM
    }
}

export default CountryView;

