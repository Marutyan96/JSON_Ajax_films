const apiKey = 'b1a2028a';
let currentPage = 1;
let currentSearch = '';

// Функция поиска фильмов
function searchMovies(page = 1) {
    const title = $('#movie-title').val();
    const type = $('#movie-type').val();

    if (!title) {
        alert('Please enter a movie title');
        return;
    }

    currentPage = page;
    currentSearch = title;

    $.ajax({
        url: `http://www.omdbapi.com/?apikey=${apiKey}&s=${title}&type=${type}&page=${page}`,
        method: 'GET',
        success: function (response) {
            if (response.Response === 'True') {
                displayMovies(response.Search, response.totalResults);
            } else {
                $('#movie-list').html('<p>Movie not found!<p>');
                $('#pagination').empty();
            }
        }
    });
}

// Функция отображения фильмов
function displayMovies(movies, totalResults) {
    const movieList = $('#movie-list');
    movieList.empty();

    movies.forEach(movie => {
        movieList.append(`
            <div class="movie-item" id="movie-${movie.imdbID}">
                <h3>${movie.Title} (${movie.Year})</h3>
                <button onclick="getMovieDetails('${movie.imdbID}', this)">Details</button>
                <div class="movie-details-container" style="display: none;"></div>
            </div>
        `);
    });

    displayPagination(totalResults);
}

// Функция отображения пагинации
function displayPagination(totalResults) {
    const pagination = $('#pagination');
    pagination.empty();

    const totalPages = Math.ceil(totalResults / 10);

    for (let i = 1; i <= totalPages; i++) {
        pagination.append(`
            <button onclick="searchMovies(${i})" ${i === currentPage ? 'disabled' : ''}>${i}</button>
        `);
    }
}

// Функция получения деталей фильма
function getMovieDetails(imdbID, button) {
    const movieItem = $(button).closest('.movie-item');
    const detailsContainer = movieItem.find('.movie-details-container');

    // Check if the details are already displayed
    if (detailsContainer.is(':visible')) {
        detailsContainer.slideUp(); // Hide the details
    } else {
        $.ajax({
            url: `http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`,
            method: 'GET',
            success: function (response) {
                displayMovieDetails(response, detailsContainer);
                detailsContainer.slideDown(); // Show the details
            },
            error: function () {
                alert('Не удалось получить сведения о фильме. Пожалуйста, повторите попытку позже.');
            }
        });
    }
}

// Функция отображения деталей фильма
function displayMovieDetails(movie, detailsContainer) {
    detailsContainer.html(`
        <div class="movie-details">
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Plot:</strong> ${movie.Plot}</p>
            <p><strong>Actors:</strong> ${movie.Actors}</p>
            <img src="${movie.Poster}" alt="${movie.Title} poster" style="max-width: 100px;">
        </div>
    `);
}

// Обработчик события для кнопки поиска
$('#search-btn').click(function () {
    searchMovies();
});