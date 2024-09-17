import ApiServe from "./ApiService.js";
import Country from "./Country.js";
import CountryView from "./CountryView.js";

const apiService = new ApiServe();
const viewCountry = new CountryView(".team-row");


apiService.fetchPais().then((paises) => {
	const objectPais = paises.slice(0, 6).map((pais) => new Country(pais.name, pais.flag));
	viewCountry.viewContries(objectPais);
});
