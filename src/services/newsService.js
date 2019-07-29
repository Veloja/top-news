const endpoint = 'https://newsapi.org/v2/top-headlines?';
const apiKey = '41f31da2a6aa40a6a30e370372706aa1';

export const getByCountry = async (country) => {
    const response = await fetch(`${endpoint}country=${country}&apiKey=${apiKey}`);
    const data = await response.json();
    return data.articles;
}

export const getByCountryAndCategory = async (country, category) => {
    const response = await fetch(`${endpoint}country=${country}&category=${category}&apiKey=${apiKey}`);
    const data = await response.json();
    return data.articles.map(a => ({...a, category}));
}

export const getByCountryAndQuery = async (country, query) => {
    const response = await fetch(`${endpoint}country=${country}&q=${query}&apiKey=${apiKey}`);
    const data = await response.json();
    return data.articles;
}