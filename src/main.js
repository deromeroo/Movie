const API_KEY = '85cadf4399683b8bcb23afd18bc43f4a';

const api = axios.create({
    baseURL: 'http://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY
    }
});

const Image_Url_w300 = 'https://image.tmdb.org/t/p/w300';
const Image_Url_w500 = 'https://image.tmdb.org/t/p/w500';

const createMovies = (array, parentContainer) => {

    array.forEach( movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');
        movieContainer.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`
        });

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.alt = movie.title;
        movieImg.src = Image_Url_w300 + movie.poster_path;

        movieContainer.appendChild(movieImg);
        parentContainer.appendChild(movieContainer);
        
    });
}

const createCategoriesList = (array, parentContainer) => {

    array.forEach( category => {
        const categoryContainer = document.createElement('div');
        categoryContainer.classList.add('category-container');

        const categoryTitle = document.createElement('h3');
        categoryTitle.classList.add('category-title');
        categoryTitle.id = 'id' + category.id;
        categoryTitle.textContent = category.name;
        categoryTitle.addEventListener('click', () => {
            location.hash = `#category=${category.id}-${category.name}`;
        })

        categoryContainer.appendChild(categoryTitle);
        parentContainer.appendChild(categoryContainer);
    })
}

const getMoviesData = async ( section , path, parentContainer, optionalConfig = {} ) => {

    const {data} = await api(path, optionalConfig);

    if( section === 'movie') {
        const movies = data.results;

        parentContainer.innerHTML = '';

        createMovies(movies, parentContainer);
        
    };
    if( section === 'category') {

        const categories = data.genres;

        parentContainer.innerHTML = " ";
    
        createCategoriesList(categories, parentContainer);
    };
    if( section === 'details') {

        const {
            title,
            overview,
            vote_average,
            genres, 
            poster_path 

        } = data;

        const movieImgUrl = Image_Url_w500 + poster_path;
        const backgroundImg = document.querySelector('.header-container--long');
        backgroundImg.style.background = `linear-gradient(180deg, rgba(0, 0, 0, 0.35) 19.27%, rgba(0, 0, 0, 0) 29.17%), url(${movieImgUrl})`;

        movieDetailTitle.textContent = title ;
        movieDetailDescription.textContent = overview ;
        movieDetailScore.textContent = vote_average ;

        movieDetailCategoriesList.innerHTML = '';

        createCategoriesList(genres, parentContainer);

    };
    if( section === 'related') {
        const relatedMovies = data.results;

        parentContainer.innerHTML = '';
        createMovies(relatedMovies, parentContainer);
    }

}


// const getTrendingMoviesPreview = async () => {
//     const {data} = await api('/trending/movie/day');
//     const movies = data.results;

//     trendingMoviesPreviewList.innerHTML = " ";

//     movies.forEach( movie => {


//         const movieContainer = document.createElement('div');
//         movieContainer.classList.add('movie-container');

//         const movieImg = document.createElement('img');
//         movieImg.classList.add('movie-img');
//         movieImg.alt = movie.title;
//         movieImg.src = Image_Url + movie.poster_path;

//         movieContainer.appendChild(movieImg);
//         trendingMoviesPreviewList.appendChild(movieContainer);
        
//     });
// }

// const getMoviesByCategory = async (id) => {
//     const {data} = await api('/discover/movie', {
//         params: {
//             'with_genres': id
//         }
//     });
//     const movies = data.results;

//     genericSection.innerHTML = " ";

//     movies.forEach( movie => {

//         const movieContainer = document.createElement('div');
//         movieContainer.classList.add('movie-container');

//         const movieImg = document.createElement('img');
//         movieImg.classList.add('movie-img');
//         movieImg.alt = movie.title;
//         movieImg.src = Image_Url + movie.poster_path;

//         movieContainer.appendChild(movieImg);
//         genericSection.appendChild(movieContainer);
        
//     });
// }

// const getCategoriesPreview = async () => {
//     const {data} = await api(`/genre/movie/list`);
//     const categories = data.genres;

//     categoriesPreviewList.innerHTML = " ";

//     categories.forEach( category => {
//         const categoryContainer = document.createElement('div');
//         categoryContainer.classList.add('category-container');

//         const categoryTitle = document.createElement('h3');
//         categoryTitle.classList.add('category-title');
//         categoryTitle.id = 'id' + category.id;
//         categoryTitle.textContent = category.name;
//         categoryTitle.addEventListener('click', () => {
//             location.hash = `#category=${category.id}-${category.name}`;
//         })

//         categoryContainer.appendChild(categoryTitle);
//         categoriesPreviewList.appendChild(categoryContainer);
//     })
// }