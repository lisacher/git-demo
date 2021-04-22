//變數
const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
//儲存符合篩選條件的項目
let filteredmovies = []
const MOVIES_PER_PAGE = 12
//找出movie清單位置
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const searchInput = document.querySelector('#search-input')
//icons位置
const icons = document.querySelector('#icons')
const faThBtn = document.querySelector(".fa-th-btn")
const faBarsBtn = document.querySelector(".fa-bars-btn")

let nowPage = 1
let mode = 'card'

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
                <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
            </div>
        </div>
    </div>`  
    })
    dataPanel.innerHTML = rawHTML
}

axios.get(INDEX_URL).then((response) => {
    movies.push(...response.data.results)
    renderPaginator(movies.length)
    renderMovieList(getMoviesByPage(1))
    console.log(movies)
    displayDataList()
  }).catch((err) => console.log(err))


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

//增加到收藏清單
function addToFavorite(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = movies.find((movie) => movie.id === id)
    if (list.some((movie) => movie.id === id)) {
      return alert('此電影已經在收藏清單中！')
    }
    list.push(movie)
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

// 新增事件監聽按鈕點擊能跳到modal畫面裡
dataPanel.addEventListener('click', function onPanelClicked (event){
    if(event.target.matches('.btn-show-movie')){
        showMovieModal(event.target.dataset.id)
    }
    else if(event.target.matches('.btn-add-favorite')){
        addToFavorite(Number(event.target.dataset.id))
    }
    
})


searchForm.addEventListener('submit', function onSearchFormSubmitted(event){
    //預防瀏覽器預設行為
    event.preventDefault()
    const keyword = searchInput.value.trim().toLowerCase()
    // //儲存符合篩選條件的項目
    //錯誤處理：輸入無效字串
    if (!keyword.length){
        return alert('請輸入有效字元')
    }
    //條件篩選
    filteredmovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(keyword)
    )
    if (filteredmovies.length === 0 ){
        return alert(`您輸入的關鍵字 ${keyword} 無符合電影`)
    }
    // //重新輸出至畫面
    renderPaginator(filteredmovies.length)
    renderMovieList(filteredmovies)
    
})

//分頁
function getMoviesByPage(page){
    //計算起始 index 
    const startIndex = (page - 1) * MOVIES_PER_PAGE
    //回傳切割後的新陣列
    return movies.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator(amount) {
    //計算總頁數
    const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
    //製作 template 
    let rawHTML = ''
    
    for (let page = 1; page <= numberOfPages; page++) {
      rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>`
    }
    //放回 HTML
    paginator.innerHTML = rawHTML
  }
  
paginator.addEventListener('click', function onPaginatorClicked(event) {
    //如果被點擊的不是 a 標籤，結束
    if (event.target.tagName !== 'A') return
    displayDataList()
    //透過 dataset 取得被點擊的頁數
    nowPage = Number(event.target.dataset.page)
    if (dataPanel.classList.contains('row')) {
        renderMovieList(getMoviesByPage(nowPage))
    } else {
        renderMovieByList(getMoviesByPage(nowPage))
    }
  })

// 欄位按鈕事件監聽
icons.addEventListener("click", function onClickIcons(event) {
    const classList = event.target.classList
  
    if (classList.contains("fa-th-btn") || classList.contains("rowIcon")) {
      dataPanel.classList.add("row")
      renderMovieList(getMoviesByPage(1))
  
      faThBtn.classList.remove("btn-primary")
      faBarsBtn.classList.remove("btn-primary")
  
      faThBtn.classList.add("btn-primary")
    } else if (
      classList.contains("fa-bars-btn") ||
      classList.contains("listBtn")
    ) {
      dataPanel.classList.remove("row")
      renderMovieByList(getMoviesByPage(1))
  
      faThBtn.classList.remove("btn-primary")
      faBarsBtn.classList.remove("btn-primary")
  
      faBarsBtn.classList.add("btn-primary")
    }
  })
  //垂直樣式函式
function renderMovieByList(data) {
    // 以垂直樣式排列
    let rawHTML = '<ul class="list-group list-group-flush">'
    // 跑一遍所有data 並加入html
    data.forEach(item => {
      rawHTML += `<li class="list-group-item d-flex justify-content-between">
            <p class="mb-0 d-flex align-items-center">${item.title}</p>
            <div>
              <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal"
                data-id="${item.id}">
                More
              </button>
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </li>`
    })
    rawHTML += '</ul>'
    dataPanel.innerHTML = rawHTML
  }
  
// 判斷是物件id為顯示卡片或顯示列表
function displayDataList() {
    const movieList = getMoviesByPage(nowPage)
    mode === 'card' ? renderMovieList(movieList) : renderMovieByList(movieList)
}

icons.addEventListener('click', function onChangeModeClicked(event) {
    if (event.target.matches('#cardMode')) {
      mode = 'card'
    } else if (event.target.matches('#listMode')) {
      mode = 'list'
    }
    displayDataList()
  })