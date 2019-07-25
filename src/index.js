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
    attachOpenPopupListener();
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

const setState = (newState) => {
    state = { ...state, ...newState }
}
