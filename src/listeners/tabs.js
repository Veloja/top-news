import { tabs } from '../core/constants';
import { setActiveTab } from '../core/state';
import { updateDOM } from '../core/dom';

export function attachTabListeners() {
    const newsTab = document.querySelector('.js-top-news');
    newsTab.addEventListener('click', onTabClick)
    const categoriesTab = document.querySelector('.js-categories');
    categoriesTab.addEventListener('click', onTabClick)
    const searchTab = document.querySelector('.js-search');
    searchTab.addEventListener('click', onTabClick)
}

function onTabClick(event) {
    console.log("TAB CLICKED", event.target.getAttribute('data-tab'));
    const tabKey = event.target.getAttribute('data-tab');
    const selectedTab = tabs.find(tab => tab.key === tabKey);

    setActiveTab(selectedTab);

    const activeTabs = document.querySelectorAll('.header__tabs-btn--active');
    removeCertainClass(activeTabs, 'header__tabs-btn--active');
    event.target.className += ' header__tabs-btn--active';

    const id = event.target.getAttribute('data-tab');

    const contents = document.querySelectorAll('.content');
    removeCertainClass(contents, 'content--active');
    document.getElementById(id).className += ' content--active';

    updateDOM();
}

function removeCertainClass(elements, className) {
    elements.forEach(element => {
        element.className = element.className.replace(className, '');
    });
}
