import './styles/main.scss';

import { addLoadedClass, onTabClick, changeBtnClass, clearInputValue, moveSliderToLeft, moveSliderToRight, goBackToCategoriesMain } from './domJS/domJS';
import { newsItem, renderSearch } from './templates/htmlComponents';
import { displayPopup } from './popup';
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

const categories = ['business', 'sport'];

let state = {
    news: [],
    country: countries[0],
    term: '',
    business: [],
    count: 0
}

const usBtn = document.querySelector('.js-us');
const gbBtn = document.querySelector('.js-gb');

const news = document.querySelector('.news__wrap');
const newsTitle = document.querySelector('.news__title');

const categoriesWrapper = document.querySelector('.categories');


usBtn.addEventListener('click', onChangeCountry);
gbBtn.addEventListener('click', onChangeCountry);

usBtn.addEventListener('click', changeBtnClass);
gbBtn.addEventListener('click', changeBtnClass);

usBtn.addEventListener('click', setCountToZero);
gbBtn.addEventListener('click', setCountToZero);

usBtn.addEventListener('click', updateCategoriesInDOM);
gbBtn.addEventListener('click', updateCategoriesInDOM);

gbBtn.click();

function setCountry(event) {
    const countryKey = event.target.getAttribute('data-cn');
    state.country = countries.find(c => c.key === countryKey);
}

function setCountToZero() {
    state.count = 0;
}

// api for top news and search
async function onChangeCountry(event) {
    // change state on action
    setCountry(event);

    // fetch new data
    const news = await newsService.getByCountry(state.country.key);
    state.news = news;


    // update top news template
    // update categories template
    // update search template

    // switch za active page

    updateSearchInDOM();

    updateNewsInDom();

    updateCategoriesInDOM();

    // attach listeners to new dom elements
    attachNewsPopupListener();
    // update styles that are dependant on state
    // updateCountryButtonsInDOM()

}

// categories functionality
const categoriesBtn = document.querySelector('.js-categories');
categoriesBtn.addEventListener('click', updateCategoriesInDOM);

function updateCategoriesInDOM() {
    fetchAllCategories();
}
async function fetchAllCategories() {
    const resultsForAllCategories = await Promise.all(categories.map( async (c, index, arr) => {
        return await newsService.getByCountryAndCategory(state.country.key, arr[index]);
    }));

    renderByCategory(resultsForAllCategories);

    attachCategoriesPopupListener();

    const next = document.querySelectorAll('.js-next');
    const prev = document.querySelectorAll('.js-prev');
    next.forEach(n => n.addEventListener('click', moveSliderToRight));
    prev.forEach(n => n.addEventListener('click', moveSliderToLeft));
    let sliderTitle = document.querySelectorAll('.categories .slider__title');

    sliderTitle.forEach(t => t.addEventListener('click', openAllCategoryNews))
}

async function openAllCategoryNews(event) {
    const clickedCategorytitle = event.target.innerHTML.toLowerCase()
    const allNewsForCategory = await newsService.getByCountryAndCategory(state.country.key, clickedCategorytitle);
    console.log(allNewsForCategory, 'ALL CATEGORY NEWS');
    const categoriesAll = document.querySelector('.categories__all');
    const clickedTitle = event.target.value;
    categoriesAll.className += ' open'
    const categoriesDiv = document.querySelector('#categories');
    categoriesDiv.className += ' hide'

    categoriesAll.innerHTML = `
        <h2 class="category-all-news__title">All news from for business category</h2>
        <button class="js-categories-btn btn">go back</button>
        <div class="category-all-news__holder">
            ${allNewsForCategory.map((item, index) => newsItem(item, index)).join('')}
        </div>
    `
    const categoryBtn = document.querySelector('.js-categories-btn');
    categoryBtn.addEventListener('click', goBackToCategoriesMain);
    // attachCategoryAllNewsPopupListener()
    attachCategoryAllNewsPopupListener()
}

function renderByCategory(resultsForAllCategories) {
    categoriesWrapper.innerHTML = `
    <h2>Top 5 news by categories from ${state.country.name}</h2>
    ${
        resultsForAllCategories.map((r, index, arr) => `
            <div class="slider__parent">
                <h3 class="slider__title">${arr[index][0].category.charAt(0).toUpperCase() + arr[index][0].category.slice(1)}</h3>
                    <button class="js-prev slider__btn-prev slider__btn--disabled"></button>
                    <button class="js-next slider__btn-next"></button>
                    <div class="category__slider">
                        <div class="slider">
                            ${arr[index].slice(0, 5).map((item, index) => newsItem(item, index)).join('')}
                        </div>
                    </div>
                    <div id="${arr[index][0].category}"></div>
            </div>
        `).join('')
    }
    `
}


function updateNewsInDom() {
    newsTitle.innerHTML = `All news from ${state.country.name}`;
    // updateCountryButtonStyles(state.country);

    news.innerHTML = `
        ${state.news.map((item, index) => newsItem(item, index)).join('')}
    `
}

function updateSearchInDOM() {
    renderSearch(state);
    attachKeyupEventListener();
    // attachSearchPopupListener();

}

function attachKeyupEventListener() {
    const search = document.querySelector('.search__input');
    search.addEventListener('keyup', getSpecificNewsByQuery);
}

async function getSpecificNewsByQuery(event) {
    state.term = event.target.value;
    const fetchedNewsByQueryArr = await newsService.getByCountryAndQuery(state.country.key, state.term);

    const specificNewsWrap = document.querySelector('.filtered__news');
    specificNewsWrap.innerHTML = `
        ${fetchedNewsByQueryArr.map((item, index) => newsItem(item, index)).join('')}
    `
    attachSearchPopupListener();
}




// POPUPS functionallity
function attachNewsPopupListener() {
    const items = document.querySelectorAll('.news__item-link');
    items.forEach(i => i.addEventListener('click', clickedItem))
}

function attachCategoriesPopupListener() {
    const items = document.querySelectorAll('.slider__parent .news__item-link');
    items.forEach(i => i.addEventListener('click', clickedItem))
}

function attachCategoryAllNewsPopupListener() {
    const items = document.querySelectorAll('.categories__all .news__item-link');
    items.forEach(i => i.addEventListener('click', clickedItem))
}

function attachSearchPopupListener() {
    const items = document.querySelectorAll('.filtered__news .news__item-link');
    items.forEach(i => i.addEventListener('click', clickedItem))
}

function clickedItem(event) {
    console.log('search clicked')
    const clickedLink = event.target;
    const exactItem = clickedLink.closest('.news__item');
    openPopups(exactItem);
}

function openPopups(exactItem) {
    const title = exactItem.querySelector('.news__item-title').innerHTML;
    const styleAttr = exactItem.querySelector('.news__item-image').getAttribute('style');
    const imgUrl = styleAttr.split('\'');
    const img = imgUrl[1];
    const desc = exactItem.querySelector('.news__item-desc').innerHTML;
    displayPopup(title, img, desc);
}

export { state }
