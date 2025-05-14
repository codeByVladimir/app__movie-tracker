const titleNode = document.querySelector('.main__title');
const posterNode = document.querySelector('.main__poster');
const listNode = document.querySelector('.main__role-list');
const descriptionNode = document.querySelector('.main__description');
const ratingNode = document.querySelector('.main__rating');
const trailerNode = document.querySelector('.main__video-trailer');

const URL = 'http://www.omdbapi.com/?apikey=be7190c1&i=';
const API_KEY = 'AIzaSyAx8Tg_iKsb_NUSsz_D8ACtz6Pq4OstJJE';

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
    <iframe class="main__trailer" width="521px" height="291px" src="${videoId}" frameborder="0" allowfullscreen></iframe>
    `
    
}

async function start() {
    const getData = await getInfo();
    const videoId = await parseTrailer(getData, API_KEY);
    await createContent(getData, videoId);
}

start()