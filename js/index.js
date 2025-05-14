const movieslistNode = document.querySelector('.main__list-movies');
const animelistNode = document.querySelector('.main__list-anime');

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