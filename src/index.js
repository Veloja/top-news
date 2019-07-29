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

const categories = ['business', 'sport']

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


usBtn.addEventListener('click', onChangeCountry);
gbBtn.addEventListener('click', onChangeCountry);

usBtn.addEventListener('click', changeBtnClass);
gbBtn.addEventListener('click', changeBtnClass);

usBtn.addEventListener('click', setCountToZero);
gbBtn.addEventListener('click', setCountToZero);

usBtn.addEventListener('click', displayCategories);
gbBtn.addEventListener('click', displayCategories);

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
    console.log('TOP NEWS', state);

    // update top news template
    // update categories template
    // update search template
    updateSearchInDOM();

    updateNewsInDom();
    // attach listeners to new dom elements
    // update styles that are dependant on state
    // updateCountryButtonsInDOM()



}

// gbBtn.click();
function updateNewsInDom() {
    newsTitle.innerHTML = `All news from ${state.country.name}`;
    // updateCountryButtonStyles(state.country);

    // for(let item of news) {
    //     const createdDomElem = createElement(newsItem(item, index));
    //     createdDomElem.attachPopupListener(click, onPopp);
    //     newsContainer.addChildren(createdDomElem);
    // }

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




// categories functionality
const categoriesBtn = document.querySelector('.js-categories');
const business = document.querySelector('.categories__category--business');

categoriesBtn.addEventListener('click', displayCategories);
// categoriesBtn.click();

async function displayCategories() {
    const businessCategoryNews = await newsService.getByCountryAndCategory(state.country.key, 'business');
    setState({
        ...state,
        business: businessCategoryNews.slice(0,5),
        businessAll: businessCategoryNews.all,
        count: 0
    })
    renderBusinessCategory(state);
    console.log('RENDER BUSINESS', state);
    attachCategoryPopupListener();

    const next = document.querySelector('.js-next');
    const prev = document.querySelector('.js-prev');
    next.addEventListener('click', moveSliderToRight);
    prev.addEventListener('click', moveSliderToLeft);

    const businessAllnews = document.querySelector('#business');
    const categoryTitle = document.querySelector('.slider__title');
    categoryTitle.addEventListener('click', showAllCategoryNews)

    categoriesTitle.innerHTML = `Top 5 news by categories from ${state.country.name}`
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
            <div id="business"></div>
        </div>
    `
}

// CATEGORY ALL NEWS POPUP
function attachCategoryAllNewsPopupListener() {
    const items = document.querySelectorAll('.categories__all .news__item');
    items.forEach(item => item.addEventListener('click', openCategoryAllNewsPopup))
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




const setState = (newState) => {
    state = { ...state, ...newState }
}

export { state }
