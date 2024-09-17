class Country {
	constructor(name, flag) {
		this.name = name;
		this.flag = flag;
	}

	render() {
		const imgCreate = `<img class="img-style" src="${this.flag}" alt="${this.name}"/>`;
		const pCreate = `<p class="title">${this.name}</p>`;
		return { imgCreate, pCreate };
	}
}

export default Country;

