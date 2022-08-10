import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import './App.css';

function App() {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	/**
	 * Wrapped in useCallback() hook to ensure the function object pointer
	 * remains the same when the component re-renders and only triggers the
	 * useEffect() hooks when it itself changes.
	 *
	 * See useEffect() below.
	 */
	const fetchMoviesHandler = useCallback(async () => {
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
			// const response = await fetch('https://swapi.dev/api/films/');
			/**
			 * Switch to Firebase backend app URL:
			 */
			const response = await fetch(
				'https://react-http-requests-b9d38-default-rtdb.europe-west1.firebasedatabase.app/movies.json'
			);

			/**
			 * If the response from fetch is not OK, throw an Error and stop
			 * the execution of the try function.
			 */
			if (!response.ok) {
				throw new Error('Something went wrong');
			}

			const data = await response.json();

			const loadedMovies = [];

			for (const key in data) {
				loadedMovies.push({
					id: key,
					title: data[key].title,
					openingText: data[key].openingText,
					releaseDate: data[key].releaseDate,
				});
			}

			setMovies(loadedMovies);

			// const transformedMovies = data.results.map((movie) => {
			// 	return {
			// 		id: movie.episode_id,
			// 		title: movie.title,
			// 		openingText: movie.opening_crawl,
			// 		releaseDate: movie.release_date,
			// 	};
			// });

			// setMovies(transformedMovies);
		} catch (error) {
			/**
			 * When try fails due to response.ok check on line 29 failing,
			 * take the error message we created and update the error state
			 * with it.
			 */
			setError(error.message);
		}
		setIsLoading(false);
	}, []);

	/**
	 * Adding a useEffect() hook ensures the API fetch is made when the component
	 * is loaded and when the fetchMoviesHandler() changes, not just when the
	 * button is clicked.
	 *
	 * As fetchMoviesHandler() is a function, and therefore an object, we have to
	 * wrap it in a useCallback() hook to ensure the original object is kept in the
	 * memory and a new pointer is created each time the component re-renders.
	 */
	useEffect(() => {
		fetchMoviesHandler();
	}, [fetchMoviesHandler]);

	async function addMovieHandler(movie) {
		/**
		 * Set up POST request to send data to Firebase database. POST doesn't always
		 * create/update database automatically but usually does, depends on backend
		 * app configuration.
		 *
		 * Body contains the data object transformed from a Javscript object into JSON.
		 *
		 * Headers should contain 'Content-Type: application/json' to specify data type.
		 * Not always necessary but often is.
		 */
		const response = await fetch(
			'https://react-http-requests-b9d38-default-rtdb.europe-west1.firebasedatabase.app/movies.json',
			{
				method: 'POST',
				body: JSON.stringify(movie),
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		/**
		 * Firebase responds in JSON.
		 */
		const data = await response.json();
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
				<AddMovie onAddMovie={addMovieHandler} />
			</section>
			<section>
				<button onClick={fetchMoviesHandler}>Fetch Movies</button>
			</section>
			<section>{content}</section>
		</React.Fragment>
	);
}

export default App;
