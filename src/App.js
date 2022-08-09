import React, { useState } from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	async function fetchMoviesHandler() {
		setIsLoading(true);
		// Set to null to ensure any previous errors are cleared.
		setError(null);

		/**
		 * Use try/catch for setting error state.
		 */
		try {
			/**
			 * Alternative syntax to chaining .then()
			 */
			const response = await fetch('https://swapi.dev/api/films/');

			/**
			 * If the response from fetch is not OK, throw an Error and stop
			 * the execution of the try function.
			 */
			if (!response.ok) {
				throw new Error('Something went wrong');
			}

			const data = await response.json();

			const transformedMovies = data.results.map((movie) => {
				return {
					id: movie.episode_id,
					title: movie.title,
					openingText: movie.opening_crawl,
					releaseDate: movie.release_date,
				};
			});

			setMovies(transformedMovies);
		} catch (error) {
			/**
			 * When try fails due to response.ok check on line 29 failing,
			 * take the error message we created and update the error state
			 * with it.
			 */
			setError(error.message);
		}
		setIsLoading(false);

		/**
		 * Chaining .then() syntax
		 */
		// fetch('https://swapi.dev/api/films/')
		// 	.then((response) => {
		// 		return response.json();
		// 	})
		// 	.then((data) => {
		// 		const transformedMovies = data.results.map((movie) => {
		// 			return {
		// 				id: movie.episode_id,
		// 				title: movie.title,
		// 				openingText: movie.opening_crawl,
		// 				releaseDate: movie.release_date,
		// 			};
		// 		});

		// 		setMovies(transformedMovies);
		// 	});
	}

	let content = <p>No movies found.</p>;

	if (movies.length > 0) {
		content = <MoviesList movies={movies} />;
	}

	if (error) {
		content = <p>{error}</p>;
	}

	if (isLoading) {
		content = <p>Loading...</p>;
	}

	return (
		<React.Fragment>
			<section>
				<button onClick={fetchMoviesHandler}>Fetch Movies</button>
			</section>
			<section>{content}</section>
		</React.Fragment>
	);
}

export default App;
