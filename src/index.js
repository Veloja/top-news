import './styles/main.scss';

import { addLoadedClass, onTabClick, changeBtnClass } from './domJS/domJS';
import { newsItem } from './components/newsItem';

import * as API from './API/news';

const usBtn = document.querySelector('.js-us');
const gbBtn = document.querySelector('.js-gb');

const news = document.querySelector('.news__wrap');
const search = document.querySelector('.search');

const categoriesTitle = document.querySelector('.categories__title');
const newsTitle = document.querySelector('.news__title');


usBtn.addEventListener('click', getArticles);
gbBtn.addEventListener('click', getArticles);

usBtn.addEventListener('click', changeBtnClass);
gbBtn.addEventListener('click', changeBtnClass);

usBtn.addEventListener('click', setCountToZero);
gbBtn.addEventListener('click', setCountToZero);

usBtn.addEventListener('click', displayCategories);
gbBtn.addEventListener('click', displayCategories);

usBtn.addEventListener('click', setCountryName);
gbBtn.addEventListener('click', setCountryName);

let state = {
    news: [],
    country: 'gb',
    countryName: 'Great Britain',
    term: '',
    business: [],
    count: 0
}

function setCountryName(event) {
    const countryName = event.target.getAttribute('data-cn');
    countryName === 'gb' ? state.countryName = 'Great Britain' : state.countryName = 'United States'
    state.countryName
}

function setCountToZero() {
    state.count = 0;
}

// api for top news and search
async function getArticles() {
    let countryName = '';

    //check which country btn is clicked and set state
    state.country = this.getAttribute('data-cn');
    state.country === 'gb' ? countryName = 'Great Britain' : countryName = 'United States'

    const news = await API.getByCountries(state.country);
    setState({
        ...state,
        news,
        countryName
    })
    console.log('TOP NEWS', state);
    renderNews(state);
    newsTitle.innerHTML = `All news from ${state.countryName}`
    renderSearch(state);
    attachOpenPopupListener();
    attachKeyupEventListener();
    attachSearchBtn(state);
    showFilteredNews();
}


// categories functionality
const categoriesBtn = document.querySelector('.js-categories');
const business = document.querySelector('.categories__category--business');

categoriesBtn.addEventListener('click', displayCategories);
// categoriesBtn.click();

let next = null;
let prev = null;
async function displayCategories() {
    const businessCategoryNews = await API.getBusiness(state.country, 'business');
    console.log(businessCategoryNews.all, 'BUSINESS ALL');
    console.log(businessCategoryNews.topFive, 'BUSINESS TOP 5');

    setState({
        ...state,
        business: businessCategoryNews.topFive,
        businessAll: businessCategoryNews.all,
        count: 0
    })
    renderBusinessCategory(state);
    console.log(state, 'BUSINESS');
    next = document.querySelector('.js-next');
    prev = document.querySelector('.js-prev');
    next.addEventListener('click', moveSliderToRight);
    prev.addEventListener('click', moveSliderToLeft);
    categoriesTitle.innerHTML = `Top 5 news by categories from ${state.countryName}`

}

function renderBusinessCategory() {
    business.innerHTML = `
        <div class="slider__parent">
        <h3 class="slider__title">Businness</h3>
            <button class="js-prev slider__btn-prev slider__btn--disabled"></button>
            <button class="js-next slider__btn-next"></button>
            <div class="category__slider">
                <div class="slider">
                    ${state.business.map((item, index) => newsItem(item, index)).join('')}
                </div>
            </div>
        </div>
    `
}

//slider
function moveSliderToRight() {
    const sliderItems = document.querySelectorAll('.slider .news__item');
    const width = sliderItems[0].offsetWidth + 15
    state.count = state.count + 1;

    sliderItems.forEach(item => {
        item.style.transform = `translateX(-${width * state.count}px)`
    })
    state.count > 0 && (prev.className = prev.className.replace('slider__btn--disabled', ''));
    state.count >= 3 && (next.className += 'slider__btn--disabled')
}

function moveSliderToLeft() {
    const sliderItems = document.querySelectorAll('.slider .news__item');
    const width = sliderItems[0].offsetWidth + 15
    state.count = state.count -1;
    
    sliderItems.forEach(item => {
        item.style.transform = `translateX(-${width * state.count}px)`
    })
    state.count === 0 && (prev.className += 'slider__btn--disabled');
    state.count < 3 && (next.className = next.className.replace('slider__btn--disabled', ''));
}

// first part with top news
function attachSearchBtn(newState) {
    const state = newState;
    const btn = document.querySelector('.search__btn');
    btn.addEventListener('click', searchTerm);
}

function attachKeyupEventListener() {
    const search = document.querySelector('.search__input');
    const filtered = search.addEventListener('keyup', () => {
        state.term = event.target.value
    });
}

// POPUP
function attachOpenPopupListener() {
    const allNews = document.querySelectorAll('.news__item-link');
    allNews.forEach(link => {
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

    const popup = document.createElement('div');
    popup.className += 'popup'
    popup.innerHTML = `
        <div class="popup__wrap">
            <h5 class="popup__title">${title}</h5>
            <div class="popup__image" style="background-image: url('${img}')">
               
            </div>
            ${
                !desc
                    ? ''
                    :  `<p class="popup__desc">${desc}</p>`
            }
            <button class="btn popupClose">back</button>
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
        ${state.news.map((item, index) => newsItem(item, index)).join('')}
    `
}

// FILTER SEARCH 
function searchTerm() {
    const termToFind = state.term.toLowerCase();
    const filteredNews = state.news.filter(newsItem => {
        const title = newsItem.title;
        if(title.toLowerCase().includes(termToFind)) {
            return newsItem
        }
    })
    showFilteredNews(filteredNews);
    clearInputValue();
}

function clearInputValue() {
    const input = document.querySelector('.search__input');
    input.value = '';
}

function showFilteredNews(filteredNews) {
    let arr = [];
    const wrap = document.querySelector('.filtered__news');
    filteredNews === undefined ? arr = [] : arr = filteredNews

    wrap.innerHTML = `
        ${ arr.map((item, index) => newsItem(item, index)).join('') }
    `
}

function renderSearch(state) {
    search.innerHTML = `
        <h2>Search Top News by ${state.countryName}</h2>
        <div class="search-input__wrap">
            <input class="search__input" type="text" value="" placeholder="Search top news" />
            <button class="search__btn">Search</button>
        </div>
        <div class="filtered__news">
        
        </div>
    `
}

const setState = (newState) => {
    state = { ...state, ...newState }
}
