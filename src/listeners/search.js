import { setTerm } from '../core/state';
import { updateSearchItems } from '../core/dom';

export function attachSearchListener() {
    const search = document.querySelector('.search__input');
    search.addEventListener('keyup', onSearch);
}

var timer;

async function onSearch(event) {
    setTerm(event.target.value);

    clearTimeout(timer);
    timer = setTimeout(async() => {
        await updateSearchItems(event.target.value);
    }, 1000);
}