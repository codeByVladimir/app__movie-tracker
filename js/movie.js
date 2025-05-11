const titleNode = document.querySelector('.main__title');
const posterNode = document.querySelector('.main__poster');
const listNode = document.querySelector('.main__role-list');
const descriptionNode = document.querySelector('.main__description');
const ratingNode = document.querySelector('.main__rating');
const trailerNode = document.querySelector('.main__video');

const URL = 'http://www.omdbapi.com/?apikey=be7190c1&i=';

async function getInfo(){
    const params = Object.fromEntries(new URLSearchParams(window.location.search));
    const request = await fetch(`${URL}${encodeURIComponent(params.id)}`)
    const response = await request.json();
    return response;
}
async function parseTrailer(data) {
    const urlParseVideo = 'https://yandex.ru/video/search?text=';
    const encodedURL = encodeURIComponent(`${urlParseVideo}трейлер ${data.Title}`);
    const request = await fetch(`https://api.allorigins.win/get?url=${encodedURL}`);
    const response = await request.json();
    const parserDOM = new DOMParser();
    const doc = parserDOM.parseFromString(response, 'text/html');
    console.log(doc);
}



function createContent(data) {
    titleNode.textContent = data.Title
    posterNode.src = data.Poster;
    posterNode.alt = data.Title;
    const genres = data.Genre.split(',').map(genre => genre.trim())
    for (const genre of genres) {
        listNode.innerHTML += `<li class="main__role-item">${genre}</li>`     
    }
    descriptionNode.textContent = data.Plot;
    ratingNode.textContent = `IMDB Rating ⭐${data.imdbRating}`;
    
}

async function start() {
    const getData = await getInfo();
    await createContent(getData);
    await parseTrailer(getData);
}

start()