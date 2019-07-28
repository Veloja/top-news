function createAndAppendPopup(title, img, desc) {
    const popup = document.createElement('div');
    popup.className += 'popup'
    popup.innerHTML = `
        <div class="popup__wrap">
            <h5 class="popup__title">${title}</h5>
            <div class="popup__image" style="background-image: url('${img}')">
               
            </div>
            ${
                !desc
                    ? ''
                    :  `<p class="popup__desc">${desc}</p>`
            }
            <button class="btn popupClose">back</button>
        </div>
    `
    document.body.appendChild(popup);
    backBtn = document.querySelector('.popupClose');
    backBtn.addEventListener('click', closePopup)
}

let backBtn = ''
function closePopup() {
    this.closest('.popup').remove();
}


export { createAndAppendPopup }