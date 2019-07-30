function displayPopup(title, img, desc) {
    console.log('DESC', desc);
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
    backBtn = document.querySelector('.popupClose');
    backBtn.addEventListener('click', closePopup)
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

let backBtn = ''
function closePopup() {
    this.closest('.popup').remove();
}


export { displayPopup }