//變數
const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies'))
//找出movie清單位置
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')

//函式產生movies 
function renderMovieList(data) {
    // let rawHTML = ''
    let rawHTML = ''
    data.forEach((item) => {
    rawHTML += `<div class="col-sm-3">
    <div class="mb-2">
        <div class="card">
            <img src="${
                POSTER_URL + item.image
            }" class="card-img-top" alt="Movie Poster"/>
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
            </div>
            <div class="card-footer">
                <button class="btn btn-primary btn-show-movie"data-toggle="modal"
                data-target="#movie-modal" data-id="${item.id}">More</button>
                <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">X</button>
            </div>
            </div>
        </div>
    </div>`  
    })
    dataPanel.innerHTML = rawHTML
}


//函式產生modal裡的資料
function showMovieModal (id){
    const title = document.querySelector('#movie-modal-title')
    const description = document.querySelector('#movie-modal-description')
    const date = document.querySelector('#movie-modal-date')
    const image = document.querySelector('#movie-modal-image')
    axios.get (INDEX_URL + id).then((response) => {
        const data = response.data.results
        title.innerText = data.title
        description.innerText = data.description
        date.innerText = 'Release:' + data.release_date
        image.innerHTML = `<img src="${POSTER_URL + data.image}" alt="movie-poster" class="img-fluid">`
    })
}





// 新增事件監聽按鈕點擊能跳到modal畫面裡
dataPanel.addEventListener('click', function onPanelClicked (event){
    if(event.target.matches('.btn-show-movie')){
        showMovieModal(event.target.dataset.id)
    }
    else if (event.target.matches('.btn-remove-favorite')){
        removeFavorite(Number(event.target.dataset.id))
    }
})

function removeFavorite(id) {
    if(!movies) return
  
    //透過 id 找到要刪除電影的 index
    const movieIndex = movies.findIndex((movie) => movie.id === id)
  
    //刪除該筆電影
    movies.splice(movieIndex,1)
  
    //存回 local storage
    localStorage.setItem('favoriteMovies', JSON.stringify(movies))
  
    //更新頁面
    renderMovieList(movies)
  }

renderMovieList(movies)