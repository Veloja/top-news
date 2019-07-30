import { setCountry } from '../core/state';
import { countries } from '../core/constants';
import { updateDOM } from '../core/dom';

export function attachCountryListeners() {
    const gb = document.querySelector('.js-gb');
    gb.addEventListener("click", onCountryClick);
    const us = document.querySelector('.js-us');
    us.addEventListener("click", onCountryClick);
}

function onCountryClick(event) {
    const countryKey = event.target.getAttribute('data-cn');
    const selectedCountry = countries.find(c => c.key === countryKey);

    setCountry(selectedCountry);

    const activeCountryBtns = document.querySelectorAll('.header__tabs-country--active');
    removeCertainClass(activeCountryBtns, 'header__tabs-country--active');
    event.target.className += ' header__tabs-country--active';

    updateDOM();
}

function removeCertainClass(elements, className) {
    elements.forEach(element => {
        element.className = element.className.replace(className, '');
    });
}