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
}
function removeCertainClass(elements, className) {
    elements.forEach(element => {
        element.className = element.className.replace(className, '');
    });
}

// const filter = (event) => {
//     const value = event.target.value.toLowerCase();
//     const cards = document.querySelectorAll('.card');
//     cards.forEach(function(card, index) {
//         const text = card.querySelector('.card__title').innerHTML;
//         text.toLowerCase().includes(value) 
//             ? card.style.display = 'inline-block'
//             : card.style.display = 'none'
//     })
// };

const filter = (event) => {
    const value = event.target.value.toLowerCase();
    // dom elements 
    const topNews = document.querySelectorAll('.news__item');
    return console.log('FILTERED FROM RET', topNews);
    
}

export { addLoadedClass, onTabClick, filter };