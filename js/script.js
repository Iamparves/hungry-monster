const mealSearchBtn = document.getElementById('meal__search');
const mealInput = document.querySelector('.meal__search--input');

// Call loadMeal function on pressing search button or enter key
mealSearchBtn.addEventListener('click', loadMeal);
mealInput.addEventListener('keypress', event => { if (event.charCode === 13) loadMeal() });

// Load Meal data using input value
function loadMeal() {
    const mealAPI = `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealInput.value}`;

    fetch(mealAPI)
        .then(res => res.json())
        .then(data => displayMeal(data.meals))

    // Display Meal Data if found any or else show that no search result found
    function displayMeal(meals) {
        const mealContainer = document.querySelector('.meal__cards');
        const noMealFound = document.querySelector('.meal__not--found');
        const mealDescriptionContainer = document.querySelector('.meal__description--box');

        mealContainer.innerHTML = '';
        noMealFound.innerText = '';
        mealDescriptionContainer.innerHTML = '';

        // Check if meals object contains any meal data or not
        if (meals) {
            meals.forEach(meal => {
                const mealItem = document.createElement('div');
                mealItem.setAttribute('class', 'meal__card');
                mealItem.innerHTML = `
                <div class="meal__img--box">
                    <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal__img img-cover-fit">
                </div>
                <div class="meal__content">
                    <h2 class="meal__title">${meal.strMeal}</h2>
                </div>
                `
                mealContainer.appendChild(mealItem);
            })

            loadMealDescription();
        } else {
            noMealFound.innerText = `No meal found for "${mealInput.value}" search result`;
        }
    }
}

// Load Meal Descrption Data using clicked meal name
function loadMealDescription() {
    const mealCards = document.querySelectorAll('.meal__card');
    mealCards.forEach(meal => {
        meal.addEventListener('click', function () {
            const mealDescriptionAPI = `https://www.themealdb.com/api/json/v1/1/search.php?s=${meal.innerText}`;
            fetch(mealDescriptionAPI)
                .then(res => res.json())
                .then(data => displayMealDescription(data.meals[0]))
        })
    })
}

// Display Meal Description Card When meal is clicked
function displayMealDescription(meal) {
    const mealDescriptionContainer = document.querySelector('.meal__description--box');
    const mealDescription = document.createElement('div');
    mealDescription.setAttribute('class', 'meal__description');
    mealDescription.innerHTML = `
            <div class="meal__description--img-box">
                <button class="meal__description--close">&times;</button>
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal__description--img img-cover-fit">
            </div>
            <div class="meal__description--content">
                <h2 class="meal__description--title">${meal.strMeal}</h2>
                <h3 class="meal__description--subtitle">Ingredients</h3>
                <ul class="meal__description--list"></ul>
            </div>
            `
    mealDescriptionContainer.innerHTML = '';
    mealDescriptionContainer.appendChild(mealDescription);
    const mealDescriptionList = document.querySelector('.meal__description--list');
    for (let i = 1; i <= 20; i++) {
        if (meal['strIngredient' + i]) {
            const ingredient = document.createElement('li');
            ingredient.setAttribute('class', 'meal__description--item');
            ingredient.innerText = `${meal['strMeasure' + i]} ${meal['strIngredient' + i]}`;
            mealDescriptionList.appendChild(ingredient);
        }
    }
    mealDescriptionContainer.style.visibility = 'visible';
    mealDescriptionContainer.style.opacity = '1';

    // Hide Meal Description Card on Close Button Click
    const mealDescriptionCloeBtn = document.querySelector('.meal__description--close');

    mealDescriptionCloeBtn.addEventListener('click', () => {
        const mealDescriptionContainer = document.querySelector('.meal__description--box');
        mealDescriptionContainer.style.opacity = '0';
        mealDescriptionContainer.style.visibility = 'hidden';
    });
}