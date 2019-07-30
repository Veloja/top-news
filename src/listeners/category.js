export function attachCategoryTitleListener() {
    let sliderTitle = document.querySelectorAll('.categories .slider__title');
    sliderTitle.forEach(t => t.addEventListener('click', openAllCategoryNews));
}

async function openAllCategoryNews(event) {
    console.log("WAIT A BIT");
    // const clickedCategorytitle = event.target.innerHTML.toLowerCase();

    // const allNewsForCategory = await newsService.getByCountryAndCategory(state.country.key, clickedCategorytitle);

    // const categoriesAll = document.querySelector('.categories__all');
    // categoriesAll.className += ' open'
    // const categoriesDiv = document.querySelector('#categories');
    // categoriesDiv.className += ' hide'

    // categoriesAll.innerHTML = `
    //     <h2 class="category-all-news__title">All news from for ${state.country.name} category...</h2>
    //     <button class="js-categories-btn btn">go back</button>
    //     <div class="category-all-news__holder">
    //         ${allNewsForCategory.map((item, index) => newsItem(item, index)).join('')}
    //     </div>
    // `
    // const categoryBtn = document.querySelector('.js-categories-btn');
    // categoryBtn.addEventListener('click', goBackToCategoriesMain);
    // attachCategoryAllNewsPopupListener();
    // state.activeCategory.category = clickedCategorytitle;
    // state.activeCategory.active = true;
}

// go back to main categories view
function goBackToCategoriesMain() {
    const categoriesAll = document.querySelector('.categories__all');
    categoriesAll.className = categoriesAll.className.replace('open', '');
    categoriesAll.innerHTML = '';
    const categoriesDiv = document.querySelector('#categories');
    categoriesDiv.className = categoriesDiv.className.replace('hide', '');
    state.activeCategory.active = false;
    state.activeCategory.category = '';
    console.log('STATE AFTER BEIGN GO BACK', state.activeCategory);
}