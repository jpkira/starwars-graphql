// import { GraphQLServer } from 'graphql-yoga';
// ... or using `require()`
const { GraphQLServer } = require('graphql-yoga');
const axios = require('axios');

const starWarsApi = axios.create({
	baseURL: 'https://swapi.dev/api'
});

const resolvers = {
	Query: {
		films: async () => {
			let res = await starWarsApi.get('/films');
			return res.data.results.map((film) => {
				return {
					title: film.title,
					episode_id: film.episode_id,
					opening_crawl: film.opening_crawl,
					director: film.director,
					producer: film.producer,
					release_date: film.release_date,
					characters: film.characters
				};
			});
		},

		characters: async () => {
			let res = await starWarsApi.get('/people');
			return res.data.results.map((person) => {
				return {
					name: person.name,
					height: person.height,
					mass: person.mass,
					hair_color: person.hair_color,
					skin_color: person.skin_color,
					eye_color: person.eye_color,
					birth_year: person.birth_year,
					gender: person.gender,
					films: person.films
				};
			});
		}
	},

	Film: {
		characters: (parent) => {
			let resPromise = parent.characters.map(async (url) => {
				let res = await axios.get(url);
				return {
					name: res.data.name,
					height: res.data.height,
					mass: res.data.mass,
					hair_color: res.data.hair_color,
					skin_color: res.data.skin_color,
					eye_color: res.data.eye_color,
					birth_year: res.data.birth_year,
					gender: res.data.gender,
					films: res.data.films
				};
			});

			return Promise.all(resPromise);
		}
	},

	People: {
		films: (parent) => {
			let resPromise = parent.films.map(async (url) => {
				let res = await axios.get(url);
				return {
					title: res.data.title,
					episode_id: res.data.episode_id,
					opening_crawl: res.data.opening_crawl,
					director: res.data.director,
					producer: res.data.producer,
					release_date: res.data.release_date,
					characters: res.data.characters
				};
			});

			return Promise.all(resPromise);
		}
	}
};

const options = {
	endpoint: '/graphql',
	subscriptions: '/subscriptions',
	playground: '/playground'
};

const server = new GraphQLServer({
	typeDefs: './schema.graphql',
	resolvers: resolvers
});

server.start(options, () => console.log('Server is running on localhost:4000'));
