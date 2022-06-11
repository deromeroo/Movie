trendingBtn.addEventListener('click', () => {
    location.hash = "#trends";
});

searchFormBtn.addEventListener('click', () => {
    if(searchFormInput.value === '') {
        location.hash = '#home';
    }else {
        location.hash = `#search=${searchFormInput.value.trim()}`;
    }
});

arrowBtn.addEventListener('click', () => {
    history.back() ;
});

headerTitle.addEventListener('click', () => {
    location.hash = '#home';
})

window.addEventListener('DOMContentLoaded', navigator, false );
window.addEventListener('hashchange', navigator, false );


function navigator() {

    if( location.hash.startsWith('#trends') ) {
        trendingPage();
    }else if (location.hash.startsWith('#search=') ) {
        searchPage();
    }else if (location.hash.startsWith('#movie=') ) {
        moviesPage();
    }else if (location.hash.startsWith('#category=') ) {
        categoriesPage();
    } else {
        homePage();
    };

    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
};


const homePage = () => {

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.add('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.remove('inactive');
    categoriesPreviewSection.classList.remove('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.add('inactive');

    ///GET Trendings Movies
    getMoviesData('movie', '/trending/movie/day', trendingMoviesPreviewList);

    //GET Movies Genre
    getMoviesData('category', '/genre/movie/list', categoriesPreviewList);
}

const categoriesPage = () => {

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    const [_, categoryData] = location.hash.split('=')  //=> ['#category', 'id-name'];
    const [categoryId, categoryName] = categoryData.split('-');
    const [firstName, secondName = ''] = categoryName.split('%20');

    headerCategoryTitle.textContent  = `${firstName}  ${secondName}`;

    getMoviesData('movie', '/discover/movie', genericSection , {
        params: {
            'with_genres' : categoryId
        }
    })
}

const moviesPage = () => {

    headerSection.classList.add('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.add('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.add('inactive');
    movieDetailSection.classList.remove('inactive');

    const [_, movieId] = location.hash.split('=')  //=> ['#movie', 'id'];

    getMoviesData('details', `/movie/${movieId}`, movieDetailCategoriesList);
    getMoviesData('related', `/movie/${movieId}/similar`, relatedMoviesContainer)
}

const searchPage = () => {
    console.log('search')

    headerSection.classList.remove('header-container--long');
    headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.remove('inactive');
    headerCategoryTitle.classList.add('inactive');
    searchForm.classList.remove('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    /////
    const [_, query] = location.hash.split('=')  //=> ['#search', 'value'];
    getMoviesData('movie', '/search/movie', genericSection, {
        params: {
            query
        }
    });
}

const trendingPage = () => {

    headerSection.classList.remove('header-container--long');
    // headerSection.style.background = '';
    arrowBtn.classList.remove('inactive');
    arrowBtn.classList.remove('header-arrow--white');
    headerTitle.classList.add('inactive');
    headerCategoryTitle.classList.remove('inactive');
    searchForm.classList.add('inactive');

    trendingPreviewSection.classList.add('inactive');
    categoriesPreviewSection.classList.add('inactive');
    genericSection.classList.remove('inactive');
    movieDetailSection.classList.add('inactive');

    headerCategoryTitle.textContent = 'Trending';

    ///GET Trendings Movies
    getMoviesData('movie', '/trending/movie/day', genericSection);
}

