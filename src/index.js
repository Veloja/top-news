import './styles/main.scss';

import { addLoadedClass, onTabClick, changeBtnClass, moveSliderToLeft, moveSliderToRight, goBackToCategoriesMain } from './domJS/domJS';
import { newsItem, renderSearch, renderByCategory } from './templates/htmlComponents';
import { attachNewsPopupListener, attachCategoriesPopupListener, attachCategoryAllNewsPopupListener, attachSearchPopupListener } from './popup';
import * as newsService from './services/newsService';

const countries = [
    {
        key: 'gb',
        name: 'Great Britain'
    },
    {
        key: 'us',
        name: 'United States'
    }
]

const categories = ['business', 'sport', 'science'];
function setSliderCounter() {
    return categories.map(c => {return {count: 0}})
}

let state = {
    news: [],
    country: countries[0],
    // term: '',
    activeTab: {
        active: true,
        tab: 'news',
    },
    activeCategory: {
        active: false,
        category: ''
    },
    sliderCounter: setSliderCounter()
}
// tab elements
const usBtn = document.querySelector('.js-us');
const gbBtn = document.querySelector('.js-gb');
const searchBTN = document.querySelector('.js-search');
const categoriesBTN = document.querySelector('.js-categories');
const newsBTN = document.querySelector('.js-top-news');
// dom elements
const news = document.querySelector('.news__wrap');
const newsTitle = document.querySelector('.news__title');
// tab listeners
usBtn.addEventListener('click', updateDom);
gbBtn.addEventListener('click', updateDom);
searchBTN.addEventListener('click', updateDom);
categoriesBTN.addEventListener('click', updateDom);
newsBTN.addEventListener('click', updateDom);
// country listeners
usBtn.addEventListener('click', onChangeCountry);
gbBtn.addEventListener('click', onChangeCountry);

usBtn.addEventListener('click', changeBtnClass);
gbBtn.addEventListener('click', changeBtnClass);

usBtn.addEventListener('click', setCountToZero);
gbBtn.addEventListener('click', setCountToZero);

// usBtn.addEventListener('click', updateAllCategoryNewsState);
// gbBtn.addEventListener('click', updateAllCategoryNewsState);

gbBtn.click();

function setCountry(event) {
    const countryKey = event.target.getAttribute('data-cn');
    state.country = countries.find(c => c.key === countryKey);
}

function setCountToZero() {
    state.count = 0;
}

async function updateDom() {
    // fetch news data
    const news = await newsService.getByCountry(state.country.key);
    state.news = news;
    //reset slider counter to zero on country change
    state.sliderCounter = setSliderCounter();
    // update all templates depending on active tab or country, no need to render all at once
    switch(state.activeTab.tab) {
        case 'news':
            updateNewsInDom();
            break;
        case 'categories':
            updateCategoriesInDOM();
            break;
        case 'search':
            const searchNews = await newsService.getByCountryAndQuery(state.country.key, state.term);;
            updateSearchInDOM(searchNews);
            break;
    }

    switch(state.activeCategory.active) {
        case state.activeCategory.category === 'business':
            const allBusinessNews = await newsService.getByCountryAndCategory(state.country.key, state.activeCategory.category);
            // update dom
            console.log(allBusinessNews, 'BUSINESS NEWS SWITCH');
            break;
        case state.activeCategory.category === 'sport':
            const allSportNews = await newsService.getByCountryAndCategory(state.country.key, state.activeCategory.category);
            // update dom
            console.log(allSportNews, 'SPORT NEWS SWITCH');
            break;
        case state.activeCategory.category === 'science':
            const allScienceNews = await newsService.getByCountryAndCategory(state.country.key, state.activeCategory.category);
            console.log(allScienceNews, 'SPORT NEWS SWITCH');
            break;
    }
    // attach listeners to new dom elements
    attachNewsPopupListener();
}
// SEARCH IN DOM
function updateSearchInDOM(searchNews) {
    renderSearch(state);
    attachKeyupEventListener();

    const specificNewsWrap = document.querySelector('.filtered__news');
    specificNewsWrap.innerHTML = `${searchNews.map((item, index) => newsItem(item, index)).join('')}`;
    attachSearchPopupListener();
}
function attachKeyupEventListener() {
    const search = document.querySelector('.search__input');
    search.addEventListener('keyup', getSpecificNewsByQuery);
}
var timer;
async function getSpecificNewsByQuery(event) {
    state.term = event.target.value;

    clearTimeout(timer);
    timer = setTimeout(async() => {
        await updateSearchItems(state.term);
    }, 500);
}
async function updateSearchItems(text) {
    const searchNews = await newsService.getByCountryAndQuery(state.country.key, text);
    const specificNewsWrap = document.querySelector('.filtered__news');
    specificNewsWrap.innerHTML = `${searchNews.map((item, index) => newsItem(item, index)).join('')}`;
    attachSearchPopupListener();
}// categories functionality
const categoriesBtn = document.querySelector('.js-categories');
categoriesBtn.addEventListener('click', updateCategoriesInDOM);

function updateCategoriesInDOM() {
    fetchAllCategories();
}
async function fetchAllCategories() {
    const resultsForAllCategories = await Promise.all(categories.map( async (c) => {
        return await newsService.getByCountryAndCategory(state.country.key, c);
    }));

    renderByCategory(resultsForAllCategories, state);
    attachCategoriesPopupListener();

    const next = document.querySelectorAll('.js-next');
    const prev = document.querySelectorAll('.js-prev');
    next.forEach(n => n.addEventListener('click', moveSliderToRight));
    prev.forEach(n => n.addEventListener('click', moveSliderToLeft));
    let sliderTitle = document.querySelectorAll('.categories .slider__title');
    sliderTitle.forEach(t => t.addEventListener('click', openAllCategoryNews));
}

async function openAllCategoryNews(event) {
    const clickedCategorytitle = event.target.innerHTML.toLowerCase();

    const allNewsForCategory = await newsService.getByCountryAndCategory(state.country.key, clickedCategorytitle);

    const categoriesAll = document.querySelector('.categories__all');
    categoriesAll.className += ' open'
    const categoriesDiv = document.querySelector('#categories');
    categoriesDiv.className += ' hide'

    categoriesAll.innerHTML = `
        <h2 class="category-all-news__title">All news from for ${state.country.name} category...</h2>
        <button class="js-categories-btn btn">go back</button>
        <div class="category-all-news__holder">
            ${allNewsForCategory.map((item, index) => newsItem(item, index)).join('')}
        </div>
    `
    attachClickedCategoryListeners(clickedCategorytitle);
}

async function attachClickedCategoryListeners(clickedCategorytitle) {
    const categoryBtn = document.querySelector('.js-categories-btn');
    categoryBtn.addEventListener('click', goBackToCategoriesMain);
    state.activeCategory.category = clickedCategorytitle;
    state.activeCategory.active = true;
    console.log('ACTIVE CATEGORY', state.activeCategory);
    attachCategoryAllNewsPopupListener();
    return await updateDom()
}

// NEWS IN DOM
function updateNewsInDom() {
    newsTitle.innerHTML = `All news from ${state.country.name}`;
    news.innerHTML = `
        ${state.news.map((item, index) => newsItem(item, index)).join('')}
    `
}

// change country state based on action
function onChangeCountry(event) {
    setCountry(event);
}

export { state }
