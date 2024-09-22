let currentPage = 1;
const articlesPerPage = 5;
let totalPages = 1;
let articles = []; // Holds the original articles data
let filteredArticles = []; // Holds the filtered articles based on search or sorting criteria

// Function to render articles on the page
function renderArticles(articles, page) {
    const start = (page - 1) * articlesPerPage;
    const end = start + articlesPerPage;
    const articlesToShow = articles.slice(start, end);

    const articlesContainer = document.getElementById('articles');
    articlesContainer.innerHTML = ''; // Clear existing articles

    articlesToShow.forEach(article => {
        const articleContainer = document.createElement('div');
        articleContainer.classList.add('w3-container');

        const articleLink = document.createElement('a');
        articleLink.href = article.url;
        articleLink.classList.add('article-link');

        const articleCard = document.createElement('div');
        articleCard.classList.add('w3-card', 'w3-hover-shadow', 'article-card');

        const articleImage = document.createElement('img');
        articleImage.src = article.image;
        articleImage.alt = article.altText;
        articleImage.classList.add('article-image');

        const articleTitle = document.createElement('div');
        articleTitle.classList.add('article-title');
        articleTitle.innerText = article.title;

        const articleDescription = document.createElement('div');
        articleDescription.classList.add('article-description');
        articleDescription.innerText = article.description;

        const articleInfo = document.createElement('div');
        articleInfo.classList.add('article-info');
        articleInfo.innerHTML = `${article.date} by <span class="article-author">${article.author}</span>`;

        articleCard.appendChild(articleImage);
        articleCard.appendChild(articleTitle);
        articleCard.appendChild(articleDescription);
        articleCard.appendChild(articleInfo);

        articleLink.appendChild(articleCard);
        articleContainer.appendChild(articleLink);
        articlesContainer.appendChild(articleContainer);
    });
}

// Function to render pagination buttons
function renderPagination(totalPages) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = ''; // Clear existing buttons

    const prevBtn = document.createElement('a');
    prevBtn.href = "#";
    prevBtn.classList.add('w3-button');
    prevBtn.innerHTML = '&laquo;';
    prevBtn.id = 'prev-btn';
    paginationContainer.appendChild(prevBtn);

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('a');
        pageBtn.href = "#";
        pageBtn.classList.add('w3-button');
        pageBtn.innerText = i;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderArticles(filteredArticles, currentPage);
            updatePaginationControls();
        });
        paginationContainer.appendChild(pageBtn);
    }

    const nextBtn = document.createElement('a');
    nextBtn.href = "#";
    nextBtn.classList.add('w3-button');
    nextBtn.innerHTML = '&raquo;';
    nextBtn.id = 'next-btn';
    paginationContainer.appendChild(nextBtn);

    // Attach event listeners for the first and last buttons
    document.getElementById('prev-btn').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderArticles(filteredArticles, currentPage);
            updatePaginationControls();
        }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderArticles(filteredArticles, currentPage);
            updatePaginationControls();
        }
    });

    updatePaginationControls(); // Ensure controls are updated after rendering
}

// Function to update pagination controls
function updatePaginationControls() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    // Highlight the current page
    const pageButtons = document.querySelectorAll('#pagination .w3-button');
    pageButtons.forEach((btn, index) => {
        btn.classList.remove('w3-green'); // Remove any existing highlights
        if (index === currentPage) { // +1 to account for the prev button
            btn.classList.add('w3-green');
        }
    });
}

// Function to filter articles based on search query
function filterArticles(query) {
    query = query.toLowerCase();
    filteredArticles = articles.filter(article => article.title.toLowerCase().includes(query));

    totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    currentPage = 1; // Reset to the first page
    renderArticles(filteredArticles, currentPage);
    renderPagination(totalPages);
}

// Function to parse the date from "Month Year" format
function parseDate(dateString) {
    const [month, year] = dateString.split(' ');
    return new Date(`${month} 1, ${year}`); // Day is set to 1 for comparison purposes
}

// Function to sort articles based on the selected criterion
function sortArticles(criterion) {
    if (criterion === 'Latest') {
        filteredArticles.sort((a, b) => parseDate(b.date) - parseDate(a.date));
    } else if (criterion === 'Oldest') {
        filteredArticles.sort((a, b) => parseDate(a.date) - parseDate(b.date));
    } else if (criterion === 'Hot') {
        filteredArticles.sort((a, b) => b.views - a.views);
    }

    totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
    currentPage = 1; // Reset to the first page
    renderArticles(filteredArticles, currentPage);
    renderPagination(totalPages);
}


// Function to handle the button clicks
function handleButtonClick(event) {
    const buttons = document.querySelectorAll('.button-group .button');
    buttons.forEach(button => button.classList.remove('active'));
    event.target.classList.add('active');

    const criterion = event.target.innerText;
    sortArticles(criterion);
}

// Fetch the JSON data
fetch('articles.json?v=4')
    .then(response => response.json())
    .then(data => {
        articles = data.articles;
        filteredArticles = articles; // Initially, filtered articles are the same as all articles
        totalPages = Math.ceil(articles.length / articlesPerPage);

        // Render the first page of articles and the pagination controls
        renderArticles(filteredArticles, currentPage);
        renderPagination(totalPages);
    })
    .catch(error => console.error('Error fetching JSON data:', error));

// Event listener for search bar input
document.getElementById('search-bar').addEventListener('input', function() {
    const query = this.value;
    filterArticles(query);
});

// Event listeners for the sorting buttons
document.querySelectorAll('.button-group .button').forEach(button => {
    button.addEventListener('click', handleButtonClick);
});
