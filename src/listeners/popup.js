export function attachNewsPopupListener() {
    const items = document.querySelectorAll('.news__item-link');
    items.forEach(i => i.addEventListener('click', onNewsItemClick))
}

export function attachCategoriesPopupListener() {
    const items = document.querySelectorAll('.slider__parent .news__item-link');
    items.forEach(i => i.addEventListener('click', onNewsItemClick))
}

export function attachSearchPopupListener() {
    const items = document.querySelectorAll('.filtered__news .news__item-link');
    items.forEach(i => i.addEventListener('click', onNewsItemClick));
}

function onNewsItemClick(event) {
    const clickedLink = event.target;
    const exactItem = clickedLink.closest('.news__item');
    openPopups(exactItem);
}

function onPopupClose(event) {
    event.target.closest('.popup').remove();
}

function openPopups(exactItem) {
    const title = exactItem.querySelector('.news__item-title').innerHTML;
    const styleAttr = exactItem.querySelector('.news__item-image').getAttribute('style');
    const imgUrl = styleAttr.split('\'');
    const img = imgUrl[1];
    const desc = exactItem.querySelector('.news__item-desc').innerHTML;
    displayPopup(title, img, desc);
}

function displayPopup(title, img, desc) {
    const popup = document.createElement('div');
    popup.className += 'popup'
    popup.innerHTML = `
        <div class="popup__wrap">
            ${titleText(title)}
            <div class="popup__image" ${bgImage(img)}></div>
            ${descriptionParagraph(desc)}
            <button class="btn popupClose">back</button>
        </div>
    `
    document.body.appendChild(popup);
    const backBtn = document.querySelector('.popupClose');
    backBtn.addEventListener('click', onPopupClose)
}


const descriptionParagraph = (text) => {
    return text ? `<p class="popup__desc">${text}</p>` : '';
}

const titleText = (title) => {
    return title ? `<h5 class="popup__title">${title}</h5>` : '';
}

const bgImage = (img) => {
    return img ? `style="background-image: url('${img}')"` : '';
}