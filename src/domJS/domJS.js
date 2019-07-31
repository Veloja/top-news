import { state } from '../index';

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
    state.activeTab.tab = id;
    // reset term in state on tab change
    state.term = '';

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
function moveSliderToRight(event) {
    const counterID = event.target.getAttribute('data-next');
    state.sliderCounter[counterID].count += 1;
    const count = state.sliderCounter[counterID].count;
    const exactSlider = event.target.closest('.slider__parent');
    const exactSliderItems = exactSlider.querySelectorAll('.category__slider .slider .news__item');
    const width = exactSliderItems[0].offsetWidth + 15;
    const exactNext = exactSlider.querySelector('.js-next');
    const exactPrev = exactSlider.querySelector('.js-prev');

    exactSliderItems.forEach(item => {
        item.style.transform = `translateX(-${width * count}px)`
    })

    state.sliderCounter[counterID].count > 0 && (exactPrev.className = exactPrev.className.replace('slider__btn--disabled', ''));
    state.sliderCounter[counterID].count >= 3 && (exactNext.className += 'slider__btn--disabled');
}

function moveSliderToLeft(event) {
    const counterID = event.target.getAttribute('data-prev');
    state.sliderCounter[counterID].count -= 1;
    const count = state.sliderCounter[counterID].count;
    const exactSlider = event.target.closest('.slider__parent');
    const exactSliderItems = exactSlider.querySelectorAll('.category__slider .slider .news__item');
    const width = exactSliderItems[0].offsetWidth + 15;
    const exactPrev = exactSlider.querySelector('.js-prev');
    const exactNext = exactSlider.querySelector('.js-next');

    exactSliderItems.forEach(item => {
        item.style.transform = `translateX(-${width * count}px)`
    })

    state.sliderCounter[counterID].count === 0 && (exactPrev.className += 'slider__btn--disabled');
    state.sliderCounter[counterID].count < 3 && (exactNext.className = exactNext.className.replace('slider__btn--disabled', ''));
}

// go back to main categories view
function goBackToCategoriesMain() {
    const categoriesAll = document.querySelector('.categories__all');
    categoriesAll.className = categoriesAll.className.replace('open', '');
    categoriesAll.innerHTML = '';
    const categoriesDiv = document.querySelector('#categories');
    categoriesDiv.className = categoriesDiv.className.replace('hide', '');
    state.activeCategory.active = false;
    state.activeCategory.category = '';
    console.log('STATE AFTER BEIGN GO BACK', state.activeCategory);
}

export { addLoadedClass, onTabClick, changeBtnClass, moveSliderToLeft, moveSliderToRight, goBackToCategoriesMain };
