const categoriesWrapper = document.querySelector('.categories');

export const newsItem = (item, index) => {
    return `
        <div class="news__item" data-item="${index}" type="button">
            <h3 class="news__item-title">${item.title}</h3>
            <div class="news__item-image" style="background-image: url('${item.urlToImage}')">
            </div>
            <p class="news__item-desc">${item.description}</p>
            <a class="news__item-link" href="javascript:;">Read More </a>
        </div>
    `
}

export const renderSearch = (state) =>  {
    search.innerHTML = `
        <h2>Search Top News by ${state.country.name}</h2>
        <div class="search-input__wrap">
            <input class="search__input" type="text" value="${state.term}" placeholder="Search top news" />
        </div>
        <div class="filtered__news"></div>
    `
}

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
