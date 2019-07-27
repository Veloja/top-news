
const getByCountries = (country) => {
    const data = fetch(`https://newsapi.org/v2/top-headlines?country=${country}&apiKey=28626ffdb69d49a8989eaceeb85ef254`)
        .then(result => result.json())
        .then(data => showArticles(data))
    return data;
}

function showArticles(data) {
    const articles = data.articles;
    return articles;
}

const getBusiness = (country, category) => {
    let all = []
    const data = fetch(`https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=28626ffdb69d49a8989eaceeb85ef254`)
        .then(result => result.json())
        .then(data => displayTopFiveAndAllCategoryArticles(data))
        return data;
}

function displayTopFiveAndAllCategoryArticles(data) {
    const topFive = data.articles.splice(0, 5);
    const all = data.articles
    return { topFive, all };
} 

export { getByCountries, getBusiness };