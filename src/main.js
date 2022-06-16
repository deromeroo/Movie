//DATA
const API_KEY = '85cadf4399683b8bcb23afd18bc43f4a';
const [language, country] = (window.navigator.language || navigator.browserLanguage).split('-');

const api = axios.create({
    baseURL: 'http://api.themoviedb.org/3',
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    },
    params: {
        'api_key': API_KEY,
        'language': language
    }
});

const Image_Url_w300 = 'https://image.tmdb.org/t/p/w300';
const Image_Url_w500 = 'https://image.tmdb.org/t/p/w500';

const likedMoviesList = () =>{
    const item = JSON.parse( localStorage.getItem('liked_movies') );
    let movies;

    if(item) {
        movies = item;
    }else{
        movies = {};
    };

    return movies;
};

const likeMovie = (movie) => {
    const likedMovies = likedMoviesList();

    if( likedMovies[movie.id] ) {
        likedMovies[movie.id] = undefined;
    }else {
        likedMovies[movie.id] = movie;
    };

    localStorage.setItem( 'liked_movies' ,JSON.stringify(likedMovies) );
};

//Utils
const lazyLoader = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const url = entry.target.getAttribute('data-img')
        entry.target.setAttribute('src', url);
      }
    });
});

const createMovies = (array, parentContainer, lazyLoad = "" ) => {

    array.forEach( movie => {

        const movieContainer = document.createElement('div');
        movieContainer.classList.add('movie-container');

        const movieImg = document.createElement('img');
        movieImg.classList.add('movie-img');
        movieImg.alt = movie.title;
        movieImg.setAttribute(
            lazyLoad ? 'data-img' : 'src',
            Image_Url_w300 + movie.poster_path,
        );
        movieImg.addEventListener('click', () => {
            location.hash = `#movie=${movie.id}`
        });

        movieImg.addEventListener('error', ()=> {
            movieImg.style.display = 'none';
        });

        const likeBtn = document.createElement('button');
        likeBtn.classList.add('movie-btn');

        likedMoviesList() [movie.id] && likeBtn.classList.add('movie-btn--liked');

        likeBtn.addEventListener('click', () => {
            likeBtn.classList.toggle('movie-btn--liked');
            //AGREGAR A LOCAL STORAGE
            likeMovie(movie);
        });

        if(lazyLoad) {
            lazyLoader.observe(movieImg);
        }

        movieContainer.appendChild(movieImg);
        movieContainer.appendChild(likeBtn);
        parentContainer.appendChild(movieContainer);
        
    });
};

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

    if( section === 'movies') {
        const movies = data.results;
        maxPage = data.total_pages;
        parentContainer.innerHTML = '';

        createMovies(movies, parentContainer, true);
        
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

        parentContainer.innerHTML = '';

        createCategoriesList(genres, parentContainer);

    };
    if( section === 'related') {
        const relatedMovies = data.results;

        parentContainer.innerHTML = '';
        createMovies(relatedMovies, parentContainer, true);
    }

}

const getLikedMovies = () => {
    const likedMovies = likedMoviesList();
    const likedArray = Object.values(likedMovies);
    likedMoviesListArticle.innerHTML = '';

    createMovies(likedArray, likedMoviesListArticle, true);
}

const getPagination = async (e) => {

    const [hash, query] = e.path[0].location.hash.split('=');
    
    if(hash.startsWith('#trends')) {
        var path = '/trending/movie/day';
        var config = {
            params: {
                page
            }
        }
    };
    if (hash.startsWith('#category') ){
        var path = '/discover/movie';
        var config = {
            params: {
                page
            }
        }
    };
    if (hash.startsWith('#search') ){
        var path = '/search/movie';
        var config = {
            params: {
                page,
                query,
            }
        }
    };

    const {
        scrollTop, 
        scrollHeight, 
        clientHeight
    } = document.documentElement;

    const scrollIsBottom = (scrollTop + clientHeight) >= (scrollHeight - 15);
    const pageIsNotMax = page < maxPage;
    
    if( scrollIsBottom && pageIsNotMax) {

        page++;
        const {data} = await api(path, config);
        const movies = data.results;
    
        createMovies(movies, genericSection, true);
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