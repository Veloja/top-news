import './styles/main.scss';

import { attachCountryListeners } from './listeners/countries';
import { attachTabListeners } from './listeners/tabs';
import { updateDOM } from './core/dom';

function initializeApp() {
    attachCountryListeners();
    attachTabListeners();
    updateDOM();
}

initializeApp();
