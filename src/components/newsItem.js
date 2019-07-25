const newsItem = (item, index) => {
    return `
        <div class="news__item" data-item="${index}" type="button">
            <h5 class="news__item-title">${item.title}</h5>
            <div class="news__item-image">
                <img src="${item.urlToImage}" class="news__item-img" />
            </div>
            <p class="news__item-desc">${item.description}</p>
            <a class="news__item-link" href="javascript:;">Read More </a>
        </div>
    `
}

export { newsItem };