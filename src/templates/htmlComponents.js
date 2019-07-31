const categoriesWrapper = document.querySelector('.categories');

export const newsItem = (item, index) => {
    return `
        <div class="news__item" data-item="${index}" type="button">
            <h3 class="news__item-title">${item.title}</h3>
            <div class="news__item-image" style="background-image: url('${item.urlToImage !== null ? item.urlToImage : 'https://via.placeholder.com/150/0000FF/808080?Text=PLACEHOLDER.com'}')"></div>
            <p class="news__item-desc">${item.description === null || item.description === '' ? 'No text available, sorry!' : item.description}</p>
            <p class="news__item-content">${item.content}</p>
            <a class="news__item-link" href="javascript:;">Read More</a>
        </div>
    `
}

export const renderSearch = (state) => {
    search.innerHTML = `
        <h2 class="news__title">Search Top News by ${state.country.name}</h2>
        <div class="search-input__wrap">
            <input class="search__input" type="text" value="${state.term}" placeholder="Search top news" />
        </div>
        <div class="filtered__news"></div>
    `
}

export function renderByCategory(resultsForAllCategories, state) {
        categoriesWrapper.innerHTML = `
            <h2 class="news__title">Top 5 news by categories from ${state.country.name}</h2>
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

export function renderAllNewsForCategory(state, allNewsForCategory) {
    const categoriesAll = document.querySelector('.categories__all');
    categoriesAll.innerHTML = `
        <h2 class="category-all-news__title">All news from ${state.country.name} for ${state.activeCategory.category} category...</h2>
        <button class="category-all__btn js-categories-btn btn">go back</button>
        <div class="category-all-news__holder">
            ${allNewsForCategory.map((item, index) => newsItem(item, index)).join('')}
        </div>
    `
}

export function updateNewsInDom(state, newsTitle) {
    newsTitle.innerHTML = `All news from ${state.country.name}`;
    news.innerHTML = `
        ${state.news.map((item, index) => newsItem(item, index)).join('')}
    `
}
