import { newsItem } from './templates/htmlComponents';

const categoriesWrapper = document.querySelector('.categories');
export function renderByCategory(resultsForAllCategories, state) {
        categoriesWrapper.innerHTML = `
            <h2>Top 5 news by categories from ${state.country.name}</h2>
            ${
                resultsForAllCategories.map((r, index, arr) => `
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
