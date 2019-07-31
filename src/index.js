import './styles/main.scss';

import { addLoadedClass, onTabClick, changeBtnClass, moveSliderToLeft, moveSliderToRight, goBackToCategoriesMain } from './domJS/domJS';
import { newsItem, renderSearch, renderByCategory, renderAllNewsForCategory } from './templates/htmlComponents';
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

// country listeners
usBtn.addEventListener('click', onChangeCountry);
gbBtn.addEventListener('click', onChangeCountry);
// tab listeners
usBtn.addEventListener('click', updateDom);
gbBtn.addEventListener('click', updateDom);
searchBTN.addEventListener('click', updateDom);
categoriesBTN.addEventListener('click', updateDom);
newsBTN.addEventListener('click', updateDom);

usBtn.addEventListener('click', changeBtnClass);
gbBtn.addEventListener('click', changeBtnClass);

usBtn.addEventListener('click', setCountToZero);
gbBtn.addEventListener('click', setCountToZero);

usBtn.addEventListener('click', setCountry);
gbBtn.addEventListener('click', setCountry);
gbBtn.click();
// change country state based on action
function onChangeCountry(event) {
    setCountry(event);
}
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
            // check if we clicked on category to render that
            if(state.activeCategory.active) {
                await renderOneCategoryByTitle(state.activeCategory.category);
            } else {
                updateCategoriesInDOM();
            }
            break;
        case 'search':
            const searchNews = await newsService.getByCountryAndQuery(state.country.key, state.term);;
            updateSearchInDOM(searchNews);
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
}
// categories functionality
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
    await renderOneCategoryByTitle(clickedCategorytitle);
}

async function renderOneCategoryByTitle(title) {
    const allNewsForCategory = await newsService.getByCountryAndCategory(state.country.key, title);

    if(state.activeCategory.active) {
        const categoriesAll = document.querySelector('.categories__all');
        categoriesAll.className += ' open'
        const categoriesDiv = document.querySelector('#categories');
        categoriesDiv.className += ' hide'
    }

    renderAllNewsForCategory(state, allNewsForCategory)
    attachClickedCategoryListeners(title);
    state.activeCategory.active = true;
}

async function attachClickedCategoryListeners(clickedCategorytitle) {
    const categoryBtn = document.querySelector('.js-categories-btn');
    categoryBtn.addEventListener('click', goBackToCategoriesMain);
    state.activeCategory.category = clickedCategorytitle;
    state.activeCategory.active = true;
    attachCategoryAllNewsPopupListener();
}

// NEWS IN DOM
function updateNewsInDom() {
    newsTitle.innerHTML = `All news from ${state.country.name}`;
    news.innerHTML = `
        ${state.news.map((item, index) => newsItem(item, index)).join('')}
    `
}

export { state }
