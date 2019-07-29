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
const search = document.querySelector('.search');

const categoriesTitle = document.querySelector('.categories__title');
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
    updateSearchInDOM();

    updateNewsInDom();

    updateCategoriesInDOM();

    // attach listeners to new dom elements
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
    console.log(allNewsForCategory);
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
    attachCategoryAllNewsPopupListener()
}

function renderByCategory(resultsForAllCategories) {
    let title = '';
    categoriesWrapper.innerHTML = `
    <h2>Top 5 news by categories from ${state.country.name}</h2>
    ${
        resultsForAllCategories.map((r, index, arr) => `
            <div class="slider__parent">
                <h3 class="slider__title">${title = arr[index][0].category.charAt(0).toUpperCase() + arr[index][0].category.slice(1)}</h3>
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

function showAllCategoryNews() {
    const categoriesAll = document.querySelector('.categories__all');
    const clickedTitle = event.target.value;
    categoriesAll.className += ' open'
    const categoriesDiv = document.querySelector('#categories');
    categoriesDiv.className += ' hide'

    categoriesAll.innerHTML = `
        <h2 class="category-all-news__title">All news from ${state.country.name} for business category</h2>
        <button class="js-categories-btn btn">go back</button>
        <div class="category-all-news__holder">
            ${state.businessAll.map((item, index) => newsItem(item, index)).join('')}
        </div>
    `
    const categoryBtn = document.querySelector('.js-categories-btn');
    categoryBtn.addEventListener('click', goBackToCategoriesMain);
    attachCategoryAllNewsPopupListener()

}

function updateNewsInDom() {
    newsTitle.innerHTML = `All news from ${state.country.name}`;
    // updateCountryButtonStyles(state.country);

    news.innerHTML = `
        ${state.news.map((item, index) => newsItem(item, index)).join('')}
    `
    attachOpenPopupListener();
}

function updateSearchInDOM() {
    renderSearch(state);
    attachKeyupEventListener();
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
}

// CATEGORY ALL NEWS POPUP
function attachCategoryAllNewsPopupListener() {
    const items = document.querySelectorAll('.categories__all .news__item');
    items.forEach(item => item.addEventListener('click', openCategoryAllNewsPopup));
}
function openCategoryAllNewsPopup() {
    let title = '';
    let img = '';
    let desc = '';
    const clickedPopupID = this.getAttribute('data-item');
    state.businessAll.filter((item, index) => {
        if(index === +clickedPopupID) {
            title = item.title;
            img = item.urlToImage;
            desc = item.content;
        }
    });
    displayPopup(title, img, desc)
}
// CATEGORY POPUP
function attachCategoryPopupListener() {
    const slides = document.querySelectorAll('.category__slider .news__item');
    slides.forEach(slide => slide.addEventListener('click', openCategoryPopup))
}
function openCategoryPopup() {
    let title = '';
    let img = '';
    let desc = '';
    const clickedPopupID = this.getAttribute('data-item');
    state.business.filter((item, index) => {
        if(index === +clickedPopupID) {
            title = item.title;
            img = item.urlToImage;
            desc = item.content;
        }
    });
    displayPopup(title, img, desc);
}
// NEWS POPUP
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
    state.news.filter((item, index) => {
        if(index === +clickedPopupID) {
            title = item.title;
            img = item.urlToImage;
            desc = item.content;
        }
    });
    displayPopup(title, img, desc);
}

export { state }
