import './styles/main.scss';

import { addLoadedClass, onTabClick, filter } from './domJS/domJS';
import { newsItem } from './components/newsItem';

import * as API from './API/news';

const usBtn = document.querySelector('.js-us');
const gbBtn = document.querySelector('.js-gb');

const news = document.getElementById('news');
const search = document.querySelector('.search');


usBtn.addEventListener('click', getArticles);
gbBtn.addEventListener('click', getArticles);

let state = {
    loadingNews: true,
    news: [],
    countryName: 'Great Britain',
}
let term = '';
let newsArr = [];

async function getArticles() {
    let countryName = '';
    const value = this.getAttribute('data-cn')
    value === 'gb' ? countryName = 'Grait britain' : countryName = 'USA'
    const news = await API.getByCountries(value);
    setState({
        ...state,
        news,
        loadingNews: false,
        countryName
    })
    newsArr = news;
    console.log(state);
    renderNews(state);
    renderSearch(state);
    attachOpenPopupListener();
    attachKeyupEventListener();
    attachSearchBtn(state);
    showFilteredNews()
}

function attachSearchBtn(newState) {
    const state = newState;
    const btn = document.querySelector('.search__btn');
    btn.addEventListener('click', searchTerm);
}

function searchTerm() {
    const termToFind = term.toLowerCase();
    const filteredNews = newsArr.filter(newsItem => {
        const title = newsItem.title
        if(title.toLowerCase().includes(termToFind)) {
            return newsItem
        }
    })
    showFilteredNews(filteredNews)
    clearInputValue()
}

function clearInputValue() {
    const input = document.querySelector('.search__input')
    input.value = ''
}

function showFilteredNews(filteredNews) {
    let arr = [];
    const wrap = document.querySelector('.filtered__news');
    filteredNews === undefined ? arr = [] : arr = filteredNews

    wrap.innerHTML = `
        ${ arr.map((item, index) => newsItem(item, index)).join('') }
    `
}

function attachKeyupEventListener() {
    const search = document.querySelector('.search__input');
    const filtered = search.addEventListener('keyup', () => {
        term = event.target.value
    });
}

function attachOpenPopupListener() {
    const divs = document.querySelectorAll('.news__item-link');

    divs.forEach(link => {
        link.parentElement.addEventListener('click', openPopup);
    })
}

function openPopup() {
    let title = '';
    let img = '';
    let desc = '';

    const clickedPopupID = this.getAttribute('data-item');
    console.log(clickedPopupID, 'id');

    state.news.filter((item, index) => {
        if(index === +clickedPopupID) {
            title = item.title;
            img = item.urlToImage;
            desc = item.content;
        }
    });

    const popup = document.createElement('div')
    popup.className += 'popup'
    popup.innerHTML = `
        <div class="popup__wrap">
            <h5 class="popup__title">${title}</h5>
            <div class="popup__image">
                <img class="popup__img" src="${img}" />
            </div>
            ${
                !desc
                    ? ''
                    :  `<p class="popup__desc">${desc}</p>`
            }
            <button class="popupClose">back</button>
        </div>
    `
    document.body.appendChild(popup);
    backBtn = document.querySelector('.popupClose');
    backBtn.addEventListener('click', closePopup)
}

let backBtn = ''
function closePopup() {
    const tet = this.closest('.popup').remove();
}

gbBtn.click();

function renderNews() {
    news.innerHTML = `
        ${
            state.loadingNews
                ? `<h1>LOADING...</h1>`
                : `${state.news.map((item, index) => newsItem(item, index)).join('')}`
        }
    `
}

function renderSearch(state) {
    search.innerHTML = `
        <h2>Search Top News by ${state.countryName}</h2>
        <input class="search__input" type="text" value="" placeholder="Search top news" />
        <button class="search__btn">Search</button>
        <div class="filtered__news">
        
        </div>
    `
}

const setState = (newState) => {
    state = { ...state, ...newState }
}
