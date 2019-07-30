import { getSliderCounterByIndex, incrementSliderByIndex, decrementSliderByIndex } from '../core/state';

export function attachSliderListeners() {
    const next = document.querySelectorAll('.js-next');
    const prev = document.querySelectorAll('.js-prev');
    next.forEach(n => n.addEventListener('click', moveSliderToRight));
    prev.forEach(n => n.addEventListener('click', moveSliderToLeft));
}

function moveSliderToRight(event) {
    const counterID = event.target.getAttribute('data-next');
    incrementSliderByIndex(counterID);
    const count = getSliderCounterByIndex(counterID);
    const exactSlider = event.target.closest('.slider__parent');
    const exactSliderItems = exactSlider.querySelectorAll('.category__slider .slider .news__item');
    const width = exactSliderItems[0].offsetWidth + 15;
    const exactNext = exactSlider.querySelector('.js-next');
    const exactPrev = exactSlider.querySelector('.js-prev');

    exactSliderItems.forEach(item => {
        item.style.transform = `translateX(-${width * count}px)`
    })

    getSliderCounterByIndex(counterID) > 0 && (exactPrev.className = exactPrev.className.replace('slider__btn--disabled', ''));
    getSliderCounterByIndex(counterID) >= 3 && (exactNext.className += 'slider__btn--disabled');
}

function moveSliderToLeft(event) {
    const counterID = event.target.getAttribute('data-prev');
    decrementSliderByIndex(counterID);
    const count = getSliderCounterByIndex(counterID);
    const exactSlider = event.target.closest('.slider__parent');
    const exactSliderItems = exactSlider.querySelectorAll('.category__slider .slider .news__item');
    const width = exactSliderItems[0].offsetWidth + 15;
    const exactPrev = exactSlider.querySelector('.js-prev');
    const exactNext = exactSlider.querySelector('.js-next');

    exactSliderItems.forEach(item => {
        item.style.transform = `translateX(-${width * count}px)`
    })

    getSliderCounterByIndex(counterID) === 0 && (exactPrev.className += 'slider__btn--disabled');
    getSliderCounterByIndex(counterID) < 3 && (exactNext.className = exactNext.className.replace('slider__btn--disabled', ''));
}