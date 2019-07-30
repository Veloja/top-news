import { countries, tabs, categories } from './constants';

const state = {
    country: countries[0],
    activeTab: tabs[0],
    term: ''
}

export function getState() {
    return state;
}

export function resetSliderCounter() {
    state.sliderCounters = categories.map(c => 0)
}

export function incrementSliderByIndex(index) {
    state.sliderCounters[index] += 1;
}

export function decrementSliderByIndex(index) {
    state.sliderCounters[index] -= 1;
}

export function getSliderCounterByIndex(index) {
    return state.sliderCounters[index];
}

export function setCountry(country) {
    state.country = country;
}

export function setActiveTab(tab) {
    state.activeTab = tab;
}

export function setTerm(text) {
    state.term = text;
}