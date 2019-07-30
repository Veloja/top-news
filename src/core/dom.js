import { getState, resetSliderCounter } from './state';
import { categories } from './constants';
import * as newsService from '../services/newsService';
import { attachSliderListeners } from '../listeners/slider';
import { attachCategoryTitleListener } from '../listeners/category';
import { attachSearchListener } from '../listeners/search';
import { attachNewsPopupListener, attachCategoriesPopupListener, attachSearchPopupListener } from '../listeners/popup';
import { newsItem, renderSearch } from '../templates/htmlComponents';

export async function updateDOM() {
    const state = getState();
    console.log("UPDATE DOM", state);
    switch(state.activeTab.key) {
        case 'news':
            const topNews = await newsService.getByCountry(state.country.key);
            updateNewsInDom(state.country.name, topNews);
            break;
        case 'categories':
            const categoryNews =  await fetchAllCategories(state.country.key);
            updateCategoriesInDOM(state.country.name, categoryNews);
            break;
        case 'search':
            const searchNews = await newsService.getByCountryAndQuery(state.country.key, state.term);;
            updateSearchInDOM(searchNews);
            break;
    }
    attachNewsPopupListener();
}

async function fetchAllCategories(countryKey) {
    return await Promise.all(categories.map(async (category) => {
        return await newsService.getByCountryAndCategory(countryKey, category);
    }));
}

function updateNewsInDom(countryName, topNews) {
    const newsTitle = document.querySelector('.news__title');
    newsTitle.innerHTML = `All news from ${countryName}`;

    const news = document.querySelector('.news__wrap');
    news.innerHTML = `
        ${topNews.map((item, index) => newsItem(item, index)).join('')}
    `
}

function updateCategoriesInDOM(countryName, categoryNews) {
    resetSliderCounter();
    console.log(getState());
    renderByCategory(countryName, categoryNews);

    attachCategoryTitleListener();
    attachSliderListeners();
    attachCategoriesPopupListener();
}

function renderByCategory(countryName, categoryNews) {
    const categoriesWrapper = document.querySelector('.categories');
    categoriesWrapper.innerHTML = `
        <h2>Top 5 news by categories from ${countryName}</h2>
        ${
            categoryNews.map((r, index, arr) => `
                <div class="slider__parent" data-slider="${index}">
                    <h3 class="slider__title">${arr[index][0].category.charAt(0).toUpperCase() + arr[index][0].category.slice(1)}</h3>
                        <button class="js-prev slider__btn-prev slider__btn--disabled" data-prev="${index}"></button>
                        <button class="js-next slider__btn-next" data-next="${index}"></button>
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

function updateSearchInDOM(searchNews) {
    const state = getState();
    renderSearch(state.country.name, state.term);
    attachSearchListener();

    const specificNewsWrap = document.querySelector('.filtered__news');
    specificNewsWrap.innerHTML = `${searchNews.map((item, index) => newsItem(item, index)).join('')}`;
    attachSearchPopupListener();
}

export async function updateSearchItems(text) {
    console.log("ITEMS UPDATED AGAIN");
    const state = getState();
    const searchNews = await newsService.getByCountryAndQuery(state.country.key, text);
    const specificNewsWrap = document.querySelector('.filtered__news');
    specificNewsWrap.innerHTML = `${searchNews.map((item, index) => newsItem(item, index)).join('')}`;
    attachSearchPopupListener();
}