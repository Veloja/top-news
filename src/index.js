import './styles/main.scss';

import { addLoadedClass, onTabClick } from './domJS/domJS';
import { newsItem } from './components/newsItem';

import * as API from './API/news';

const topNewsBtn = document.querySelector('.js-top-news');
const categoriesBtn = document.querySelector('.js-categories');
const searchBtn = document.querySelector('.js-search');

const usBtn = document.querySelector('.js-us');
const gbBtn = document.querySelector('.js-gb');

const news = document.getElementById('news');
const categories = document.getElementById('categories');
const search = document.getElementById('search');

usBtn.addEventListener('click', getArticles);
gbBtn.addEventListener('click', getArticles);

let state = {
    loadingNews: true,
    news: [],
}

async function getArticles() {
    const value = this.getAttribute('data-cn')
    console.log(value);
    const news = await API.getByCountries(value);
    setState({
        ...state,
        news,
        loadingNews: false
    })
    console.log(state);
    renderNews(state);
}

gbBtn.click();
renderNews()

function renderNews() {
    news.innerHTML = `
        ${
            state.loadingNews
                ? `<h1>LOADING...</h1>`
                : `${state.news.map((item, index) => newsItem(item, index)).join('')}`
        }
    `
}

const setState = (newState) => {
    state = { ...state, ...newState }
}
