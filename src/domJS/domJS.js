import { state } from '../index';
import { newsItem } from '../templates/htmlComponents';

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

    // set state of active tab
    state.activeTab.tab = id
    console.log(state.activeTab);

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

// SLIDER
let prev = null;
let next = null;

function moveSliderToRight() {
    next = document.querySelector('.js-next');
    prev = document.querySelector('.js-prev');
    next.addEventListener('click', moveSliderToRight);
    prev.addEventListener('click', moveSliderToLeft);
    const sliderItems = document.querySelectorAll('.slider .news__item');
    const width = sliderItems[0].offsetWidth + 15;
    state.count = state.count + 1;

    sliderItems.forEach(item => {
        item.style.transform = `translateX(-${width * state.count}px)`
    })
    state.count > 0 && (prev.className = prev.className.replace('slider__btn--disabled', ''));
    state.count >= 3 && (next.className += 'slider__btn--disabled');
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

// go back to main categories view
function goBackToCategoriesMain() {
    const categoriesAll = document.querySelector('.categories__all');
    categoriesAll.className = categoriesAll.className.replace('open', '');
    categoriesAll.innerHTML = '';
    const categoriesDiv = document.querySelector('#categories');
    categoriesDiv.className = categoriesDiv.className.replace('hide', '');
}

export { addLoadedClass, onTabClick, changeBtnClass, moveSliderToLeft, moveSliderToRight, goBackToCategoriesMain };