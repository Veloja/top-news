const body = document.getElementsByTagName('body')[0];
const addLoadedClass = window.addEventListener('load', () => {
    body.classList.add('loaded');
});

export { addLoadedClass };