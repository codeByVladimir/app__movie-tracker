const titleNode = document.querySelector('.main__title');
const posterNode = document.querySelector('.main__poster');
const listNode = document.querySelector('.main__role-list');
const descriptionNode = document.querySelector('.main__description');
const ratingNode = document.querySelector('.main__rating');
const trailerNode = document.querySelector('.main__video-trailer');
const searchNode = document.querySelector('.header__search');
const titleSearchNode = document.querySelector('.header__popup')

const URL = 'https://www.omdbapi.com/?apikey=be7190c1&i=';
const searchURL = 'https://www.omdbapi.com/?apikey=be7190c1&t=';
const API_KEY = 'AIzaSyAx8Tg_iKsb_NUSsz_D8ACtz6Pq4OstJJE';


function debounce(fn, ms){
    let timer; // сохраняем id таймера
    return function(...args){ // в обертку rest сохраняет параметры браузера
        clearTimeout(timer); 
        timer = setTimeout(() => {
            fn(...args);
        }, ms)
    }
}

const searchTitle = debounce(getSearchTitle, 600);
searchNode.addEventListener('input', searchTitle);

async function fetchData(title){
    try{
        const request = await fetch(`${searchURL}${encodeURIComponent(title)}`);
        const response = await request.json();
        return response; // Промис возвращает
    }catch(error){
        console.log(`Ошибка парсинга: ${error}`);
    }
}
async function getSearchTitle(event) {
    const title = event.target.value;
    const response = await fetchData(title);
    console.log(response);
    
    renderSearchTitle(response);
}

async function renderSearchTitle(response) {
    if(response.Response === 'True'){
        titleSearchNode.classList.add('popup-open');
        document.body.classList.add('no-scroll');
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
    }else if((searchNode.value.trim() === '')){
        titleSearchNode.classList.remove('popup-open');
        document.body.classList.remove('no-scroll');
        titleSearchNode.innerHTML = '';
    }else{
        titleSearchNode.classList.add('popup-open');
        document.body.classList.add('no-scroll');
        titleSearchNode.innerHTML = `
        <div class="header__popup-content">
            <p class='error-movie'>Movie not found! English please</p>
        </div>`
    }
    
}
document.addEventListener('click', (event) => {
    console.log(event.target.classList[0]);
    if(event.target.classList[0] === 'header__popup'){
        titleSearchNode.classList.remove('popup-open');
        document.body.classList.remove('no-scroll');
        searchNode.value = '';
    }
})


async function getInfo(){
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    const request = await fetch(`${URL}${encodeURIComponent(params.id)}`)
    const response = await request.json();
    return response;
}

async function parseTrailer(data, apikey) {
    const query = `trailer ${data.Title}`
    const url = `https://www.googleapis.com/youtube/v3/search?key=${apikey}&type=video&part=snippet&q=${encodeURIComponent(query)}`;
    
    const request = await fetch(url);
    const response = await request.json()
    return `https://www.youtube.com/embed/${response.items[0].id.videoId}`;
}



function createContent(data, videoId) {
    titleNode.textContent = data.Title
    posterNode.src = data.Poster;
    posterNode.alt = data.Title;
    const genres = data.Genre.split(',').map(genre => genre.trim())
    for (const genre of genres) {
        listNode.innerHTML += `<li class="main__role-item">${genre}</li>`     
    }
    descriptionNode.textContent = data.Plot;
    ratingNode.textContent = `IMDB Rating ⭐${data.imdbRating}`;
    trailerNode.innerHTML += `
    <iframe class="main__trailer" src="${videoId}" frameborder="0" allowfullscreen></iframe>
    `
    
}

async function start() {
    const getData = await getInfo();
    const videoId = await parseTrailer(getData, API_KEY);
    await createContent(getData, videoId);
}

start()
