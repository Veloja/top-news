import { state } from '../index';
import { newsItem } from '../components/newsItem';

const body = document.getElementsByTagName('body')[0];
const addLoadedClass = window.addEventListener('load', () => {
    body.classList.add('loaded');
});

const tabs = document.querySelector('.header__tabs');
tabs.addEventListener('click', onTabClick);
function onTabClick(event) {
    const activeTabs = document.querySelectorAll('.header__tabs-btn--active');
    removeCertainClass(activeTabs, 'header__tabs-btn--active');
    event.target.className += ' header__tabs-btn--active';

    const id = event.target.getAttribute('data-tab');

    const contents = document.querySelectorAll('.content');
    removeCertainClass(contents, 'content--active');
    document.getElementById(id).className += ' content--active';
}

const countries = document.querySelector('.header__countries');
countries.addEventListener('click', changeBtnClass);

function changeBtnClass(event) {
    const activeCountryBtns = document.querySelectorAll('.header__tabs-country--active');
    removeCertainClass(activeCountryBtns, 'header__tabs-country--active');
    event.target.className += ' header__tabs-country--active';
}

function removeCertainClass(elements, className) {
    elements.forEach(element => {
        element.className = element.className.replace(className, '');
    });
}

// FILTER
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

export { addLoadedClass, onTabClick, changeBtnClass, showFilteredNews, clearInputValue };