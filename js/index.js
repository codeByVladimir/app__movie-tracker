const movieslistNode = document.querySelector('.main__list-movies');
const animelistNode = document.querySelector('.main__list-anime');
const searchNode = document.querySelector('.header__search');
const titleSearchNode = document.querySelector('.header__popup')

const URL = 'https://www.omdbapi.com/?apikey=be7190c1&t=';

const popularMovies = [
    'Joker', 
    'the last of us', 
    'the gray man',
    'wednesday',
    'squid game',
    'Now You See Me',
];

const popularAnime = [
    "JoJo's Bizarre Adventure",
    'Naruto: Shippuden',
    'my hero academia',
    'kimetsu no yaiba',
    'Death Note',
    'hunter x hunter'
];

function debounce(fn, ms){
    let timer; // сохраняем id таймера
    return function(...args){ // в обертку rest сохраняет параметры браузера
        clearTimeout(timer); 
        timer = setTimeout(() => {
            fn(...args);
        }, ms)
    }
}

async function fetchData(title){
    try{
        const request = await fetch(`${URL}${encodeURIComponent(title)}`);
        const response = await request.json();
        return response; // Промис возвращает
    }catch(error){
        console.log(`Ошибка парсинга: ${error}`);
    }
}
async function getSearchTitle(event) {
    const title = event.target.value;
    const response = await fetchData(title);
    renderSearchTitle(response);
}
const searchTitle = debounce(getSearchTitle, 600);
searchNode.addEventListener('input', searchTitle);

async function renderSearchTitle(response) {
    titleSearchNode.innerHTML = `
        <div class="header__popup-content">
            <div class="header__popup-image-wrapper">
                <img class="header__popup-image" src="${response.Poster}" alt="${response.Title}">
            </div>
            <div class="header__popup-about">
                <h3 class="header__popup-title">${response.Title}</h3>
                <p class="header__popup-subtitle">${response.Year} ${response.Genre}</p>
                <p class="header__popup-about-title">${response.Plot}</p>
            </div>
        </div>
    `
}

async function parseInfo(url, movies){
    try{
        const parseData = [];
        for (const element of movies) {
            const getInfo = await fetch(`${url}${encodeURIComponent(element)}`);
            const response = await getInfo.json();
            parseData.push(response)
        }
        return parseData;
        
    }catch(error){
        console.log(error);
    }
}

function htmlCreateElement(object, listNode){
    for (const element of object) {
        listNode.innerHTML += `
        <li class="main__content-item" data-id="${element.imdbID}">
            <div class="main__content-img-wrapper">
                <img class="main__content-image" src="${element.Poster}" alt="${element.Title}">
            </div>
        </li>`
    }
}



movieslistNode.addEventListener('click', (event) => {
    const getDataId = event.target.closest('.main__content-item');
    if(!getDataId) return;
    const dataId = getDataId.dataset.id;
    window.location.href = `movie.html?id=${dataId}`;
})
animelistNode.addEventListener('click', (event) => {
    const getDataId = event.target.closest('.main__content-item');
    if(!getDataId) return;
    const dataId = getDataId.dataset.id;
    window.location.href = `movie.html?id=${dataId}`;
})



async function start(){
    const movies = await parseInfo(URL, popularMovies);
    const anime = await parseInfo(URL, popularAnime)
    await htmlCreateElement(movies, movieslistNode);
    await htmlCreateElement(anime, animelistNode)
}

start();