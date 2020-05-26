const axios = require('axios');

const starWarsApi = axios.create({
	baseURL: 'https://swapi.dev/api'
});

const test = async () => {
	let res = await starWarsApi.get('/films');
	console.log(res);
};

test();
