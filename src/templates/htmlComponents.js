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
